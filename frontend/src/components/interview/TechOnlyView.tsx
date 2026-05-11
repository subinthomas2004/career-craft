import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone, ArrowRight, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import SpeakingIndicator from "@/components/interview/SpeakingIndicator";
import AvatarPlayer from "@/components/interview/AvatarPlayer";
import UserVideoPreview from "@/components/interview/UserVideoPreview";
import CodeEditorPanel from "@/components/interview/CodeEditorPanel";
import { InterviewState } from "@/lib/interview/types";

interface TechOnlyViewProps {
    sessionState: InterviewState;
    avatarState: 'idle' | 'talking' | 'listening';
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

export default function TechOnlyView({
    sessionState,
    avatarState,
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
}: TechOnlyViewProps) {
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const currentQ = sessionState.currentQuestion;

    // Auto-open code editor when David asks a coding question and close when not
    useEffect(() => {
        if (isCodeQuestion) {
            setShowCodeEditor(true);
        } else {
            setShowCodeEditor(false);
        }
    }, [isCodeQuestion]);

    const renderMainView = () => (
        <div className="h-full flex flex-col w-full relative">
            {/* Scrollable Container for Videos */}
            <div className={cn(
                "flex-1 w-full overflow-y-auto overflow-x-hidden min-h-0 px-4 py-6 lg:px-6 flex flex-col items-center",
                showCodeEditor ? "justify-start" : "justify-center"
            )}>
                {/* Videos Row Container */}
                <div className={cn(
                    "flex gap-6 w-full transition-all duration-500 items-stretch flex-1",
                    showCodeEditor 
                        ? "flex-col max-w-md max-h-none" // Vertically stack and narrow down when editor open
                        : "flex-col lg:flex-row justify-center max-w-6xl lg:h-[65vh]" // Standard size
                )}>
                    
                    {/* Interviewer: David */}
                    <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-2xl transition-all duration-300 flex-1 aspect-video lg:aspect-auto min-h-[220px]">
                        <div className="absolute inset-0 bg-black/10">
                            <AvatarPlayer
                                state={avatarState}
                                videoSet={techVideos}
                                isActive={true}
                                className="w-full h-full object-cover opacity-100"
                            />
                        </div>
                        {/* Info Overlay */}
                        <div className="absolute top-4 left-4 z-10">
                            <div className="bg-black/60 backdrop-blur rounded-lg p-3 border border-white/10 shadow-lg">
                                <p className="font-medium text-white text-sm">David</p>
                                <p className="text-[10px] text-white/70 font-semibold uppercase">Technical Lead</p>
                            </div>
                        </div>
                        
                        {avatarState === 'talking' && (
                            <div className="absolute top-4 right-4 z-10">
                                <SpeakingIndicator isActive={true} />
                            </div>
                        )}

                        {/* Question Overlay - Subtitle Style (Inside Avatar Card) */}
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
                            <div className="bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-xl w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 pointer-events-auto">
                                <p className="text-sm text-white font-medium leading-snug text-center">
                                    "{currentQ?.text}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Video */}
                    <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-2xl transition-all duration-300 flex-1 aspect-video lg:aspect-auto min-h-[220px] group">
                        {isVideoOn ? (
                            <div className="w-full h-full relative">
                                <UserVideoPreview isVideoOn={isVideoOn} />
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                <div className="text-center">
                                    <VideoOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm font-medium">Camera Off</p>
                                </div>
                            </div>
                        )}

                        {/* Info Overlay */}
                        <div className="absolute top-4 left-4 z-10">
                            <div className="bg-black/60 backdrop-blur rounded-lg p-3 border border-white/10 shadow-lg">
                                <p className="font-medium text-white text-sm">You</p>
                                <p className="text-[10px] text-white/70 font-semibold uppercase">Candidate</p>
                            </div>
                        </div>

                        {/* Speaking Indicator */}
                        {isListening && (
                            <div className="absolute top-4 right-4 z-20">
                                <SpeakingIndicator isActive={true} />
                            </div>
                        )}

                        {/* Transcript Overlay */}
                        <div className={cn("absolute bottom-4 left-4 right-4 z-20 flex justify-center transition-all duration-300", 
                            currentTranscript ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
                            <div className="bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-xl w-full max-w-lg mx-auto">
                                <p className="text-sm text-white font-medium leading-snug text-center">
                                    {currentTranscript || " "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Dock - Fixed below scrollable area */}
            <div className="w-full flex-shrink-0 flex justify-center items-center p-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap justify-center items-center gap-3 bg-card/90 backdrop-blur-2xl px-4 py-3 rounded-full border border-border shadow-2xl ring-1 ring-white/5">
                    
                    <Button
                        variant={isMicOn ? "outline" : "destructive"}
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-md transition-all hover:scale-105",
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
                        className={cn("w-12 h-12 rounded-full shadow-md transition-all hover:scale-105",
                            isVideoOn ? "hover:bg-accent" : "bg-red-500 text-white hover:bg-red-600")}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <div className="w-px h-8 bg-border mx-1" />

                    {/* Code Editor Toggle Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-md transition-all hover:scale-105",
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
                        className="w-12 h-12 rounded-full shadow-md bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
                        onClick={onEndInterview}
                        title="End Interview"
                    >
                        <Phone className="w-5 h-5" />
                    </Button>

                    <Button
                        size="lg"
                        className={cn("rounded-full font-semibold shadow-md transition-all duration-300 ml-1 h-12 px-6 group/btn hover:scale-105",
                            (currentTranscript || isListening)
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-muted text-muted-foreground pointer-events-none"
                        )}
                        onClick={onManualSubmit}
                        disabled={!currentTranscript && !isListening}
                    >
                        Submit <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full overflow-hidden relative bg-background/95">
            <div className="h-full flex w-full overflow-hidden">
                {/* Main Interface (Resizes to 40% when editor is open) */}
                <div className={cn(
                    "h-full flex-shrink-0 transition-all duration-500 ease-in-out",
                    showCodeEditor ? "w-full lg:w-[40%]" : "w-full"
                )}>
                    {renderMainView()}
                </div>

                {/* Right Side: Code Editor (Sliding in from right) */}
                <div className={cn(
                    "absolute top-4 bottom-4 right-4 w-[calc(60%-2rem)] bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out transform flex flex-col z-50",
                    showCodeEditor ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0 pointer-events-none"
                )}>
                    <div className="p-3 bg-muted/50 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold tracking-tight">Code Editor</span>
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
