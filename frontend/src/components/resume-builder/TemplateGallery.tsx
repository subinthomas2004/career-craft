import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Globe, Zap, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useResume } from '@/context/ResumeContext';
import { resumeTemplates } from '@/lib/templates';
import { TemplateId } from '@/types/resume';
import { cn } from '@/lib/utils';
import { parseResumeFile } from '@/lib/resume-parser';
import { useToast } from '@/hooks/use-toast';
import { ResumePreview } from './ResumePreview';
import { sampleResumeData } from '@/lib/sample-data';

const templateCategories = [
    { id: 'all', label: 'All Templates' },
    { id: 'simple', label: 'Simple', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'modern', label: 'Modern', icon: <Globe className="w-4 h-4" /> },
    { id: 'creative', label: 'Creative', icon: <Zap className="w-4 h-4" /> },
    { id: 'photo', label: 'With Photo', icon: <Camera className="w-4 h-4" /> },
];

export function TemplateGallery() {
    const { setSelectedTemplate, setActiveStep, setResumeData, analyzeCurrentResume } = useResume();
    const [activeCategory, setActiveCategory] = useState('all');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const filteredTemplates = activeCategory === 'all'
        ? resumeTemplates
        : resumeTemplates.filter(t => {
            if (activeCategory === 'simple') return t.category === 'minimal' || t.category === 'professional';
            if (activeCategory === 'modern') return t.category === 'modern';
            if (activeCategory === 'creative') return t.category === 'creative';
            if (activeCategory === 'photo') return t.hasPhoto;
            return true;
        });

    const handleSelectTemplate = (templateId: TemplateId) => {
        setSelectedTemplate(templateId);
        setActiveStep('edit');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

        if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF, DOCX, or TXT file.',
                variant: 'destructive',
            });
            return;
        }

        setIsImporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const resumeData = await parseResumeFile(file);
            setResumeData(resumeData);
            analyzeCurrentResume();
            setActiveStep('edit');

            toast({
                title: 'Resume imported!',
                description: 'Your resume has been imported. Review and edit as needed.',
            });
        } catch (error) {
            toast({
                title: 'Error importing file',
                description: 'There was an error parsing your resume. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileImport}
                className="hidden"
            />

            {/* Header Section */}
            <div className="bg-card border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Start building your resume
                    </h1>
                    <p className="text-muted-foreground">
                        Choose a design you like. You can customize or switch it later.
                    </p>
                </div>
            </div>

            {/* Tabs and Import */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                        <TabsList className="bg-muted/50 p-1">
                            {templateCategories.map((cat) => (
                                <TabsTrigger
                                    key={cat.id}
                                    value={cat.id}
                                    className="flex items-center gap-2 data-[state=active]:bg-card"
                                >
                                    {cat.icon}
                                    {cat.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleImportClick}
                        disabled={isImporting}
                    >
                        <Upload className="w-4 h-4" />
                        {isImporting ? 'Importing...' : 'Import existing resume'}
                    </Button>
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className={cn(
                                "group relative bg-card rounded-xl border overflow-hidden cursor-pointer transition-all duration-300",
                                hoveredTemplate === template.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                            )}
                            onMouseEnter={() => setHoveredTemplate(template.id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            onClick={() => handleSelectTemplate(template.id as TemplateId)}
                        >
                            {/* Preview Image */}
                            <div className="aspect-[8.5/11] bg-muted relative overflow-hidden">
                                <TemplatePreviewCard templateId={template.id} hasPhoto={template.hasPhoto} />

                                {/* Photo Badge */}
                                {template.hasPhoto && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute top-2 left-2 gap-1 text-xs bg-background/80 backdrop-blur-sm"
                                    >
                                        <User className="w-3 h-3" />
                                        Photo
                                    </Badge>
                                )}

                                {/* ATS Score Badge */}
                                <Badge
                                    variant="secondary"
                                    className="absolute top-2 right-2 text-xs bg-background/80 backdrop-blur-sm"
                                >
                                    {template.atsScore}% ATS
                                </Badge>

                                {/* Hover Overlay */}
                                <div className={cn(
                                    "absolute inset-0 bg-foreground/80 flex items-center justify-center transition-opacity duration-200",
                                    hoveredTemplate === template.id ? "opacity-100" : "opacity-0"
                                )}>
                                    <Button className="bg-background text-foreground hover:bg-background/90">
                                        Use this template
                                    </Button>
                                </div>
                            </div>

                            {/* Template Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-foreground uppercase tracking-wide text-sm">
                                    {template.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {template.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Visual template preview thumbnails
// Visual template preview thumbnails using the actual ResumePreview component
function TemplatePreviewCard({ templateId, hasPhoto }: { templateId: string; hasPhoto: boolean }) {
    // We use a fixed scale that works well for the grid layout
    // The parent container has aspect-[8.5/11] which matches the resume dimensions
    const scale = 0.4; // Initial guess, we can refine this or make it responsive with more complex logic

    return (
        <div className="w-full h-full overflow-hidden bg-white relative pointer-events-none select-none">
            {/* 
               We render the ResumePreview. 
               The ResumePreview renders at 8.5in width (816px).
               To fit it in our card, we scale it down.
               The origin-top-left ensures it stays anchored to the corner.
             */}
            <div
                className="absolute top-0 left-0"
                style={{
                    transform: `scale(${0.33})`, // Adjusted scale for grid column sizes
                    transformOrigin: 'top left',
                    width: '8.5in',
                    // Force height to ensure background fills if scaled heavily
                    height: '11in'
                }}
            >
                <ResumePreview
                    data={sampleResumeData}
                    template={templateId as TemplateId}
                    scale={1} // We handle scaling in the wrapper to avoid component-level transform conflicts inside the loop context if any
                />
            </div>

            {/* Overlay gradient to make text less readable/distracting, treating it more like a visual thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
        </div>
    );
}
