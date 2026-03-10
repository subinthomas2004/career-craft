import { ResumeData, ATSScore, ATSFeedback } from '@/types/resume';
import { api } from '@/lib/api';

const POWER_WORDS = [
    'achieved', 'improved', 'increased', 'reduced', 'developed', 'created',
    'implemented', 'managed', 'led', 'designed', 'launched', 'optimized',
    'delivered', 'generated', 'established', 'streamlined', 'coordinated',
    'executed', 'transformed', 'accelerated', 'spearheaded', 'pioneered',
];

const COMMON_KEYWORDS = [
    'experience', 'skills', 'education', 'project', 'team', 'leadership',
    'communication', 'problem-solving', 'collaboration', 'management',
    'development', 'analysis', 'strategy', 'customer', 'client',
];

export async function analyzeResume(data: ResumeData, jobDescription?: string): Promise<ATSScore> {
    try {
        const resumeText = JSON.stringify(data);
        const response = await api.post('/groq/resume/analyze', {
            resumeText: resumeText,
            jobDescription: jobDescription || ''
        });

        if (response.data && response.data.success && response.data.score) {
            const score = response.data.score;

            // Generate unique IDs or keys for feedback items if needed, but the interface handles it
            return {
                overall: score.overall || 0,
                breakdown: score.breakdown || {
                    formatting: 0, keywords: 0, structure: 0, content: 0, readability: 0
                },
                feedback: Array.isArray(score.feedback) ? score.feedback : []
            };
        }
    } catch (error) {
        console.error("AI ATS Analysis failed:", error);
    }

    // Fallback to local analysis if the API fails
    return analyzeResumeLocal(data);
}

function analyzeResumeLocal(data: ResumeData): ATSScore {
    const feedback: ATSFeedback[] = [];

    // Analyze formatting
    const formattingScore = analyzeFormatting(data, feedback);

    // Analyze keywords
    const keywordsScore = analyzeKeywords(data, feedback);

    // Analyze structure
    const structureScore = analyzeStructure(data, feedback);

    // Analyze content quality
    const contentScore = analyzeContent(data, feedback);

    // Analyze readability
    const readabilityScore = analyzeReadability(data, feedback);

    // Calculate overall score
    const overall = Math.round(
        (formattingScore * 0.2) +
        (keywordsScore * 0.25) +
        (structureScore * 0.2) +
        (contentScore * 0.25) +
        (readabilityScore * 0.1)
    );

    // Add positive feedback if score is good
    if (overall >= 80) {
        feedback.unshift({
            category: 'success',
            title: 'Excellent ATS Compatibility',
            description: 'Your resume is well-optimized for applicant tracking systems.',
            impact: 10,
        });
    }

    return {
        overall,
        breakdown: {
            formatting: formattingScore,
            keywords: keywordsScore,
            structure: structureScore,
            content: contentScore,
            readability: readabilityScore,
        },
        feedback: feedback.sort((a, b) => {
            const order = { critical: 0, warning: 1, suggestion: 2, success: 3 };
            return order[a.category] - order[b.category];
        }),
    };
}

function analyzeFormatting(data: ResumeData, feedback: ATSFeedback[]): number {
    let score = 100;

    // Check contact info completeness
    if (!data.contact.email) {
        feedback.push({
            category: 'critical',
            title: 'Missing Email Address',
            description: 'Add your email address so employers can contact you.',
            impact: 15,
        });
        score -= 15;
    }

    if (!data.contact.phone) {
        feedback.push({
            category: 'warning',
            title: 'Missing Phone Number',
            description: 'Include a phone number for easier communication.',
            impact: 10,
        });
        score -= 10;
    }

    if (!data.contact.location) {
        feedback.push({
            category: 'warning',
            title: 'Missing Location',
            description: 'Add your city and state to help with location-based searches.',
            impact: 5,
        });
        score -= 5;
    }

    return Math.max(0, score);
}

function analyzeKeywords(data: ResumeData, feedback: ATSFeedback[]): number {
    let score = 70;

    const allText = [
        data.summary,
        ...data.experience.flatMap(e => e.description),
        ...data.skills.map(s => s.name),
    ].join(' ').toLowerCase();

    // Check for power words
    const powerWordsFound = POWER_WORDS.filter(word => allText.includes(word));
    if (powerWordsFound.length >= 5) {
        score += 20;
        feedback.push({
            category: 'success',
            title: 'Strong Action Verbs',
            description: `Great use of power words like "${powerWordsFound.slice(0, 3).join('", "')}".`,
            impact: 10,
        });
    } else if (powerWordsFound.length < 3) {
        feedback.push({
            category: 'suggestion',
            title: 'Add More Action Verbs',
            description: 'Use strong action verbs like "achieved", "implemented", "led" to describe accomplishments.',
            impact: 10,
        });
    }

    // Check skills section
    if (data.skills.length >= 8) {
        score += 10;
    } else if (data.skills.length < 5) {
        feedback.push({
            category: 'warning',
            title: 'Limited Skills Listed',
            description: 'Add more relevant skills to improve keyword matching with job descriptions.',
            impact: 10,
        });
        score -= 10;
    }

    return Math.min(100, Math.max(0, score));
}

function analyzeStructure(data: ResumeData, feedback: ATSFeedback[]): number {
    let score = 100;

    // Check for essential sections
    if (!data.summary || data.summary.length < 50) {
        feedback.push({
            category: 'warning',
            title: 'Weak Professional Summary',
            description: 'Add a compelling 2-4 sentence summary highlighting your key qualifications.',
            impact: 15,
        });
        score -= 15;
    }

    if (data.experience.length === 0) {
        feedback.push({
            category: 'critical',
            title: 'No Work Experience',
            description: 'Add your work history with detailed accomplishments and responsibilities.',
            impact: 25,
        });
        score -= 25;
    }

    if (data.education.length === 0) {
        feedback.push({
            category: 'warning',
            title: 'Missing Education Section',
            description: 'Include your educational background, degrees, and relevant certifications.',
            impact: 10,
        });
        score -= 10;
    }

    if (data.skills.length === 0) {
        feedback.push({
            category: 'critical',
            title: 'No Skills Listed',
            description: 'Add a skills section with relevant technical and soft skills.',
            impact: 20,
        });
        score -= 20;
    }

    return Math.max(0, score);
}

function analyzeContent(data: ResumeData, feedback: ATSFeedback[]): number {
    let score = 70;

    // Check experience descriptions for metrics
    const hasMetrics = data.experience.some(exp =>
        exp.description.some(desc => /\d+%|\d+\+|\$\d+|[0-9]+ (users|clients|customers|projects|team)/i.test(desc))
    );

    if (hasMetrics) {
        score += 20;
        feedback.push({
            category: 'success',
            title: 'Quantified Achievements',
            description: 'Great job including metrics and numbers to demonstrate impact.',
            impact: 15,
        });
    } else {
        feedback.push({
            category: 'suggestion',
            title: 'Add Quantifiable Results',
            description: 'Include numbers, percentages, and metrics to showcase your impact (e.g., "increased sales by 25%").',
            impact: 15,
        });
    }

    // Check description length
    const avgDescLength = data.experience.reduce((acc, exp) =>
        acc + exp.description.reduce((a, d) => a + d.length, 0) / Math.max(1, exp.description.length), 0
    ) / Math.max(1, data.experience.length);

    if (avgDescLength > 80) {
        score += 10;
    } else if (avgDescLength < 40 && data.experience.length > 0) {
        feedback.push({
            category: 'suggestion',
            title: 'Expand Job Descriptions',
            description: 'Add more detail to your job descriptions to highlight your responsibilities and achievements.',
            impact: 10,
        });
    }

    return Math.min(100, Math.max(0, score));
}

function analyzeReadability(data: ResumeData, feedback: ATSFeedback[]): number {
    let score = 80;

    // Check summary length
    if (data.summary.length > 100 && data.summary.length < 400) {
        score += 10;
    } else if (data.summary.length > 500) {
        feedback.push({
            category: 'suggestion',
            title: 'Summary Too Long',
            description: 'Keep your professional summary concise (2-4 sentences).',
            impact: 5,
        });
        score -= 10;
    }

    // Check for consistent formatting in experience
    const bulletCounts = data.experience.map(e => e.description.length);
    const avgBullets = bulletCounts.reduce((a, b) => a + b, 0) / Math.max(1, bulletCounts.length);

    if (avgBullets >= 3 && avgBullets <= 5) {
        score += 10;
    } else if (avgBullets > 6) {
        feedback.push({
            category: 'suggestion',
            title: 'Too Many Bullet Points',
            description: 'Aim for 3-5 bullet points per position to maintain readability.',
            impact: 5,
        });
    }

    return Math.min(100, Math.max(0, score));
}

export function getScoreColor(score: number): string {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
}

export function getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
}
