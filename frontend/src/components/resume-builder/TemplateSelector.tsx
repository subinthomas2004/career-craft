import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { resumeTemplates } from '@/lib/templates';
import { TemplateId } from '@/types/resume';

// Template color schemes for preview cards
const templateColors: Record<TemplateId, { bg: string; accent: string }> = {
    classic: { bg: 'bg-card', accent: 'bg-primary' },
    modern: { bg: 'bg-card', accent: 'bg-info' },
    minimal: { bg: 'bg-card', accent: 'bg-foreground' },
    executive: { bg: 'bg-card', accent: 'bg-primary' },
    creative: { bg: 'bg-card', accent: 'bg-accent' },
    professional: { bg: 'bg-card', accent: 'bg-primary' },
    elegant: { bg: 'bg-card', accent: 'bg-muted-foreground' },
    bold: { bg: 'bg-card', accent: 'bg-foreground' },
    compact: { bg: 'bg-card', accent: 'bg-primary' },
    tech: { bg: 'bg-card', accent: 'bg-info' },
    sidebar: { bg: 'bg-card', accent: 'bg-primary' },
    corporate: { bg: 'bg-card', accent: 'bg-foreground' },
    designer: { bg: 'bg-card', accent: 'bg-accent' },
    clean: { bg: 'bg-card', accent: 'bg-muted-foreground' },
};

function TemplatePreview({ id, hasPhoto }: { id: TemplateId; hasPhoto: boolean }) {
    const colors = templateColors[id];

    return (
        <div className={`aspect-[8.5/11] ${colors.bg} rounded-md border border-border p-3 relative overflow-hidden`}>
            {/* Header */}
            <div className="flex gap-2 mb-3">
                {hasPhoto && (
                    <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1">
                    <div className={`h-2.5 ${colors.accent} rounded w-3/4`} />
                    <div className="h-1.5 bg-muted rounded w-1/2" />
                </div>
            </div>

            {/* Summary */}
            <div className="space-y-1 mb-3">
                <div className="h-1 bg-muted rounded w-full" />
                <div className="h-1 bg-muted rounded w-5/6" />
                <div className="h-1 bg-muted rounded w-4/6" />
            </div>

            {/* Section */}
            <div className={`h-1.5 ${colors.accent} rounded w-1/3 mb-2`} />
            <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                    <div className="h-1.5 bg-muted-foreground/30 rounded w-1/2" />
                    <div className="h-1 bg-muted rounded w-1/4" />
                </div>
                <div className="space-y-1 pl-2">
                    <div className="h-1 bg-muted rounded w-full" />
                    <div className="h-1 bg-muted rounded w-5/6" />
                </div>
            </div>

            {/* Section 2 */}
            <div className={`h-1.5 ${colors.accent} rounded w-1/4 mb-2`} />
            <div className="space-y-2">
                <div className="flex justify-between">
                    <div className="h-1.5 bg-muted-foreground/30 rounded w-2/5" />
                    <div className="h-1 bg-muted rounded w-1/5" />
                </div>
                <div className="space-y-1 pl-2">
                    <div className="h-1 bg-muted rounded w-4/5" />
                    <div className="h-1 bg-muted rounded w-3/5" />
                </div>
            </div>
        </div>
    );
}

export function TemplateSelector() {
    const { selectedTemplate, setSelectedTemplate, setActiveStep } = useResume();

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Choose Your Template</h2>
                <p className="text-muted-foreground mt-2">
                    All templates are ATS-optimized and professionally designed
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {resumeTemplates.map((template) => (
                    <Card
                        key={template.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden group ${selectedTemplate === template.id
                                ? 'ring-2 ring-primary shadow-lg'
                                : 'hover:ring-1 hover:ring-primary/50'
                            }`}
                        onClick={() => setSelectedTemplate(template.id as TemplateId)}
                    >
                        <div className="relative">
                            <TemplatePreview id={template.id as TemplateId} hasPhoto={template.hasPhoto} />

                            {selectedTemplate === template.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-primary-foreground" />
                                </div>
                            )}

                            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs gap-1">
                                    <Star className="w-3 h-3" />
                                    {template.atsScore}% ATS
                                </Badge>
                            </div>
                        </div>

                        <div className="p-3">
                            <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {template.description}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setActiveStep('edit')}>
                    Back to Editor
                </Button>
                <Button onClick={() => setActiveStep('export')}>
                    Continue to Export
                </Button>
            </div>
        </div>
    );
}
