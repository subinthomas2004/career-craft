import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
// We need to point to the worker file. In a Vite/React app, this usually requires handling the worker source.
// For simplicity, we'll try a CDN link or relative path if copied.
// However, a common pattern in React is:
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface AnalysisResult {
    score: number;
    keywordsFound: string[];
    keywordsMissing: string[];
    formattingIssues: string[];
    strengths: string[];
    improvements: string[];
}

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

export const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + " ";
    }

    return fullText;
};

export const analyzeResume = (text: string): AnalysisResult => {
    const lowerText = text.toLowerCase();

    // 1. Keyword Analysis
    const keywordsFound = COMMON_TECH_KEYWORDS.filter(k =>
        lowerText.includes(k.toLowerCase())
    );

    const keywordsMissing = COMMON_TECH_KEYWORDS.filter(k =>
        !lowerText.includes(k.toLowerCase())
    ).slice(0, 10); // Check top 10 missing only

    // 2. Formatting & Structure Analysis
    const formattingIssues: string[] = [];
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 50; // Base score

    // Check for Contact Info
    if (EMAIL_REGEX.test(text)) {
        score += 10;
        strengths.push("Contact email detected");
    } else {
        formattingIssues.push("Missing email address");
        improvements.push("Add a clear email address for recruiters");
    }

    if (PHONE_REGEX.test(text)) {
        score += 5;
    } else {
        formattingIssues.push("Missing phone number");
    }

    if (LINKEDIN_REGEX.test(text)) {
        score += 5;
        strengths.push("LinkedIn profile linked");
    } else {
        improvements.push("Add your LinkedIn profile URL");
    }

    // Check for Sections
    let sectionsFound = 0;
    ESSENTIAL_SECTIONS.forEach(section => {
        if (lowerText.includes(section.toLowerCase())) {
            sectionsFound++;
        }
    });

    if (sectionsFound >= 3) {
        score += 10;
        strengths.push("Good section structure detected");
    } else {
        formattingIssues.push("Essential sections (Education, Experience) might be missing or unclear");
        improvements.push("Use standard headings like 'Experience', 'Education', 'Skills'");
    }

    // Keyword Score
    const keywordRatio = keywordsFound.length / 5; // Expecting at least 5 keywords for a "good" technical resume
    score += Math.min(keywordRatio * 20, 20);

    if (keywordsFound.length >= 5) {
        strengths.push(`Found ${keywordsFound.length} relevant technical keywords`);
    } else {
        improvements.push("Add more technical keywords relevant to your role");
    }

    // Length Check (Rough character count)
    if (text.length > 200 && text.length < 5000) {
        score += 5;
    } else if (text.length < 200) {
        formattingIssues.push("Resume seems too short");
    }

    // Cap Score
    score = Math.min(Math.round(score), 100);

    return {
        score,
        keywordsFound,
        keywordsMissing,
        formattingIssues,
        strengths,
        improvements
    };
};
