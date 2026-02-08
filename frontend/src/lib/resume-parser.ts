import { ResumeData, Experience, Education, Skill } from '@/types/resume';
import { emptyResumeData } from './sample-data';

// This is a client-side parser that extracts text from files
// For production, you'd use a proper backend parser

export async function parseResumeFile(file: File): Promise<ResumeData> {
    const text = await extractTextFromFile(file);
    return parseResumeText(text);
}

async function extractTextFromFile(file: File): Promise<string> {
    // For PDF files, we'll need to handle them differently
    // In production, this would use a proper PDF parser
    if (file.type === 'application/pdf') {
        // Simulate PDF parsing - in production use pdf.js or backend
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                // This is a placeholder - real PDF parsing would extract text
                resolve('');
            };
            reader.readAsArrayBuffer(file);
        });
    }

    // For text-based files
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export function parseResumeText(text: string): ResumeData {
    const resume: ResumeData = { ...emptyResumeData };

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
        resume.contact.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
        resume.contact.phone = phoneMatch[0];
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) {
        resume.contact.linkedin = linkedinMatch[0];
    }

    // Extract potential name (first line or line before email)
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
        const potentialName = lines[0].trim();
        if (potentialName.length < 50 && !potentialName.includes('@')) {
            resume.contact.name = potentialName;
        }
    }

    // Extract skills from common patterns
    const skillsSection = text.match(/skills?:?\s*([\s\S]*?)(?=\n\n|experience|education|$)/i);
    if (skillsSection) {
        const skillText = skillsSection[1];
        const skills = skillText
            .split(/[,|•·\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.length < 30);

        resume.skills = skills.map((name, index) => ({
            id: `skill-${index}`,
            name,
            level: 'intermediate' as const,
        }));
    }

    return resume;
}

// Generate unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

export function createEmptyExperience(): Experience {
    return {
        id: generateId(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [''],
    };
}

export function createEmptyEducation(): Education {
    return {
        id: generateId(),
        degree: '',
        field: '',
        institution: '',
        location: '',
        graduationDate: '',
    };
}

export function createEmptySkill(): Skill {
    return {
        id: generateId(),
        name: '',
        level: 'intermediate',
    };
}
