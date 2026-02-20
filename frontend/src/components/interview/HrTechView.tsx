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
    isCodeQuestion
}: HrTechViewProps) {
    const [showCodeEditor, setShowCodeEditor] = useState(false);

    // Auto-open code editor when David asks a coding question
    useEffect(() => {
        if (isCodeQuestion) {
            setShowCodeEditor(true);
        }
    }, [isCodeQuestion]);

    const isHrActive = sessionState.currentInterviewer === 'hr_manager';
    const currentQ = sessionState.currentQuestion;

    const renderVideoGrid = (showToggle = false) => (
        <div className="h-full w-full p-4 overflow-hidden">
            {/* 2x2 Grid Layout for Single Screen Experience */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">

                {/* 1. Top Left: Sarah (HR) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-xl border border-border/40 overflow-hidden relative shadow-lg h-full w-full">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={isHrActive ? avatarState : 'idle'}
                            videoSet={hrVideos}
                            isActive={isHrActive}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                        <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-white font-medium flex flex-col items-start min-w-[100px]">
                            <span className="text-xs font-bold leading-none mb-0.5">Sarah</span>
                            <span className="text-[10px] text-white/70 leading-none">HR Manager</span>
                        </div>
                        {isHrActive && avatarState === 'talking' && <SpeakingIndicator isActive={true} />}
                    </div>
                </div>

                {/* 2. Top Right: David (Tech) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-xl border border-border/40 overflow-hidden relative shadow-lg h-full w-full">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={!isHrActive ? avatarState : 'idle'}
                            videoSet={techVideos}
                            isActive={!isHrActive}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                        <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-white font-medium flex flex-col items-start min-w-[100px]">
                            <span className="text-xs font-bold leading-none mb-0.5">David</span>
                            <span className="text-[10px] text-white/70 leading-none">Technical Lead</span>
                        </div>
                        {!isHrActive && avatarState === 'talking' && <SpeakingIndicator isActive={true} />}
                    </div>
                </div>

                {/* 3. Bottom Left: User Video */}
                <div className="bg-card/70 backdrop-blur-xl rounded-xl border border-border/40 overflow-hidden relative shadow-lg h-full w-full">
                    {isVideoOn ? <UserVideoPreview isVideoOn={isVideoOn} /> : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <VideoOff className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <div className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border border-white/5 shadow-sm backdrop-blur-md",
                            isListening ? "bg-green-500/90 text-white" : "bg-black/60 text-white/80")}>
                            <div className={cn("w-2 h-2 rounded-full", isListening ? "bg-white animate-pulse" : "bg-white/50")} />
                            {isListening ? "LISTENING" : "WAITING"}
                        </div>
                    </div>
                </div>

                {/* 4. Bottom Right: Admin/Info Panel */}
                <div className="flex flex-col gap-3 h-full w-full overflow-hidden">

                    {/* A. Question Display (Flex-1 to take available space) */}
                    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5 flex-1 overflow-y-auto shadow-inner min-h-0">
                        <p className="text-white/90 text-sm font-medium leading-relaxed">
                            {currentQ?.text || "Waiting for question..."}
                        </p>
                        {currentQ && (
                            <p className="text-[10px] text-white/50 mt-2 uppercase tracking-wider">
                                — {isHrActive ? 'Sarah (HR)' : 'David (Tech)'}
                            </p>
                        )}
                    </div>

                    {/* B. Transcript (Single line or two) */}
                    <div className="bg-black/40 backdrop-blur px-3 py-2 rounded-xl border border-white/5 text-center flex-shrink-0">
                        <p className="text-xs text-white/70 truncate max-w-full italic">{currentTranscript || "(Listening for answer...)"}</p>
                    </div>

                    {/* C. Controls Row */}
                    <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-lg flex-shrink-0">
                        <div className="flex flex-wrap gap-1.5 items-center">
                            <Button
                                variant={isMicOn ? "secondary" : "destructive"}
                                size="icon"
                                onClick={() => setIsMicOn(!isMicOn)}
                                disabled={avatarState === 'talking'}
                                className={cn("h-8 w-8 rounded-lg", avatarState === 'talking' && "opacity-50 cursor-not-allowed")}
                            >
                                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                            </Button>
                            <Button variant={isVideoOn ? "secondary" : "destructive"} size="icon" onClick={() => setIsVideoOn(!isVideoOn)} className="h-8 w-8 rounded-lg">
                                {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                            </Button>

                            {/* Toggle Editor Button */}
                            {showToggle && (
                                <Button
                                    variant="default"
                                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                                    className={cn("h-8 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:scale-105",
                                        showCodeEditor
                                            ? "bg-red-500 hover:bg-red-600 text-white border-none"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-white/10")}
                                    title="Toggle Code Editor"
                                >
                                    <Code className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide hidden sm:inline">{showCodeEditor ? "Close" : "Editor"}</span>
                                </Button>
                            )}
                        </div>
                        <Button variant="destructive" size="icon" onClick={onEndInterview} className="h-8 w-8 rounded-lg hover:bg-red-600">
                            <Phone className="w-3.5 h-3.5 fill-current" />
                        </Button>
                    </div>

                    {/* D. Submit Button */}
                    {/* D. Submit Button / Start Button */}
                    <div className="flex gap-2 shrink-0">
                        {!isListening && (
                            <Button
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg text-sm h-10 rounded-xl"
                                onClick={setIsMicOn.bind(null, true)}
                                disabled={avatarState === 'talking'}
                            >
                                <Mic className="w-4 h-4 mr-2" /> Start Record
                            </Button>
                        )}
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 font-bold text-white shadow-lg text-sm h-10 rounded-xl" onClick={onManualSubmit} disabled={!currentTranscript && !isListening}>
                            Submit <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );

    return (
        <div className="h-full w-full overflow-hidden">
            {showCodeEditor ? (
                // SPLIT VIEW (Active Editor - Fixed 50/50 Split)
                <div className="h-full grid grid-cols-2 gap-4">
                    {/* Left Side: Videos (Reuses the 2x2 grid layout) */}
                    <div className="h-full overflow-hidden bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                        {renderVideoGrid(true)}
                    </div>

                    {/* Right Side: Code Editor (Full height) */}
                    <div className="h-full overflow-hidden bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                        <CodeEditorPanel onSubmit={onCodeSubmit} question={currentQ?.text} />
                    </div>
                </div>
            ) : (
                // FULL VIDEO GRID (Hidden Editor)
                // Uses the exact same 2x2 grid, just filling the screen
                <div className="h-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl">
                    {renderVideoGrid(true)}
                </div>
            )}
        </div>
    );
}
