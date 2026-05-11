import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
            const originalElement = document.getElementById('resume-preview');
            if (!originalElement) {
                throw new Error('Resume preview not found');
            }

            // 1. Create a pristine clone for perfect capturing (removes visual scale artifacts)
            const clone = originalElement.cloneNode(true) as HTMLElement;
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.left = '-9999px';
            clone.style.zoom = '1'; // Reset scale factor to ensure 1:1 capture
            clone.style.transform = 'none';
            clone.style.boxShadow = 'none'; // Remove shadow for cleaner PDF
            
            document.body.appendChild(clone);

            // 2. Wait briefly for renderer stability
            await new Promise(resolve => setTimeout(resolve, 100));

            // Use html2canvas to capture pristine high resolution snapshot
            const canvas = await html2canvas(clone, {
                scale: 2, // Render at double resolution for sharp printing
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
                windowWidth: clone.scrollWidth,
                windowHeight: clone.scrollHeight
            });

            // 3. Cleanup the hidden cloned element
            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            
            // Letter size standard dimensions in points (72 DPI)
            // Letter: 8.5 x 11 inches => 612 x 792 pts
            const pdf = new jsPDF('p', 'pt', 'letter');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = pdfWidth / imgWidth;
            
            const imgScaledHeight = imgHeight * ratio;
            
            let heightLeft = imgScaledHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgScaledHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            // Add consecutive pages if the resume spans multiple letter pages
            while (heightLeft >= 0) {
                position = heightLeft - imgScaledHeight; // Shifts to top of next "slice"
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgScaledHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            const name = resumeData.contact.name || 'resume';
            const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            pdf.save(`${safeName}_resume.pdf`);

            setExportComplete(true);
            toast({
                title: 'Resume Downloaded Successfully',
                description: 'The PDF file is saved to your downloads.',
            });

            setTimeout(() => setExportComplete(false), 3000);
        } catch (error) {
            console.error('Export error:', error);
            toast({
                title: 'Export failed',
                description: 'There was an error generating the PDF. Please try again.',
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
                            <div className="flex justify-center">
                                <ResumePreview data={resumeData} template={selectedTemplate} scale={0.65} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
