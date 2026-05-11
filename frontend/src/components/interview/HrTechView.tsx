import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone, ArrowRight, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import SpeakingIndicator from "@/components/interview/SpeakingIndicator";
import AvatarPlayer from "@/components/interview/AvatarPlayer";
import UserVideoPreview from "@/components/interview/UserVideoPreview";
import CodeEditorPanel from "@/components/interview/CodeEditorPanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { InterviewState } from "@/lib/interview/types";

interface HrTechViewProps {
    sessionState: InterviewState;
    avatarState: 'idle' | 'talking' | 'listening';
    hrVideos: any;
    techVideos: any;
    isMicOn: boolean;
    setIsMicOn: (val: boolean) => void;
    isVideoOn: boolean;
    setIsVideoOn: (val: boolean) => void;
    isListening: boolean;
    currentTranscript: string;
    onManualSubmit: () => void;
    onEndInterview: () => void;
    onCodeSubmit?: (code: string, language: string) => void;
    isCodeQuestion?: boolean;
    spokenCharIndex?: number;
}

export default function HrTechView({
    sessionState,
    avatarState,
    hrVideos,
    techVideos,
    isMicOn,
    setIsMicOn,
    isVideoOn,
    setIsVideoOn,
    isListening,
    currentTranscript,
    onManualSubmit,
    onEndInterview,
    onCodeSubmit,
    isCodeQuestion,
    spokenCharIndex = 0
}: HrTechViewProps) {
    const [showCodeEditor, setShowCodeEditor] = useState(false);

    // Auto-open code editor when David asks a coding question and close when not
    useEffect(() => {
        if (isCodeQuestion) {
            setShowCodeEditor(true);
        } else {
            setShowCodeEditor(false);
        }
    }, [isCodeQuestion]);

    const isHrActive = sessionState.currentInterviewer === 'hr_manager';
    const currentQ = sessionState.currentQuestion;

    const renderVideoGrid = () => (
        <div className="h-full flex flex-col w-full relative">
            {/* Scrollable Content Area (Scrolls if stacked height > screen height) */}
            <div className={cn(
                "flex-1 w-full overflow-y-auto overflow-x-hidden min-h-0 px-4 py-6 lg:px-6 flex flex-col items-center",
                showCodeEditor ? "justify-start" : "justify-center"
            )}>
                {/* 3-Box Container */}
                <div className={cn(
                    "grid gap-4 w-full transition-all duration-500 items-stretch",
                    showCodeEditor
                        ? "grid-cols-1 max-w-md" // Single narrow stack when code editor active
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl lg:h-[65vh]" // 3-wide row
                )}>
                    {/* 1. Sarah (HR) */}
                    <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-xl aspect-video lg:aspect-auto min-h-[180px]">
                        <div className="absolute inset-0 bg-black/10">
                            <AvatarPlayer
                                state={isHrActive ? avatarState : 'idle'}
                                videoSet={hrVideos}
                                isActive={isHrActive}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Sarah Label */}
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10 shadow-lg">
                                <span className="text-xs font-bold leading-none block">Sarah</span>
                                <span className="text-[10px] text-white/70 uppercase tracking-wider">HR Manager</span>
                            </div>
                        </div>
                        {/* Speaking Indicator Sarah */}
                        {isHrActive && avatarState === 'talking' && (
                            <div className="absolute top-3 right-3 z-20">
                                <SpeakingIndicator isActive={true} />
                            </div>
                        )}
                        {/* Subtitle Sarah */}
                        {isHrActive && currentQ && (
                            <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-center pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 shadow-xl w-full max-w-xs pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-xs font-medium text-white leading-snug text-center">
                                        "{currentQ.text}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. David (Tech) */}
                    <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-xl aspect-video lg:aspect-auto min-h-[180px]">
                        <div className="absolute inset-0 bg-black/10">
                            <AvatarPlayer
                                state={!isHrActive ? avatarState : 'idle'}
                                videoSet={techVideos}
                                isActive={!isHrActive}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* David Label */}
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10 shadow-lg">
                                <span className="text-xs font-bold leading-none block">David</span>
                                <span className="text-[10px] text-white/70 uppercase tracking-wider">Tech Lead</span>
                            </div>
                        </div>
                        {/* Speaking Indicator David */}
                        {!isHrActive && avatarState === 'talking' && (
                            <div className="absolute top-3 right-3 z-20">
                                <SpeakingIndicator isActive={true} />
                            </div>
                        )}
                        {/* Subtitle David */}
                        {!isHrActive && currentQ && (
                            <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-center pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 shadow-xl w-full max-w-xs pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-xs font-medium text-white leading-snug text-center">
                                        "{currentQ.text}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. User Video Preview */}
                    <div className={cn(
                        "bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-xl aspect-video lg:aspect-auto min-h-[180px]",
                        showCodeEditor ? "hidden lg:block" : ""
                    )}>
                        {isVideoOn ? <UserVideoPreview isVideoOn={isVideoOn} /> : (
                            <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <VideoOff className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-xs font-medium">Camera Off</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Candidate Label */}
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10 shadow-lg">
                                <span className="text-xs font-bold leading-none block">You</span>
                                <span className="text-[10px] text-white/70 uppercase tracking-wider">Candidate</span>
                            </div>
                        </div>

                        {/* Active User Speaking Indicator */}
                        {isListening && (
                            <div className="absolute top-3 right-3 z-20">
                                <SpeakingIndicator isActive={true} />
                            </div>
                        )}

                        {/* User Transcript Subtitles Overlay */}
                        <div className={cn(
                            "absolute bottom-3 left-3 right-3 z-30 flex justify-center transition-all duration-300 pointer-events-none",
                            currentTranscript ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        )}>
                            <div className="bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-white/10 shadow-xl w-full max-w-xs text-center">
                                <p className="text-xs font-medium leading-snug">
                                    {currentTranscript || " "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Central Floating Command Controls Dock - Fixed below scroll area */}
            <div className="w-full flex-shrink-0 flex justify-center items-center p-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap justify-center items-center gap-3 bg-card/90 backdrop-blur-2xl px-4 py-3 rounded-full border border-border shadow-xl ring-1 ring-white/5">
                    <Button
                        variant={isMicOn ? "outline" : "destructive"}
                        size="icon"
                        className={cn("w-11 h-11 rounded-full shadow transition-all hover:scale-105",
                            isMicOn ? "hover:bg-accent" : "bg-red-500 text-white hover:bg-red-600",
                            avatarState === 'talking' && "opacity-50 grayscale cursor-not-allowed"
                        )}
                        onClick={() => setIsMicOn(!isMicOn)}
                        disabled={avatarState === 'talking'}
                        title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant={isVideoOn ? "outline" : "destructive"}
                        size="icon"
                        className={cn("w-11 h-11 rounded-full shadow transition-all hover:scale-105",
                            isVideoOn ? "hover:bg-accent" : "bg-red-500 text-white hover:bg-red-600")}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <div className="w-px h-7 bg-border mx-1" />

                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-11 h-11 rounded-full shadow transition-all hover:scale-105",
                            showCodeEditor 
                                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent" 
                                : "hover:bg-accent text-foreground"
                        )}
                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                        title="Toggle Code Editor"
                    >
                        <Code className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon"
                        className="w-11 h-11 rounded-full shadow-md bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
                        onClick={onEndInterview}
                        title="End Interview"
                    >
                        <Phone className="w-5 h-5" />
                    </Button>

                    <Button
                        size="lg"
                        className={cn("rounded-full font-semibold shadow-md transition-all duration-300 ml-1 h-11 px-6 group/btn hover:scale-105",
                            (currentTranscript || isListening)
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-muted text-muted-foreground pointer-events-none"
                        )}
                        onClick={onManualSubmit}
                        disabled={!currentTranscript && !isListening}
                    >
                        Submit <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full overflow-hidden relative bg-background/95">
            <div className="h-full flex w-full overflow-hidden">
                {/* Videos Frame (Resizes automatically to leave space for code editor) */}
                <div className={cn(
                    "h-full flex-shrink-0 transition-all duration-500 ease-in-out",
                    showCodeEditor ? "w-full lg:w-[40%]" : "w-full"
                )}>
                    {renderVideoGrid()}
                </div>

                {/* Slide-in Code Editor Panel */}
                <div className={cn(
                    "absolute top-4 bottom-4 right-4 w-[calc(60%-2rem)] bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out transform flex flex-col z-50",
                    showCodeEditor ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0 pointer-events-none"
                )}>
                    <div className="p-3 bg-muted/50 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold tracking-tight">Code Workspace</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setShowCodeEditor(false)}>
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </Button>
                    </div>
                    <div className="flex-1 h-full w-full overflow-hidden">
                        <CodeEditorPanel onSubmit={onCodeSubmit} question={currentQ?.codeTask || currentQ?.text} />
                    </div>
                </div>
            </div>
        </div>
    );
}
