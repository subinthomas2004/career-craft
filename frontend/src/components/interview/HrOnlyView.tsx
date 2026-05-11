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
    isMicOn: boolean;
    setIsMicOn: (val: boolean) => void;
    isVideoOn: boolean;
    setIsVideoOn: (val: boolean) => void;
    isListening: boolean;
    currentTranscript: string;
    onManualSubmit: () => void;
    onEndInterview: () => void;
}

export default function HrOnlyView({
    sessionState,
    avatarState,
    hrVideos,
    isMicOn,
    setIsMicOn,
    isVideoOn,
    setIsVideoOn,
    isListening,
    currentTranscript,
    onManualSubmit,
    onEndInterview
}: HrOnlyViewProps) {
    const currentQ = sessionState.currentQuestion;

    return (
        <div className="h-full flex flex-col items-center justify-center gap-8 p-6 bg-background/95">

            {/* Videos Row Container */}
            <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 w-full max-w-6xl flex-1 max-h-[50vh]">
                
                {/* Interviewer: Sarah (Smaller Box) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-2xl transition-all duration-300 flex-1 aspect-video lg:aspect-auto min-h-[250px]">
                    <div className="absolute inset-0 bg-black/10">
                        <AvatarPlayer
                            state={avatarState}
                            videoSet={hrVideos}
                            isActive={true}
                            className="w-full h-full object-cover opacity-100"
                        />
                    </div>
                    {/* Info Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                        <div className="bg-black/60 backdrop-blur rounded-lg p-3 border border-white/10 shadow-lg">
                            <p className="font-medium text-white text-sm">Sarah</p>
                            <p className="text-[10px] text-white/70 font-semibold uppercase">HR Manager</p>
                        </div>
                    </div>
                    {avatarState === 'talking' && (
                        <div className="absolute top-4 right-4 z-10">
                            <SpeakingIndicator isActive={true} />
                        </div>
                    )}

                    {/* Question Overlay - Subtitle Style */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
                        <div className="bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-xl w-full max-w-lg mx-auto transition-all animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-sm md:text-base text-white font-medium leading-tight text-center">
                                "{currentQ?.text}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Video (Smaller Box) */}
                <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden relative shadow-2xl transition-all duration-300 flex-1 aspect-video lg:aspect-auto min-h-[250px] group">
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

                    {/* Speaking Indicator (Top Right) */}
                    {isListening && (
                        <div className="absolute top-4 right-4 z-20">
                            <SpeakingIndicator isActive={true} />
                        </div>
                    )}

                    {/* Transcript Overlay - Subtitle Style (Matches Interviewer) */}
                    <div className={cn("absolute bottom-4 left-4 right-4 z-20 flex justify-center transition-all duration-300", 
                        currentTranscript ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
                        <div className="bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-xl w-full max-w-lg mx-auto">
                            <p className="text-sm md:text-base text-white font-medium leading-tight text-center">
                                {currentTranscript || " "}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Controls Overlay (Centered at bottom) */}
            <div className="flex justify-center items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap justify-center items-center gap-4 bg-card/90 backdrop-blur-2xl p-4 rounded-full border border-border shadow-2xl ring-1 ring-white/5">
                    {/* Mic Toggle */}
                    <Button
                        variant={isMicOn ? "outline" : "destructive"}
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-lg transition-all hover:scale-105",
                            isMicOn ? "hover:bg-accent" : "bg-red-500 text-white hover:bg-red-600",
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
                        variant={isVideoOn ? "outline" : "destructive"}
                        size="icon"
                        className={cn("w-12 h-12 rounded-full shadow-lg transition-all hover:scale-105",
                            isVideoOn ? "hover:bg-accent" : "bg-red-500 text-white hover:bg-red-600")}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <div className="w-px h-8 bg-border mx-1" />

                    {/* End Call */}
                    <Button
                        variant="destructive"
                        size="icon"
                        className="w-12 h-12 rounded-full shadow-lg bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
                        onClick={onEndInterview}
                        title="End Interview"
                    >
                        <Phone className="w-5 h-5" />
                    </Button>

                    {/* Submit Answer */}
                    <Button
                        size="lg"
                        className={cn("rounded-full font-semibold shadow-lg transition-all duration-300 ml-2 h-12 px-6 group/btn hover:scale-105",
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
}
