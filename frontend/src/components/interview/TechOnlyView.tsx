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
        <div className="h-full grid lg:grid-cols-5 gap-4">
            {/* Interviewer Column (Left) — David (80%) */}
            <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-lg transition-all duration-300 flex-1 h-full">
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
                        <div className="bg-black/60 backdrop-blur rounded-lg p-3 border border-white/10">
                            <p className="font-medium text-white">David</p>
                            <p className="text-xs text-white/70">Technical Lead</p>
                        </div>
                    </div>
                    {avatarState === 'talking' && (
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
                            <SpeakingIndicator isActive={true} />
                        </div>
                    )}

                    {/* Question Overlay */}
                    <div className="absolute bottom-20 left-6 right-6 z-10 flex justify-center">
                        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl max-w-xl text-center">
                            <p className="text-sm md:text-base text-white/95 font-medium leading-relaxed">"{currentQ?.text}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Column (Right) - Full Height Video (20%) */}
            <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                <div className="bg-card rounded-2xl border border-border overflow-hidden relative flex-1 shadow-2xl h-full group">
                    {isVideoOn ? <UserVideoPreview isVideoOn={isVideoOn} /> : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center">
                                <VideoOff className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">Camera Off</p>
                            </div>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className={cn("px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md shadow-lg border border-white/10 transition-all duration-300",
                            isListening ? "bg-red-500 text-white animate-pulse" : "bg-black/60 text-white/80")}>
                            <div className={cn("w-2 h-2 rounded-full", isListening ? "bg-white" : "bg-white/50")} />
                            <span className="text-xs font-bold tracking-wider uppercase">{isListening ? "Recording" : "Standby"}</span>
                        </div>
                    </div>

                    {/* Real-time Subtitles */}
                    <div className="absolute bottom-32 left-0 right-0 px-8 flex justify-center z-20 pointer-events-none">
                        <div className={cn("bg-black/70 backdrop-blur-md text-white px-6 py-4 rounded-2xl text-center shadow-2xl max-w-2xl transition-all duration-300 transform",
                            currentTranscript ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                            <p className="text-lg md:text-xl font-medium leading-relaxed">
                                {currentTranscript}
                            </p>
                        </div>
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-end w-full px-4 pointer-events-none">
                        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-3xl border border-white/15 pointer-events-auto shadow-2xl scale-90 md:scale-100 max-w-full">
                            {/* Mic Toggle */}
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

                            {/* Camera Toggle */}
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

                            {/* End Call */}
                            <Button
                                variant="destructive"
                                size="icon"
                                className="w-14 h-14 mx-2 rounded-full shadow-2xl bg-red-600 hover:bg-red-700 border-2 border-red-800/20 text-white transition-all hover:scale-110"
                                onClick={onEndInterview}
                                title="End Interview"
                            >
                                <Phone className="w-6 h-6 fill-current" />
                            </Button>

                            {/* Code Editor Toggle */}
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

                            {/* Submit Answer */}
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
                                Submit <ArrowRight className="w-4 h-4 ml-2" />
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
                {/* Left Side: Videos (Full width when closed, 50% when open) */}
                <div className="h-full w-full flex-shrink-0 transition-all duration-700 ease-in-out">
                    {renderMainView()}
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
