import { Question, InterviewState, InterviewConfig, InterviewerId } from './types';

const INITIAL_STATE: InterviewState = {
    currentQuestion: null,
    history: [],
    contextKeywords: [],
    currentInterviewer: 'hr_manager',
    isOver: false,
};

export class InterviewEngine {
    private state: InterviewState;
    private config: InterviewConfig;

    constructor(config: InterviewConfig) {
        this.config = config;
        this.state = { ...INITIAL_STATE };
    }

    public startSession(): Question | null {
        this.state = { ...INITIAL_STATE, isOver: false, history: [] };

        // Determine starting interviewer based on mode
        if (this.config.interviewType === 'technical') {
            // Technical Only: David solo
            this.state.currentInterviewer = 'tech_lead';

            const domainContext = this.config.jobRole || this.config.domain || 'software engineering';

            const davidSoloGreetings = [
                `Hey, good morning! I'm David, the Technical Lead here. I'll be conducting your technical interview today for the ${domainContext} role. Let's jump right in — could you start by telling me about your technical background?`,
                `Hi there! I'm David, and I'll be handling your technical interview today. We'll be focusing on ${domainContext}. Let's get started — what technologies have you been working with recently?`,
                `Hello! Welcome. I'm David, your technical interviewer today. I'll be assessing your skills in ${domainContext}. To begin, can you walk me through your most recent technical project?`,
                `Good morning! I'm David. I'll be evaluating your technical expertise in ${domainContext} today. Let's dive in — tell me about your experience and the technologies you're most comfortable with.`,
                `Hey! I'm David, the Tech Lead. Great to have you here for this ${domainContext} interview. Let's get started — can you give me a quick overview of your technical skills?`
            ];

            const randomGreeting = davidSoloGreetings[Math.floor(Math.random() * davidSoloGreetings.length)];

            const greetingQuestion: Question = {
                id: `dynamic_greeting_${Date.now()}`,
                text: randomGreeting,
                type: 'technical',
                difficulty: 'beginner',
                topic: 'greeting',
                keywords: ['ready', 'yes', 'hello', 'hi'],
                expectedKeywords: ['yes', 'okay', 'sure', 'ready'],
                followUpIds: []
            };

            this.state.currentQuestion = greetingQuestion;
            return greetingQuestion;
        }

        // HR+Tech mode: randomize who starts
        if (this.config.interviewType === 'hr-tech') {
            const startsWithHr = Math.random() > 0.5;
            this.state.currentInterviewer = startsWithHr ? 'hr_manager' : 'tech_lead';

            const sarahGreetings = [
                "Hi there! Good morning. I'm Sarah, and I'll be handling the HR side of this interview today. My colleague David will join in for the technical portion. Let's start — could you tell me a bit about yourself?",
                "Hello! Welcome, it's great to have you here. I'm Sarah, one of the interviewers today. David, our Technical Lead, will also be chatting with you shortly. So, let's begin — what brings you here today?",
                "Hey, good to meet you! I'm Sarah from HR. David will be joining us for the technical round. Before we dive in, I'd love to hear a quick introduction about yourself.",
                "Good morning! Thanks for coming in. I'm Sarah, your HR interviewer for today. David will cover the technical side later on. To kick things off, could you give us a brief overview of your background?",
                "Hi! I'm Sarah. Welcome to your interview. I'll be asking you some behavioral and background questions, and my colleague David will cover the technical aspects. Ready to get started? Tell me about yourself."
            ];

            const davidGreetings = [
                "Hey, good morning! I'm David, the Technical Lead here. I'll be starting off with some technical questions today, and my colleague Sarah from HR will also be chatting with you. So, let's jump right in — could you start by telling me about your technical background?",
                "Hi there! I'm David, and I'll be handling the technical portion of this interview. Sarah will cover the HR side as well. Let's get started — what technologies have you been working with recently?",
                "Hello! Welcome. I'm David, your technical interviewer today. Sarah from HR will join in shortly for behavioral questions. To begin, can you walk me through your most recent project?",
                "Good morning! I'm David. I'll be assessing the technical side today, along with Sarah who handles the behavioral aspects. Let's dive in — tell me about your experience in your domain.",
                "Hey! I'm David, the Tech Lead. Great to have you here. Sarah and I will be interviewing you today. I'll kick things off — can you give me a quick overview of your technical skills?"
            ];

            const greetings = startsWithHr ? sarahGreetings : davidGreetings;
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

            const greetingQuestion: Question = {
                id: `dynamic_greeting_${Date.now()}`,
                text: randomGreeting,
                type: startsWithHr ? 'hr' : 'technical',
                difficulty: 'beginner',
                topic: 'greeting',
                keywords: ['ready', 'yes', 'hello', 'hi'],
                expectedKeywords: ['yes', 'okay', 'sure', 'ready'],
                followUpIds: []
            };

            this.state.currentQuestion = greetingQuestion;
            return greetingQuestion;
        }

        // Introduction Prep Mode
        if (this.config.interviewType === 'intro-prep') {
            const introGreeting: Question = {
                id: 'intro_greeting',
                text: "Hello! I'm Sarah, your personal interview coach. I'm here to help you perfect your self-introduction. Let's start—please introduce yourself as you would in a real interview.",
                type: 'hr',
                difficulty: 'beginner',
                topic: 'introduction',
                keywords: [],
                expectedKeywords: []
            };
            this.state.currentInterviewer = 'hr_manager';
            this.state.currentQuestion = introGreeting;
            return introGreeting;
        }

        // HR Only mode: Sarah solo greeting
        this.state.currentInterviewer = 'hr_manager';

        const sarahSoloGreetings = [
            "Hi there! Good morning. I'm Sarah, and I'll be your interviewer today. Let's start — could you tell me a bit about yourself?",
            "Hello! Welcome, it's great to have you here. I'm Sarah, your HR interviewer for today. So, let's begin — what brings you here today?",
            "Hey, good to meet you! I'm Sarah. Before we dive in, I'd love to hear a quick introduction about yourself.",
            "Good morning! Thanks for coming in. I'm Sarah. To kick things off, could you give me a brief overview of your background?",
            "Hi! I'm Sarah. Welcome to your interview. Ready to get started? Tell me about yourself."
        ];

        const randomGreeting = sarahSoloGreetings[Math.floor(Math.random() * sarahSoloGreetings.length)];

        const greetingQuestion: Question = {
            id: `dynamic_greeting_${Date.now()}`,
            text: randomGreeting,
            type: 'hr',
            difficulty: 'beginner',
            topic: 'greeting',
            keywords: ['ready', 'yes', 'hello', 'hi'],
            expectedKeywords: ['yes', 'okay', 'sure', 'ready'],
            followUpIds: []
        };

        this.state.currentQuestion = greetingQuestion;
        return greetingQuestion;
    }

    public submitAnswer(answer: string, duration: number, metrics?: { wpm: number, fillerCount: number, pauseDuration: number }) {
        if (!this.state.currentQuestion) return;

        // Simple keyword score (for feedback display)
        const score = this.calculateScore(answer, this.state.currentQuestion.expectedKeywords);

        // Save to history
        this.state.history.push({
            question: this.state.currentQuestion,
            answer,
            score,
            duration,
            metrics
        });

        // NO forced alternation — the AI decides when to switch via [SWITCH] signal
        // In HR Only mode, stays as hr_manager
        // In Technical Only mode, stays as tech_lead
    }

    // Called externally when AI signals [SWITCH] to hand off to the other interviewer
    public switchInterviewer() {
        if (this.config.interviewType === 'hr-tech') {
            this.state.currentInterviewer = this.state.currentInterviewer === 'hr_manager' ? 'tech_lead' : 'hr_manager';
        }
    }

    private calculateScore(answer: string, expectedKeywords: string[]): number {
        if (!expectedKeywords || expectedKeywords.length === 0) return 75; // Default for dynamic questions
        const lowerAnswer = answer.toLowerCase();
        let hitCount = 0;
        expectedKeywords.forEach(k => {
            if (lowerAnswer.includes(k.toLowerCase())) hitCount++;
        });
        const ratio = hitCount / Math.max(expectedKeywords.length, 1);
        return Math.min(Math.round(ratio * 100), 100);
    }

    public setNextQuestionFromExternal(text: string, codeTask?: string): Question {
        const newQ: Question = {
            id: `dynamic_${Date.now()}`,
            text: text,
            type: (this.state.currentInterviewer === 'hr_manager' || !this.config.domain) ? 'hr' : 'technical',
            difficulty: 'intermediate',
            topic: 'dynamic',
            keywords: [],
            expectedKeywords: [],
            codeTask: codeTask
        };
        this.state.currentQuestion = newQ;
        return newQ;
    }

    public endInterview() {
        this.state.isOver = true;
    }

    public getState() {
        return this.state;
    }
}
