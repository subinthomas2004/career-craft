import AIMentorProfile from "../models/AIMentorProfile.js";
import User from "../models/User.js";
import { groqChat } from "./groqController.js";
import mongoose from "mongoose";

// Get or create profile
export const getMentorProfile = async (req, res) => {
    try {
        let profile = await AIMentorProfile.findOne({ user: req.user._id });
        if (!profile) {
            profile = await AIMentorProfile.create({
                user: req.user._id,
                personalityMode: 'friendly',
                memory: { weakTopics: [], pastScores: [] },
                dailyGoals: [],
                learningRoadmap: []
            });
        }
        res.json({ success: true, profile });
    } catch (error) {
        console.error("Get Mentor Profile Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update personality
export const updatePersonality = async (req, res) => {
    const { personalityMode } = req.body;
    try {
        const profile = await AIMentorProfile.findOneAndUpdate(
            { user: req.user._id },
            { $set: { personalityMode } },
            { new: true, upsert: true }
        );
        res.json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Generate Daily Goals using AI
export const generateGoals = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const profile = await AIMentorProfile.findOne({ user: req.user._id });
        
        const systemPrompt = `You are a smart Daily Goal Generator for CareerCraft, an intelligent placement prep platform.
Given the user's stats and memory, generate 3 to 5 achievable daily goals.
Adapt difficulty based on current streak and performance.
Include categories like 'coding', 'aptitude', 'typing', 'quiz', 'interview'.
Return ONLY a valid JSON object containing a root key "goals" with an array of goal objects containing 'title', 'category', and 'difficulty'.
Output valid JSON format only. Example: { "goals": [{"title": "Solve 2 Medium DP questions", "category": "coding", "difficulty": "Medium"}] }`;

        const context = `User Current Streak: ${user?.streak || 0} days.
Recent Weak Areas: ${profile?.memory?.weakTopics?.join(', ') || 'None identified yet'}.
Target Role: ${user?.targetRole || 'Software Developer'}.`;

        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: context }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        let responseText = completion.choices[0]?.message?.content;
        // Attempt parsing, wrap in try catch in case LLM wraps in an object with key goals
        let goalsArray = [];
        try {
            const parsed = JSON.parse(responseText);
            goalsArray = parsed.goals || parsed.targets || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);
            if (!Array.isArray(goalsArray)) goalsArray = [];
        } catch(e) {
             goalsArray = [];
        }

        // If LLM returns trash fallback
        if (goalsArray.length === 0) {
            goalsArray = [
                { title: "Complete 1 Aptitude Quiz", category: "aptitude", difficulty: "Beginner" },
                { title: "Practice typing for 15 minutes", category: "typing", difficulty: "Daily" },
                { title: "Solve 1 coding question", category: "coding", difficulty: "Easy" }
            ];
        }

        // Normalize format with IDs and date
        const today = new Date().toISOString().split('T')[0];
        const formattedGoals = goalsArray.map(g => ({
            id: new mongoose.Types.ObjectId().toString(),
            title: g.title,
            category: g.category || 'general',
            difficulty: g.difficulty || 'Medium',
            isCompleted: false,
            date: today
        }));

        const updatedProfile = await AIMentorProfile.findOneAndUpdate(
            { user: req.user._id },
            { $set: { dailyGoals: formattedGoals } },
            { new: true, upsert: true }
        );

        res.json({ success: true, goals: updatedProfile.dailyGoals });

    } catch (error) {
        console.error("Generate Goals Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const toggleGoal = async (req, res) => {
    const { goalId } = req.body;
    try {
        // 1. Find profile and inspect goals to get current state
        const profile = await AIMentorProfile.findOne({ user: req.user._id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        // 2. Locate the specific goal instance
        const goalIndex = profile.dailyGoals.findIndex(g => g.id === goalId || g._id?.toString() === goalId);
        
        if (goalIndex === -1) {
            console.error(`ToggleGoal error: Goal ID ${goalId} not found in profile.`);
            return res.status(404).json({ success: false, message: "Task identifier invalid." });
        }

        // 3. Read and invert status
        const currentStatus = profile.dailyGoals[goalIndex].isCompleted;
        const newStatus = !currentStatus;

        // 4. Atomically update the target element via positional query to bypass full-document validation artifacts
        // 4. Directly target and update ONLY that sub-item field index via MongoDB set
        const fieldKey = `dailyGoals.${goalIndex}.isCompleted`;
        const updatedProfile = await AIMentorProfile.findOneAndUpdate(
            { _id: profile._id },
            { $set: { [fieldKey]: newStatus } },
            { new: true, validateBeforeSave: false }
        );
 
        res.json({ success: true, profile: updatedProfile });
    } catch (error) {
        console.error("Toggle Goal backend exception:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Chat with AI Mentor
export const mentorChat = async (req, res) => {
    const { message, chatHistory } = req.body;

    try {
        const profile = await AIMentorProfile.findOne({ user: req.user._id });
        const user = await User.findById(req.user._id);

        const mode = profile?.personalityMode || 'friendly';
        const toneMap = {
            friendly: "You are a supportive, friendly mentor who gives encouraging feedback and helps patiently.",
            strict: "You are a strict, rigorous mentor. You call out laziness, push for high standards, and prioritize discipline.",
            corporate: "You are a corporate professional mentor. Your tone is formal, objective, and focused on workplace readiness and industry standards.",
            motivational: "You are a high-energy motivational coach. Focus on mindset, persistence, and overcoming limiting beliefs."
        };

        const systemPrompt = `${toneMap[mode]}
You are a continuous interactive AI Mentor in the CareerCraft ecosystem.
Capabilities: Answer preparation doubts, suggest what to study next, give nudges, coding/interview guidance, career roadmapping.
You recall the user's progress, weak topics, and behavior.
User Context:
- Target Role: ${user?.targetRole || 'Unknown'}
- Weak Areas: ${profile?.memory?.weakTopics?.join(', ') || 'Pending assessment'}
- Current Streak: ${user?.streak || 0}
Analyze message for frustration, stress or boredom. Adopt response emotionally based on detected tone.
Keep answers medium length, use markdown for bullet points and code blocks if needed. Make interaction feel personalized.
If user completes a goal or achieves progress, celebrate accountability style.`;

        const contextMessages = [
            { role: "system", content: systemPrompt },
            ...(chatHistory || []).slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: message }
        ];

        const completion = await groqChat({
            messages: contextMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        const aiMessage = completion.choices[0]?.message?.content;

        // Save to profile history for persistent memory (optional, keeping recent limit)
        await AIMentorProfile.updateOne(
            { user: req.user._id },
            { 
                $push: { 
                    chatHistory: { 
                        $each: [
                            { role: "user", content: message },
                            { role: "assistant", content: aiMessage }
                        ],
                        $slice: -20
                    } 
                }
            }
        );

        res.json({ success: true, response: aiMessage });

    } catch (error) {
        console.error("Mentor Chat Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Generate Behavioral Psychology Engine Analysis
export const analyzeBehavior = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const activities = user.recentActivities || [];

        const systemPrompt = `You are a Behavioral Psychology Engine for learning.
Analyze the activity logs provided. Identify:
1. Study consistency.
2. Procrastination patterns (if sparse gaps exist).
3. Peak productive windows (hypothetical if data is limited based on typical timestamps).
Provide short interventions (Burnout prevention, habit reinforcement).
Return valid JSON object with keys: peakProductiveHours (array of strings), procrastinationPatterns (array of strings), consistencyScore (0-100), interventionTip (string).`;

        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Recent User Activities: ${JSON.stringify(activities)}` }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0]?.message?.content);

        const updatedProfile = await AIMentorProfile.findOneAndUpdate(
            { user: req.user._id },
            { 
                $set: { 
                    "behavioralMetrics.peakProductiveHours": analysis.peakProductiveHours || [],
                    "behavioralMetrics.procrastinationPatterns": analysis.procrastinationPatterns || [],
                    "behavioralMetrics.consistencyScore": analysis.consistencyScore || 0,
                    "behavioralMetrics.lastAnalysisDate": new Date()
                } 
            },
            { new: true }
        );

        res.json({ success: true, metrics: updatedProfile.behavioralMetrics, interventionTip: analysis.interventionTip });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Skills Gap Roadmap
export const generateRoadmap = async (req, res) => {
    const { goal } = req.body; // e.g. "30-Day Placement Plan", "FAANG Preparation"
    try {
        const user = await User.findById(req.user._id);
        
        const systemPrompt = `You are an Adaptive Learning Architect. 
Generate a personalized roadmap for: ${goal || 'General Preparation'}.
Include 4 to 6 clear milestones. Each milestone needs iterative steps.
Format purely in JSON matching structure: { "roadmap": [{"title": "Milestone Title", "steps": ["Step 1", "Step 2"]}] }`;

        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `User Skills: ${user?.skills?.join(', ')}. Target: ${goal}` }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        let milestones = [];
        try {
             const parsed = JSON.parse(completion.choices[0]?.message?.content);
             milestones = parsed.roadmap || parsed.milestones || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);
        } catch(e) { milestones = []; }

        if (!Array.isArray(milestones)) milestones = [];

        const formattedRoadmap = milestones.map((m, i) => ({
            id: `rm-${i}-${Date.now()}`,
            title: m.title || `Milestone ${i+1}`,
            status: 'pending',
            steps: (m.steps || []).map(s => ({ title: s, isDone: false }))
        }));

        await AIMentorProfile.findOneAndUpdate(
            { user: req.user._id },
            { $set: { learningRoadmap: formattedRoadmap } }
        );

        res.json({ success: true, roadmap: formattedRoadmap });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Reflection Generation
export const generateReflection = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const profile = await AIMentorProfile.findOne({ user: req.user._id });
        
        const systemPrompt = `Generate a concise Weekly AI Review Report for the student.
Compare their goals completed against their activity.
Predict their current placement readiness percentage (0-100%).
List 2 Strengths improved and 2 Areas still weak.
Provide written report narrative (max 2-3 sentences).
Return JSON: { weeklyReport: "string", strengthsImproved: [], areasStillWeak: [], predictedReadiness: 0-100 }`;

        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `User Stats: ${JSON.stringify(user?.stats || {})}. Goals Completed: ${profile?.dailyGoals?.filter(g=>g.isCompleted).length || 0}` }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(completion.choices[0]?.message?.content);

        const updated = await AIMentorProfile.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    progressReflection: {
                        weeklyReport: data.weeklyReport,
                        strengthsImproved: data.strengthsImproved,
                        areasStillWeak: data.areasStillWeak,
                        predictedReadiness: data.predictedReadiness,
                        lastUpdated: new Date()
                    }
                }
            },
            { new: true }
        );

        res.json({ success: true, reflection: updated.progressReflection });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
