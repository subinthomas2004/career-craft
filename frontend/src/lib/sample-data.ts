import { ResumeData } from '@/types/resume';

export const sampleResumeData: ResumeData = {
    contact: {
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        website: 'alexjohnson.dev',
    },
    summary: 'Results-driven software engineer with 5+ years of experience building scalable web applications. Expertise in React, TypeScript, and Node.js. Passionate about creating intuitive user experiences and mentoring junior developers. Successfully led teams of 3-5 engineers to deliver projects on time.',
    experience: [
        {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            startDate: 'Jan 2022',
            endDate: 'Present',
            current: true,
            description: [
                'Led development of a customer-facing dashboard that increased user engagement by 40%',
                'Architected microservices infrastructure handling 1M+ daily requests',
                'Mentored 3 junior developers, conducting weekly code reviews and pair programming sessions',
                'Reduced application load time by 60% through performance optimization techniques',
            ],
        },
        {
            id: '2',
            title: 'Software Engineer',
            company: 'StartupXYZ',
            location: 'San Francisco, CA',
            startDate: 'Mar 2019',
            endDate: 'Dec 2021',
            current: false,
            description: [
                'Developed and maintained React applications serving 50K+ monthly users',
                'Implemented CI/CD pipelines reducing deployment time by 75%',
                'Collaborated with product team to define technical requirements and roadmap',
                'Built RESTful APIs using Node.js and PostgreSQL',
            ],
        },
        {
            id: '3',
            title: 'Junior Developer',
            company: 'WebAgency',
            location: 'Oakland, CA',
            startDate: 'Jun 2017',
            endDate: 'Feb 2019',
            current: false,
            description: [
                'Created responsive websites for 20+ clients using HTML, CSS, and JavaScript',
                'Participated in agile development processes including daily standups and sprint planning',
                'Assisted in migrating legacy jQuery codebase to modern React architecture',
            ],
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            graduationDate: 'May 2017',
            gpa: '3.7',
        },
    ],
    skills: [
        { id: '1', name: 'React', level: 'expert' },
        { id: '2', name: 'TypeScript', level: 'expert' },
        { id: '3', name: 'Node.js', level: 'advanced' },
        { id: '4', name: 'PostgreSQL', level: 'advanced' },
        { id: '5', name: 'AWS', level: 'intermediate' },
        { id: '6', name: 'Docker', level: 'intermediate' },
        { id: '7', name: 'GraphQL', level: 'advanced' },
        { id: '8', name: 'Python', level: 'intermediate' },
        { id: '9', name: 'Git', level: 'expert' },
        { id: '10', name: 'Agile/Scrum', level: 'advanced' },
    ],
    projects: [
        {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with real-time inventory management',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            link: 'github.com/alex/ecommerce',
        },
        {
            id: '2',
            name: 'Task Management App',
            description: 'Collaborative task management tool with real-time updates',
            technologies: ['React', 'Firebase', 'Material-UI'],
            link: 'github.com/alex/taskmanager',
        },
    ],
    certifications: [
        {
            id: '1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: 'Sep 2023',
        },
        {
            id: '2',
            name: 'Professional Scrum Master I',
            issuer: 'Scrum.org',
            date: 'Mar 2021',
        },
    ],
    languages: [
        { name: 'English', proficiency: 'Native' },
        { name: 'Spanish', proficiency: 'Conversational' },
    ],
};

export const emptyResumeData: ResumeData = {
    contact: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
};
