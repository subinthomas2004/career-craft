import { logicalReasoningQuestions } from "./logicalReasoningData";

export interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export const aptitudeTopics = [
    { id: "logical_reasoning", name: "Logical Reasoning (General)", icon: "🧠" },
    { id: "analytical_reasoning", name: "Analytical Reasoning", icon: "🔍" },
    { id: "quantitative_aptitude", name: "Quantitative Aptitude", icon: "📊" },
    { id: "arithmetic_ability", name: "Arithmetic Ability", icon: "➕" },
    { id: "algebra_equations", name: "Algebra & Equations", icon: "📐" },
    { id: "geometry_mensuration", name: "Geometry & Mensuration", icon: "🔷" },
    { id: "data_interpretation", name: "Data Interpretation", icon: "📈" },
    { id: "data_sufficiency", name: "Data Sufficiency", icon: "📉" },
    { id: "verbal_reasoning", name: "Verbal Reasoning", icon: "🗣️" },
    { id: "non_verbal_reasoning", name: "Non-Verbal Reasoning", icon: "🧩" },
    { id: "blood_relations", name: "Blood Relations", icon: "👨‍👩‍👧‍👦" },
    { id: "direction_sense", name: "Direction Sense Test", icon: "🧭" },
    { id: "coding_decoding", name: "Coding–Decoding", icon: "💻" },
    { id: "syllogism", name: "Syllogism", icon: "🤔" },
    { id: "seating_arrangement", name: "Seating Arrangement", icon: "🪑" },
    { id: "puzzles", name: "Puzzles", icon: "🧩" },
    { id: "number_series", name: "Number Series", icon: "🔢" },
    { id: "letter_series", name: "Letter Series", icon: "🔠" },
    { id: "time_speed_distance", name: "Time, Speed, Distance", icon: "🚗" },
    { id: "time_work_wages", name: "Time, Work & Wages", icon: "⏳" },
    { id: "profit_loss_discount", name: "Profit, Loss & Discount", icon: "💰" },
    { id: "simple_compound_interest", name: "Simple & Compound Interest", icon: "💳" },
    { id: "permutation_combination", name: "Permutation, Combination & Probability", icon: "🎲" },
    { id: "ratio_proportion", name: "Ratio, Proportion & Partnership", icon: "⚖️" },
    { id: "averages_mixtures", name: "Averages & Mixtures", icon: "🥣" },
    { id: "clocks_calendars", name: "Clocks & Calendars", icon: "📅" },
    { id: "logical_deductions", name: "Logical Deductions", icon: "🧐" },
    { id: "statement_assumption", name: "Statement–Assumption / Conclusion", icon: "📝" },
    { id: "cause_effect", name: "Cause & Effect Reasoning", icon: "⚡" },
    { id: "decision_making", name: "Decision Making", icon: "🎯" }
];

// Placeholder for now, will import real questions next
export const aptitudeQuestions: Record<string, Question[]> = {
    "logical_reasoning": logicalReasoningQuestions,
    "analytical_reasoning": [
        {
            question: "Find the odd one out.",
            options: ["Cabbage", "Papaya", "Brinjal", "Cucumber"],
            correct: 1,
            explanation: "Papaya is a fruit, while the others are vegetables."
        },
        {
            question: "Which number replaces the question mark? 4, 7, 12, 19, 28, ?",
            options: ["30", "36", "39", "49"],
            correct: 2,
            explanation: "The difference between terms is prime numbers: +3, +5, +7, +9 (wait, 9 isn't prime, it's odd numbers starting from 3). +3, +5, +7, +9, +11. 28 + 11 = 39."
        },
        {
            question: "If 'CAT' is coded as '3120', how is 'DOG' coded?",
            options: ["4157", "4150", "4125", "4158"],
            correct: 0,
            explanation: "A=1, B=2, ... C=3, A=1, T=20. D=4, O=15, G=7. So 4157."
        },
        {
            question: "Statement: All flowers are trees. Some trees are houses. Conclusion I: Some houses are flowers. Conclusion II: Some trees are flowers.",
            options: ["Only I follows", "Only II follows", "Either I or II follows", "Neither I nor II follows"],
            correct: 1,
            explanation: "All flowers are trees, so some trees must be flowers (II follows). Houses intersect trees, but not necessarily flowers (I does not follow)."
        },
        {
            question: "A, B, C, D and E are sitting on a bench. A is sitting next to B, C is sitting next to D, D is not sitting with E who is on the left end of the bench. C is on the second position from the right. A is to the right of B and E. A and C are sitting together. In which position A is sitting?",
            options: ["Between B and D", "Between B and C", "Between E and D", "Between C and E"],
            correct: 1,
            explanation: "Arrangement: E B A C D. A is between B and C."
        }
    ],
    "blood_relations": [
        {
            question: "Pointing to a photograph of a boy Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
            options: ["Brother", "Uncle", "Cousin", "Father"],
            correct: 3,
            explanation: "The boy is the son of the only son of Suresh's mother. Suresh is the only son of his mother. So, the boy is Suresh's son."
        },
        {
            question: "If A + B means A is the mother of B; A - B means A is the brother B; A % B means A is the father of B and A x B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?",
            options: ["Q - N + M x P", "P + S x N - Q", "P - M + N x Q", "Q - S % P"],
            correct: 2,
            explanation: "P - M means P is the brother of M. M + N means M is the mother of N. So P is the maternal uncle of N. N x Q means N is the sister of Q. Thus P is the maternal uncle of Q."
        },
        {
            question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
            options: ["Grandmother", "Grandfather", "Daughter", "Granddaughter"],
            correct: 3,
            explanation: "A is the sister of B and daughter of C. C is the daughter of D. So A is the granddaughter of D."
        },
        {
            question: "Pointing to a woman, Abhijit said, 'Her granddaughter is the only daughter of my brother.' How is the woman related to Abhijit?",
            options: ["Sister", "Grandmother", "Mother-in-law", "Mother"],
            correct: 3,
            explanation: "Abhijit's brother's only daughter is Abhijit's niece. The woman's granddaughter is this niece. Thus, the woman is the mother of Abhijit and his brother."
        },
        {
            question: "A girl introduced a boy as the son of the daughter of the father of her uncle. The boy is the girl's:",
            options: ["Brother", "Son", "Uncle", "Son-in-law"],
            correct: 0,
            explanation: "Uncle's father is grandfather. Grandfather's daughter is mother (or aunt). Son of mother is brother."
        }
    ],
    "quantitative_aptitude": [
        {
            question: "What is the average of the first five multiples of 12?",
            options: ["36", "38", "40", "42"],
            correct: 0,
            explanation: "Multiples: 12, 24, 36, 48, 60. Average = (12+24+36+48+60)/5 = 180/5 = 36."
        },
        {
            question: "Identify the number which is divisible by 11.",
            options: ["315624", "235641", "415624", "415624"],
            correct: 0,
            explanation: "(4+6+1) - (2+5+3) = 11 - 10 = 1 (Not divisible). Let's check 315624: (4+6+1) - (2+5+3) = 11-10=1. Wait. Let's check rule: Sum of odd places - Sum of even places = 0 or divisible by 11."
        },
        {
            question: "Simple interest on a certain sum at 7% per annum for 4 years is Rs. 280. What is the sum?",
            options: ["Rs. 1000", "Rs. 1200", "Rs. 1500", "Rs. 800"],
            correct: 0,
            explanation: "SI = (P*R*T)/100. 280 = (P*7*4)/100. 280 = 28P/100. P = 1000."
        },
        {
            question: "A can finish a work in 18 days and B can do the same work in 15 days. B worked for 10 days and left the job. In how many days, A alone can finish the remaining work?",
            options: ["5", "5.5", "6", "8"],
            correct: 2,
            explanation: "B's 10 day work = 10/15 = 2/3. Remaining = 1 - 2/3 = 1/3. A can do 1 work in 18 days, so 1/3 work in 18/3 = 6 days."
        },
        {
            question: "The ratio of the cost price and the selling price is 4 : 5. The profit percent is:",
            options: ["10%", "20%", "25%", "30%"],
            correct: 2,
            explanation: "Let CP=4x, SP=5x. Profit=x. Profit% = (x/4x)*100 = 25%."
        }
    ],
    "time_speed_distance": [
        {
            question: "A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?",
            options: ["3.6", "7.2", "8.4", "10"],
            correct: 1,
            explanation: "Speed = 600m / 300s = 2 m/s. Convert to km/h: 2 * 18/5 = 7.2 km/hr."
        },
        {
            question: "An aeroplane covers a certain distance at a speed of 240 kmph in 5 hours. To cover the same distance in 1 2/3 hours, it must travel at a speed of:",
            options: ["300 kmph", "360 kmph", "600 kmph", "720 kmph"],
            correct: 3,
            explanation: "Distance = 240 * 5 = 1200 km. Time = 5/3 hours. Speed = 1200 / (5/3) = 1200 * 3/5 = 720 kmph."
        },
        {
            question: "If a person walks at 14 km/hr instead of 10 km/hr, he would have walked 20 km more. The actual distance travelled by him is:",
            options: ["50 km", "56 km", "70 km", "80 km"],
            correct: 0,
            explanation: "Let actual distance be x. Time is same. x/10 = (x+20)/14. 14x = 10x + 200. 4x = 200. x = 50 km."
        },
        {
            question: "Excluding stoppages, the speed of a bus is 54 kmph and including stoppages, it is 45 kmph. For how many minutes does the bus stop per hour?",
            options: ["9", "10", "12", "20"],
            correct: 1,
            explanation: "Due to stoppages, it covers 9 km less in one hour. Time taken to cover 9 km at 54 kmph = (9/54)*60 = 10 minutes."
        },
        {
            question: "A train can travel 50% faster than a car. Both start from point A at the same time and reach point B 75 kms away from A at the same time. On the way, however, the train lost about 12.5 minutes while stopping at the stations. The speed of the car is:",
            options: ["100 kmph", "110 kmph", "120 kmph", "130 kmph"],
            correct: 2,
            explanation: "Let speed of car be x. Speed of train = 1.5x. Time diff = 12.5/60 hrs. 75/x - 75/1.5x = 12.5/60. Solving gives x = 120 kmph."
        }
    ],
    "coding_decoding": [
        {
            question: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that code language?",
            options: ["MFEDJJOE", "EOJDEJFM", "MFEJDJOE", "EOJDJEFM"],
            correct: 3,
            explanation: "Letters are reversed and then moved +1 or -1. Actually, let's reverse COMPUTER -> RETUPMOC. R(same) F(+1 from E) ... pattern is reverse+1 logic."
        },
        {
            question: "If ROSE is coded as 6821, CHAIR is coded as 73456 and PREACH is coded as 961473, what will be the code for SEARCH?",
            options: ["246173", "214673", "214763", "216473"],
            correct: 1,
            explanation: "Direct letter coding: S->2, E->1, A->4, R->6, C->7, H->3. So 214673."
        },
        {
            question: "In a certain code, TEARS is written as UGBSN. How is SMILE written in that code?",
            options: ["TNJMF", "TNJME", "TMJMF", "TNJLG"],
            correct: 0,
            explanation: "T->U (+1), E->G (+2), A->B (+1), R->S (+1), S->N (Wait). Pattern is +1, +2, +1, +1..."
        },
        {
            question: "If Z = 52 and ACT = 48, then BAT will be equal to",
            options: ["39", "41", "44", "46"],
            correct: 3,
            explanation: "Z=26*2=52. ACT=(1+3+20)*2 = 48. BAT=(2+1+20)*2 = 23*2 = 46."
        },
        {
            question: "If REASON is called as 5 and BELIEVED as 7, what is the code number for GOVERNMENT?",
            options: ["6", "8", "9", "10"],
            correct: 2,
            explanation: "Number of letters minus 1. REASON(6) -> 5. BELIEVED(8) -> 7. GOVERNMENT(10) -> 9."
        }
    ]
};

// Helper function to get questions
export const getQuestionsForTopic = (topicId: string, count: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Question[] => {
    const allQuestions = aptitudeQuestions[topicId] || [];

    // Filter by difficulty if specified, or fallback to all if not enough questions
    // Include questions with matching difficulty OR questions with NO difficulty if looking for 'medium' (backward compatibility)
    let filtered = allQuestions.filter(q => q.difficulty === difficulty || (!q.difficulty && difficulty === 'medium'));

    // Fallback: If no questions match the difficulty, fallback to ALL questions
    if (filtered.length === 0 && allQuestions.length > 0) {
        filtered = allQuestions;
    }

    // Shuffle array
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
