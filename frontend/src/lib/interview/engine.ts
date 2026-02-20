import { Question, InterviewState, InterviewConfig, InterviewerId } from './types';
import webQuestions from '../../data/questions/web-dev.json';
import hrQuestions from '../../data/questions/hr-behavioral.json';

// Type assertion for the imported JSONs
const allWebQuestions = webQuestions as Question[];
const allHrQuestions = hrQuestions as Question[];

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
    private questionsPool: Question[];
    private maxQuestions: number = 10;

    constructor(config: InterviewConfig) {
        this.config = config;
        this.state = { ...INITIAL_STATE };
        this.questionsPool = this.initializeQuestionsPool();

        // Ensure we have questions
        if (this.questionsPool.length === 0) {
            console.error("No questions found for configuration", config);
        }

        // Logic for question count
        // User requested "remove 15 questions limit" -> Make it long (e.g. 50)
        // The user can end it manually whenever they want.
        this.maxQuestions = 50;
    }

    private initializeQuestionsPool(): Question[] {
        let pool: Question[] = [];

        console.log("Initializing Pool. Config:", this.config);

        // Load domain specific questions
        if (this.config.domain === 'web') {
            pool = [...pool, ...allWebQuestions];
        }
        // Add more domains here as we create more JSONs

        // Load HR questions if enabled
        if (this.config.includeHr) {
            console.log("Loading HR questions. Count:", allHrQuestions.length);
            pool = [...pool, ...allHrQuestions];
        }

        console.log("Total Questions in Pool:", pool.length);
        return pool;
    }

    public startSession(): Question | null {
        // Reset Logic if reusing instance (though usually new instance per session)
        this.state = { ...INITIAL_STATE, isOver: false, history: [] };

        // For HR+Tech mode: randomize who starts and use varied greetings
        if (this.config.interviewType === 'hr-tech') {
            // Randomly pick who starts: Sarah (HR) or David (Tech)
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

        // HR Only mode: use static greeting from JSON (unchanged)
        if (this.config.includeHr) {
            const greeting = this.questionsPool.find(q => q.id === 'hr_greeting');
            if (greeting) {
                this.state.currentQuestion = greeting;
                return greeting;
            }
        }

        // Fallback for other modes
        const firstQuestion = this.selectNextQuestion();
        this.state.currentQuestion = firstQuestion;
        return firstQuestion;
    }

    public submitAnswer(answer: string, duration: number, metrics?: { wpm: number, fillerCount: number, pauseDuration: number }) {
        if (!this.state.currentQuestion) return;

        // 1. Analyze Answer (Simple Keyword Matching)
        const score = this.calculateScore(answer, this.state.currentQuestion.expectedKeywords);

        // 2. Extract context keywords for future reference
        const newKeywords = this.extractKeywords(answer);
        this.state.contextKeywords = [...new Set([...this.state.contextKeywords, ...newKeywords])];

        // 3. Save to history
        this.state.history.push({
            question: this.state.currentQuestion,
            answer,
            score,
            duration,
            metrics
        });

        // 4. Switch Interviewer (only in HR+Tech mode)
        if (this.config.interviewType === 'hr-tech') {
            this.state.currentInterviewer = this.state.currentInterviewer === 'hr_manager' ? 'tech_lead' : 'hr_manager';
        }
        // In HR Only mode, currentInterviewer stays as 'hr_manager'
    }

    public getNextQuestion(): Question | null {
        // Check if we reached the limit
        const count = this.state.history.length;

        // If last question was 'hr_closing', we END immediately.
        const lastQ = this.state.history[count - 1]?.question;
        if (lastQ?.id === 'hr_closing') {
            this.state.isOver = true;
            return null;
        }

        // PRE-CLOSING CHECK:
        // If we reached maxQuestions - 1, we MUST force the closing question next.
        if (count >= this.maxQuestions - 1) {
            const closing = this.questionsPool.find(q => q.id === 'hr_closing');
            if (closing) {
                this.state.currentQuestion = closing;
                return closing;
            }
        }

        // Hard stop if we somehow exceeded or closing missing
        if (count >= this.maxQuestions) {
            this.state.isOver = true;
            return null;
        }

        const nextQ = this.selectNextQuestion();

        // If no more questions found, end it
        if (!nextQ) {
            this.state.isOver = true;
            return null;
        }

        this.state.currentQuestion = nextQ;
        return nextQ;
    }

    private selectNextQuestion(): Question | null {
        // Filter out already asked questions
        const historyIds = new Set(this.state.history.map(h => h.question.id));
        const available = this.questionsPool.filter(q => !historyIds.has(q.id));

        if (available.length === 0) return null;

        const lastEntry = this.state.history[this.state.history.length - 1];

        // 0. MANDATORY FLOW: Greeting -> Intro
        if (lastEntry?.question.id === 'hr_greeting') {
            const intro = available.find(q => q.id === 'hr_intro');
            if (intro) return intro;
        }

        // 1. Strong Priority: Direct Follow-ups from the LAST question
        if (lastEntry && lastEntry.question.followUpIds && lastEntry.question.followUpIds.length > 0) {
            // Find valid follow-ups that haven't been asked
            const directFollowUps = available.filter(q => lastEntry.question.followUpIds?.includes(q.id));
            if (directFollowUps.length > 0) {
                // If possible, pick one that matches context, otherwise first one
                return directFollowUps[0];
            }
        }

        // 2. Check for Contextual Match (Keywords)
        const contextualMatches = available.filter(q =>
            q.keywords.some(k => this.state.contextKeywords.includes(k.toLowerCase()))
        );

        if (contextualMatches.length > 0) {
            return contextualMatches.sort((a, b) => {
                const aCount = a.keywords.filter(k => this.state.contextKeywords.includes(k)).length;
                const bCount = b.keywords.filter(k => this.state.contextKeywords.includes(k)).length;
                return bCount - aCount;
            })[0];
        }

        // 3. Fallback: Role alternation preference
        // In HR only mode, everything is HR, so this filter is moot but harmless.
        const preferredType = (this.state.currentInterviewer === 'hr_manager' || !this.config.domain) ? 'hr' : 'technical';
        const typeMatches = available.filter(q => q.type === preferredType);

        if (typeMatches.length > 0) {
            return typeMatches[Math.floor(Math.random() * typeMatches.length)];
        }

        // 4. Ultimate Fallback: Random available
        return available[Math.floor(Math.random() * available.length)];
    }

    private calculateScore(answer: string, expectedKeywords: string[]): number {
        const lowerAnswer = answer.toLowerCase();
        let hitCount = 0;
        expectedKeywords.forEach(k => {
            if (lowerAnswer.includes(k.toLowerCase())) hitCount++;
        });
        // Simple linear scoring
        const ratio = hitCount / Math.max(expectedKeywords.length, 1);
        return Math.min(Math.round(ratio * 100), 100);
    }

    private extractKeywords(answer: string): string[] {
        // A very naive extraction. In a real app, use NLP.
        // Here we just look for words that match any known keywords in our entire pool to "activate" them.
        const knownKeywords = new Set(this.questionsPool.flatMap(q => q.keywords));
        const words = answer.toLowerCase().split(/\s+/);
        return words.filter(w => knownKeywords.has(w));
    }

    public setNextQuestionFromExternal(text: string): Question {
        const newQ: Question = {
            id: `dynamic_${Date.now()}`,
            text: text,
            type: (this.state.currentInterviewer === 'hr_manager' || !this.config.domain) ? 'hr' : 'technical',
            difficulty: 'intermediate',
            topic: 'dynamic',
            keywords: [],
            expectedKeywords: [] // AI scoring pending
        };
        this.state.currentQuestion = newQ;
        return newQ;
    }

    public getState() {
        return this.state;
    }
}
