import React from 'react';
import { FileUp, BarChart3, Edit3, Layout, Download, Check } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';

const steps = [
    { id: 'upload', label: 'Upload', icon: FileUp },
    { id: 'analyze', label: 'Analyze', icon: BarChart3 },
    { id: 'edit', label: 'Edit', icon: Edit3 },
    { id: 'template', label: 'Template', icon: Layout },
    { id: 'export', label: 'Export', icon: Download },
] as const;

export function StepNavigation() {
    const { activeStep, setActiveStep, atsScore, resumeData } = useResume();

    const getStepStatus = (stepId: string) => {
        const stepIndex = steps.findIndex(s => s.id === stepId);
        const activeIndex = steps.findIndex(s => s.id === activeStep);

        if (stepIndex < activeIndex) return 'completed';
        if (stepIndex === activeIndex) return 'active';
        return 'pending';
    };

    const canNavigate = (stepId: string) => {
        // Can always go back
        const stepIndex = steps.findIndex(s => s.id === stepId);
        const activeIndex = steps.findIndex(s => s.id === activeStep);
        if (stepIndex <= activeIndex) return true;

        // Check if we have data to proceed
        if (stepId === 'analyze' && !atsScore) return false;
        if (stepId === 'edit' && !resumeData.contact.name && !atsScore) return false;
        if (stepId === 'template' && !resumeData.contact.name) return false;
        if (stepId === 'export' && !resumeData.contact.name) return false;

        return true;
    };

    return (
        <nav className="w-full">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    const Icon = step.icon;
                    const isClickable = canNavigate(step.id);

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => isClickable && setActiveStep(step.id)}
                                disabled={!isClickable}
                                className={cn(
                                    'flex flex-col items-center gap-2 transition-all duration-200',
                                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed',
                                    status === 'active' && 'scale-110',
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                                        status === 'completed' && 'bg-success text-success-foreground',
                                        status === 'active' && 'bg-primary text-primary-foreground shadow-lg',
                                        status === 'pending' && 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {status === 'completed' ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'text-xs font-medium transition-colors',
                                        status === 'active' && 'text-primary',
                                        status === 'completed' && 'text-success',
                                        status === 'pending' && 'text-muted-foreground',
                                    )}
                                >
                                    {step.label}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'flex-1 h-0.5 mx-2 transition-colors',
                                        getStepStatus(steps[index + 1].id) !== 'pending'
                                            ? 'bg-success'
                                            : 'bg-muted',
                                    )}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </nav>
    );
}
