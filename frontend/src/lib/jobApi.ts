import { api } from './api';

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
    postedDate: string;
    description: string;
    requirements: string[];
    applyLink: string;
    logo: string;
    source?: 'infopark' | 'jsearch' | 'featured';
    campus?: string | null;
    applyEmail?: string;
}

export const jobApi = {
    getJobs: async (search?: string, source?: string): Promise<{ success: boolean; count: number; data: Job[] }> => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (source) params.source = source;
        const response = await api.get('/jobs', { params });
        return response.data;
    },

    getInfoparkJobs: async (search?: string, campus?: string): Promise<{ success: boolean; count: number; data: Job[] }> => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (campus) params.campus = campus;
        const response = await api.get('/jobs/infopark', { params });
        return response.data;
    }
};
