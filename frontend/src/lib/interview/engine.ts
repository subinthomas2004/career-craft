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
        this.state = { ...INITIAL_STATE, isOver: false, history: [] }; // Explicit reset

        // For HR mode, ALWAYS start with the greeting
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

        // 4. Switch Interviewer 
        // In "HR Only" mode, all are HR Managers.
        // Sarah (hr_manager) -> David (tech_lead used as ID for 2nd avatar)
        this.state.currentInterviewer = this.state.currentInterviewer === 'hr_manager' ? 'tech_lead' : 'hr_manager';
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
