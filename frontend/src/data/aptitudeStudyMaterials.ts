
export interface StudySection {
    id: string;
    title: string;
    introduction: string;
    formulas: { label: string; equation: string; description?: string }[];
    tips: string[];
    examples: { question: string; solution: string; explanation: string }[];
}

export const studyMaterials: Record<string, StudySection> = {
    "quantitative_aptitude": {
        id: "quantitative_aptitude",
        title: "Quantitative Aptitude",
        introduction: "Quantitative aptitude tests your ability to use numbers and mathematical concepts to solve problems. This section covers general arithmetic, algebra, and geometry concepts.",
        formulas: [
            { label: "BODMAS Rule", equation: "Bracket -> Orders -> Division -> Multiplication -> Addition -> Subtraction", description: "Order of operations for simplifying expressions." },
            { label: "Divisibility by 3", equation: "Sum of digits is divisible by 3", description: "Check if a number is divisible by 3." },
            { label: "LCM & HCF", equation: "Product of two numbers = LCM x HCF", description: "Relationship between Least Common Multiple and Highest Common Factor." }
        ],
        tips: [
            "Always simplify fractions before calculating.",
            "Use approximation for complex calculations in multiple-choice questions.",
            "Memorize squares up to 30 and cubes up to 15."
        ],
        examples: [
            {
                question: "What is the HCF of 12 and 18?",
                solution: "6",
                explanation: "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Common factors: 1, 2, 3, 6. Highest is 6."
            }
        ]
    },
    "time_speed_distance": {
        id: "time_speed_distance",
        title: "Time, Speed & Distance",
        introduction: "This topic deals with the relationship between time taken, distance covered, and speed of moving objects.",
        formulas: [
            { label: "Basic Formula", equation: "Distance = Speed × Time", description: "The fundamental relationship." },
            { label: "Average Speed", equation: "2xy / (x + y)", description: "When traveling same distance at speed x and return at speed y." },
            { label: "Relative Speed (Opposite)", equation: "S1 + S2", description: "When two objects move towards each other." },
            { label: "Relative Speed (Same)", equation: "S1 - S2", description: "When two objects move in the same direction." },
            { label: "Km/h to m/s", equation: "x km/h = x × (5/18) m/s", description: "Conversion factor." }
        ],
        tips: [
            "Ensure all units (km/hr, m/s, min, sec) are consistent before calculating.",
            "For train problems, length of train is added to length of platform/bridge for total distance.",
            "A pole or man has negligible length."
        ],
        examples: [
            {
                question: "A train running at 72 km/hr crosses a pole in 9 seconds. What is the length of the train?",
                solution: "180 meters",
                explanation: "Speed = 72 km/hr = 72 * (5/18) = 20 m/s. Distance = Speed * Time = 20 * 9 = 180 meters."
            }
        ]
    },
    "profit_loss_discount": {
        id: "profit_loss_discount",
        title: "Profit, Loss & Discount",
        introduction: "These problems involve financial transactions, dealing with Cost Price (CP), Selling Price (SP), and Market Price (MP).",
        formulas: [
            { label: "Profit", equation: "SP - CP", description: "When SP > CP" },
            { label: "Loss", equation: "CP - SP", description: "When CP > SP" },
            { label: "Profit %", equation: "(Profit / CP) × 100", description: "Profit percentage is always calculated on CP." },
            { label: "Loss %", equation: "(Loss / CP) × 100", description: "Loss percentage is always calculated on CP." },
            { label: "Discount", equation: "MP - SP", description: "Discount is calculated on Market Price." }
        ],
        tips: [
            "If CP is not given, assume CP = 100 for percentage problems.",
            "Markup is the difference between MP and CP.",
            "Successive discounts of a% and b% = (a + b - ab/100)% effective discount."
        ],
        examples: [
            {
                question: "A man buys a toy for Rs. 25 and sells it for Rs. 30. Find his gain percent.",
                solution: "20%",
                explanation: "Gain = 30 - 25 = 5. Gain % = (5/25) * 100 = 20%."
            }
        ]
    },
    "simple_compound_interest": {
        id: "simple_compound_interest",
        title: "Simple & Compound Interest",
        introduction: "Understand how money grows over time with interest rates.",
        formulas: [
            { label: "Simple Interest (SI)", equation: "(P × R × T) / 100", description: "P=Principal, R=Rate%, T=Time in years." },
            { label: "Total Amount (SI)", equation: "P + SI", description: "Final amount after interest." },
            { label: "Compound Amount (CI)", equation: "P(1 + R/100)^n", description: "Amount after n years compounted annually." },
            { label: "CI Formula", equation: "Amount - Principal", description: "Total compound interest." }
        ],
        tips: [
            "For half-yearly compounding, rate becomes R/2 and time becomes 2T.",
            "For quarterly compounding, rate becomes R/4 and time becomes 4T.",
            "Difference between CI and SI for 2 years = P(R/100)^2."
        ],
        examples: [
            {
                question: "Find the simple interest on Rs. 1000 at 10% per annum for 5 years.",
                solution: "Rs. 500",
                explanation: "SI = (1000 * 10 * 5) / 100 = 500."
            }
        ]
    },
    "logical_reasoning": {
        id: "logical_reasoning",
        title: "Logical Reasoning",
        introduction: "Logical reasoning tests your ability to analyze relationships, patterns, and sequences.",
        formulas: [
            { label: "Number Series", equation: "Look for difference (d), ratio (r), or squares/cubes (n²)", description: "Identify the pattern of growth." },
            { label: "Coding (Forward)", equation: "A=1, B=2, ..., Z=26", description: "Forward alphabetical position." },
            { label: "Coding (Reverse)", equation: "A=26, B=25, ..., Z=1", description: "Reverse alphabetical position." }
        ],
        tips: [
            "Write down the alphabet A-Z with numbers 1-26 for coding questions.",
            "For series, first check the difference between consecutive terms.",
            "Check for prime numbers, squares, and cubes patterns."
        ],
        examples: [
            {
                question: "Find the next number: 2, 4, 8, 16, ...",
                solution: "32",
                explanation: "Each number is multiplied by 2. 16 * 2 = 32."
            }
        ]
    },
    "blood_relations": {
        id: "blood_relations",
        title: "Blood Relations",
        introduction: "Tests understanding of family relationships and hierarchy.",
        formulas: [
            { label: "Generations", equation: "Grandparents -> Parents -> Self/Siblings -> Children", description: "Visualize the family tree." },
            { label: "Spouse", equation: "Husband <=> Wife", description: "Double arrow represents marriage." },
            { label: "Sibling", equation: "Brother - Sister", description: "Single line represents siblings." }
        ],
        tips: [
            "Break down complex sentences into smaller parts.",
            "Assume yourself as the primary character to solve effectively.",
            "Male is usually represented by (+) or Square, Female by (-) or Circle."
        ],
        examples: [
            {
                question: "A is the brother of B. B is the sister of C. How is A related to C?",
                solution: "Brother",
                explanation: "A is male (brother). A, B, and C are siblings. So A is the brother of C."
            }
        ]
    }
};

// Fallback for topics not explicitly defined in studyMaterials
const getFallbackMaterial = (id: string, name: string): StudySection => ({
    id: id,
    title: name,
    introduction: `Master the key concepts and techniques for ${name} to ace your aptitude tests.`,
    formulas: [
        { label: "Key Concept", equation: "Fundamental Principles", description: `Understand the core logic behind ${name}.` },
        { label: "Approach", equation: "Step-by-Step Analysis", description: "Break down the problem into smaller components." }
    ],
    tips: [
        "Read the question twice to understand exactly what is asked.",
        "Eliminate obviously wrong options first.",
        "Practice regularly to improve speed and accuracy in this topic."
    ],
    examples: [] // Will rely on dynamic questions if empty
});

export const getStudyMaterial = (topicId: string, topicName: string): StudySection => {
    return studyMaterials[topicId] || getFallbackMaterial(topicId, topicName);
};
