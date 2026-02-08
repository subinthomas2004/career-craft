import React, { useCallback, useState } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { parseResumeFile } from '@/lib/resume-parser';
import { useToast } from '@/hooks/use-toast';

export function FileUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { setResumeData, analyzeCurrentResume, setActiveStep, loadSampleData } = useResume();
    const { toast } = useToast();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await processFile(files[0]);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
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

        setIsProcessing(true);

        try {
            // Simulate processing delay for demo
            await new Promise(resolve => setTimeout(resolve, 1500));

            const resumeData = await parseResumeFile(file);
            setResumeData(resumeData);
            analyzeCurrentResume();
            setActiveStep('analyze');

            toast({
                title: 'Resume uploaded!',
                description: 'Your resume has been analyzed. Review the results below.',
            });
        } catch (error) {
            toast({
                title: 'Error processing file',
                description: 'There was an error parsing your resume. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTrySample = () => {
        loadSampleData();
        setActiveStep('analyze');
        toast({
            title: 'Sample resume loaded!',
            description: 'Review the ATS analysis and edit as needed.',
        });
    };

    const handleBuildFromScratch = () => {
        setActiveStep('edit');
        toast({
            title: 'Start building!',
            description: 'Fill in your details to create your resume.',
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDragging
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    } ${isProcessing ? 'pointer-events-none opacity-70' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                />

                <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full bg-primary/10 ${isProcessing ? 'animate-pulse' : ''}`}>
                        {isProcessing ? (
                            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Upload className="w-10 h-10 text-primary" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">
                            {isProcessing ? 'Analyzing your resume...' : 'Upload your resume'}
                        </h3>
                        <p className="text-muted-foreground mt-2">
                            {isProcessing
                                ? 'This will only take a moment'
                                : 'Drag and drop or click to browse. PDF, DOCX supported.'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 gap-3"
                    onClick={handleTrySample}
                >
                    <FileText className="w-5 h-5" />
                    Try with sample resume
                </Button>

                <Button
                    size="lg"
                    className="flex-1 h-14 gap-3"
                    onClick={handleBuildFromScratch}
                >
                    <Sparkles className="w-5 h-5" />
                    Build from scratch
                </Button>
            </div>
        </div>
    );
}
