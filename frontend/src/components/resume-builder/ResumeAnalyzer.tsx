import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Info, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { parseResumeFile } from '@/lib/resume-parser';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ResumeAnalyzer() {
    const {
        atsScore,
        setResumeData,
        analyzeCurrentResume,
        setActiveStep
    } = useResume();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.[0]) {
            await processFile(files[0]);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.[0]) {
            await processFile(files[0]);
        }
    };

    const processFile = async (file: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

        if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF, DOCX, or TXT file.',
                variant: 'destructive',
            });
            return;
        }

        setIsAnalyzing(true);
        setFileName(file.name);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const resumeData = await parseResumeFile(file);
            setResumeData(resumeData);
            analyzeCurrentResume();

            toast({
                title: 'Analysis complete!',
                description: 'Your resume has been analyzed. Review the results below.',
            });
        } catch (error) {
            toast({
                title: 'Error analyzing file',
                description: 'There was an error parsing your resume. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsAnalyzing(false);
        }
    };



    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-500';
        if (score >= 60) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-rose-500';
    };

    const getFeedbackIcon = (category: string) => {
        switch (category) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'critical':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Resume Analyzer
                    </h1>
                    <p className="text-muted-foreground">
                        Upload your resume to get an instant ATS score and actionable feedback
                    </p>
                </div>

                {/* Upload Section */}
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-8 transition-all duration-200 mb-8",
                        dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                        isAnalyzing && "opacity-50 pointer-events-none"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            {isAnalyzing ? (
                                <div className="animate-spin">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                            ) : (
                                <Upload className="w-8 h-8 text-primary" />
                            )}
                        </div>

                        {isAnalyzing ? (
                            <div>
                                <p className="text-lg font-medium text-foreground mb-2">Analyzing your resume...</p>
                                <p className="text-muted-foreground text-sm">{fileName}</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-lg font-medium text-foreground mb-2">
                                    Drag & drop your resume here
                                </p>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Supports PDF, DOCX, and TXT files
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Button onClick={() => fileInputRef.current?.click()}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Browse Files
                                    </Button>
                                    <Button variant="outline" onClick={() => setActiveStep('template')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Resume
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Analysis Results */}
                {atsScore && (
                    <div className="space-y-6">
                        {/* Overall Score Card */}
                        <Card className="overflow-hidden">
                            <div className={cn(
                                "h-2 bg-gradient-to-r",
                                getScoreGradient(atsScore.overall)
                            )} />
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">ATS Score</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Based on industry best practices
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "text-5xl font-bold",
                                        getScoreColor(atsScore.overall)
                                    )}>
                                        {atsScore.overall}
                                    </div>
                                </div>

                                {/* Score Breakdown */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(atsScore.breakdown).map(([key, value]) => (
                                        <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground capitalize mb-1">{key}</p>
                                            <div className="relative pt-1">
                                                <Progress value={value} className="h-2" />
                                                <p className={cn("text-sm font-bold mt-1", getScoreColor(value))}>
                                                    {value}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feedback Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Detailed Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {atsScore.feedback.map((item, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex gap-4 p-4 rounded-lg border",
                                                item.category === 'success' && "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900",
                                                item.category === 'warning' && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900",
                                                item.category === 'critical' && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
                                                item.category === 'suggestion' && "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900"
                                            )}
                                        >
                                            <div className="flex-shrink-0">
                                                {getFeedbackIcon(item.category)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <Button size="lg" onClick={() => setActiveStep('edit')}>
                                Edit Resume
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => setActiveStep('template')}>
                                Choose Template
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
