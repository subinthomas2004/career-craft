export type QuestionType = 'hr' | 'technical';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type InterviewerId = 'hr_manager' | 'tech_lead';

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    difficulty: Difficulty;
    topic: string; // e.g., "react", "javascript", "behavioral"
    keywords: string[]; // Keywords that characterise this question
    expectedKeywords: string[]; // Keywords expected in the answer for scoring
    followUpIds?: string[]; // Direct follow-ups if this question is answered nicely
}

export interface InterviewState {
    currentQuestion: Question | null;
    history: Array<{
        question: Question;
        answer: string;
        score: number;
        duration: number; // in seconds
        metrics?: {
            wpm: number;
            fillerCount: number;
            pauseDuration: number; // seconds before answering
        };
    }>;
    contextKeywords: string[]; // Accumulator of detected keywords from user answers
    currentInterviewer: InterviewerId;
    isOver: boolean;
}

export interface InterviewConfig {
    domain: string; // e.g., "web", "android"
    includeHr: boolean;
    difficulty: Difficulty;
    resumeText?: string;
}
