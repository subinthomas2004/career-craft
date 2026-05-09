import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, User, History, ChevronRight, PanelRightClose, PanelRightOpen, FileText, CheckCircle2, ArrowRight, Send, X } from 'lucide-react';
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
    const [resumeText, setResumeText] = useState<string>("");
    const [parsedResumeData, setParsedResumeData] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'none' | 'upload' | 'profile'>('none');

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
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const userInputRef = useRef<string>("");
    
    // Confidence / Nervousness tracking
    const speechStartTimeRef = useRef<number>(0);
    const lastWordTimeRef = useRef<number>(0);
    const totalPauseTimeRef = useRef<number>(0);
    const [confidenceFeedback, setConfidenceFeedback] = useState<string>("");

    // Sync ref with state
    useEffect(() => {
        userInputRef.current = userInput;
        
        // Silence detection: If user stops talking for 5s, submit
        if (stage === 'interview' && userInput.trim().length > 0 && !aiSpeaking) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
                handleUserSubmit();
            }, 5000);
        }

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [userInput, stage, aiSpeaking]);

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
            // After AI finishes speaking, auto-turn on the microphone
            startListening(); 
        };
        utterance.onerror = () => setAiSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        if (!parsedResumeData) return;
        setParsedResumeData({
            ...parsedResumeData,
            skills: parsedResumeData.skills.filter((s: string) => s !== skillToRemove)
        });
    };

    const triggerAiOpening = async () => {
        setProcessing(true);
        try {
            // Create a custom context string from parsedResumeData if it exists
            let contextText = resumeText;
            if (parsedResumeData) {
                contextText = `
Name: ${parsedResumeData.full_name || 'N/A'}
Contact: ${parsedResumeData.email || ''} ${parsedResumeData.phone || ''}
Location: ${parsedResumeData.location || ''}
Links: ${parsedResumeData.links?.join(', ') || ''}
Summary: ${parsedResumeData.summary || ''}
Skills: ${parsedResumeData.skills?.join(', ') || ''}
Projects: ${parsedResumeData.projects?.map((p: any) => `${p.title} (${p.year}): ${p.description}`).join('; ') || ''}
Certifications: ${parsedResumeData.certifications?.join(', ') || ''}
Experience: ${parsedResumeData.experience?.map((exp: any) => `${exp.role} at ${exp.company} (${exp.duration})`).join('; ') || ''}
Education: ${parsedResumeData.education?.map((edu: any) => `${edu.degree} from ${edu.school} (${edu.year}) - Score: ${edu.score || 'N/A'}`).join('; ') || ''}
                `.trim();
            }

            const res = await api.post('/groq/interview/question', {
                resumeText: contextText || "No resume provided.",
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
            if (!isListening) toast.success("Mic On - Listening...");
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error !== 'no-speech') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            // Auto-restart recognition if it stops on its own (browsers do this after a pause)
            if (recognitionRef.current === recognition) {
                try {
                    recognition.start();
                } catch (e) {
                    setIsListening(false);
                }
            }
        };

        recognition.onresult = (event: any) => {
            const now = Date.now();
            if (speechStartTimeRef.current === 0) {
                speechStartTimeRef.current = now;
                lastWordTimeRef.current = now;
                totalPauseTimeRef.current = 0;
            }

            // Detect gaps between words for confidence analysis
            const gap = now - lastWordTimeRef.current;
            if (gap > 1000) { // More than 1s gap is a hesitation
                totalPauseTimeRef.current += gap;
            }
            lastWordTimeRef.current = now;

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
            recognitionRef.current.onend = null; // Prevent auto-restart
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsListening(false);
        }
    };

    const toggleMic = () => {
        if (isListening) {
            if (userInput.trim().length > 0) {
                handleUserSubmit();
            } else {
                stopListening();
                toast.info("Mic Off");
            }
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
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        // Analyze Confidence
        const totalTime = Date.now() - speechStartTimeRef.current;
        const hesitationRatio = speechStartTimeRef.current > 0 ? totalPauseTimeRef.current / totalTime : 0;
        let confidenceNote = "";
        if (hesitationRatio > 0.4) confidenceNote = "[User seems very nervous/hesitant with many long pauses]";
        else if (hesitationRatio > 0.2) confidenceNote = "[User had some minor hesitations]";
        else confidenceNote = "[User spoke confidently]";
        
        setConfidenceFeedback(confidenceNote);
        // Reset trackers
        speechStartTimeRef.current = 0;
        totalPauseTimeRef.current = 0;

        const currentHistory = transcript.concat({ role: 'user', content: currentMsg + (confidenceNote ? ` ${confidenceNote}` : ''), timestamp: '' }).map(t => ({
            role: t.role,
            content: t.content
        }));

        // Use structured context if available
        let contextText = resumeText;
        if (parsedResumeData) {
            contextText = `
Name: ${parsedResumeData.full_name || 'N/A'}
Contact: ${parsedResumeData.email || ''} ${parsedResumeData.phone || ''}
Location: ${parsedResumeData.location || ''}
Links: ${parsedResumeData.links?.join(', ') || ''}
Summary: ${parsedResumeData.summary || ''}
Skills: ${parsedResumeData.skills?.join(', ') || ''}
Projects: ${parsedResumeData.projects?.map((p: any) => `${p.title} (${p.year}): ${p.description}`).join('; ') || ''}
Certifications: ${parsedResumeData.certifications?.join(', ') || ''}
Experience: ${parsedResumeData.experience?.map((exp: any) => `${exp.role} at ${exp.company} (${exp.duration})`).join('; ') || ''}
Education: ${parsedResumeData.education?.map((edu: any) => `${edu.degree} from ${edu.school} (${edu.year}) - Score: ${edu.score || 'N/A'}`).join('; ') || ''}
            `.trim();
        }

        try {
            const res = await api.post('/groq/interview/question', {
                resumeText: contextText || "No resume provided.",
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
        setResumeText("");
        setParsedResumeData(null);
        setSelectionMode('none');
        setIsTranscriptOpen(false);
        toast.info("Session ended.");
    };

    const handleUseProfileResume = async () => {
        setIsUploading(true);
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                toast.error("Please log in to use your profile resume.");
                return;
            }
            const { token } = JSON.parse(userInfo);
            
            const { data } = await api.get("/upload/resume-profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setResumeText(data.text);
                setParsedResumeData(data.data);
                setSelectionMode('profile');
                toast.success("Profile resume loaded successfully!");
            }
        } catch (error: any) {
            console.error("Profile Resume Error:", error);
            const errorMessage = error.response?.data?.error || "No resume found in your profile.";
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
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

                    {!resumeText && selectionMode === 'none' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={handleUseProfileResume}>
                                <Card className="h-full border-2 border-primary/10 hover:border-primary/30 transition-all bg-card/50 shadow-lg">
                                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            {isUploading && selectionMode === 'none' ? <Loader2 className="w-8 h-8 animate-spin" /> : <User className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Use Profile Resume</h3>
                                            <p className="text-sm text-muted-foreground">Load the resume already stored in your professional profile.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => setSelectionMode('upload')}>
                                <Card className="h-full border-2 border-primary/10 hover:border-primary/30 transition-all bg-card/50 shadow-lg">
                                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Upload New Resume</h3>
                                            <p className="text-sm text-muted-foreground">Upload a fresh PDF resume for this specific session.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    ) : (
                        <Card className="border-2 border-primary/10 shadow-xl overflow-hidden rounded-2xl">

                            <CardContent className="p-8">
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-background hover:bg-muted/30 transition-all shadow-sm">
                                        <div className="text-center w-full max-w-sm">
                                            {resumeText ? (
                                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col gap-4 w-full">
                                                    <div className="flex items-center justify-between border-b pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                            <span className="font-semibold text-foreground">
                                                                {selectionMode === 'profile' ? 'Profile Resume Ready' : 'Resume Ready'}
                                                            </span>
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => { 
                                                                setResumeText(""); 
                                                                setParsedResumeData(null); 
                                                                setSelectionMode('none'); 
                                                            }} 
                                                            className="text-destructive hover:text-destructive text-xs h-7"
                                                        >
                                                            Change
                                                        </Button>
                                                    </div>
                                                    

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
                                                                    setSelectionMode('upload');
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

                                    <div className="flex gap-4">
                                        <Button
                                            size="lg"
                                            className="w-full text-lg h-14 rounded-xl shadow-md"
                                            disabled={!resumeText && !isUploading}
                                            onClick={() => {
                                                setStage('interview');
                                                setIsTranscriptOpen(false);
                                            }}
                                        >
                                            Start Preparation <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
                                    <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed drop-shadow-sm break-words whitespace-pre-wrap">
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

            {/* Bottom Controls */}
            <div className="flex justify-center items-center gap-6 p-3 md:p-4 shrink-0 bg-card border border-border rounded-full mx-auto w-fit shadow-sm mb-6">
                <Button
                    variant={isListening ? "default" : "secondary"}
                    size="icon"
                    className={cn("w-14 h-14 rounded-full", isListening ? "bg-indigo-500 hover:bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white" : "text-muted-foreground hover:bg-muted font-bold shadow-sm border border-border/50")}
                    onClick={toggleMic}
                    title={isListening ? "Mute Microphone" : "Unmute Microphone"}
                >
                    {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    className={cn("w-14 h-14 rounded-full shadow-sm border border-border/50", isVideoEnabled ? "text-foreground" : "text-muted-foreground")}
                    onClick={toggleVideo}
                    title={isVideoEnabled ? "Turn off Camera" : "Turn on Camera"}
                >
                    {isVideoEnabled ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleEndCall}
                    className="w-14 h-14 rounded-full hover:bg-red-600 shadow-md shadow-red-500/20"
                    title="End Call"
                >
                    <PhoneOff className="w-6 h-6" />
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
