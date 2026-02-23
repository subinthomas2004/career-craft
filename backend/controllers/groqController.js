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
    const { resumeText, history, type, domain, questionCount, interviewType } = req.body;

    const qCount = questionCount || 0;

    // Construct the system prompt based on type
    const systemPrompt = type === 'technical'
        ? `You are David, a Senior Technical Lead conducting the technical portion of a two-person interview panel.
Your co-interviewer Sarah (HR Manager) handles behavioral questions. You handle ALL technical content.

DOMAIN: ${domain || 'general software engineering'}
QUESTIONS ASKED SO FAR: ${qCount}

RULES:
1. Ask questions STRICTLY related to the "${domain}" domain. Use the candidate's RESUME SKILLS to target specific technologies they claim to know.
2. DIFFICULTY: Ask "Medium-Easy" algorithmic or practical questions (e.g., Fibonacci, Palindrome, Factorial, String manipulation). DO NOT ask complex "Hard" LeetCode style problems (like Graph DP or Advanced Trees).
3. When asking a CODING question:
   - You MUST start your response with exactly "[CODE_QUESTION]" followed by the problem statement.
   - You MUST explicitly say something like "I've placed the coding question on the right side of your screen" or "Please use the editor on the right to solve this".
4. IF the user's answer starts with "[Submitted Code", ANALYZE the code thoroughly: check correctness, edge cases, and style. Give specific feedback.
5. START each response by briefly acknowledging the candidate's previous answer (1 sentence), then ask your next question.
7. LENGTH: Keep your questions extremely short and concise. Your entire response MUST be a maximum of 1 or 2 sentences. DO NOT ask multi-part questions.
8. DYNAMIC FLOW: Gauge the candidate's skill level.
   - If they are clearly strong: you can wrap up after 4-5 technical questions.
   - If average: probe deeper with 6-8 questions.
   - If struggling: be supportive but still assess, 3-4 questions max.
8. When you have assessed the candidate sufficiently, respond with "[END_INTERVIEW]" followed by a brief, polite closing.
9. DO NOT ask HR/behavioral questions. That's Sarah's job.`
        : (interviewType === 'hr'
            ? `You are Sarah, the sole HR Manager conducting this interview alone. There is NO other interviewer — you are the only person in this interview besides the candidate. NEVER mention any colleague, co-interviewer, David, or anyone else.

QUESTIONS ASKED SO FAR: ${qCount}

RULES:
1. ABSOLUTELY NO TECHNICAL QUESTIONS. Do NOT ask about code, algorithms, system design, or technical definitions.
2. Ask about: self-introduction, background from resume, career goals, strengths/weaknesses, teamwork, conflict resolution, leadership, situational questions (STAR method).
3. USE THE RESUME to ask SPECIFIC questions: "I see you studied at X, what drew you there?", "Your project Y sounds interesting, tell me about the team dynamics."
4. Be warm, empathetic, and conversational. Validate the candidate's feelings and experiences.
5. START each response by briefly acknowledging the candidate's previous answer, then ask your next question.
6. Speak as "I" not "we" — you are alone.
7. LENGTH: Keep your questions extremely short and concise. Your entire response MUST be a maximum of 1 or 2 sentences. DO NOT ask long, multi-part behavioral questions.
8. DYNAMIC FLOW: Assess cultural fit efficiently.
   - If the candidate communicates well: 3-4 behavioral questions is enough.
   - If you need more clarity: up to 5-6 questions.
8. When you have assessed cultural fit, respond with "[END_INTERVIEW]" followed by a warm, supportive closing.
9. For the FIRST question: Start with a friendly greeting introducing ONLY yourself as Sarah the HR Manager, then ask them to introduce themselves.`
            : (interviewType === 'intro-prep'
                ? `You are Sarah, an expert Career Coach and Communication Trainer.
You are helping the user perfect their "Self Introduction" (Tell me about yourself).

QUESTIONS ASKED SO FAR: ${qCount}

RULES:
1. Your GOAL is to help the user craft a perfect 60-90 second introduction.
2. ANALYZE their response against their RESUME. Did they mention their key role, years of experience, and top skills?
3. CRITIQUE specifically:
   - Structure: Did they start with "I am X with Y years of experience"?
   - Relevance: Did they align with their resume?
   - Confidence: Mention if they sounded vague.
4. If their introduction is weak, ask them to try again with specific improvements ("That was a bit short. Try adding your experience at [Company]").
5. If good, ask a follow-up to test them: "Great intro. Now, why do you want to work in this domain?"
6. LENGTH: Keep your questions extremely short and concise. Your entire response MUST be a maximum of 1 or 2 sentences.
7. Be encouraging but professional.
7. For the FIRST question: Start by introducing yourself as Sarah the Coach, and ask them to give their elevator pitch or self-introduction.`
                : `You are Sarah, an HR Manager conducting the behavioral portion of a two-person interview panel.
Your co-interviewer David (Technical Lead) handles technical questions. You handle HR and behavioral content.

QUESTIONS ASKED SO FAR: ${qCount}

RULES:
1. ABSOLUTELY NO TECHNICAL QUESTIONS. Do NOT ask about code, algorithms, system design, or technical definitions.
2. Ask about: self-introduction, background from resume, career goals, strengths/weaknesses, teamwork, conflict resolution, leadership, situational questions (STAR method).
3. USE THE RESUME to ask SPECIFIC questions: "I see you studied at X, what drew you there?", "Your project Y sounds interesting, tell me about the team dynamics."
4. Be warm, empathetic, and conversational. Validate the candidate's feelings and experiences.
5. START each response by briefly acknowledging the candidate's previous answer, then ask your next question.
6. LENGTH: Keep your questions extremely short and concise. Your entire response MUST be a maximum of 1 or 2 sentences. DO NOT ask long, multi-part behavioral questions.
7. DYNAMIC FLOW: Assess cultural fit efficiently.
   - If the candidate communicates well: 3-4 behavioral questions is enough.
   - If you need more clarity: up to 5-6 questions.
7. When you have assessed cultural fit, respond with "[END_INTERVIEW]" followed by a warm, supportive closing.
8. For the FIRST question: Start with a friendly greeting and ask them to introduce themselves.`))

    // Format history for the AI
    const conversationHistory = history.map(h => ({
        role: h.role,
        content: h.content
    }));

    const messages = [
        { role: "system", content: `${systemPrompt}\n\nCandidate Resume Context:\n${resumeText || "No resume provided."}` },
        ...conversationHistory
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
        });

        const question = completion.choices[0]?.message?.content || "Could you elaborate on that?";

        // Detect if it's a coding question
        const isCodeQuestion = question.startsWith('[CODE_QUESTION]');
        const cleanQuestion = isCodeQuestion ? question.replace('[CODE_QUESTION]', '').trim() : question;

        res.json({
            success: true,
            question: cleanQuestion,
            isCodeQuestion
        });
    } catch (error) {
        console.error("Groq Interview Gen Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate question" });
    }
};

// Analyze code submitted by candidate during HR+Tech interview
export const analyzeCodeSubmission = async (req, res) => {
    const { code, language, question, resumeText, domain } = req.body;

    const systemPrompt = `You are David, a Senior Technical Lead reviewing a candidate's code submission during an interview.

The candidate was asked: "${question}"
They submitted code in: ${language}

ANALYZE the code and provide:
1. Brief acknowledgment of their approach (1 sentence)
2. Whether the solution is CORRECT or has bugs
3. Time and Space complexity
4. Any edge cases missed
5. Code quality and style feedback
6. A score from 0-100

Keep your feedback conversational and concise (spoken interview style, not a code review document).
End with a follow-up question or transition. If the code is good, acknowledge it positively.

Output your spoken feedback directly. Do NOT use JSON format.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the submitted code:\n\n\`\`\`${language}\n${code}\n\`\`\`` }
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 300,
        });

        const feedback = completion.choices[0]?.message?.content || "Let me review your code.";

        res.json({
            success: true,
            feedback
        });
    } catch (error) {
        console.error("Code Analysis Error:", error);
        res.status(500).json({ success: false, error: "Failed to analyze code" });
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

    const systemPrompt = `You are a skilled debater in a live verbal debate.
    Topic: "${topic}"
    Your Stance: ${aiStance}
    User's Stance: ${userStance}
    
    GUIDELINES FOR REALISM AND ADAPTABILITY:
    1. BE CONCISE. Spoken debates have short turns. Keep response under 3-4 sentences.
    2. BE CONVERSATIONAL. Use fillers occasionally ("Look,", "I mean,"), contractions, and direct address.
    3. ADAPT TO THE USER. Analyze their latest argument for logical fallacies, weak evidence, or emotional appeals, and systematically dismantle it.
    4. COUNTER-ATTACK. Do not just defend your stance; exploit the specific vulnerabilities in the user's previous statement.
    5. DO NOT start with "As an AI" or "I understand". Start directly with your counter-point.
    6. If the user's point is weak, point it out explicitly.
    7. If you are interrupting, acknowledge it briefly ("Hold on,").`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context so far:\n${context || "No context yet."}\n\nUser just said: "${userMsg}"` }
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
    // Check if it's for 'debate' (1v1) or 'gd' (group)
    const { type, category } = req.body;

    let systemPrompt = "";

    if (type === 'debate') {
        systemPrompt = `Generate a single, provocative, and debatable motion for a 1-on-1 debate.
        Category: ${category || "General"}
        Examples: "AI will replace doctors", "Social media bans are necessary".
        Output ONLY the topic string. No quotes.`;
    } else {
        systemPrompt = `Generate a single, interesting topic suitable for a Group Discussion (GD).
        Category: ${category || "General"}
        It should allow for multiple perspectives.
        Output ONLY the topic string. No quotes.`;
    }

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

export const analyzeSpeech = async (req, res) => {
    const { transcript } = req.body;

    const systemPrompt = `You are a strict English Communication Coach.
    Analyze the following speech transcript (generated from Speech-to-Text).
    
    CRITICAL INSTRUCTIONS:
    1. IGNORE capitalization, punctuation, and spelling errors (e.g. "real world" vs "real-world", "react" vs "React"). The input is raw audio transcript, so these are not user errors.
    2. FOCUS ONLY on:
       - Verb tense errors (e.g. "I goes" -> "I went")
       - Subject-verb agreement (e.g. "They is" -> "They are")
       - Wrong word usage (e.g. "their" vs "there" if obvious from context, but be lenient)
       - Sentence structural issues (fragments, run-ons that confusing meaning)
    3. Filler Words to count: um, uh, like, you know, basically, literally.
    4. Sentiment/Tone: Confident, Nervous, Neutral.

    OUTPUT JSON ONLY in this format:
    {
        "score": 0-100,
        "grammarCorrections": [
            { "original": "I goes to market", "correction": "I went to the market", "reason": "Subject-verb agreement" }
        ],
        "fillerWordCount": { "um": 2, "like": 5 },
        "tone": "Nervous",
        "feedback": "Try to speak more slowly and avoid starting sentences with 'basically'."
    }`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: transcript }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, analysis });

    } catch (error) {
        console.error("Speech Analysis Error:", error);
        res.status(500).json({ success: false, error: "Failed to analyze speech" });
    }
};

export const evaluateDebate = async (req, res) => {
    const { message } = req.body;

    const systemPrompt = `You are an Expert Debate Evaluator.
    You will receive a prompt containing a debate transcript and instructions on how to evaluate the User.
    You MUST output ONLY a valid JSON object matching the requested schema. Do not output markdown code blocks.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const report = completion.choices[0]?.message?.content;
        res.json({ success: true, response: report });

    } catch (error) {
        console.error("Debate Evaluation Error:", error);
        res.status(500).json({ success: false, error: "Failed to evaluate debate" });
    }
};
