import { ResumeData, Experience, Education, Skill } from '@/types/resume';
import { emptyResumeData } from './sample-data';

// This is a client-side parser that extracts text from files
// For production, you'd use a proper backend parser

import { api } from '@/lib/api';

export async function parseResumeFile(file: File): Promise<ResumeData> {
    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await api.post('/upload/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.success) {
            console.log("Raw API Response:", response.data);
            const mappedData = mapGroqDataToResumeData(response.data.data, response.data.text);
            console.log("Mapped Resume Data:", mappedData);
            return mappedData;
        } else {
            throw new Error(response.data?.error || 'Failed to parse resume');
        }
    } catch (error) {
        console.error("Resume upload error:", error);
        // Fallback to text parsing if backend fails
        const text = await extractTextFromFile(file);
        return parseResumeText(text);
    }
}

function mapGroqDataToResumeData(aiData: any, rawText: string): ResumeData {
    const resume = { ...emptyResumeData };

    // Safely extract from AI structure
    if (!aiData) return parseResumeText(rawText); // Fallback

    if (aiData.full_name) resume.contact.name = aiData.full_name;
    if (aiData.email) resume.contact.email = aiData.email;
    if (aiData.phone) resume.contact.phone = aiData.phone;
    if (aiData.location) resume.contact.location = aiData.location;

    if (aiData.summary) resume.summary = aiData.summary;
    else if (aiData.profile) resume.summary = aiData.profile;
    else if (aiData.objective) resume.summary = aiData.objective;
    else if (aiData.about) resume.summary = aiData.about;

    if (Array.isArray(aiData.skills)) {
        resume.skills = aiData.skills.map((skill: any, i: number) => ({
            id: generateId(),
            name: typeof skill === 'string' ? skill : skill.name || '',
            level: 'intermediate'
        })).filter((s: Skill) => s.name);
    }

    if (Array.isArray(aiData.experience)) {
        resume.experience = aiData.experience.map((exp: any) => ({
            id: generateId(),
            title: exp.role || '',
            company: exp.company || '',
            location: '',
            startDate: exp.duration?.split('-')[0]?.trim() || '',
            endDate: exp.duration?.split('-')[1]?.trim() || '',
            current: exp.duration?.toLowerCase().includes('present') || false,
            description: Array.isArray(exp.summary) ? exp.summary : exp.summary?.split(/[\n•]/).filter((s: string) => s.trim()) || ['']
        }));
    }

    if (Array.isArray(aiData.education)) {
        resume.education = aiData.education.map((edu: any) => ({
            id: generateId(),
            degree: edu.degree || '',
            field: '',
            institution: edu.school || '',
            location: '',
            graduationDate: edu.year || '',
        }));
    }

    if (Array.isArray(aiData.projects)) {
        resume.projects = aiData.projects.map((proj: any) => ({
            id: generateId(),
            name: proj.title || '',
            description: proj.description || '',
            technologies: [],
            link: '',
            year: proj.year || ''
        }));
    }

    if (Array.isArray(aiData.certifications)) {
        resume.certifications = aiData.certifications.map((cert: any) => ({
            id: generateId(),
            name: typeof cert === 'string' ? cert : cert.name || '',
            issuer: '',
            date: ''
        }));
    }

    if (Array.isArray(aiData.links)) {
        aiData.links.forEach((link: string) => {
            const lowerLink = link.toLowerCase();
            if (lowerLink.includes('linkedin')) {
                resume.contact.linkedin = link;
            } else if (lowerLink.includes('github') || lowerLink.includes('portfolio') || lowerLink.includes('vercel')) {
                resume.contact.website = link;
            }
        });
    }

    return resume;
}

// Keep extractTextFromFile and parseResumeText as fallback for plain text or if backend is down
async function extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve('');
            reader.readAsArrayBuffer(file);
        });
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export function parseResumeText(text: string): ResumeData {
    const resume: ResumeData = { ...emptyResumeData };
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) resume.contact.email = emailMatch[0];
    const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) resume.contact.phone = phoneMatch[0];
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) resume.contact.linkedin = linkedinMatch[0];
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
        const potentialName = lines[0].trim();
        if (potentialName.length < 50 && !potentialName.includes('@')) {
            resume.contact.name = potentialName;
        }
    }
    const skillsSection = text.match(/skills?:?\s*([\s\S]*?)(?=\n\n|experience|education|$)/i);
    if (skillsSection) {
        const skills = skillsSection[1].split(/[,|•·\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
        resume.skills = skills.map((name, index) => ({ id: `skill-${index}`, name, level: 'intermediate' as const }));
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
