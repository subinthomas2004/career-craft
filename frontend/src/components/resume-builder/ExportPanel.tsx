import React, { useState, useRef } from 'react';
import { Download, FileText, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { ResumePreview } from './ResumePreview';
import { getTemplateById } from '@/lib/templates';
import { useToast } from '@/hooks/use-toast';

export function ExportPanel() {
    const { resumeData, selectedTemplate, setActiveStep } = useResume();
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const template = getTemplateById(selectedTemplate);

    const handleExportPDF = async () => {
        setIsExporting(true);

        try {
            // Using the browser's print functionality for PDF generation
            const printWindow = window.open('', '_blank');

            if (!printWindow) {
                toast({
                    title: 'Pop-up blocked',
                    description: 'Please allow pop-ups to download your resume.',
                    variant: 'destructive',
                });
                setIsExporting(false);
                return;
            }

            const resumeElement = document.getElementById('resume-preview');
            if (!resumeElement) {
                throw new Error('Resume preview not found');
            }

            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resumeData.contact.name || 'Resume'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            @page {
              size: letter;
              margin: 0;
            }
            
            @media print {
              body {
                width: 8.5in;
              }
            }
          </style>
        </head>
        <body>
          ${resumeElement.innerHTML}
        </body>
        </html>
      `);

            printWindow.document.close();

            // Wait for content to load
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
                setExportComplete(true);

                toast({
                    title: 'PDF ready!',
                    description: 'Your resume has been prepared for download.',
                });

                setTimeout(() => setExportComplete(false), 3000);
            }, 500);
        } catch (error) {
            console.error('Export error:', error);
            toast({
                title: 'Export failed',
                description: 'There was an error exporting your resume. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Export Your Resume</h2>
                <p className="text-muted-foreground mt-2">
                    Preview and download your ATS-optimized resume
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Export Options */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-4">Download Options</h3>

                            <div className="space-y-4">
                                <Button
                                    size="lg"
                                    className="w-full h-14 gap-3"
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : exportComplete ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                    {isExporting
                                        ? 'Generating PDF...'
                                        : exportComplete
                                            ? 'PDF Ready!'
                                            : 'Download PDF'
                                    }
                                </Button>

                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p className="flex items-center gap-2">
                                        <Check className="w-3 h-3 text-success" />
                                        ATS-readable text format
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Check className="w-3 h-3 text-success" />
                                        Standard letter size (8.5" x 11")
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Check className="w-3 h-3 text-success" />
                                        No signup required
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-3">Template</h3>
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="font-medium">{template?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {template?.atsScore}% ATS Score
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => setActiveStep('template')}
                            >
                                Change Template
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setActiveStep('edit')}
                        >
                            Edit Content
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setActiveStep('upload')}
                        >
                            Start Over
                        </Button>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                        <div className="bg-muted/50 p-2 text-center text-sm text-muted-foreground border-b">
                            Preview (actual PDF will be full resolution)
                        </div>
                        <div
                            ref={previewRef}
                            className="overflow-auto max-h-[800px] bg-muted/30 p-6"
                        >
                            <div className="transform-gpu origin-top-left" style={{ transform: 'scale(0.65)' }}>
                                <ResumePreview data={resumeData} template={selectedTemplate} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
