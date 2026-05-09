import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://career-craft-u7fq.onrender.com/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
    } catch (error) {
        console.error('Error attaching token:', error);
    }
    return config;
});

export const resumeApi = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);

        // axios handles multipart/form-data automatically if we pass FormData
        // but explicit header helps in some edge cases or we let browser set it
        const response = await api.post('/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    get: async (id: string) => {
        const response = await api.get(`/resume/${id}`);
        return response.data;
    }
};
