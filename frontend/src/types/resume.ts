export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages?: { name: string; proficiency: string }[];
  customSections?: { title: string; content: string }[];
}

export interface ATSFeedback {
  category: 'critical' | 'warning' | 'suggestion' | 'success';
  title: string;
  description: string;
  impact: number;
}

export interface ATSScore {
  overall: number;
  breakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    content: number;
    readability: number;
  };
  feedback: ATSFeedback[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'professional' | 'modern' | 'creative' | 'minimal';
  hasPhoto: boolean;
  atsScore: number;
}

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'professional'
  | 'elegant'
  | 'bold'
  | 'compact'
  | 'tech'
  | 'sidebar'
  | 'corporate'
  | 'designer'
  | 'clean';
