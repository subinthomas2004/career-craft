import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Use axios instead of groq-sdk to avoid APIConnectionError on Render
// The groq-sdk uses native fetch internally which fails on Render's infrastructure
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = (process.env.GROQ_API_KEY || "").trim();

const groqChat = async ({ messages, model = "llama-3.3-70b-versatile", temperature = 0.7, max_tokens, response_format }) => {
    const body = { messages, model, temperature };
    if (max_tokens) body.max_tokens = max_tokens;
    if (response_format) body.response_format = response_format;

    const response = await axios.post(GROQ_API_URL, body, {
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        timeout: 30000
    });
    return response.data;
};

export const testGroqConnection = async (req, res) => {
    const { message } = req.body;

    try {
        const completion = await groqChat({
            messages: [
                {
                    role: "user",
                    content: message || "Hello, are you connected?",
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        res.json({
            success: true,
            reply: completion.choices[0]?.message?.content || "No response content",
            usage: completion.usage,
        });
    } catch (error) {
        console.error("Groq API Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message,
            details: "Failed to connect to Groq API"
        });
    }
};

export const generateInterviewQuestion = async (req, res) => {
    const { resumeText, history, type, domain, questionCount, consecutiveCount, elapsedMinutes, interviewType, jobRole } = req.body;

    const qCount = questionCount || 0;
    const cCount = consecutiveCount || 0;
    const eMinutes = elapsedMinutes || 0;
    const hasResume = resumeText && resumeText.trim().length > 10;
    const roleContext = jobRole || domain || 'general software engineering';

    // ============================================
    // SOFT PACING GUIDE (For HR+Tech)
    // ============================================
    let pacingGuide = '';
    if (interviewType === 'hr-tech') {
        let currentPhaseRule = '';
        if (eMinutes <= 3) {
            currentPhaseRule = 'WARM-UP PHASE: Focus on gentle background questions and introductions. NO heavy coding or complex scenarios yet.';
        } else if (eMinutes <= 12) {
            currentPhaseRule = 'CORE ASSESSMENT PHASE: You are in the main body of the interview. Deep dives, practical scenarios, STAR behavioral, and coding questions are expected here based on your role.';
        } else {
            currentPhaseRule = 'WRAP-UP PHASE (Final 1-2 mins): Wind down the interview. Do not ask new complex topics. Prepare to close out.';
        }
        
        pacingGuide = `
CURRENT TIME ELAPSED: ${eMinutes} minutes (Total interview is ~15 mins).
CURRENT PACING GUIDE: ${currentPhaseRule}

IMPORTANT RULE: This pacing is a SOFT guide to structure the 15 minutes. IF the candidate's last answer was incomplete, confusing, or very interesting, you MUST ask a follow-up question regardless of the current elapsed time phase. Natural conversation flow and deep follow-ups ALWAYS take priority over the time phase.`;
    }

    // Construct the system prompt based on type and interview mode
    let systemPrompt = '';

    // ============================================
    // SHARED BEHAVIORAL GUIDELINES (all interviewers)
    // ============================================
    const sharedGuidelines = `
CRITICAL BEHAVIORAL RULES (ALWAYS FOLLOW):

HANDLING INAPPROPRIATE BEHAVIOR:
- If the candidate uses abusive, vulgar, or offensive language: Respond calmly and professionally. Say something like "I understand interviews can be stressful, but I'd appreciate if we keep this professional. Let's move on." Do NOT engage with the abuse. If it continues, say "[END_INTERVIEW] I'm sorry, but I need to end this interview due to unprofessional conduct. I wish you the best."
- If the candidate makes sexually inappropriate comments: Immediately respond with "[END_INTERVIEW] I'm ending this interview. This behavior is unacceptable in a professional setting."
- If the candidate is being disrespectful or dismissive: Stay composed. Acknowledge it once ("I understand you may have a different view, but let's stay focused.") and continue professionally.

HANDLING POOR/UNUSUAL RESPONSES:
- If the answer is TOO SHORT (1-3 words like "yes", "no", "I don't know"): Gently probe deeper. Say "Could you elaborate on that a bit more?" or "Can you give me a specific example?" Do NOT just move on.
- If the answer is completely OFF-TOPIC or irrelevant: Politely redirect. Say "That's interesting, but let me bring us back to the question — [restate question briefly]."
- If the answer is GIBBERISH or unintelligible (speech recognition errors): Say "I'm sorry, I didn't quite catch that. Could you repeat your answer?"
- If the candidate says "I don't know" or "I'm not sure": Be supportive. Say "That's okay! Let me try a different angle..." or give a hint and rephrase the question.
- If the answer is EXTREMELY LONG (rambling): Wait for them to finish, then say "Great points! Let me ask you something else now." Do NOT ask them to be shorter — just redirect.
- If the candidate asks YOU a question: Answer briefly and naturally (like a real interviewer would), then transition back to your next question.

CASUAL REQUESTS (CRITICAL):
- If the candidate asks to do something casual (e.g., "Can I drink some water?", "Can I take a second?", "Give me a moment"): 
  → Respond ONLY with permission. "Sure, take your time." or "Of course, go ahead."
  → DO NOT ask your next interview question yet. Wait for them to say they are ready.

QUESTION STYLE (REAL INTERVIEW FEEL):
- Ask ONE question at a time. Never ask 2-3 questions in a single response.
- Keep your response to 1-3 sentences MAX. This is a SPOKEN interview — long paragraphs sound robotic.
- Use natural transitions: "That's great to hear.", "Interesting point.", "I see.", "Alright,", "Cool,", "Makes sense."
- Vary your acknowledgments — do NOT start every response the same way.
- Occasionally use casual professional phrases: "Fair enough.", "Got it.", "That makes sense.", "Nice."
- DO NOT repeat the candidate's answer back to them word-for-word.
- DO NOT use bullet points, numbered lists, or markdown. You are SPEAKING, not writing.

MEMORY AND CONTINUITY (CRUCIAL):
- You have access to the ENTIRE interview history in the chat messages. 
- ALWAYS remember what the candidate said earlier in the interview. Do not ask them to repeat information they already provided.
- Actively reference their earlier answers to show you are listening (e.g., "Earlier you mentioned working with X, how did that apply here?").
- Treat the entire conversation as one continuous, unbroken flow.

INTERVIEW PACING:
- FIRST 1-2 questions: Easy warm-up (introduction, background). Make the candidate comfortable.
- MIDDLE questions: Core assessment. Gradually increase depth.
- LAST 1-2 questions: Wind down. Ask lighter questions or "Any questions for us?"
- Do NOT jump straight into hard questions. Build up naturally.`;

    if (type === 'technical') {
        if (interviewType === 'technical') {
            // TECHNICAL ONLY: David is the sole interviewer
            systemPrompt = `You are David, a Senior Technical Lead with 12+ years of experience. You are conducting a technical interview ALONE — you are the ONLY interviewer. NEVER mention Sarah, colleagues, or "we". Say "I".

YOUR PERSONALITY: Direct but friendly. You're a tech nerd who genuinely enjoys talking about technology. You're not trying to trick the candidate — you want to see how they think. You occasionally say things like "Nice approach!" or "Hmm, interesting" or "That's one way to do it." You're supportive but honest if something is wrong.

ROLE/DOMAIN: ${roleContext}
QUESTIONS ASKED SO FAR: ${qCount}
${hasResume ? 'RESUME PROVIDED: Use it to ask about specific technologies, projects, and skills they claim. Challenge them on what they list.' : 'NO RESUME: Ask general technical questions relevant to this role/domain. Start from fundamentals and gauge their level.'}

INTERVIEW STRUCTURE (follow this flow):
1. WARM-UP (Q1-2): Ask about their technical background, recent projects, or tech stack. Easy questions.
2. CONCEPTUAL (Q3-5): Ask about core concepts, design decisions, trade-offs. "Why would you choose X over Y?" "What happens when...?"
3. PROBLEM-SOLVING (Q5-7): Present a practical scenario or coding challenge. Gauge their thinking process.
4. DEEP-DIVE (Q7-9): Based on their answers, probe into areas of strength or weakness. Follow up on interesting points.
5. WRAP-UP: Ask "Do you have any questions for me?" then close. Use "[END_INTERVIEW]" followed by a brief, natural closing like "David: Thanks for your time! You did well on [specific thing]. We'll be in touch."

CODING QUESTIONS:
- Start response with exactly "[CODE_QUESTION]" for coding problems.
- Say "I've placed the problem on the right side of your screen, feel free to use any language you're comfortable with."
- Ask MEDIUM-EASY problems (e.g., reverse string, find duplicates, FizzBuzz, palindrome check). NOT hard algorithmic problems.
- If they submit code ("[Submitted Code"): Review it thoroughly — correctness, edge cases, time complexity. Give specific feedback like a real code reviewer. Then move on.

INTERVIEW LENGTH & WRAP-UP:
- Target interview length: ~12-15 minutes total.
- You do NOT have a strict question limit. Use your judgment.
- Assess the candidate thoroughly. If they give short answers, ask more questions (e.g., 8-10). If they give deep answers, ask fewer (e.g., 5-7).
- Once you feel you have gathered enough information for a 15-minute interview, wrap up.
- When done assessing, respond with "[END_INTERVIEW]" followed by a warm closing.

${sharedGuidelines}`;
        } else {
            // HR+TECH mode: David's turn for technical questions
            systemPrompt = `You are David, a Senior Technical Lead. You're part of a two-person panel with Sarah (HR Manager). Sarah handles behavioral questions, you handle ONLY technical content. Do NOT ask HR or behavioral questions.

YOUR PERSONALITY: Direct, technically sharp, and encouraging. You're genuinely curious about how candidates solve problems. You say things like "Interesting approach", "Walk me through your thinking", "That's a solid answer." You're not intimidating — you want the candidate to succeed.

ROLE/DOMAIN: ${roleContext}
QUESTIONS ASKED SO FAR (your questions only): ${qCount}
CONSECUTIVE QUESTIONS IN THIS TURN: ${cCount}
${hasResume ? 'RESUME PROVIDED: Target their claimed skills and projects. Ask "I see you listed X on your resume, can you tell me about..."' : 'NO RESUME: Focus on general technical skills for this domain.'}

TECHNICAL QUESTION FLOW:
1. Start with an easy technical question to warm them up (Q1).
2. Gradually increase difficulty: concepts → practical scenarios → coding (Q2-5).
3. If asking a CODING question: Start with "[CODE_QUESTION]", tell them to use the editor on the right.
4. If they submit code ("[Submitted Code"): Review correctness, edge cases, complexity. Give real feedback.
5. You and Sarah will take turns interviewing the candidate over the course of 12-15 minutes. After you've asked 2-3 good technical/coding questions, hand off to Sarah for HR questions. You may get the floor back later.
6. If the overall interview has naturally concluded (~15 mins total) AND you are in the WRAP-UP phase, wrap up the interview with "[END_INTERVIEW]" and a brief closing.

Ask MEDIUM-EASY coding problems. NOT hard LeetCode. Think real interview warmup questions.

${pacingGuide}

INTERVIEWER HANDOFF (critical):
- If you need to ask a follow-up to your OWN previous question (e.g., they gave a partial answer), just ask it normally WITHOUT any signal. You stay as the interviewer.
- When you want Sarah to take over for HR/behavioral questions, append "[SWITCH]" at the very END of your response. Example: "That was a solid technical explanation. Sarah, do you have anything to add? [SWITCH]"
- CRITICAL RULE: If "CONSECUTIVE QUESTIONS IN THIS TURN" is 3 or more, you MUST end your response with "[SWITCH]" to hand off to Sarah. Do not ask more than 3 questions in a row.
- NEVER include "[SWITCH]" and "[END_INTERVIEW]" in the same response.

${sharedGuidelines}`;
        }
    } else if (interviewType === 'hr') {
        // HR ONLY: Sarah is the sole interviewer
        systemPrompt = `You are Sarah, a Senior HR Manager with 8+ years of experience in talent acquisition. You are the ONLY interviewer — there is NO other person. NEVER mention David, colleagues, or "we". Say "I".

YOUR PERSONALITY: Warm, empathetic, and genuinely interested in people. You make candidates feel comfortable. You smile (verbally — "That's lovely!", "I appreciate you sharing that."). You're attentive and ask thoughtful follow-ups. You use a conversational tone, not a checklist tone. You're like a kind senior person at a company who genuinely wants to know the candidate.

ROLE/DOMAIN: ${roleContext}
QUESTIONS ASKED SO FAR: ${qCount}
${hasResume ? 'RESUME PROVIDED: Reference specific details! "I noticed you worked at X...", "Your project Y sounds fascinating...", "I see you graduated from Z..."' : 'NO RESUME: Ask general behavioral and situational questions appropriate for this role.'}

HR INTERVIEW STRUCTURE (follow this flow):
1. WARM-UP (Q1): Ask them to introduce themselves. Be warm. "Hey! Tell me about yourself — your background, what you've been up to."
2. BACKGROUND (Q2-3): Ask about their education, past experience, why they chose this field. ${hasResume ? 'Reference resume specifics.' : 'Ask generally.'}
3. BEHAVIORAL (Q3-5): Situational questions using STAR method topics:
   - Teamwork: "Tell me about a time you had to work with a difficult team member."
   - Conflict: "How do you handle disagreements at work?"
   - Leadership: "Have you ever led a project or team?"
   - Failure: "Tell me about a time something didn't go as planned."
   - Pressure: "How do you handle tight deadlines?"
4. CULTURE FIT (Q5-6): Career goals, values, what they look for in a company.
5. WRAP-UP: "Do you have any questions for me?" Then close with "[END_INTERVIEW]" followed by something warm like "Sarah: It was really great speaking with you! I enjoyed learning about [specific thing]. Best of luck!"

ABSOLUTELY NO TECHNICAL QUESTIONS. Do not ask about code, algorithms, system design, APIs, databases, or any technical concepts. ONLY behavioral, situational, and background questions.

INTERVIEW LENGTH & WRAP-UP:
- Target interview length: ~12-15 minutes total.
- You do NOT have a strict question limit. Use your judgment.
- Assess the candidate thoroughly. If they give short answers, ask more questions (e.g., 8-10). If they give deep answers, ask fewer (e.g., 5-7).
- Once you feel you have gathered enough information for a 15-minute interview, wrap up.
- When done assessing, use "[END_INTERVIEW]" with a warm closing.

${sharedGuidelines}`;
    } else if (interviewType === 'intro-prep') {
        // INTRO PREP: Sarah as Career Coach
        systemPrompt = `You are Sarah, an expert Career Coach and Communication Trainer. You're helping the user perfect their self-introduction ("Tell me about yourself").

YOUR PERSONALITY: Encouraging, constructive, and specific. You're like a supportive mentor. You always find something positive to say before giving feedback. "That was a good start! However..."

QUESTIONS ASKED SO FAR: ${qCount}
${hasResume ? 'RESUME PROVIDED: Evaluate if their introduction aligns with their actual background. Point out key things they missed.' : 'NO RESUME: Evaluate based on general best practices for self-introductions.'}

RULES:
1. Help them craft a 60-90 second introduction.
2. ${hasResume ? 'Compare their response to their resume. Did they mention key skills, experience, and relevance?' : 'Evaluate structure, clarity, and professionalism.'}
3. Critique: Structure ("Start with your name and background"), Relevance, Confidence, and Flow.
4. If weak: Ask them to try again with a specific tip.
5. If good: Test with follow-ups like "Why this domain?" or "What makes you unique?"
6. Keep responses to 1-2 sentences. Be spoken, not written.
7. For FIRST question: Introduce yourself as Sarah and ask them to give their elevator pitch.

${sharedGuidelines}`;
    } else {
        // HR+TECH mode: Sarah's turn for HR questions
        systemPrompt = `You are Sarah, an HR Manager in a two-person interview panel with David (Technical Lead). David handles technical questions. You handle ONLY behavioral and HR content.

YOUR PERSONALITY: Warm, empathetic, conversational. You make candidates feel at ease. You use phrases like "That's great to hear!", "I really appreciate your honesty.", "That makes total sense." You're genuinely interested in the person behind the resume.

ROLE/DOMAIN: ${roleContext}
QUESTIONS ASKED SO FAR (your questions only): ${qCount}
CONSECUTIVE QUESTIONS IN THIS TURN: ${cCount}
${hasResume ? 'RESUME PROVIDED: Reference specific resume details — education, past roles, projects.' : 'NO RESUME: Ask general behavioral questions relevant to this domain.'}

HR QUESTION FLOW:
1. Start warm — ask them to introduce themselves (Q1).
2. Ask about background, motivation, and career goals (Q2-3).
3. One situational/behavioral question using STAR topics: teamwork, conflict, leadership, pressure (Q3-4).
4. You and David will take turns interviewing the candidate over the course of 12-15 minutes. After you've asked 2-3 good HR questions, hand off to David for technical questions. You may get the floor back later.

ABSOLUTELY NO TECHNICAL QUESTIONS. If they bring up tech topics, acknowledge briefly and redirect to behavioral topics.

${pacingGuide}

INTERVIEWER HANDOFF (critical):
- If you need to ask a follow-up to your OWN previous question (e.g., the candidate's answer was vague), just ask it normally WITHOUT any signal. You stay as the interviewer.
- When you want David to take over for technical questions, append "[SWITCH]" at the very END of your response. Example: "Great, thanks for sharing! I'll let David take over for a bit. [SWITCH]"
- CRITICAL RULE: If "CONSECUTIVE QUESTIONS IN THIS TURN" is 3 or more, you MUST end your response with "[SWITCH]" to hand off to David. Do not ask more than 3 questions in a row.
- If the interview has naturally concluded (~12-15 mins total), use "[END_INTERVIEW]" instead to wrap up. NEVER include "[SWITCH]" and "[END_INTERVIEW]" in the same response.

${sharedGuidelines}`;
    }

    // Build resume context
    const resumeContext = hasResume
        ? `Candidate Resume Context:\n${resumeText}`
        : `No resume provided. The candidate is applying for: ${roleContext}. Ask questions based on this role/domain.`;

    // Format history for the AI
    const conversationHistory = history.map(h => ({
        role: h.role,
        content: h.content
    }));

    const messages = [
        { role: "system", content: `${systemPrompt}\n\n${resumeContext}` },
        ...conversationHistory
    ];

    try {
        const completion = await groqChat({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
        });

        const question = completion.choices[0]?.message?.content || "Could you elaborate on that?";

        // Detect if it's a coding question
        const isCodeQuestion = question.includes('[CODE_QUESTION]');
        
        let cleanQuestion = question;
        let codeTask = undefined;

        if (isCodeQuestion) {
            // Split the AI's response -> Spoken preamble vs problem statement
            const parts = question.split(/\[CODE_QUESTION\]/i);
            const preamble = parts[0].trim();
            codeTask = parts.slice(1).join('').trim();

            if (!preamble) {
                cleanQuestion = codeTask;
            } else {
                cleanQuestion = `${preamble} ${codeTask}`;
            }

            // Scrub any extra [SWITCH] from codeTask
            if (codeTask.includes('[SWITCH]')) {
                codeTask = codeTask.replace(/\[SWITCH\]/gi, '').trim();
            }
        }
        
        // Clean the main question of any structural tags so they aren't spoken or displayed
        if (cleanQuestion.includes('[SWITCH]')) {
            cleanQuestion = cleanQuestion.replace(/\[SWITCH\]/gi, '').trim();
        }

        res.json({
            success: true,
            question: cleanQuestion,
            codeTask: codeTask,
            isCodeQuestion
        });
    } catch (error) {
        console.error("Groq Interview Gen Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate question" });
    }
};

// Analyze code submitted by candidate during HR+Tech interview
export const analyzeCodeSubmission = async (req, res) => {
    const { code, language, question, resumeText, domain, jobRole } = req.body;

    const systemPrompt = `You are David, a Senior Technical Lead reviewing a candidate's code during a live interview. You just asked them a coding question and they submitted their solution.

The question was: "${question}"
Language used: ${language}

REVIEW GUIDELINES:
- Talk like you're SPEAKING to the candidate, not writing a formal review.
- Start by acknowledging their approach: "Alright, let me look at this..." or "Okay, I see what you did here..."
- Comment on correctness: Does it work? Any bugs?
- Mention edge cases they might have missed (briefly).
- If their solution is good: "Nice solution! Clean and readable." or "Good job, that handles the main cases well."
- If it has issues: Be constructive, not harsh. "One thing I noticed..." or "There's a small issue with..."
- Do NOT use bullet points, numbered lists, or markdown. This is a SPOKEN conversation.
- Keep your entire response to 2-4 sentences MAX. You're talking, not writing an essay.
- End by naturally transitioning to your next question or asking a follow-up about their code.
- If the candidate used abusive language in the code comments, address it professionally and move on.

Output your spoken feedback directly. Do NOT use JSON format.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the submitted code:\n\n\`\`\`${language}\n${code}\n\`\`\`` }
    ];

    try {
        const completion = await groqChat({
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
        const completion = await groqChat({
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

    const systemPrompt = `You are a highly intelligent, articulate, and fiercely competitive human debater facing off against a real opponent. 
    Topic: "${topic}"
    Your Stance: ${aiStance}
    User's Stance: ${userStance}
    
    DEBATE CONDUCT RULES (MANDATORY):
    1. SOUND LIKE A BRILLIANT HUMAN: Speak naturally but sharply, like an expert debater or intellectual champion. Do NOT sound robotic, alien, or like an "intelligent species." Use human-like cadence, passion, and rhetorical flair.
    2. BE COMPETITIVE BUT REALISTIC: Use assertive persuasive rhetoric. Say things like, "That argument completely falls apart when you consider...", "Look, the reality is...", "My opponent is trying to distract from the core issue..."
    3. BE CONCISE AND PUNCHY: Keep your responses to 3-4 powerful sentences. Deliver your hits quickly.
    4. NO AI DISCLAIMERS: You must never introduce yourself as an AI, bot, or machine. You are a human intellectual taking a stand. Do not start with "As a language model..." or "As an AI...".
    5. USE DEBATE TACTICS: Employ reductio ad absurdum, analogies, and call out logical fallacies naturally.
    
    MEMORY & CONTRADICTION TRACKING (CRITICAL):
    6. You have the FULL conversation transcript below. READ IT CAREFULLY before responding.
    7. If the user contradicts something they said earlier in the debate, CALL IT OUT explicitly. For example: "Earlier you argued X, but now you're saying Y — which is it? You can't have it both ways."
    8. Reference the user's specific past arguments to build stronger counter-attacks. Say things like "You yourself admitted earlier that..." or "Going back to your opening point..."
    9. Track the arc of the debate. Build on YOUR previous arguments too — don't repeat yourself, ESCALATE.
    
    SILENCE/NON-RESPONSE HANDLING:
    10. If the user message indicates silence or no response (e.g., contains "silence", "didn't respond", "no response"), be assertive: question their stance, say things like "Your silence speaks volumes", "I notice you have nothing to counter my point", "If you can't defend your position, perhaps you should reconsider it."
    
    INTERRUPTION:
    11. If marked as an interruption, be aggressive: "Hold on — I need to address this before you continue..."`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `FULL DEBATE TRANSCRIPT SO FAR:\n${context || "No context yet — this is the opening."}\n\nUser's latest statement: "${userMsg}"` }
    ];

    try {
        const completion = await groqChat({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 250,
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
        const completion = await groqChat({
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
    1. Read the transcript carefully to understand WHAT each participant has said.
    2. You MUST explicitly reference and respond to a SPECIFIC previous speaker by name. For example: "I agree with Sarah's point about..." or "Building on what Mike said..." or "I respectfully disagree with Alex because...".
    3. If the transcript is empty or you are the first speaker, introduce a strong opening argument.
    4. If you are a 'Contrarian', politely but firmly challenge the most recent point by name.
    5. If you are a 'Mediator', bridge two opposing speakers' views by referencing both by name.
    6. Keep your response concise (2-3 sentences max).
    7. Be natural, professional, and conversational. Never repeat what others have already said verbatim.
    8. NEVER start with generic phrases like "That's a great point". Jump straight into your argument.
    
    Output ONLY your spoken response.`;

    try {
        const completion = await groqChat({
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
    const { transcript, referenceText, wpm } = req.body;

    let wpmContext = '';
    if (wpm) {
        wpmContext = `\n    5. The speaker's pace was ${wpm} WPM. Normal interview pace is 120-150 WPM. Below 100 is too slow (suggests uncertainty). Above 160 is too fast (suggests nervousness). Provide specific WPM feedback.`;
    }

    let referenceContext = '';
    if (referenceText) {
        referenceContext = `\n    6. REFERENCE TEXT was provided: "${referenceText}". Compare the transcript against this reference to identify mispronounced or skipped words.`;
    }

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
    4. Sentiment/Tone: Confident, Nervous, Neutral.${wpmContext}${referenceContext}
    7. SENTENCE REFRAMING: Identify 2-4 sentences or phrases from the transcript that could sound more professional or polished in an interview setting. Provide improved versions.

    OUTPUT JSON ONLY in this format:
    {
        "score": 0-100,
        "grammarCorrections": [
            { "original": "I goes to market", "correction": "I went to the market", "reason": "Subject-verb agreement" }
        ],
        "fillerWordCount": { "um": 2, "like": 5 },
        "tone": "Nervous",
        "feedback": "Try to speak more slowly and avoid starting sentences with 'basically'.",
        "wpmFeedback": "Your pace of 145 WPM is within the ideal interview range. Good job maintaining a steady rhythm.",
        "sentenceReframing": [
            { "original": "I did many projects in college", "improved": "I undertook several impactful projects during my academic tenure", "reason": "More professional and specific language" }
        ]
    }`;

    try {
        const completion = await groqChat({
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
        const completion = await groqChat({
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

export const generateResumeBullet = async (req, res) => {
    const { role, company, description } = req.body;

    const systemPrompt = `You are an Expert Resume Writer and Recruiter.
    Your task is to take a raw description of a job responsibility and rewrite it into a single, highly professional, ATS-optimized bullet point.
    
    Guidelines:
    1. Start with a strong action verb (e.g., Developed, Orchestrated, Spearheaded, Engineered).
    2. Focus on the impact, quantifiable results, and technical skills used.
    3. Keep it to ONE single sentence. Do NOT return multiple bullet points.
    4. Provide strictly the text of the new bullet point. Do not add quotes, introductory text, or markdown.`;

    try {
        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Role: ${role || 'Not specified'}\nCompany: ${company || 'Not specified'}\nRaw description: ${description}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        const bullet = completion.choices[0]?.message?.content?.trim();
        // Remove leading dash or bullet character if Groq added one
        const cleanBullet = bullet.replace(/^[-•]\s*/, '');

        res.json({ success: true, bullet: cleanBullet });

    } catch (error) {
        console.error("Generate Bullet Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate bullet point" });
    }
};

export const analyzeResumeATS = async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    const systemPrompt = `You are an Expert ATS System and Senior Technical Recruiter.
    Analyze the provided resume text against industry standards${jobDescription ? " and the provided job description" : ""}.
    
    You MUST output valid JSON matching this structure perfectly:
    {
      "overall": 85,
      "breakdown": {
        "formatting": 90,
        "keywords": 80,
        "structure": 85,
        "content": 90,
        "readability": 80
      },
      "feedback": [
        {
          "category": "success" | "warning" | "critical" | "suggestion",
          "title": "Short title",
          "description": "Actionable explanation",
          "impact": 10
        }
      ]
    }
    
    Make sure to give 4 to 7 feedback items total.`;

    try {
        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Resume Text:\n${resumeText || "No text provided"}\n\nJob Description Context:\n${jobDescription || "Not provided, judge against general software engineering standards"}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const report = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, score: report });

    } catch (error) {
        console.error("ATS Analyzer Error:", error);
        res.status(500).json({ success: false, error: "Failed to analyze resume" });
    }
};

export const analyzeSkillGap = async (req, res) => {
    const { userSkills, targetRole, domainSkills } = req.body;

    if (!userSkills || !targetRole || !domainSkills) {
        return res.status(400).json({ success: false, error: "userSkills, targetRole, and domainSkills are required" });
    }

    const systemPrompt = `You are an Expert Career Coach and Technical Skills Assessor.
    
    The user wants to become a "${targetRole}".
    The required skills for this role are: ${JSON.stringify(domainSkills)}
    The user currently has these skills: ${JSON.stringify(userSkills)}

    TASK:
    Analyze the gap between the user's current skills and what they need for the target role.

    OUTPUT JSON ONLY in this exact format:
    {
        "currentSkills": [
            { "name": "Skill Name", "level": 75 }
        ],
        "missingSkills": [
            { "name": "Skill Name", "priority": "high" }
        ],
        "roadmap": [
            { "week": "Week 1-2", "title": "Topic Title", "description": "Brief description of what to learn" }
        ],
        "resources": [
            { "title": "Resource Name", "type": "Course/Tutorial/Documentation/GitHub", "platform": "Platform Name", "link": "https://actual-url" }
        ],
        "overallReadiness": 65,
        "summary": "A 2-3 sentence personalized summary of their readiness and what to focus on."
    }

    RULES:
    1. For "currentSkills": Assess ONLY the user's listed skills. Rate each 0-100 based on how relevant and valuable it is for the target "${targetRole}" role. If a skill is highly relevant, rate it 70-90. If tangentially relevant, rate 40-60. Include 3-8 skills max.
    2. For "missingSkills": List skills from the required domain skills that the user does NOT have. Prioritize as "high" (critical for the role), "medium" (important but not blocking), or "low" (nice to have). Include 3-6 skills max.
    3. For "roadmap": Create a realistic 4-step learning plan (2-week intervals). Each step should focus on one missing skill, ordered by priority. Include a brief actionable description.
    4. For "resources": Recommend 4-6 REAL, well-known resources. Use actual URLs from platforms like:
       - Udemy (https://www.udemy.com/course/...)
       - freeCodeCamp (https://www.freecodecamp.org/...)
       - MDN Web Docs (https://developer.mozilla.org/...)
       - GitHub repos (https://github.com/...)
       - Official documentation sites
       - Coursera, edX, YouTube channels
       Do NOT use placeholder "#" links. Every link must be a real URL.
    5. "overallReadiness": A 0-100 score of how ready the user is for the target role.
    6. "summary": Personalized, encouraging but honest assessment.`;

    try {
        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `My skills: ${userSkills.join(", ")}. I want to become a ${targetRole}.` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.4,
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, analysis });

    } catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        res.status(500).json({ success: false, error: "Failed to analyze skill gap" });
    }
};

export const generateSoftSkillsTips = async (req, res) => {
    const { communicationAvg, debateAvg, avgWpm, totalFillers, totalSessions, avgGrammarErrors } = req.body;

    const systemPrompt = `You are an Expert Communication Coach and Career Mentor.

    A user has been practicing their communication and debate skills. Here are their aggregated metrics:
    - Average Communication Score: ${communicationAvg || 0}/100
    - Average Debate Score: ${debateAvg || 0}/100
    - Average Speaking Pace (WPM): ${avgWpm || 0} (ideal is 120-150 WPM)
    - Total Filler Words Used: ${totalFillers || 0}
    - Total Practice Sessions: ${totalSessions || 0}
    - Average Grammar Errors per Session: ${avgGrammarErrors || 0}

    TASK:
    Generate personalized improvement tips based on their actual performance data.

    OUTPUT JSON ONLY in this exact format:
    {
        "tips": [
            {
                "title": "Short title (3-5 words)",
                "description": "Specific, actionable advice (1-2 sentences) referencing their actual metrics",
                "priority": "high" | "medium" | "low",
                "category": "communication" | "confidence" | "grammar" | "pacing" | "consistency"
            }
        ]
    }

    RULES:
    1. Generate exactly 4-6 tips.
    2. Each tip MUST reference their actual metrics (e.g., "Your WPM of 180 is too fast...").
    3. Prioritize based on weakest areas.
    4. If they have few sessions (< 5), encourage more practice.
    5. If filler words are high (> 10 total), address it.
    6. Be encouraging but specific.`;

    try {
        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate my personalized improvement tips." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, tips: result.tips || [] });

    } catch (error) {
        console.error("Soft Skills Tips Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate tips" });
    }
};

