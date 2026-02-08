import React, { useState, useEffect } from 'react';
import { Download, Eye, Palette, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResume } from '@/context/ResumeContext';
import { ResumePreview } from './ResumePreview';
import { ResumeEditor } from './ResumeEditor';
import { cn } from '@/lib/utils';

export function ResumeBuilder() {
    const { resumeData, selectedTemplate, setActiveStep } = useResume();
    const [showPreview, setShowPreview] = useState(true);
    const [scale, setScale] = useState(0.6);

    // Auto-adjust scale based on window width on mount
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) { // xl
                setScale(0.5);
            } else if (window.innerWidth < 1536) { // 2xl
                setScale(0.6);
            } else {
                setScale(0.75);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleExport = () => {
        setActiveStep('export');
    };

    const handleBack = () => {
        setActiveStep('template');
    };

    const PREVIEW_WIDTH_IN = 8.5;
    const PREVIEW_HEIGHT_IN = 11;
    const PIXELS_PER_INCH = 96;

    // Calculate occupied dimensions to reserve proper layout space
    const scaledWidth = PREVIEW_WIDTH_IN * PIXELS_PER_INCH * scale;
    const scaledHeight = PREVIEW_HEIGHT_IN * PIXELS_PER_INCH * scale;

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Top toolbar */}
            <div className="bg-card border-b px-4 py-3 flex items-center justify-between shadow-sm z-10 relative">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to templates</span>
                    </Button>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Template:</span>
                        <span className="text-sm font-medium capitalize bg-muted px-2 py-0.5 rounded text-foreground">{selectedTemplate}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center border rounded-md mr-2 bg-background">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(s => Math.max(0.3, s - 0.1))}>
                            <ZoomOut className="w-3 h-3" />
                        </Button>
                        <span className="text-xs w-12 text-center text-muted-foreground">{Math.round(scale * 100)}%</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(s => Math.min(1.5, s + 0.1))}>
                            <ZoomIn className="w-3 h-3" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveStep('template')}
                        className="gap-2"
                    >
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Change Template</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="gap-2 lg:hidden"
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Show Editor' : 'Show Preview'}
                    </Button>
                    <Button onClick={handleExport} className="gap-2 shadow-sm">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel - Scrollable Form */}
                <div className={cn(
                    "flex-1 border-r bg-background transition-all duration-300",
                    !showPreview ? "w-full" : "hidden lg:block lg:w-1/2 xl:w-[45%]"
                )}>
                    <ScrollArea className="h-full">
                        <div className="p-6 max-w-2xl mx-auto">
                            <ResumeEditor />
                        </div>
                    </ScrollArea>
                </div>

                {/* Preview Panel - Fixed/Sticky or Scrollable */}
                <div className={cn(
                    "flex-1 bg-muted/30 overflow-hidden relative transition-all duration-300",
                    showPreview ? "w-full lg:block lg:w-1/2 xl:w-[55%]" : "hidden"
                )}>
                    <ScrollArea className="h-full w-full">
                        <div className="min-h-full flex items-start justify-center p-8">
                            <div
                                className="shadow-2xl bg-white transition-all duration-300 ease-in-out"
                                style={{
                                    width: scaledWidth,
                                    height: scaledHeight,
                                    // This wrapper ensures the layout reserves exactly the scaled size
                                }}
                            >
                                {/* 
                                    We use the 'scale' property of ResumePreview which uses 'transform: scale()' 
                                    and 'transform-origin: top left'.
                                    Since we wrapped it in a div of correct scaled size, it fits perfectly.
                                */}
                                <div style={{ width: '8.5in', height: '11in' }}>
                                    <ResumePreview
                                        data={resumeData}
                                        template={selectedTemplate}
                                        scale={scale}
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
