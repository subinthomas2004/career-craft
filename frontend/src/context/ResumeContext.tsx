import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ResumeData, ATSScore, TemplateId } from '@/types/resume';
import { emptyResumeData, sampleResumeData } from '@/lib/sample-data';
import { analyzeResume } from '@/lib/ats-analyzer';

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: (data: ResumeData) => void;
    updateResumeData: (partial: Partial<ResumeData>) => void;
    atsScore: ATSScore | null;
    analyzeCurrentResume: (jobDescription?: string, dataToAnalyze?: ResumeData) => Promise<ATSScore | undefined>;
    selectedTemplate: TemplateId;
    setSelectedTemplate: (template: TemplateId) => void;
    activeStep: 'upload' | 'analyze' | 'edit' | 'template' | 'export';
    setActiveStep: (step: 'upload' | 'analyze' | 'edit' | 'template' | 'export') => void;
    loadSampleData: () => void;
    resetResume: () => void;
    setAtsScore: (score: ATSScore | null) => void;
}


const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
    const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
    const [activeStep, setActiveStep] = useState<'upload' | 'analyze' | 'edit' | 'template' | 'export'>('upload');

    const updateResumeData = useCallback((partial: Partial<ResumeData>) => {
        setResumeData(prev => ({ ...prev, ...partial }));
    }, []);

    const analyzeCurrentResume = useCallback(async (jobDescription?: string, dataToAnalyze?: ResumeData) => {
        const data = dataToAnalyze || resumeData;
        const score = await analyzeResume(data, jobDescription);
        setAtsScore(score);
        return score;
    }, [resumeData]);

    const loadSampleData = useCallback(async () => {
        setResumeData(sampleResumeData);
        const score = await analyzeResume(sampleResumeData);
        setAtsScore(score);
    }, []);

    const resetResume = useCallback(() => {
        setResumeData(emptyResumeData);
        setAtsScore(null);
        setActiveStep('upload');
    }, []);

    return (
        <ResumeContext.Provider
            value={{
                resumeData,
                setResumeData,
                updateResumeData,
                atsScore,
                analyzeCurrentResume,
                selectedTemplate,
                setSelectedTemplate,
                activeStep,
                setActiveStep,
                loadSampleData,
                resetResume,
                setAtsScore,
            }}

        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
}
