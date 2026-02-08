import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const testGroqConnection = async (req, res) => {
    const { message } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message || "Hello, are you connected?",
                },
            ],
            model: "llama-3.3-70b-versatile",
        }).asResponse();

        const headers = completion.headers;
        const body = await completion.json();

        // Helper to safely get header value
        const getHeader = (name) => {
            let val;
            if (headers && typeof headers.get === 'function') {
                val = headers.get(name);
            } else {
                val = headers ? headers[name] : null;
            }
            // Handle array response from some SDKs/Networks
            return Array.isArray(val) ? val[0] : val;
        };

        res.json({
            success: true,
            reply: body.choices[0]?.message?.content || "No response content",
            usage: body.usage,
            limits: {
                remainingRequests: getHeader('x-ratelimit-remaining-requests'),
                remainingTokens: getHeader('x-ratelimit-remaining-tokens'),
                resetRequests: getHeader('x-ratelimit-reset-requests'),
                resetTokens: getHeader('x-ratelimit-reset-tokens'),
                limitRequests: getHeader('x-ratelimit-limit-requests'),
                limitTokens: getHeader('x-ratelimit-limit-tokens'),
            }
        });
    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: "Failed to connect to Groq API"
        });
    }
};

export const generateInterviewQuestion = async (req, res) => {
    const { resumeText, history, type, domain } = req.body;

    // Construct the system prompt based on type
    const systemPrompt = type === 'technical'
        ? `You are a strict Technical Interviewer for a ${domain} role, part of a two-person panel with Sarah (HR Manager).
        CONTEXT: The conversation history contains 'assistant' messages (from you or Sarah) and 'user' messages.
        INPUT: Use the provided Resume Context and Domain (${domain}) to generate relevant technical questions.
        PROTOCOL:
        1. IF the user's answer starts with "[Submitted Code", your PRIORITY is to ANALYZE the code. Check for correctness, efficiency, and edge cases. Provide specific feedback.
        2. Analyze the candidate's last answer.
        3. START your response by acknowledging it.
        4. THEN ask a conceptual or coding query based on their skills.
        5. DYNAMIC LENGTH: Do not stick to a fixed number of questions. Stop when you have enough data.
           - Short interview (5 mins): If candidate is very poor or extremely good/efficient.
           - Long interview (15 mins): If candidate is average and you need to probe deeper.
        6. IF you are satisfied with the evaluation OR if the candidate asks to stop, respond with "[END_INTERVIEW]" followed by a polite closing statement.`
        : `You are an HR Manager, part of a two-person panel.
        CONTEXT: The conversation history contains 'assistant' messages (from you or your co-interviewer) and 'user' messages (from the candidate).
        INPUT: Use the provided Resume Context to ask specific background questions (e.g., "Why did you choose this college?", "Tell me about your gap year").
        RULES:
        1. ABSOLUTELY NO TECHNICAL QUESTIONS. Do NOT ask about code, syntax, definitions.
        2. Focus on behavior (STAR method), teamwork, conflict resolution, and RESUME BACKGROUND (Education, Hobbies, Projects - non-technical aspects).
        3. BE DYNAMIC & REACTIVE: Validate feelings.
        4. DYNAMIC LENGTH: Stop when you have assessed cultural fit. Could be short (few questions) or long depending on the candidate's depth.
        5. IF you are satisfied OR if the candidate asks to stop, respond with "[END_INTERVIEW]" followed by a closing.`

    // Format history for the AI
    const conversationHistory = history.map(h => ({
        role: h.role, // Trust the frontend role (assistant/user)
        content: h.content
    }));

    // Add resume context to the first user message or system message
    const messages = [
        { role: "system", content: `${systemPrompt}\n\nCandidate Resume Context:\n${resumeText || "No resume provided."}` },
        ...conversationHistory
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 150,
        });

        const question = completion.choices[0]?.message?.content || "Could you elaborate on that?";

        res.json({
            success: true,
            question
        });
    } catch (error) {
        console.error("Groq Interview Gen Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate question" });
    }
};

export const generateReport = async (req, res) => {
    const { history, domain, resumeText } = req.body;

    // Calculate aggregate metrics from history
    let totalWpm = 0;
    let totalFillers = 0;
    let answerCount = 0;

    history.forEach(h => {
        if (h.role === 'user' && h.metrics) {
            totalWpm += h.metrics.wpm || 0;
            totalFillers += h.metrics.fillerCount || 0;
            answerCount++;
        }
    });

    const avgWpm = answerCount > 0 ? Math.round(totalWpm / answerCount) : 0;

    const systemPrompt = `You are an Expert Interview Evaluator.
    Analyze the candidate's performance based on the transcript AND their audio metrics.

    METRICS:
    - Average Speech Pace: ${avgWpm} WPM (Normal is 120-150. Below 100 is slow/uncertain. Above 160 is fast/nervous).
    - Total Filler Words (um, uh, like): ${totalFillers} (High count indicates hesitation).

    TASK:
    Generate a JSON report with:
    1. "score": 0-100 (Overall performance).
    2. "technicalAnalysis": Paragraph on technical accuracy.
    3. "communicationAnalysis": Paragraph analyzing their CONFIDENCE based on the WPM and Fillers. Explicitly mention their pace and hesitation.
    4. "bodyLanguageEstimation": Estimate likely body language based on confidence (e.g. "Confident tone suggests good posture" or "Hesitation suggests nervousness").
    5. "feedback": Bullet points for improvement.

    OUTPUT JSON ONLY.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Resume Context: ${resumeText}\n\nTranscript:\n${JSON.stringify(history)}` }
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const report = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, report });

    } catch (error) {
        console.error("Report Gen Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate report" });
    }
};

export const generateDebateResponse = async (req, res) => {
    const { topic, aiStance, userStance, context, userMsg } = req.body;

    const systemPrompt = `You are a skilled debater in a group discussion.
    Topic: "${topic}"
    Your Stance: ${aiStance}
    User's Stance: ${userStance}
    
    INSTRUCTIONS:
    1. Respond to the user's latest argument directly.
    2. Be logical, persuasive, and concise (max 3 sentences).
    3. Maintain a professional but competitive tone.
    4. If the user's argument is weak, point out the flaw gently but firmly.
    5. Support your stance with a counter-point.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context:\n${context}\n\nUser said: "${userMsg}"` }
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 200,
        });

        const response = completion.choices[0]?.message?.content || "I see your point, but I disagree.";
        res.json({ success: true, response });

    } catch (error) {
        console.error("Debate AI Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate response" });
    }
};

export const generateGroupDiscussionTopic = async (req, res) => {
    const systemPrompt = `Generate a single, interesting, and controversial debate topic suitable for a group discussion. 
    It can be about Technology, Society, Politics, Environment, or Ethics. 
    Output ONLY the topic string. No quotes, no labels.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate one topic." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.9,
            max_tokens: 50,
        });

        const topic = completion.choices[0]?.message?.content?.trim() || "Is AI beneficial for society?";
        res.json({ success: true, topic });

    } catch (error) {
        console.error("Topic Gen Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate topic" });
    }
};

export const generateGDResponse = async (req, res) => {
    const { topic, agentName, role, style, context } = req.body;

    const systemPrompt = `You are participating in a formal Group Discussion (GD) on the topic: "${topic}".
    
    You are ${agentName}.
    Your Role: ${role}
    Your Speaking Style: ${style}
    
    Current Discussion Transcript:
    ${context}
    
    INSTRUCTIONS:
    1. Read the transcript to understand the current flow.
    2. Make a relevant point based on your role (${role}).
    3. If you are the 'Initiator' and the transcript is empty, start the discussion.
    4. If you are a 'Contrarian', politely challenge the previous point.
    5. If you are a 'Mediator', try to bridge gaps or summarize.
    6. Keep your response concise (2-3 sentences max).
    7. Be natural, professional, and conversational.
    
    Output ONLY your spoken response.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "It is your turn to speak." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 150,
        });

        const response = completion.choices[0]?.message?.content || "I have an interesting perspective on this.";
        res.json({ success: true, response });

    } catch (error) {
        console.error("GD AI Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate GD response" });
    }
};
