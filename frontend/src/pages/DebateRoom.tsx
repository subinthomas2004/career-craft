import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, MicOff, ArrowLeft, StopCircle, Trophy, History, PanelRightClose, PanelRightOpen, ChevronRight, User, Bot, Video, VideoOff } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HourglassTimer } from '@/components/debate/HourglassTimer';

interface TranscriptItem {
    speaker: 'User' | 'AI';
    text: string;
    timestamp: string;
}

const DebateRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, stance, timeLimit = 5 } = location.state || {}; // timeLimit in minutes, default to 5

    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [userInput, setUserInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert minutes to seconds
    const [aiSpeaking, setAiSpeaking] = useState(false);

    // UI State
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

    // Video State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraPermitted, setCameraPermitted] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    // Voice Interaction State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!topic) {
            toast.error("No topic selected.");
            navigate('/dashboard/debate/topic');
            return;
        }

        // Random Start Logic
        const shouldAiStart = Math.random() > 0.5;
        if (shouldAiStart) {
            triggerAiOpening();
        } else {
            toast.info("You start! Make your opening statement.");
        }
    }, [topic, navigate]);

    const triggerAiOpening = async () => {
        try {
            setProcessing(true);
            setAiSpeaking(true);
            const aiStance = stance === 'Pro' ? 'Con' : 'Pro';

            // Artificial delay for realism
            await new Promise(r => setTimeout(r, 1500));

            const res = await api.post('/groq/debate/response', {
                topic,
                aiStance,
                userStance: stance,
                context: "The debate is just starting. You are making the opening statement.",
                userMsg: "(Waiting for opening statement)"
            });

            const aiResponse = res.data.response;
            addTranscriptItem('AI', aiResponse);
            speakText(aiResponse);
        } catch (err) {
            console.error("AI Start Error:", err);
            toast.error("AI couldn't start, please go first.");
            setAiSpeaking(false);
        } finally {
            setProcessing(false);
        }
    };

    // Camera Init
    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setStream(mediaStream);
                setCameraPermitted(true);
            } catch (err) {
                console.error("Camera access denied:", err);
                toast.error("Camera access required for the debate experience.");
                setCameraPermitted(false);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
                toast.info(videoTrack.enabled ? "Camera On" : "Camera Off");
            }
        }
    };

    // Timer Logic
    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleEndDebate();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript, isTranscriptOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const speakText = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;

        utterance.onstart = () => setAiSpeaking(true);
        utterance.onend = () => setAiSpeaking(false);
        utterance.onerror = () => setAiSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    // Interruption Logic
    useEffect(() => {
        let interruptionTimer: NodeJS.Timeout;
        if (isListening && !aiSpeaking) {
            interruptionTimer = setTimeout(() => {
                toast.warning("AI is interrupting!");
                handleInterruption();
            }, 45000); // 45 seconds limit
        }
        return () => clearTimeout(interruptionTimer);
    }, [isListening, aiSpeaking]);

    const handleInterruption = () => {
        stopListening();
        // Trigger immediate response with interruption flag
        handleUserSubmit(true);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        if (recognitionRef.current && isListening) return;

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true; // Keep listening until stopped manually
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            toast.success("Listening...");
        };

        recognition.onend = () => {
            // Auto-restart if we didn't explicitly stop it (and debate is active)
            // But for this simple implementation, we'll just let it stop or require toggling
            // Actually, continuous=true should handle most pauses.
            // If it stops due to silence, let's keep state somewhat clearer:
            // setIsListening(false); 
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setUserInput((prev) => prev + (prev ? ' ' : '') + finalTranscript);
            }
        };

        try {
            recognition.start();
        } catch (err) {
            console.error(err);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const toggleMic = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const handleUserSubmit = async (isInterruption = false) => {
        if (!userInput.trim() && !isInterruption) return;

        const userMsg = userInput || "(User was interrupted)";
        setUserInput('');
        addTranscriptItem('User', userMsg);
        setProcessing(true);

        // Stop listening while AI thinks/speaks to avoid picking up AI voice
        if (isListening) stopListening();

        try {
            const aiStance = stance === 'Pro' ? 'Con' : 'Pro';
            const context = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
            const interruptionContext = isInterruption ? " [SYSTEM: AI INTERRUPTED USER DUE TO TIME LIMIT. BE ASSERTIVE.]" : "";

            const res = await api.post('/groq/debate/response', {
                topic,
                aiStance,
                userStance: stance,
                context: context + interruptionContext,
                userMsg
            });

            const aiResponse = res.data.response;
            addTranscriptItem('AI', aiResponse);
            speakText(aiResponse);

        } catch (error) {
            console.error("AI Error:", error);
            toast.error("AI failed to respond. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const addTranscriptItem = (speaker: 'User' | 'AI', text: string) => {
        setTranscript(prev => [...prev, {
            speaker,
            text,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const handleEndDebate = () => {
        setIsActive(false);
        window.speechSynthesis.cancel();
        stopListening();
        toast.info("Debate ended. Generating report...");
        navigate('/dashboard/debate/report', {
            state: { transcript, topic, stance }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-background p-4 gap-4 max-w-[1800px] mx-auto overflow-hidden">

            {/* Header Status Bar (Compact) */}
            <div className="relative flex flex-nowrap items-center justify-between bg-card/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-border shadow-sm z-20 shrink-0 gap-4">

                {/* Left: Back Button */}
                <div className="flex items-center gap-3 shrink-0 z-10">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/debate/topic')} className="rounded-full hover:bg-muted">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </div>

                {/* Center: Topic & Stance (Absolute Centered) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-20">
                    <div className="pointer-events-auto flex flex-col items-center max-w-full">
                        <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center w-full leading-tight tracking-tight" title={topic}>
                            {topic}
                        </h1>
                        <div className="flex items-center gap-3 text-sm mt-2">
                            <span className={cn("px-3 py-1 rounded-full font-bold bg-muted/50 border backdrop-blur-sm shadow-sm")}>
                                You: <span className={stance === 'Pro' ? "text-emerald-600" : "text-rose-600"}>{stance}</span>
                            </span>
                            <span className="text-muted-foreground font-semibold">vs</span>
                            <span className={cn("px-3 py-1 rounded-full font-bold bg-muted/50 border backdrop-blur-sm shadow-sm")}>
                                AI: <span className={stance === 'Pro' ? "text-rose-600" : "text-emerald-600"}>{stance === 'Pro' ? 'Con' : 'Pro'}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                        className={cn("hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground", isTranscriptOpen && "bg-muted")}
                    >
                        {isTranscriptOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                        <span className="text-xs font-medium">{isTranscriptOpen ? "Hide" : "Transcript"}</span>
                    </Button>
                    <div className="flex items-center gap-4 pl-4 border-l border-border/50">
                        <HourglassTimer timeLeft={timeLeft} totalTime={timeLimit * 60} />
                        <Button variant="destructive" size="icon" onClick={handleEndDebate} className="rounded-full w-10 h-10 shadow-lg hover:bg-red-600 transition-all" title="End Debate">
                            <StopCircle className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content: Split Screen Layout */}
            <div className="flex gap-4 flex-1 min-h-0 relative">

                {/* Visual Stage */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-0">

                    {/* AI Opponent Box */}
                    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-border/50 shadow-inner relative overflow-hidden flex flex-col group">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat pointer-events-none" />

                        {/* Status Label */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", aiSpeaking ? "bg-green-500" : "bg-red-500")} />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Opponent</span>
                        </div>

                        {/* Central Visual */}
                        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
                            {/* Pulse Effect when speaking */}
                            {aiSpeaking && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                            )}

                            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800 border-4 border-slate-700/50 flex items-center justify-center shadow-2xl">
                                <Bot className={cn("w-16 h-16 transition-all duration-300", aiSpeaking ? "text-blue-400 scale-110" : "text-slate-500")} />
                            </div>

                            <div className="mt-6 text-center z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-200">AI Debater</h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium">
                                    {aiSpeaking ? "Arguing..." : "Listening..."}
                                </p>
                            </div>
                        </div>

                        {/* AI Transcript Overlay (Optional - showing last line?) */}
                        {aiSpeaking && lastAiMessage(transcript) && (
                            <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur px-4 py-3 rounded-xl border border-white/10 text-center">
                                <p className="text-sm text-slate-200 line-clamp-2 italic">"{lastAiMessage(transcript)}"</p>
                            </div>
                        )}
                    </Card>

                    {/* User Camera Box */}
                    <Card className="bg-black border-border/50 shadow-inner relative overflow-hidden flex flex-col">

                        {/* Status Label */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur px-2 py-1 rounded-md">
                            <div className={cn("w-2 h-2 rounded-full", cameraPermitted && isVideoEnabled ? "bg-green-500" : "bg-red-500")} />
                            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">You</span>
                        </div>

                        {/* Video Feed */}
                        <div className="flex-1 relative bg-neutral-900 w-full h-full flex items-center justify-center overflow-hidden">
                            {cameraPermitted && isVideoEnabled ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transform -scale-x-100"
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center relative p-6">
                                    {/* Pulse Effect when speaking/listening */}
                                    {isListening && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                                    )}

                                    <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-neutral-800 border-4 border-neutral-700/50 flex items-center justify-center shadow-2xl">
                                        <User className={cn("w-16 h-16 transition-all duration-300", isListening ? "text-indigo-400 scale-110" : "text-neutral-500")} />
                                    </div>

                                    <div className="mt-6 text-center z-10">
                                        <h3 className="text-xl md:text-2xl font-bold text-neutral-200">You</h3>
                                        <p className="text-sm text-neutral-500 mt-1 font-medium">
                                            {isListening ? "Arguing..." : "Listening..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Mic Overlay */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 w-full max-w-sm px-4">

                                <Button
                                    size="icon"
                                    variant={isVideoEnabled ? "secondary" : "destructive"}
                                    onClick={toggleVideo}
                                    className={cn(
                                        "h-12 w-12 rounded-full shadow-lg border-2 border-transparent transition-all shrink-0",
                                        !isVideoEnabled && "shadow-red-500/20 border-red-500/50"
                                    )}
                                    title={isVideoEnabled ? "Turn Camera Off" : "Turn Camera On"}
                                >
                                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                </Button>

                                <div className="flex-1 relative">
                                    <Input
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder={isListening ? "Listening..." : "Type your argument..."}
                                        className="bg-black/60 border-white/10 text-white placeholder:text-white/40 backdrop-blur-md rounded-full pl-4 pr-12 h-12 focus-visible:ring-indigo-500"
                                        onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleUserSubmit(false)}
                                        disabled={!userInput.trim() || processing}
                                        className="absolute right-1 top-1 h-10 w-10 text-white hover:text-indigo-400 hover:bg-transparent"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>

                                <Button
                                    size="icon"
                                    variant={isListening ? "destructive" : "secondary"}
                                    onClick={toggleMic}
                                    className={cn(
                                        "h-12 w-12 rounded-full shadow-lg border-2 border-transparent transition-all shrink-0",
                                        isListening ? "animate-pulse shadow-red-500/20 border-red-500/50" : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                                    )}
                                    title={isListening ? "Stop Listening" : "Start Microphone"}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Transcript Panel (Collapsible) */}
                <AnimatePresence mode="wait">
                    {isTranscriptOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 350, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="h-full flex-shrink-0 border-l border-border bg-card/50 backdrop-blur"
                        >
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b border-border flex items-center justify-between">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <History className="w-4 h-4" /> Live Transcript
                                    </h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsTranscriptOpen(false)} className="h-8 w-8">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                                    <div className="space-y-4">
                                        {transcript.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground text-sm">
                                                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>Conversation history will appear here.</p>
                                            </div>
                                        )}
                                        {transcript.map((item, i) => (
                                            <div key={i} className={cn("flex flex-col gap-1 text-sm", item.speaker === 'User' ? "items-end" : "items-start")}>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                    {item.speaker} • {item.timestamp}
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-3 rounded-2xl max-w-[90%]",
                                                    item.speaker === 'User'
                                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                                        : "bg-muted text-foreground rounded-tl-none border border-border"
                                                )}>
                                                    {item.text}
                                                </div>
                                            </div>
                                        ))}
                                        {processing && (
                                            <div className="flex flex-col gap-1 items-start">
                                                <div className="px-4 py-3 bg-muted rounded-2xl rounded-tl-none border border-border flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-75" />
                                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-150" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper
function lastAiMessage(transcript: TranscriptItem[]) {
    const aiMsgs = transcript.filter(t => t.speaker === 'AI');
    return aiMsgs.length > 0 ? aiMsgs[aiMsgs.length - 1].text : null;
}

export default DebateRoom;
