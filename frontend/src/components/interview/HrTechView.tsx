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
        <div className="h-full w-full p-4 overflow-hidden relative">
            <div className={cn(
                "grid gap-4 h-full w-full transition-all duration-500",
                showCodeEditor ? "grid-cols-2 grid-rows-2" : "grid-cols-1 lg:grid-cols-3 lg:grid-rows-1"
            )}>
                {/* 1. Sarah (HR) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-lg h-full w-full">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={isHrActive ? avatarState : 'idle'}
                            videoSet={hrVideos}
                            isActive={isHrActive}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <div className="bg-black/60 backdrop-blur px-3 py-2 rounded-lg text-white font-medium flex flex-col items-start min-w-[100px] border border-white/10">
                            <span className="text-sm font-bold leading-none mb-1">Sarah</span>
                            <span className="text-xs text-white/70 leading-none">HR Manager</span>
                        </div>
                    </div>
                    {isHrActive && avatarState === 'talking' && (
                        <div className="absolute top-4 right-4 z-10">
                            <SpeakingIndicator isActive={true} />
                        </div>
                    )}
                    {/* Subtitle for Sarah */}
                    {isHrActive && currentQ && (
                        <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center pointer-events-none">
                            <div className="bg-black/85 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10 text-center shadow-xl max-w-[95%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="text-sm md:text-base text-white/95 font-medium leading-relaxed tracking-wide">
                                    {showCodeEditor ? (
                                        (() => {
                                            const rawText = currentQ.text;
                                            const words = rawText.split(/\s+/).filter(Boolean);
                                            
                                            // More robust word tracking
                                            let charAcc = 0;
                                            let currentWordIndex = 0;
                                            for (let i = 0; i < words.length; i++) {
                                                const word = words[i];
                                                // Find actual start index of this word in raw text to handle double spaces etc
                                                const actualPos = rawText.indexOf(word, charAcc);
                                                if (spokenCharIndex >= actualPos) {
                                                    currentWordIndex = i;
                                                }
                                                charAcc = actualPos + word.length;
                                            }

                                            // Determine chunk (targeting 6 words approx)
                                            const chunkSize = 6;
                                            const chunkIndex = Math.floor(currentWordIndex / chunkSize);
                                            const start = chunkIndex * chunkSize;
                                            const end = Math.min(start + chunkSize, words.length);
                                            
                                            const chunkText = words.slice(start, end).join(' ');
                                            const hasPrefix = start > 0;
                                            const hasSuffix = end < words.length;

                                            return (
                                                <span className="inline-block transition-all duration-300">
                                                    {hasPrefix && <span className="text-white/40 mr-1">..</span>}
                                                    {chunkText}
                                                    {hasSuffix && <span className="text-white/40 ml-1">...</span>}
                                                </span>
                                            );
                                        })()
                                    ) : (
                                        `"${currentQ.text}"`
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. David (Tech) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-lg h-full w-full">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={!isHrActive ? avatarState : 'idle'}
                            videoSet={techVideos}
                            isActive={!isHrActive}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <div className="bg-black/60 backdrop-blur px-3 py-2 rounded-lg text-white font-medium flex flex-col items-start min-w-[100px] border border-white/10">
                            <span className="text-sm font-bold leading-none mb-1">David</span>
                            <span className="text-xs text-white/70 leading-none">Technical Lead</span>
                        </div>
                    </div>
                    {!isHrActive && avatarState === 'talking' && (
                        <div className="absolute top-4 right-4 z-10">
                            <SpeakingIndicator isActive={true} />
                        </div>
                    )}
                    {/* Subtitle for David */}
                    {!isHrActive && currentQ && (
                        <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center pointer-events-none">
                            <div className="bg-black/85 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10 text-center shadow-xl max-w-[95%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="text-sm md:text-base text-white/95 font-medium leading-relaxed tracking-wide">
                                    {showCodeEditor ? (
                                        (() => {
                                            const rawText = currentQ.text;
                                            const words = rawText.split(/\s+/).filter(Boolean);
                                            
                                            let charAcc = 0;
                                            let currentWordIndex = 0;
                                            for (let i = 0; i < words.length; i++) {
                                                const word = words[i];
                                                const actualPos = rawText.indexOf(word, charAcc);
                                                if (spokenCharIndex >= actualPos) {
                                                    currentWordIndex = i;
                                                }
                                                charAcc = actualPos + word.length;
                                            }

                                            const chunkSize = 6;
                                            const chunkIndex = Math.floor(currentWordIndex / chunkSize);
                                            const start = chunkIndex * chunkSize;
                                            const end = Math.min(start + chunkSize, words.length);
                                            
                                            const chunkText = words.slice(start, end).join(' ');
                                            const hasPrefix = start > 0;
                                            const hasSuffix = end < words.length;

                                            return (
                                                <span className="inline-block transition-all duration-300">
                                                    {hasPrefix && <span className="text-white/40 mr-1">..</span>}
                                                    {chunkText}
                                                    {hasSuffix && <span className="text-white/40 ml-1">...</span>}
                                                </span>
                                            );
                                        })()
                                    ) : (
                                        `"${currentQ.text}"`
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. User Video */}
                <div className={cn("bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-lg h-full w-full", showCodeEditor ? "col-span-2" : "")}>
                    {isVideoOn ? <UserVideoPreview isVideoOn={isVideoOn} /> : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center">
                                <VideoOff className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">Camera Off</p>
                            </div>
                        </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <div className={cn("px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md shadow-lg border border-white/10 transition-all duration-300",
                            isListening ? "bg-red-500 text-white animate-pulse" : "bg-black/60 text-white/80")}>
                            <div className={cn("w-2 h-2 rounded-full", isListening ? "bg-white" : "bg-white/50")} />
                            <span className="text-xs font-bold tracking-wider uppercase">{isListening ? "Recording" : "Standby"}</span>
                        </div>
                    </div>
                    
                    {/* Transcript overlay for User */}
                    <div className={cn("absolute bottom-28 left-4 right-4 flex justify-center z-20 pointer-events-none transition-all duration-300 transform",
                        currentTranscript ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                        <div className="bg-black/80 backdrop-blur-md text-white px-4 py-3 rounded-xl text-center shadow-lg max-w-[90%]">
                            <p className="text-sm font-medium leading-relaxed break-words">
                                {currentTranscript}
                            </p>
                        </div>
                    </div>

                    {/* Controls Overlay (now anchored inside the User Video box) */}
                    <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-end w-full px-4 pointer-events-none">
                        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-3xl border border-white/15 pointer-events-auto shadow-2xl scale-90 md:scale-100 max-w-full">
                    <Button
                        variant={isMicOn ? "default" : "destructive"}
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-xl transition-all hover:scale-110",
                            isMicOn ? "bg-white text-black hover:bg-slate-200" : "bg-red-500 text-white hover:bg-red-600",
                            avatarState === 'talking' && "opacity-50 grayscale cursor-not-allowed"
                        )}
                        onClick={() => setIsMicOn(!isMicOn)}
                        disabled={avatarState === 'talking'}
                        title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant={isVideoOn ? "secondary" : "destructive"}
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-xl transition-all hover:scale-110",
                            isVideoOn ? "bg-white/90 hover:bg-white text-black" : "bg-red-500/90 hover:bg-red-500 text-white")}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon"
                        className="w-14 h-14 mx-2 rounded-full shadow-2xl bg-red-600 hover:bg-red-700 border-2 border-red-800/20 text-white transition-all hover:scale-110"
                        onClick={onEndInterview}
                        title="End Interview"
                    >
                        <Phone className="w-6 h-6 fill-current" />
                    </Button>

                    <Button
                        variant="default"
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-xl transition-all hover:scale-110",
                            showCodeEditor
                                ? "bg-red-500 hover:bg-red-600 text-white border-2 border-red-400/50"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white")}
                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                        title={showCodeEditor ? "Close Code Editor" : "Open Code Editor"}
                    >
                        <Code className="w-5 h-5" />
                    </Button>

                    <Button
                        size="lg"
                        className={cn("rounded-full font-bold shadow-2xl transition-all duration-300 ml-2 h-12 px-6",
                            (currentTranscript || isListening)
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gray-500 text-gray-300 hover:bg-gray-500 pointer-events-none"
                        )}
                        onClick={onManualSubmit}
                        disabled={!currentTranscript && !isListening}
                    >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full overflow-hidden relative">
            <div className={cn(
                "h-full transition-all duration-700 ease-in-out flex gap-4 w-full",
                showCodeEditor ? "pr-[50%]" : "pr-0"
            )}>
                {/* Left Side: Videos (Full width when editor closed, 50% when open) */}
                <div className="h-full w-full flex-shrink-0 transition-all duration-700 ease-in-out">
                    {renderVideoGrid()}
                </div>

                {/* Right Side: Code Editor (Sliding in from right) */}
                <div className={cn(
                    "absolute top-0 right-0 h-full w-[calc(50%-0.5rem)] bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-700 ease-in-out transform",
                    showCodeEditor ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0 pointer-events-none"
                )}>
                    <CodeEditorPanel onSubmit={onCodeSubmit} question={currentQ?.codeTask || currentQ?.text} />
                </div>
            </div>
        </div>
    );
}
