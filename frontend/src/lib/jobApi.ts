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
}

export const jobApi = {
    getJobs: async (search?: string): Promise<{ success: boolean; count: number; data: Job[] }> => {
        const params = search ? { search } : {};
        const response = await api.get('/jobs', { params });
        return response.data;
    }
};
