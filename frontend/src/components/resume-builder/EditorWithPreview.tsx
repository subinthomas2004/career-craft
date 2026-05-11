import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResume } from '@/context/ResumeContext';
import { ResumePreview } from './ResumePreview';
import { ResumeEditor } from './ResumeEditor';

export function EditorWithPreview() {
    const { resumeData, selectedTemplate, analyzeCurrentResume, setActiveStep } = useResume();

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Editor Panel */}
            <div className="order-2 lg:order-1">
                <ScrollArea className="h-full pr-4">
                    <ResumeEditor />
                </ScrollArea>
            </div>

            {/* Preview Panel */}
            <div className="order-1 lg:order-2">
                <Card className="h-full overflow-hidden sticky top-0">
                    <div className="bg-muted/50 p-2 text-center text-sm text-muted-foreground border-b flex items-center justify-center gap-4">
                        <span>Live Preview</span>
                        <span className="text-xs">•</span>
                        <span className="capitalize">{selectedTemplate} Template</span>
                    </div>
                    <CardContent className="p-4 overflow-auto h-[calc(100%-40px)] bg-muted/30">
                        <div className="flex justify-center">
                            <ResumePreview data={resumeData} template={selectedTemplate} scale={0.48} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
