import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const COMMON_TECH_KEYWORDS = [
    "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java",
    "C++", "AWS", "Docker", "Kubernetes", "SQL", "NoSQL", "MongoDB",
    "Git", "CI/CD", "Agile", "REST API", "GraphQL", "Redux", "HTML",
    "CSS", "Tailwind", "Next.js", "Vue", "Angular"
];

const ESSENTIAL_SECTIONS = [
    "Experience", "Work History", "Education", "Skills", "Projects", "Contact", "Summary", "Objective"
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/;

export const parseResume = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parse Error:", error);
        throw new Error("Failed to parse PDF");
    }
};

export const analyzeResumeText = (text) => {
    const lowerText = text.toLowerCase();

    // 1. Keyword Analysis
    const keywordsFound = COMMON_TECH_KEYWORDS.filter(k =>
        lowerText.includes(k.toLowerCase())
    );

    const keywordsMissing = COMMON_TECH_KEYWORDS.filter(k =>
        !lowerText.includes(k.toLowerCase())
    ).slice(0, 10);

    // 2. Formatting & Structure
    const formattingIssues = [];
    const strengths = [];
    const improvements = [];
    let score = 50;

    // Contact Info
    if (EMAIL_REGEX.test(text)) {
        score += 10;
        strengths.push("Contact email detected");
    } else {
        formattingIssues.push("Missing email address");
        improvements.push("Add a clear email address");
    }

    if (PHONE_REGEX.test(text)) score += 5;
    else formattingIssues.push("Missing phone number");

    if (LINKEDIN_REGEX.test(text)) {
        score += 5;
        strengths.push("LinkedIn profile linked");
    } else {
        improvements.push("Add LinkedIn profile URL");
    }

    // Sections
    let sectionsFound = 0;
    ESSENTIAL_SECTIONS.forEach(section => {
        if (lowerText.includes(section.toLowerCase())) sectionsFound++;
    });

    if (sectionsFound >= 3) {
        score += 10;
        strengths.push("Good structure detected");
    } else {
        formattingIssues.push("Essential sections missing");
        improvements.push("Use standard headings (Experience, Education)");
    }

    // Keyword Score
    const keywordRatio = keywordsFound.length / 5;
    score += Math.min(keywordRatio * 20, 20);

    if (keywordsFound.length >= 5) strengths.push(`Found ${keywordsFound.length} technical keywords`);
    else improvements.push("Add more technical keywords");

    // Length
    if (text.length > 200 && text.length < 5000) score += 5;
    else if (text.length < 200) formattingIssues.push("Resume too short");

    // Cap Score
    score = Math.min(Math.round(score), 100);

    return {
        score,
        analysis: {
            keywordsFound,
            keywordsMissing,
            formattingIssues,
            strengths,
            improvements
        }
    };
};
