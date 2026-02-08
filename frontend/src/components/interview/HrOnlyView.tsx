import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SpeakingIndicator from "@/components/interview/SpeakingIndicator";
import AvatarPlayer from "@/components/interview/AvatarPlayer";
import UserVideoPreview from "@/components/interview/UserVideoPreview";
import { InterviewState, Question } from "@/lib/interview/types";

interface HrOnlyViewProps {
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
    selectedType: string;
}

export default function HrOnlyView({
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
    selectedType
}: HrOnlyViewProps) {
    const isHrActive = sessionState.currentInterviewer === 'hr_manager';
    const currentQ = sessionState.currentQuestion;

    return (
        <div className="h-full grid lg:grid-cols-3 gap-4">

            {/* Interviewers Column (Left) */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">

                {/* Interviewer 1 (Sarah) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-lg transition-all duration-300">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={isHrActive ? avatarState : 'idle'}
                            videoSet={hrVideos}
                            isActive={isHrActive}
                            className="w-full h-full object-cover opacity-100"
                        />
                    </div>
                    {/* Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                        <div className="bg-black/60 backdrop-blur rounded-lg p-3">
                            <p className="font-medium text-white">Sarah</p>
                            <p className="text-xs text-white/70">HR Manager</p>
                        </div>
                        {isHrActive && avatarState === 'talking' && (
                            <SpeakingIndicator isActive={true} />
                        )}
                    </div>
                    {/* Question Overlay */}
                    {isHrActive && (
                        <div className="absolute bottom-20 left-4 right-4 z-10 flex justify-center">
                            <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg max-w-[90%]">
                                <p className="text-sm text-white/90 font-medium text-center leading-snug">"{currentQ?.text}"</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Interviewer 2 (David) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-lg transition-all duration-300">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={!isHrActive ? avatarState : 'idle'}
                            videoSet={techVideos}
                            isActive={!isHrActive}
                            className="w-full h-full object-cover opacity-100"
                        />
                    </div>
                    {/* Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                        <div className="bg-black/60 backdrop-blur rounded-lg p-3">
                            <p className="font-medium text-white">David</p>
                            <p className="text-xs text-white/70">{selectedType === 'hr' ? 'HR Manager' : 'Technical Lead'}</p>
                        </div>
                        {!isHrActive && avatarState === 'talking' && (
                            <SpeakingIndicator isActive={true} />
                        )}
                    </div>
                    {/* Question Overlay */}
                    {!isHrActive && (
                        <div className="absolute bottom-20 left-4 right-4 z-10 flex justify-center">
                            <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg max-w-[90%]">
                                <p className="text-sm text-white/90 font-medium text-center leading-snug">"{currentQ?.text}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Column (Right) */}
            <div className="flex flex-col gap-4 h-full">
                {/* User Video Container */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden relative flex-1 shadow-lg min-h-[400px]">
                    {isVideoOn ? <UserVideoPreview isVideoOn={isVideoOn} /> : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-2"><VideoOff className="w-8 h-8 text-muted-foreground" /></div>
                                <p className="text-muted-foreground">Camera Off</p>
                            </div>
                        </div>
                    )}
                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className={cn("rounded-full px-3 py-1 flex items-center gap-2 backdrop-blur-md shadow-sm border border-white/10", isListening ? "bg-green-500/90 text-white" : "bg-black/60 text-white/80")}>
                            <div className={cn("w-2 h-2 rounded-full", isListening ? "bg-white animate-pulse" : "bg-red-500")} />
                            <span className="text-xs font-medium">{isListening ? "Listening..." : "Processing"}</span>
                        </div>
                    </div>
                    {/* Real-time Subtitles */}
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center z-20 pointer-events-none">
                        <div className="bg-black/75 backdrop-blur-md text-white px-6 py-3 rounded-xl text-center shadow-2xl max-w-[95%] transition-all duration-300">
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Live Transcript</p>
                            <p className="text-base md:text-lg font-medium leading-relaxed">{currentTranscript || (isListening ? "Listening..." : "...")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6 mb-4 gap-4">
                    {!isListening && (
                        <Button
                            size="lg"
                            className="px-8 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-xl transition-all min-w-[200px]"
                            onClick={setIsMicOn.bind(null, true) /* Triggers effect to start */}
                            disabled={avatarState === 'talking'}
                        >
                            <Mic className="w-6 h-6 mr-2" /> Start Answer
                        </Button>
                    )}
                    <Button size="lg" className={cn("px-12 h-14 rounded-full font-bold text-xl shadow-xl transition-all min-w-[300px]", isListening ? "bg-green-600 hover:bg-green-700 text-white" : "bg-muted text-muted-foreground")} onClick={onManualSubmit} disabled={!currentTranscript && !isListening}>
                        Submit Answer <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                </div>

                {/* Controls */}
                <div className="bg-black/20 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-6 max-w-[380px] w-full mx-auto transition-all hover:bg-black/30 hover:shadow-green-900/10 hover:border-white/20">
                    {/* ... (Controls) ... */}
                    <Button
                        variant={isMicOn ? "secondary" : "destructive"}
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                            isMicOn ? "bg-white/90 hover:bg-white text-black" : "bg-red-500/90 hover:bg-red-500",
                            avatarState === 'talking' && "opacity-50 grayscale cursor-not-allowed hover:scale-100"
                        )}
                        onClick={() => setIsMicOn(!isMicOn)}
                        disabled={avatarState === 'talking'}
                        title="Toggle Microphone"
                    >
                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    <Button variant={isVideoOn ? "secondary" : "destructive"} size="icon" className={cn("w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110", isVideoOn ? "bg-white/90 hover:bg-white text-black" : "bg-red-500/90 hover:bg-red-500")} onClick={() => setIsVideoOn(!isVideoOn)} title="Toggle Camera">
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                    <div className="w-px h-8 bg-white/20 mx-2" />
                    <Button variant="destructive" size="icon" className="w-14 h-14 rounded-full shadow-lg bg-red-600 hover:bg-red-500 transition-all duration-300 hover:scale-110 ring-4 ring-transparent hover:ring-red-500/20" onClick={onEndInterview} title="End Interview">
                        <Phone className="w-6 h-6 fill-current text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
