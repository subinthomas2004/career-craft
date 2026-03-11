import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, User, History, ChevronRight, PanelRightClose, PanelRightOpen, FileText, CheckCircle2, ArrowRight, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptItem {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

const IntroPrep = () => {
    const [stage, setStage] = useState<"setup" | "interview">("setup");
    
    // Setup State
    const [resumeText, setResumeText] = useState<string>("");
    const [parsedResumeData, setParsedResumeData] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Interview State
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [userInput, setUserInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

    // Video/Audio Tracking
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraPermitted, setCameraPermitted] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    
    // Voice Interaction State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize or cleanup camera when entering/leaving interview stage
    useEffect(() => {
        if (stage === 'interview') {
            const startCamera = async () => {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    setStream(mediaStream);
                    setCameraPermitted(true);
                } catch (err) {
                    console.error("Camera access denied:", err);
                    toast.error("Camera access required for the live video feed.");
                    setCameraPermitted(false);
                }
            };
            startCamera();

            // Sarah triggers the opening question when interview starts
            triggerAiOpening();
        } else {
            // Cleanup on stage change
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            window.speechSynthesis.cancel();
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stage]);

    useEffect(() => {
        if (videoRef.current && stream && stage === 'interview') {
            videoRef.current.srcObject = stream;
        }
    }, [stream, stage, isVideoEnabled]);

    // Auto-scroll transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript, isTranscriptOpen]);

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

    const speakText = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;

        // Find a female voice to represent Sarah
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Zira') ||
            voice.name.includes('Google UK English Female') ||
            voice.name.includes('Google US English')
        );
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.onstart = () => {
            setAiSpeaking(true);
            if (isListening) stopListening(); // Stop listening while AI speaks
        };
        utterance.onend = () => {
            setAiSpeaking(false);
            // Optionally auto-resume mic here:
            // startListening(); 
        };
        utterance.onerror = () => setAiSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const triggerAiOpening = async () => {
        setProcessing(true);
        try {
            const res = await api.post('/groq/interview/question', {
                resumeText: resumeText || "No resume provided.",
                history: [],
                interviewType: 'intro-prep'
            });

            const initialQuestion = res.data.question;
            addTranscriptItem('assistant', initialQuestion);
            speakText(initialQuestion);
        } catch (error) {
            console.error("AI Start Error", error);
            toast.error("Failed to start session. Please try again.");
            setStage('setup');
        } finally {
            setProcessing(false);
        }
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

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            toast.success("Mic On - Listening...");
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
        if (isListening) {
            stopListening();
            toast.info("Mic Off");
        } else {
            startListening();
        }
    };

    const handleUserSubmit = async () => {
        if (!userInput.trim()) return;

        const currentMsg = userInput;
        setUserInput('');
        addTranscriptItem('user', currentMsg);
        setProcessing(true);

        if (isListening) stopListening();

        const currentHistory = transcript.concat({ role: 'user', content: currentMsg, timestamp: '' }).map(t => ({
            role: t.role,
            content: t.content
        }));

        try {
            const res = await api.post('/groq/interview/question', {
                resumeText: resumeText || "No resume provided.",
                history: currentHistory,
                interviewType: 'intro-prep'
            });

            const aiResponse = res.data.question;
            addTranscriptItem('assistant', aiResponse);
            speakText(aiResponse);

        } catch (error) {
            console.error("AI Error:", error);
            toast.error("AI failed to respond.");
        } finally {
            setProcessing(false);
        }
    };

    const addTranscriptItem = (role: 'user' | 'assistant', content: string) => {
        setTranscript(prev => [...prev, {
            role,
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    const handleEndCall = () => {
        window.speechSynthesis.cancel();
        stopListening();
        setTranscript([]);
        setUserInput('');
        setStage('setup');
        toast.info("Session ended.");
    };

    if (stage === "setup") {
        return (
            <div className="p-6 lg:p-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-background">
                <div className="max-w-2xl w-full mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">
                            Introduction Preparation
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium">
                            Master your self-introduction with Sarah, your AI Coach. Upload your resume, and she will listen, analyze, and help refine your pitch.
                        </p>
                    </div>

                    <Card className="border-2 border-primary/10 shadow-xl overflow-hidden rounded-2xl">
                        <CardHeader className="bg-primary/5 pb-6">
                            <CardTitle className="flex items-center justify-center gap-2 text-xl">
                                <FileText className="w-5 h-5 text-primary" />
                                Upload Resume
                            </CardTitle>
                            <CardDescription className="text-center">
                                We need your resume to provide personalized feedback on your introduction.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-background hover:bg-muted/30 transition-all shadow-sm">
                                    <div className="text-center w-full max-w-sm">
                                        {resumeText ? (
                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center shadow-inner">
                                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg text-foreground">Resume Ready</p>
                                                    <p className="text-sm text-muted-foreground">{parsedResumeData?.full_name || "Candidate"}'s File</p>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => { setResumeText(""); setParsedResumeData(null); }} className="mt-2 rounded-full px-6">
                                                    Change File
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
                                                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <FileText className="w-8 h-8 text-primary" />}
                                                </div>
                                                <div>
                                                    <p className="text-foreground font-semibold mb-1">Drag and drop to upload</p>
                                                    <p className="text-xs text-muted-foreground">PDF format only (Max 5MB)</p>
                                                </div>
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    id="resume-upload"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setIsUploading(true);
                                                        const formData = new FormData();
                                                        formData.append("resume", file);

                                                        try {
                                                            const { data } = await api.post("/upload/resume", formData, {
                                                                headers: {
                                                                    "Content-Type": "multipart/form-data",
                                                                },
                                                                timeout: 60000,
                                                            });
                                                            if (data.success) {
                                                                setResumeText(data.text);
                                                                setParsedResumeData(data.data);
                                                                toast.success("Resume parsed successfully!");
                                                            }
                                                        } catch (error: any) {
                                                            console.error("Upload error:", error);
                                                            const errorMessage = error.response?.data?.error || error.message || "Failed to upload resume.";
                                                            toast.error(errorMessage);
                                                        } finally {
                                                            setIsUploading(false);
                                                        }
                                                    }}
                                                    disabled={isUploading}
                                                />
                                                <Button variant="secondary" onClick={() => document.getElementById('resume-upload')?.click()} disabled={isUploading} className="rounded-full px-6 font-semibold">
                                                    Select PDF File
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14 rounded-xl shadow-md"
                                    disabled={!resumeText && !isUploading}
                                    onClick={() => setStage('interview')}
                                >
                                    Start Preparation <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-background p-4 gap-4 max-w-[1800px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-card/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-border shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                    <span className="font-bold text-foreground tracking-wide">Live Coaching Session</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                        className={cn("hidden md:flex items-center gap-2 font-semibold text-muted-foreground", isTranscriptOpen && "bg-muted text-foreground")}
                    >
                        {isTranscriptOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                        {isTranscriptOpen ? "Hide Transcript" : "Show Transcript"}
                    </Button>
                </div>
            </div>

            {/* Split Screen Stage */}
            <div className="flex-1 flex gap-4 min-h-0 relative">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

                    {/* AI Coach Video */}
                    <Card className="bg-slate-900 border-border/50 shadow-lg relative overflow-hidden rounded-2xl group flex flex-col">
                        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", aiSpeaking ? "bg-green-400" : "bg-blue-400")} />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Coach Sarah</span>
                        </div>
                        <div className="flex-1 relative w-full h-full bg-black flex items-center justify-center">
                            <video
                                key={aiSpeaking ? 'talking' : 'listening'}
                                autoPlay
                                loop
                                muted
                                playsInline
                                src={aiSpeaking ? "/avatars/hr/hr_talking.mp4" : "/avatars/hr/hr_listening.mp4"}
                                className={cn(
                                    "w-full h-full object-cover transition-transform duration-500",
                                    aiSpeaking ? "scale-105" : "scale-100"
                                )}
                            />
                        </div>
                        {/* Subtitle Overlay */}
                        {aiSpeaking && lastAiMessage(transcript) && (
                            <div className="absolute bottom-6 inset-x-6 z-30 pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-2xl mx-auto max-w-xl text-center">
                                    <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed drop-shadow-sm line-clamp-3">
                                        "{lastAiMessage(transcript)}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* User Camera Video */}
                    <Card className="bg-black border-border/50 shadow-lg relative overflow-hidden rounded-2xl flex flex-col">
                        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", cameraPermitted && isVideoEnabled ? "bg-green-400" : "bg-red-400")} />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">You</span>
                        </div>
                        <div className="flex-1 relative w-full h-full flex items-center justify-center bg-zinc-900">
                            {cameraPermitted && isVideoEnabled ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transform -scale-x-100"
                                />
                            ) : (
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700">
                                        <User className="w-10 h-10 text-zinc-500" />
                                    </div>
                                    <p className="text-zinc-500 font-semibold uppercase tracking-wider text-sm">Camera Off</p>
                                </div>
                            )}

                            {/* Voice Input Indication */}
                            {isListening && (
                                <div className="absolute bottom-6 z-20 bg-indigo-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg animate-pulse">
                                    <Mic className="w-4 h-4" /> Listening...
                                </div>
                            )}
                        </div>
                    </Card>

                </div>

                {/* Transcript Sidebar */}
                <AnimatePresence>
                    {isTranscriptOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 350, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-card/80 backdrop-blur border border-border shadow-sm rounded-2xl overflow-hidden flex flex-col shrink-0"
                        >
                            <div className="p-4 border-b border-border font-bold flex items-center gap-2 bg-muted/30 text-foreground">
                                <History className="w-4 h-4" /> Feedback History
                            </div>
                            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                                <div className="space-y-4">
                                    {transcript.map((item, i) => (
                                        <div key={i} className={cn("flex flex-col gap-1 text-sm", item.role === 'user' ? "items-end" : "items-start")}>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                {item.role === 'user' ? 'You' : 'Sarah'} • {item.timestamp}
                                            </div>
                                            <div className={cn(
                                                "px-4 py-3 max-w-[90%] shadow-sm",
                                                item.role === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                                    : "bg-muted text-foreground rounded-2xl rounded-tl-sm border border-border"
                                            )}>
                                                {item.content}
                                            </div>
                                        </div>
                                    ))}
                                    {processing && (
                                        <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm border border-border w-16 text-center">
                                            <span className="flex items-center gap-1 justify-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce delay-75" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce delay-150" />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Floating Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-xl border border-border p-3 md:p-4 rounded-full shadow-2xl flex items-center gap-3 z-50">
                <Button
                    variant={isListening ? "primary" : "secondary"}
                    size="icon"
                    className={cn("w-12 h-12 rounded-full", isListening ? "bg-indigo-500 hover:bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white" : "text-muted-foreground hover:bg-muted font-bold shadow-sm border border-border/50")}
                    onClick={toggleMic}
                    title={isListening ? "Mute Microphone" : "Unmute Microphone"}
                >
                    {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    className={cn("w-12 h-12 rounded-full shadow-sm border border-border/50", isVideoEnabled ? "text-foreground" : "text-muted-foreground")}
                    onClick={toggleVideo}
                    title={isVideoEnabled ? "Turn off Camera" : "Turn on Camera"}
                >
                    {isVideoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                {/* Fallback Input Box integrated into controls */}
                <div className="flex items-center bg-muted/50 border border-border rounded-full ml-2 overflow-hidden shadow-inner">
                    <Input
                        className="w-48 md:w-64 border-0 bg-transparent focus-visible:ring-0 px-4 h-11"
                        placeholder="Type or speak..."
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUserSubmit()}
                        disabled={processing}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-none text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={handleUserSubmit}
                        disabled={processing || !userInput.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleEndCall}
                    className="w-12 h-12 rounded-full hover:bg-red-600 shadow-md shadow-red-500/20"
                    title="End Call"
                >
                    <PhoneOff className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

// Helper
function lastAiMessage(transcript: TranscriptItem[]) {
    const aiMsgs = transcript.filter(t => t.role === 'assistant');
    return aiMsgs.length > 0 ? aiMsgs[aiMsgs.length - 1].content : null;
}

export default IntroPrep;
