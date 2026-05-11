import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Use axios instead of groq-sdk to avoid APIConnectionError on Render
// The groq-sdk uses native fetch internally which fails on Render's infrastructure
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = (process.env.GROQ_API_KEY || "").trim();

const logError = (errorInfo) => {
    const logPath = path.join(process.cwd(), "groq_error.log");
    const timestamp = new Date().toISOString();
    const logMessage = `\n[${timestamp}] ERROR: ${JSON.stringify(errorInfo, null, 2)}\n`;
    try {
        fs.appendFileSync(logPath, logMessage);
    } catch (err) {
        console.error("Failed to write to groq_error.log:", err);
    }
};

export const groqChat = async ({ messages, model = "llama-3.3-70b-versatile", temperature = 0.7, max_tokens, response_format }) => {
    if (!GROQ_API_KEY) {
        const error = "GROQ_API_KEY is missing or empty in environment variables.";
        logError({ error, envKeys: Object.keys(process.env).filter(k => k.includes("GROQ")) });
        throw new Error(error);
    }

    const body = { messages, model, temperature };
    if (max_tokens) body.max_tokens = max_tokens;
    if (response_format) body.response_format = response_format;

    try {
        const response = await axios.post(GROQ_API_URL, body, {
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            timeout: 30000
        });
        return response.data;
    } catch (error) {
        // Fallback mechanism: If we hit a 429 rate limit on the 70b model, fallback to the 8b model
        if (error.response?.status === 429 && model === "llama-3.3-70b-versatile") {
            const fallbackModel = "llama-3.1-8b-instant";
            console.log(`Rate limit hit for ${model}, falling back to ${fallbackModel}`);
            body.model = fallbackModel;
            
            try {
                const fallbackResponse = await axios.post(GROQ_API_URL, body, {
                    headers: {
                        "Authorization": `Bearer ${GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                });
                return fallbackResponse.data;
            } catch (fallbackError) {
                logError({
                    message: `Fallback to ${fallbackModel} failed: ` + fallbackError.message,
                    status: fallbackError.response?.status,
                    data: fallbackError.response?.data,
                    model: fallbackModel,
                    body
                });
                throw fallbackError;
            }
        }

        logError({
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            model,
            body
        });
        throw error;
    }
};

export const testGroqConnection = async (req, res) => {
    const { message } = req.body;

    if (!GROQ_API_KEY) {
        return res.status(500).json({ success: false, error: "GROQ_API_KEY missing from environment" });
    }

    try {
        const response = await axios.post(GROQ_API_URL, {
            messages: [{
                role: "user",
                content: message || "Hello, are you connected?",
            }],
            model: "llama-3.3-70b-versatile",
        }, {
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const headers = response.headers;

        // Extract precise rate limit values from headers for client telemetry display
        const limits = {
            remainingRequests: headers["x-ratelimit-remaining-requests"] || "N/A",
            limitRequests: headers["x-ratelimit-limit-requests"] || "N/A",
            resetRequests: headers["x-ratelimit-reset-requests"] || "N/A",
            remainingTokens: headers["x-ratelimit-remaining-tokens"] || "N/A",
            limitTokens: headers["x-ratelimit-limit-tokens"] || "N/A",
            resetTokens: headers["x-ratelimit-reset-tokens"] || "N/A",
        };

        res.json({
            success: true,
            reply: response.data.choices[0]?.message?.content || "Connected successfully",
            limits: limits,
            usage: response.data.usage
        });
    } catch (error) {
        console.error("Groq API Connection Test Failed:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message,
            details: "Failed to connect to Groq"
        });
    }
};

export const analyzeRole = async (req, res) => {
    const { role } = req.body;
    
    if (!role) {
        return res.status(400).json({ success: false, error: "Role is required" });
    }

    try {
        const completion = await groqChat({
            messages: [
                {
                    role: "system",
                    content: `You are an expert technical recruiter. Analyze the given job role title. 
Is this a technical role that requires specialized technical knowledge? 
Consider roles in programming, software development, data science, engineering, IT systems, UI/UX design, product design, and product management as technical roles.
Return a valid JSON object: { "isTechnical": true/false }`
                },
                {
                    role: "user",
                    content: `Job Role: ${role}`
                }
            ],
            model: "llama-3.1-8b-instant", // Use faster, smaller model
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{"isTechnical": true}');
        
        res.json({
            success: true,
            isTechnical: result.isTechnical
        });
    } catch (error) {
        console.error("Groq Analyze Role Error:", error.response?.data || error.message);
        // Fallback: assume it's technical if error
        res.json({
            success: true,
            isTechnical: true
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
    
    // Total overall questions completed (rounds)
    const totalRounds = Math.floor((history || []).length / 2);
    const currentQuestionNum = totalRounds + 1;
    
    const mandatoryEndRule = (totalRounds >= 15)
        ? `- CRITICAL CAP REACHED: The overall interview is over. You MUST output "[END_INTERVIEW]" and deliver your final closing immediately.`
        : `- TOTAL PROGRESS: This is Question #${currentQuestionNum} of 15 overall. Aim to terminate after 15 total rounds across both panel members.`;

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

RESUME VS ROLE MISMATCH (STRICT & DIRECT):
- Before asking your first question, mentally compare the candidate's provided resume against the target role: ${roleContext}.
- If there is a "MASSIVE MISMATCH" (e.g., they have a Software Developer resume but are interviewing for a Chef), you MUST be very direct and honest about it. 
- DO NOT be overly polite. Say something like: "I've reviewed your resume and to be honest, this doesn't seem like the right resume for this role at all. Your skills are in [Their Skills], which aren't relevant to being a ${roleContext}. Why are you applying for a role you're not eligible for based on your background?"
- Address their eligibility clearly: "I don't see any relevant talent for this specific position in your history."
- DO NOT proceed to ask standard or technical questions for ${roleContext} until they have justified this massive discrepancy.
- If they cannot justify it, continue to push back on the lack of suitability. This is how a real, "strict brain" interviewer would act.

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
- MANDATORY LIMIT: You MUST ask exactly 10 questions total for a complete evaluation.
- CURRENT QUESTION COUNT: ${qCount} out of 10.
${qCount >= 10
    ? "- CRITICAL: You have now asked 10 questions. YOU MUST CONCLUDE IMMEDIATELY using [END_INTERVIEW]. Acknowledge their last answer and deliver a professional farewell." 
    : `- Proceed with technical evaluation until 10 questions are reached. Ask Question #${qCount + 1}.`}
- When the 10-question threshold is met, always output "[END_INTERVIEW]" followed by your final technical wrap-up.

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
5. You and Sarah will take turns interviewing the candidate. You MUST keep track of TOTAL QUESTIONS.
6. INTERVIEW ENDING CAP:
   ${mandatoryEndRule}
   - Always prioritize using "[END_INTERVIEW]" if specified above. Do NOT switch once 15 total questions is reached.

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
- MANDATORY LIMIT: You MUST ask exactly 15 questions total for a complete evaluation.
- CURRENT QUESTION COUNT: ${qCount} out of 15.
${qCount >= 15 
    ? "- CRITICAL: You have now asked 15 questions. YOU MUST CONCLUDE IMMEDIATELY using [END_INTERVIEW]. Acknowledge their last answer and wrap up the session gracefully." 
    : `- Proceed with the interview until 15 questions are reached. Ask Question #${qCount + 1}.`}
- When the 15-question threshold is met, always output "[END_INTERVIEW]" with your final farewell.

${sharedGuidelines}`;
    } else if (interviewType === 'intro-prep') {
        // INTRO PREP: Sarah as Career Coach
        systemPrompt = `You are Sarah, an expert Career Coach and Communication Trainer. You're helping the user perfect their self-introduction ("Tell me about yourself").

YOUR PERSONALITY: Encouraging, constructive, and specific. You're like a supportive mentor. You always find something positive to say before giving feedback. "That was a good start! However..."

QUESTIONS ASKED SO FAR: ${qCount}
${hasResume ? 'RESUME PROVIDED: Evaluate if their introduction aligns with their actual background. Point out key things they missed.' : 'NO RESUME: Evaluate based on general best practices for self-introductions.'}

RULES (MANDATORY):
1. CONTINUOUS PRACTICE: This is an endless practice session. NEVER end the interview. Do not wrap up or close the session. Keep going until the user manually stops.
2. CORE FOCUS: Focus ONLY on crafting and refining their self-introduction. If they go off-topic, bring them back to their introduction.
3. THE CYCLE:
   - Ask them to deliver their introduction (e.g. "Please tell me about yourself").
   - Listen to their response.
   - Provide 1-2 specific points of feedback (Structure, Confidence, Relevance, missing Resume details).
   - Ask them to try again incorporating your feedback.
   - Repeat this cycle endlessly to help them achieve perfection.
4. ${hasResume ? 'RESUME CHECK: Compare their response to their resume. Did they mention key skills, experience, and relevance? Point out if they missed important achievements.' : 'EVALUATION: Evaluate structure, clarity, and professionalism.'}
5. Keep responses concise (1-3 sentences max). Be spoken, conversational, not written. DO NOT use bullet points or markdown.
6. For the FIRST question: Introduce yourself as Sarah and ask them to give their introduction/elevator pitch.
7. Treat poor/short/gibberish answers gently: "I didn't quite catch that, let's try the intro again."
8. PERFECT INTRODUCTION: If the candidate delivers an introduction that is completely proper, well-structured, and covers all necessary details perfectly, explicitly praise them. Say something like "Congratulations! That was perfect." or "That's exactly how it should sound." Then, ask if they want to practice it one more time to lock it in.
9. IGNORE STT ERRORS: Since this is voice-based, ignore minor misspellings of proper nouns (like their name "Subin" transcribed as "Sibin", or college names). Assume these are Speech-to-Text mic errors and DO NOT critique them for it.
10. STRICT DISCIPLINE: If the user uses abusive, vulgar, unprofessional, or "unnecessary" language, DO NOT tolerate it. Instantly warn them sternly, just like a real, strict teacher would. Say something like: "Excuse me, that language is completely unacceptable in a professional setting. Let's keep this respectful."`;
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
4. You and David will take turns interviewing the candidate.
5. OVERALL CAP RULE:
   ${mandatoryEndRule}
   - Prioritize "[END_INTERVIEW]" immediately if dictated by the rule above. Do NOT hand off once the 15-limit total is hit.

ABSOLUTELY NO TECHNICAL QUESTIONS. If they bring up tech topics, acknowledge briefly and redirect to behavioral topics.

${pacingGuide}

INTERVIEWER HANDOFF (critical):
- If you need to ask a follow-up to your OWN previous question (e.g., the candidate's answer was vague), just ask it normally WITHOUT any signal. You stay as the interviewer.
- When you want David to take over for technical questions, append "[SWITCH]" at the very END of your response. Example: "Great, thanks for sharing! I'll let David take over for a bit. [SWITCH]"
- CRITICAL RULE: If "CONSECUTIVE QUESTIONS IN THIS TURN" is 3 or more, you MUST end your response with "[SWITCH]" to hand off to David. Do not ask more than 3 questions in a row.
- NEVER include "[SWITCH]" and "[END_INTERVIEW]" in the same response.

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
    6. "questionAnalysis": Provide a detailed analysis of EVERY answer submitted. Format: [{"question": "...", "answer": "...", "evaluation": "Analysis", "suggestion": "Improvement", "rating": 1-10, "idealCodeReference": "..."}]. 
    CRITICAL RULES:
    - For any answers tagged with '[Submitted Code]', you MUST explicitly include a key "idealCodeReference" in the JSON object containing the correct/optimized sample solution (with correct syntax and logic) for the candidate to compare against. Do not wrap this key in Markdown formatting inside the string; provide clean code text.
    - You MUST retain the EXACT original answer text, including the '[Submitted Code - Language]' tag, in the "answer" field of the analysis so it renders correctly.
    - Ensure EVERY question answered is analyzed.

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

    const systemPrompt = `You are a fiercely competitive, aggressive, and street-smart human debater. 
    Topic: "${topic}"
    Your Stance: ${aiStance}
    User's Stance: ${userStance}
    
    DEBATE CONDUCT RULES (MANDATORY):
    1. BE AGGRESSIVE: Do not be polite. Your goal is to win and expose the flaws in the user's argument. Use phrases like "That's a weak point," "You're dodging the question," "That makes absolutely no sense," or "You're completely wrong there."
    2. SPEAK LIKE A TOUGH HUMAN: Use natural, punchy, and direct conversational English. AVOID robotic words like "furthermore," "notwithstanding," or "in conclusion." Use "Look," "Listen," "Wait a second," "Honestly," "Get real."
    3. KEEP IT SIMPLE: Use sharp logic but simple language. You are a human debater, not a textbook.
    4. CALL OUT CONTRADICTIONS: Read the transcript carefully. If the user changes their mind or contradicts themselves, call them out aggressively: "Earlier you argued X, but now you're saying Y. You're inconsistent."
    5. BE CONCISE: 3-4 powerful, hard-hitting sentences max.
    6. NO AI DISCLAIMERS: Never mention you are an AI. You are a human opponent.
    
    INTERRUPTION & SILENCE:
    7. If marked as an interruption, be dominant: "Don't interrupt me while I'm exposing your logic..."
    8. If the user is silent, mock their lack of defense: "Silence isn't an argument. If you can't defend your point, you've already lost."`;

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
        systemPrompt = `Generate a single, fun, and extremely simple debate topic for a student.
        Category: ${category || "General"}
        
        STRICT RULES FOR STRUCTURAL VARIETY:
        1. NO REPETITIVE STRUCTURES: Every time I ask, you MUST choose a DIFFERENT sentence structure.
        2. RANDOMLY pick one of these formats:
           - "Should [A] [B]?" (e.g., Should schools ban all exams?)
           - "Is [A] better than [B]?" (e.g., Is YouTube better than TV?)
           - "Would you rather [A] or [B]?" (e.g., Would you rather have super strength or the ability to fly?)
           - "Will [A] ever replace [B]?" (e.g., Will robots ever replace teachers?)
           - "Who would win: [A] or [B]?" (e.g., Who would win in a fight: Batman or Iron Man?)
           - "[Statement]. Agree or Disagree?" (e.g., Pizza is the best food in the world. Agree or Disagree?)
        3. AVOID "Adult/Corporate" topics: NO "Work from home", "Taxes", "Global unity", or "Nationalism".
        4. FOCUS ONLY on Student Life & Fun: Gaming, School, Cinema, Sports, Food, Pets, Superpowers.
        
        Output ONLY the topic string. No quotes.`;
    } else {
        systemPrompt = `Generate a single, fun, and extremely simple Group Discussion (GD) topic for a student.
        Category: ${category || "General"}
        
        VARIETY RULES:
        1. NO FIXED FORMAT: Do NOT always start with "Should". Use varied structures (Is X better? How does X affect Y? Should X be banned? Would you rather?).
        2. AVOID "Adult/Corporate" topics: NO "Working from home", "Taxes", "National pride", "Office culture".
        3. FOCUS ONLY on Student Life & Fun: School, Gaming, Cinema, Food, Pets, Future.
        4. Simple Language: Use 8th-grade English.
        
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
    1. Read the transcript carefully. You MUST prioritize responding to the most recent speaker, especially if it was "You" (the human user).
    2. Reference others by name: "I agree with what You said...", "Building on the user's point about...", "I disagree with Sarah because...".
    3. If the user (You) said something short or unrelated (like "I need water"), call them out politely but firmly: "While that's fine, let's try to stay focused on the topic of ${topic}...", or just ignore the irrelevant part and pivot back to the actual discussion.
    4. If the transcript is empty or you are the first speaker, introduce a strong opening argument.
    5. If you are a 'Contrarian', challenge the most recent point (especially the user's) by name.
    6. Keep your response concise (2-3 sentences max).
    7. Be natural, professional, and conversational.
    
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
    const { transcript, referenceText, wpm, topic, actualDuration, targetDuration } = req.body;

    let wpmContext = '';
    if (wpm) {
        wpmContext = `\n    - The speaker's pace was ${wpm} WPM. Normal interview pace is 120-150 WPM. Below 100 is too slow (suggests uncertainty). Above 160 is too fast (suggests nervousness). Provide specific WPM feedback.`;
    }

    let systemPrompt = '';

    if (referenceText) {
        // READ ALONG MODE
        systemPrompt = `You are a strict English Communication Coach evaluating a "Read Along" exercise.
    The user was asked to read the following reference text aloud: "${referenceText}"
    
    Analyze the provided speech transcript.
    
    CRITICAL INSTRUCTIONS:
    1. DO NOT evaluate the content, grammar, or phrasing of the text itself, because the user did not write it. Do NOT suggest adding more detail or changing the phrasing.
    2. FOCUS ONLY on delivery:
       - Did they add filler words? (um, uh, like, you know, basically, literally)
       - Sentiment/Tone: Confident, Nervous, Neutral.
       - Pacing. ${wpmContext}
    3. Generate an overall "score" (0-100) based strictly on how fluently they read it, their pace, and lack of filler words/stumbles. Do not penalize for content.
    
    OUTPUT JSON ONLY in this format:
    {
        "score": 0-100,
        "grammarCorrections": [],
        "fillerWordCount": { "um": 0, "like": 0 },
        "tone": "Confident",
        "feedback": "Great pronunciation and steady pacing. You read the text very clearly without hesitation.",
        "wpmFeedback": "Your pace of 145 WPM is within the ideal range.",
        "sentenceReframing": []
    }`;
    } else {
        // IMPROMPTU MODE
        let durationContext = '';
        if (actualDuration && targetDuration) {
            durationContext = `\n    - Duration Check: The user had ${targetDuration} seconds but only spoke for ${actualDuration} seconds. If they spoke for less than 20% of the allowed time, deduct a MASSIVE amount of points (e.g., maximum score should be 30-40) because the answer is too short to be evaluated effectively, regardless of how perfect the grammar was. Include this in the feedback.`;
        }

        let topicContext = '';
        if (topic) {
            topicContext = `\n    - Topic Relevance: The user was asked to speak about: "${topic}". Check if their response actually addresses this topic. If the response is generic, irrelevant, or just "I don't know", deduct points heavily and mention it in the feedback.`;
        }

        systemPrompt = `You are a strict English Communication Coach.
    Analyze the following speech transcript (generated from Speech-to-Text).
    
    CRITICAL INSTRUCTIONS:
    1. IGNORE capitalization, punctuation, and spelling errors (e.g. "real world" vs "real-world"). The input is raw audio transcript.
    2. FOCUS ON:
       - Verb tense errors
       - Subject-verb agreement
       - Wrong word usage
       - Sentence structural issues${topicContext}${durationContext}
    3. Filler Words to count: um, uh, like, you know, basically, literally.
    4. Sentiment/Tone: Confident, Nervous, Neutral.${wpmContext}
    5. SENTENCE REFRAMING: Identify 1-3 sentences from the transcript that could sound more professional in an interview.
    6. Generate an overall "score" (0-100). Take grammar, fluency, vocabulary, pacing, TOPIC RELEVANCE, and DURATION into account. If the answer is extremely short or irrelevant, the score MUST be low (e.g., < 50), even if grammar is perfect.
    
    OUTPUT JSON ONLY in this format:
    {
        "score": 0-100,
        "grammarCorrections": [
            { "original": "I goes to market", "correction": "I went to the market", "reason": "Subject-verb agreement" }
        ],
        "fillerWordCount": { "um": 2, "like": 5 },
        "tone": "Nervous",
        "feedback": "Your answer was too short and didn't really address the topic. Try to elaborate more next time.",
        "wpmFeedback": "Your pace of 145 WPM is within the ideal interview range.",
        "sentenceReframing": [
            { "original": "I did many projects", "improved": "I undertook several impactful projects", "reason": "More professional language" }
        ]
    }`;
    }

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
    
    IMPORTANT RULES:
    1. EXPERIENCE CHECK: If the candidate has "Projects", "Academic Projects", "Personal Projects", or any project-related array, you MUST treat those projects as Work Experience. You are FORBIDDEN from generating feedback like "Empty Experience Section" or penalizing them for lack of experience if projects exist.
    2. SUMMARY CHECK: Treat any field containing "Profile", "Objective", "About", or "Summary" as a valid summary. Do NOT generate "Missing Summary or Profile" if they have one of these.
    3. EDUCATION CHECK: If the resume contains any education details, do NOT generate "Empty Education Section".
    4. Provide constructive feedback on what exists rather than falsely claiming sections are missing.
    
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

export const analyzeCodingPractice = async (req, res) => {
    const { code, language, problemTitle, problemDescription } = req.body;

    const systemPrompt = `You are an Expert Technical Interviewer and Code Reviewer. 
    Analyze the user's code for the following problem:
    Problem: ${problemTitle}
    Description: ${problemDescription}
    Target Language: ${language}

    TASK:
    1. EXTREMELY STRICTOR LANGUAGE CHECK: If the code is NOT written in ${language} (e.g., user wrote Java in a Python section), set "hasErrors" to true and "compilationError" to "Language Mismatch: This code is not valid ${language}."
    2. SYNTAX CHECK: Check for any syntax errors, unclosed brackets, or common compilation issues for ${language}.
    3. LOGIC & EFFICIENCY: Analyze if the code correctly solves the problem and its time/space complexity.
    4. Feedback: Provide a single actionable tip.

    OUTPUT JSON ONLY:
    {
        "hasErrors": boolean,
        "compilationError": "String describing the error if any, else null",
        "analysis": "A brief (2-3 sentences) analysis of logic and efficiency",
        "feedback": "A single actionable tip for improvement",
        "score": 0-100 (Estimate based on correctness, efficiency, and language adherence)
    }

    RULES:
    - You must be the primary authority on compilation/syntax errors.
    - If the code is incomplete or has obvious syntax errors, hasErrors MUST be true.
    - If the user wrote code in a DIFFERENT language than ${language}, hasErrors MUST be true.
    - Do NOT include any other text besides the JSON.`;

    try {
        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Here is my code:\n\n\`\`\`${language}\n${code}\n\`\`\`` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, ...result });

    } catch (error) {
        console.error("Coding Practice Analysis Error:", error);
        res.status(500).json({ success: false, error: "Failed to analyze code with Groq" });
    }
};
export const handleChat = async (req, res) => {
    const { message } = req.body;

    try {
        const completion = await groqChat({
            messages: [
                {
                    role: "system",
                    content: `You are CareerCraft AI, a placement preparation assistant. Your goal is to help users with placement prep and navigating the CareerCraft platform.
                    
                    PLATFORM KNOWLEDGE:
                    - Dashboard: Central hub for all activities.
                    - AI Mock Interviews: Practice with AI and get feedback.
                    - Resume Analyzer: ATS optimization and templates.
                    - Group Discussions & Debates: Virtual practice rooms.
                    - Quizzes: Technical and Aptitude assessments.
                    - Coding Practice: Integrated IDE with challenges.
                    - Typing Test: Improve speed and accuracy.
                    - Skill Gap: Analysis of missing skills for roles.
                    - Domain Prep: Technical domain-specific resources.
                    - Communication Coach: Specialized communication practice.
                    - Company Prep: Preparation for specific companies.
                    - Job Portal: Real-time job listings and applications.
                    - Profile: Track achievements and statistics.

                    RULES:
                    - Only answer placement-related or platform-navigation questions.
                    - Do NOT answer unrelated questions (politics, general knowledge, etc.).
                    - Keep responses very minimal, concise, and direct (1-2 sentences).
                    - If a user asks 'where is X', tell them to find it in the Dashboard sidebar or menu.`
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
        });

        res.json({
            success: true,
            response: completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
        });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ success: false, message: "Chat assistance failed." });
    }
};
