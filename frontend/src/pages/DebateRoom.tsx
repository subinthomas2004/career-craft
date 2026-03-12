import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, ArrowLeft, PhoneOff, History, PanelRightClose, PanelRightOpen, ChevronRight, User, Video, VideoOff, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [processing, setProcessing] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert minutes to seconds
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const aiSpeakingRef = useRef(false); // Ref to avoid stale closure in speech recognition

    // Subtitle state
    const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

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

    // Voice preloading
    const maleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const voicesLoadedRef = useRef(false);

    // Silence timer for 7-second auto-trigger (when mic is off after AI speaks)
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastUserSpokeRef = useRef<number>(Date.now());

    // 5-second inactivity timer (when mic is on but user stops talking)
    const speechInactivityRef = useRef<NodeJS.Timeout | null>(null);

    // Track if user has actually spoken any words since mic was turned on
    const userHasSpokenRef = useRef(false);

    // Accumulated speech input ref
    const userInputRef = useRef<string>('');

    // Maximum continuous speech timer (40 seconds max)
    const maxSpeechTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Preload voices
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const male = voices.find(voice =>
                    voice.name.toLowerCase().includes('male') ||
                    voice.name.includes('David') ||
                    voice.name.includes('Mark') ||
                    voice.name.includes('Daniel') ||
                    voice.name.includes('Guy') ||
                    voice.name.includes('Matthew') ||
                    voice.name.includes('Brian')
                );
                if (male) {
                    maleVoiceRef.current = male;
                }
                voicesLoadedRef.current = true;
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        // Fallback: repeatedly try for 3 seconds
        const interval = setInterval(() => {
            if (!voicesLoadedRef.current) loadVoices();
            else clearInterval(interval);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!topic) {
            navigate('/dashboard/debate/topic');
            return;
        }

        toast.success("Debate started!", { duration: 2000 });

        // Wait 3 seconds — if user doesn't start speaking, AI opens
        const startTimer = setTimeout(() => {
            if (transcript.length === 0 && !isListening) {
                triggerAiOpening();
            }
        }, 3000);

        return () => clearTimeout(startTimer);
    }, [topic, navigate]);

    const triggerAiOpening = async () => {
        try {
            setProcessing(true);
            setAiSpeaking(true);
            const aiStance = stance === 'Pro' ? 'Con' : 'Pro';

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
            setAiSpeaking(false);
        } finally {
            setProcessing(false);
        }
    };

    // Camera Init
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(mediaStream);
            setCameraPermitted(true);
            setIsVideoEnabled(true);
        } catch (err) {
            console.error("Camera access denied:", err);
            setCameraPermitted(false);
        }
    };

    useEffect(() => {
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

    const toggleVideo = async () => {
        if (isVideoEnabled && stream) {
            // Turn OFF: stop all video tracks
            stream.getVideoTracks().forEach(track => track.stop());
            setIsVideoEnabled(false);
        } else {
            // Turn ON: re-acquire camera stream
            await startCamera();
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

        // Split text into sentences for rolling subtitles
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let sentenceIndex = 0;

        const speakSentence = (index: number) => {
            if (index >= sentences.length) {
                setAiSpeaking(false);
                aiSpeakingRef.current = false;
                setCurrentSubtitle('');
                // Auto-enable mic after AI finishes speaking
                setTimeout(() => {
                    if (isActive && !isListening) {
                        startListening();
                    }
                }, 300);
                return;
            }

            const sentence = sentences[index].trim();
            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.rate = 1.1;

            // Use preloaded male voice
            if (maleVoiceRef.current) {
                utterance.voice = maleVoiceRef.current;
            }

            utterance.onstart = () => {
                setAiSpeaking(true);
                aiSpeakingRef.current = true;
                setCurrentSubtitle(sentence);
            };

            utterance.onend = () => {
                speakSentence(index + 1);
            };

            utterance.onerror = () => {
                setAiSpeaking(false);
                aiSpeakingRef.current = false;
                setCurrentSubtitle('');
            };

            window.speechSynthesis.speak(utterance);
        };

        speakSentence(0);
    };

    // 7-second silence auto-trigger: if AI finished speaking and user doesn't respond
    useEffect(() => {
        // Clear any existing timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        // Only set timer when AI is NOT speaking and user is NOT listening and debate is active
        if (!aiSpeaking && !processing && isActive && transcript.length > 0 && !isListening) {
            silenceTimerRef.current = setTimeout(() => {
                // User hasn't spoken for 7 seconds, AI speaks again
                handleSilenceResponse();
            }, 7000);
        }

        return () => {
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, [aiSpeaking, processing, isActive, transcript.length, isListening]);

    const handleSilenceResponse = async () => {
        try {
            setProcessing(true);
            const aiStance = stance === 'Pro' ? 'Con' : 'Pro';
            const context = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');

            const res = await api.post('/groq/debate/response', {
                topic,
                aiStance,
                userStance: stance,
                context,
                userMsg: "(User remained silent and didn't respond for 7 seconds)"
            });

            const aiResponse = res.data.response;
            addTranscriptItem('AI', aiResponse);
            speakText(aiResponse);
        } catch (err) {
            console.error("AI Silence Response Error:", err);
        } finally {
            setProcessing(false);
        }
    };

    // Interruption Logic
    useEffect(() => {
        let interruptionTimer: NodeJS.Timeout;
        if (isListening && !aiSpeaking) {
            interruptionTimer = setTimeout(() => {
                handleInterruption();
            }, 45000); // 45 seconds limit
        }
        return () => clearTimeout(interruptionTimer);
    }, [isListening, aiSpeaking]);

    const handleInterruption = () => {
        stopListening();
        handleUserSubmit(true);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            return;
        }

        if (recognitionRef.current && isListening) return;

        // DON'T stop AI speaking immediately — wait until user actually speaks
        // (handled in onresult below)

        // Reset speech tracking
        userHasSpokenRef.current = false;

        // Clear silence timer when mic is turned on
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-submit when mic stops (e.g. browser stopped it)
            if (userInputRef.current.trim()) {
                handleUserSubmit(false);
            }
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
                // First speech detected — NOW stop AI if it's speaking
                if (!userHasSpokenRef.current) {
                    if (aiSpeakingRef.current) {
                        window.speechSynthesis.cancel();
                        setAiSpeaking(false);
                        aiSpeakingRef.current = false;
                        setCurrentSubtitle('');
                    }
                    
                    // Start max speech timer when user starts speaking
                    if (maxSpeechTimerRef.current) {
                        clearTimeout(maxSpeechTimerRef.current);
                    }
                    maxSpeechTimerRef.current = setTimeout(() => {
                        toast("Maximum speaking time (40s) reached. AI will now respond.");
                        stopListening();
                        handleUserSubmit(true); // Trigger AI interruption
                    }, 40000);
                }
                userHasSpokenRef.current = true;

                userInputRef.current = userInputRef.current + (userInputRef.current ? ' ' : '') + finalTranscript;
                lastUserSpokeRef.current = Date.now();

                // Reset the 5-second inactivity timer every time user speaks
                if (speechInactivityRef.current) {
                    clearTimeout(speechInactivityRef.current);
                }
                speechInactivityRef.current = setTimeout(() => {
                    // User hasn't spoken for 5 seconds while mic is on — auto-submit
                    if (userInputRef.current.trim() && isListening) {
                        stopListening();
                        handleUserSubmit(false);
                    }
                }, 5000);
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
        // Clear inactivity timer
        if (speechInactivityRef.current) {
            clearTimeout(speechInactivityRef.current);
            speechInactivityRef.current = null;
        }
        // Clear max speech timer
        if (maxSpeechTimerRef.current) {
            clearTimeout(maxSpeechTimerRef.current);
            maxSpeechTimerRef.current = null;
        }
    };

    const toggleMic = () => {
        if (isListening) {
            stopListening();
            // Manual mic-off: submit whatever accumulated speech exists
            if (userInputRef.current.trim()) {
                handleUserSubmit(false);
            }
        } else {
            startListening();
        }
    };

    const handleUserSubmit = async (isInterruption = false) => {
        const userMsg = userInputRef.current.trim() || (isInterruption ? "(User was interrupted)" : "");
        if (!userMsg) return;

        userInputRef.current = '';
        addTranscriptItem('User', userMsg);
        setProcessing(true);

        // Stop listening while AI thinks/speaks
        if (isListening) stopListening();

        try {
            const aiStance = stance === 'Pro' ? 'Con' : 'Pro';
            const context = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
            const interruptionContext = isInterruption ? " [SYSTEM: AI INTERRUPTED USER DUE TO TIME LIMIT. BE ASSERTIVE.]" : "";

            // Kick off style/speech analysis in parallel (silent — no toast)
            api.post('/groq/speech-analysis', { transcript: userMsg })
                .catch(err => console.error("Speech Analysis Error:", err));

            const res = await api.post('/groq/debate/response', {
                topic,
                aiStance,
                userStance: stance,
                context: context + `\nUser: ${userMsg}` + interruptionContext,
                userMsg
            });

            const aiResponse = res.data.response;
            addTranscriptItem('AI', aiResponse);
            speakText(aiResponse);

        } catch (error) {
            console.error("AI Error:", error);
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
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
        navigate('/dashboard/debate/report', {
            state: { transcript, topic, stance }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-background p-4 gap-3 max-w-[1800px] mx-auto overflow-hidden">

            {/* Header Status Bar (Compact — no absolute positioning to avoid overlap) */}
            <div className="flex flex-nowrap items-center justify-between bg-card/80 backdrop-blur-md p-2 md:p-3 rounded-2xl border border-border shadow-sm z-20 shrink-0 gap-2">

                {/* Left: Back Button */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/debate/topic')} className="rounded-full hover:bg-muted h-8 w-8">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>

                {/* Center: Topic & Stance (flex-based, not absolute) */}
                <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-2">
                    <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center truncate w-full leading-tight tracking-tight" title={topic}>
                        {topic}
                    </h1>
                    <div className="flex items-center gap-2 text-xs mt-1">
                        <span className={cn("px-2 py-0.5 rounded-full font-bold bg-muted/50 border backdrop-blur-sm shadow-sm")}>
                            You: <span className={stance === 'Pro' ? "text-emerald-600" : "text-rose-600"}>{stance}</span>
                        </span>
                        <span className="text-muted-foreground font-semibold">vs</span>
                        <span className={cn("px-2 py-0.5 rounded-full font-bold bg-muted/50 border backdrop-blur-sm shadow-sm")}>
                            AI: <span className={stance === 'Pro' ? "text-rose-600" : "text-emerald-600"}>{stance === 'Pro' ? 'Con' : 'Pro'}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                        className={cn("hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2", isTranscriptOpen && "bg-muted")}
                    >
                        {isTranscriptOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                        <span className="text-xs font-medium">{isTranscriptOpen ? "Hide" : "Transcript"}</span>
                    </Button>
                    <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                        {/* Normal Digital Timer */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono font-bold text-xs border shadow-sm",
                            timeLeft < 60
                                ? "text-red-600 border-red-300 bg-red-50 animate-pulse"
                                : "text-foreground border-border bg-muted/50"
                        )}>
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(timeLeft)}
                        </div>
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
                        <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
                            {/* Pulse Effect when speaking */}
                            {aiSpeaking && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-0" />
                            )}

                            <div className="relative z-10 w-full h-full bg-black flex items-center justify-center overflow-hidden">
                                <video
                                    key={aiSpeaking ? 'speaking' : 'listening'}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    src={aiSpeaking ? "/videos/debate_speaking.mp4" : "/videos/debate_listening.mp4"}
                                    className={cn(
                                        "w-full h-full object-cover origin-center",
                                        aiSpeaking ? "scale-[1.35]" : "scale-100"
                                    )}
                                />
                            </div>

                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full z-20 border border-white/10">
                                <h3 className="text-sm font-bold text-slate-200">AI Debater</h3>
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {aiSpeaking ? "Arguing..." : "Listening..."}
                                </p>
                            </div>
                        </div>

                        {/* AI Subtitle Overlay — updates sentence by sentence */}
                        {aiSpeaking && currentSubtitle && (
                            <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center z-50 shadow-2xl">
                                <p className="text-base text-white font-medium line-clamp-3 italic drop-shadow-md tracking-wide">"{currentSubtitle}"</p>
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
                                    {isListening && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                                    )}

                                    <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-neutral-800 border-4 border-neutral-700/50 flex items-center justify-center shadow-2xl">
                                        <User className={cn("w-16 h-16 transition-all duration-300", isListening ? "text-indigo-400 scale-110" : "text-neutral-500")} />
                                    </div>

                                    <div className="mt-6 text-center z-10">
                                        <h3 className="text-xl md:text-2xl font-bold text-neutral-200">You</h3>
                                        <p className="text-sm text-neutral-500 mt-1 font-medium">
                                            {isListening ? "Speaking..." : "Listening..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Listening indicator overlay on camera */}
                            {isListening && cameraPermitted && isVideoEnabled && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 px-4 py-1.5 rounded-full text-white text-xs font-bold animate-pulse z-20">
                                    🎤 Speaking...
                                </div>
                            )}
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

            {/* Bottom Control Bar — Outside the video grid */}
            <div className="shrink-0 flex items-center justify-center gap-5 py-3 px-6 bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-lg">
                {/* Video Toggle */}
                <Button
                    size="icon"
                    variant={isVideoEnabled ? "secondary" : "destructive"}
                    onClick={toggleVideo}
                    className={cn(
                        "h-12 w-12 rounded-full shadow-lg border-2 border-transparent transition-all",
                        !isVideoEnabled && "shadow-red-500/20 border-red-500/50"
                    )}
                    title={isVideoEnabled ? "Turn Camera Off" : "Turn Camera On"}
                >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                {/* Mic Toggle */}
                <Button
                    size="icon"
                    variant={isListening ? "destructive" : "secondary"}
                    onClick={toggleMic}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-lg border-2 border-transparent transition-all",
                        isListening ? "animate-pulse shadow-red-500/20 border-red-500/50" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    title={isListening ? "Stop & Submit" : "Start Speaking"}
                >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>

                {/* End Debate — Professional hang-up style */}
                <Button
                    variant="destructive"
                    onClick={handleEndDebate}
                    className="h-12 px-5 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center gap-2 font-semibold"
                    title="End Debate"
                >
                    <PhoneOff className="w-5 h-5" />
                    End Debate
                </Button>
            </div>
        </div>
    );
};

export default DebateRoom;
