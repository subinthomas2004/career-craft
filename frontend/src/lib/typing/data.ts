export type TypingMode = 'general' | 'technical' | 'business' | 'interview' | 'code';
export type Difficulty = 'beginner' | 'intermediate' | 'professional';
export type Duration = 30 | 60 | 120;

export interface TypingText {
    id: string;
    text: string;
    source?: string;
}

export type DurationTexts = Record<Duration, TypingText[]>;
export type DifficultyTexts = Record<Difficulty, DurationTexts>;

import { generalData } from './data_general';
import { technicalData } from './data_technical';
import { businessData } from './data_business';
import { interviewData } from './data_interview';
import { codeData } from './data_code';

export const TYPING_DATA: Record<TypingMode, DifficultyTexts> = {
    general: generalData,
    technical: technicalData,
    business: businessData,
    interview: interviewData,
    code: codeData,
};

export const getRandomText = (mode: TypingMode, difficulty: Difficulty, duration: Duration = 60): string => {
    const options = TYPING_DATA[mode][difficulty][duration];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex].text;
};

// Fixed paragraph for ranked mode — all users type this same text (180s)
export const RANKED_PARAGRAPH = `The relentless pursuit of excellence in any professional discipline demands not merely technical proficiency but a comprehensive understanding of the interconnected systems that govern modern enterprises. Software engineering, for instance, requires architects to balance the competing priorities of performance, maintainability, security, and scalability while navigating the ever-shifting landscape of technological innovation. The most successful practitioners cultivate a deep appreciation for both the theoretical foundations of computer science and the practical realities of deploying production systems at scale. They understand that elegant algorithms mean nothing without robust error handling, comprehensive testing, and thoughtful observability instrumentation. Similarly, the business acumen to translate technical capabilities into strategic value is what differentiates exceptional engineers from merely competent ones. Communication skills, the ability to clearly articulate complex trade-offs to diverse stakeholders, remain among the most undervalued yet critical competencies in our industry. Those who master the art of bridging the gap between technical depth and business impact consistently find themselves at the forefront of innovation, leading teams that deliver transformative solutions to the most challenging problems of our time. The future belongs to those who can synthesize knowledge across domains, adapt to uncertainty, and maintain an unwavering commitment to continuous learning throughout their careers.`;

export const getRankedText = (): string => RANKED_PARAGRAPH;
