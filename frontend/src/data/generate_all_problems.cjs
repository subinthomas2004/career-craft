const fs = require('fs');
const path = require('path');

const fileHeader = `export interface TestCase {
    input: string;
    expected: string;
}

export interface Example {
    input: string;
    output: string;
    explanation?: string;
}

export interface StarterCode {
    javascript: string;
    python: string;
    java?: string;
    cpp?: string;
    c?: string;
    csharp?: string;
    typescript?: string;
    sql?: string;
}

export const ALL_LANGUAGES = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "c", label: "C" },
    { id: "csharp", label: "C#" },
    { id: "typescript", label: "TypeScript" },
    { id: "sql", label: "SQL" },
] as const;

export type LanguageId = (typeof ALL_LANGUAGES)[number]["id"];

export function getStarterCode(problem: CodingProblem, language: LanguageId): string {
    const explicit = problem.starterCode[language as keyof StarterCode];
    if (explicit) return explicit;
    return "// Write your " + language + " solution here";
}

export interface CodingProblem {
    id: number;
    title: string;
    slug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    tags: string[];
    description: string;
    constraints: string[];
    examples: Example[];
    testCases: TestCase[];
    starterCode: StarterCode;
    hints: string[];
    acceptance: number;
    supportedLanguages?: LanguageId[];
}

export const codingProblems: CodingProblem[] = [\n`;

const fileFooter = `];

export function getCategories() {
    return Array.from(new Set(codingProblems.map(p => p.category)));
}

export function getProblemById(id: number) {
    return codingProblems.find(p => p.id === id);
}
`;

const languages = [
    { id: 'javascript', topics: ['Arrays', 'Strings', 'DOM Logic', 'Promises', 'Objects'] },
    { id: 'python', topics: ['Lists', 'Dictionaries', 'Math', 'Data Science', 'Strings'] },
    { id: 'java', topics: ['Arrays', 'Collections', 'OOP', 'Strings', 'Math'] },
    { id: 'cpp', topics: ['Arrays', 'STL', 'Pointers', 'Strings', 'Math'] },
    { id: 'c', topics: ['Arrays', 'Pointers', 'Memory', 'Strings', 'Math'] },
    { id: 'csharp', topics: ['Arrays', 'LINQ', 'Collections', 'Strings', 'Math'] },
    { id: 'typescript', topics: ['Arrays', 'Types', 'Interfaces', 'Strings', 'Objects'] },
    { id: 'sql', topics: ['Queries', 'Joins', 'Aggregation', 'Subqueries', 'Functions'] }
];

const verbs = ["Find", "Calculate", "Reverse", "Merge", "Split", "Count", "Sort", "Validate", "Extract", "Format", "Parse", "Check", "Remove", "Add", "Update"];
const adjectives = ["Unique", "Duplicate", "Maximum", "Minimum", "Valid", "Invalid", "Empty", "Sorted", "Unsorted", "Reversed", "Consecutive", "Adjacent", "Matching", "Missing", "First", "Last"];
const nouns = ["Elements", "Items", "Indices", "Values", "Records", "Nodes", "Characters", "Substring", "Subarray", "Keys", "Entries", "Pairs", "Tokens", "Words", "Digits"];

const counts = { Easy: 28, Medium: 34, Hard: 10 };

let currentId = 1;
let allProblems = [];

function generateProblem(lang, difficulty, index) {
    let topic = lang.topics[Math.floor(Math.random() * lang.topics.length)];
    let verb = verbs[Math.floor(Math.random() * verbs.length)];
    let adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];

    let title = verb + " " + adj + " " + noun + " in " + (lang.id.charAt(0).toUpperCase() + lang.id.slice(1)) + " #" + Math.floor(Math.random() * 1000);
    if (lang.id === 'sql') {
        title = verb + " " + adj + " " + noun + " (SQL)";
    }

    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let functionName = slug.replace(/-/g, '_');

    let starterCodeObj = {};
    if (lang.id === 'javascript') starterCodeObj.javascript = "/**\n * @return {any}\n */\nfunction " + functionName + "() {\n  // Your Javascript code here\n}";
    if (lang.id === 'python') starterCodeObj.python = "def " + functionName + "():\n    # Your Python code here\n    pass";
    if (lang.id === 'java') starterCodeObj.java = "class Solution {\n    public void " + functionName + "() {\n        // Your Java code here\n    }\n}";
    if (lang.id === 'cpp') starterCodeObj.cpp = "class Solution {\npublic:\n    void " + functionName + "() {\n        // Your C++ code here\n    }\n};";
    if (lang.id === 'c') starterCodeObj.c = "void " + functionName + "() {\n    // Your C code here\n}";
    if (lang.id === 'csharp') starterCodeObj.csharp = "public class Solution {\n    public void " + functionName + "() {\n        // Your C# code here\n    }\n}";
    if (lang.id === 'typescript') starterCodeObj.typescript = "function " + functionName + "(): any {\n    // Your TypeScript code here\n}";
    if (lang.id === 'sql') starterCodeObj.sql = "-- Write your MySQL query statement below\nSELECT * FROM table_name;";

    let description = "Implement the solution to " + title + ". This is a " + difficulty + " difficulty problem specifically designed for " + lang.id + " practice focusing on " + topic + ".";

    return {
        id: currentId++,
        title: title,
        slug: slug,
        difficulty: difficulty,
        category: topic,
        tags: [topic, lang.id],
        description: description,
        constraints: ["1 <= n <= 10^4", "Data types fit within standard bounds"],
        examples: [
            { input: "example_input", output: "example_output", explanation: "Basic example to demonstrate expected behavior." }
        ],
        testCases: [
            { input: "test_input_1", expected: "test_expected_1" },
            { input: "test_input_2", expected: "test_expected_2" }
        ],
        starterCode: starterCodeObj,
        hints: ["Think about how to optimize using " + topic + " in " + lang.id + ".", "Consider edge cases such as empty input."],
        acceptance: Math.floor(Math.random() * 60) + 20,
        supportedLanguages: [lang.id]
    };
}

for (let lang of languages) {
    for (const [diff, count] of Object.entries(counts)) {
        for (let i = 0; i < count; i++) {
            allProblems.push(generateProblem(lang, diff, i));
        }
    }
}

// Convert JSON nicely, but replace the double quotes in starterCode obj string literal escapes
let problemsString = allProblems.map(p => JSON.stringify(p, null, 4)).join(',\n');
let finalOutput = fileHeader + problemsString + '\n' + fileFooter;

fs.writeFileSync(path.join(__dirname, 'codingProblems.ts'), finalOutput, 'utf-8');
console.log('Successfully generated 576 unique coding problems across 8 languages!');
