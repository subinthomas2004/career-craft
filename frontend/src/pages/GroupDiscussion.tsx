import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Mic, MicOff, Video, VideoOff, ArrowLeft, PhoneOff,
    MessageSquare, X, Clock, Users
} from 'lucide-react';
import AvatarPlayer from "@/components/interview/AvatarPlayer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from "@/lib/api";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Types ---
interface Participant {
    id: string;
    name: string;
    role: string;
    color: string;
    systemPrompt: string;
    avatar?: string;
    isUser?: boolean;
}

interface TranscriptItem {
    speakerId: string;
    speakerName: string;
    text: string;
    timestamp: string;
}

// --- Constants ---
const ABUSIVE_WORDS = ["bullshit", "fuck", "bitch", "asshole", "shit", "bastard", "cunt", "motherfucker", "idiot", "stupid"];
const MODERATOR = {
    id: 'moderator',
    name: 'Interviewer',
    role: 'Moderator',
    color: 'bg-indigo-600 text-white',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Interviewer&clothing=graphicShirt'
};

const AI_AGENTS: Participant[] = [
    { id: 'p1', name: 'Alex', role: 'Candidate', color: 'bg-blue-100 text-blue-700', systemPrompt: "You are a confident candidate in a Group Discussion. Keep your points concise, relevant, and build upon others' ideas.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: 'p2', name: 'Sarah', role: 'Candidate', color: 'bg-red-100 text-red-700', systemPrompt: "You are a participant in a Group Discussion. Be polite but firm in your opinions. Agree or disagree constructively.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 'p3', name: 'Mike', role: 'Candidate', color: 'bg-green-100 text-green-700', systemPrompt: "You are a candidate in a Group Discussion. Use data or logical reasoning to support your arguments.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 'p4', name: 'Priya', role: 'Candidate', color: 'bg-purple-100 text-purple-700', systemPrompt: "You are a candidate in a Group Discussion. Focus on bringing a balanced perspective to the topic.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' }
];

const ALEX_VIDEOS = {
    idle: "/videos/gd/alex_listening.mp4",
    talking: "/videos/gd/alex_speaking.mp4",
    listening: "/videos/gd/alex_listening.mp4",
    nodding: "/videos/gd/alex_listening.mp4"
};

const MIKE_VIDEOS = {
    idle: "/videos/gd/mike_listening.mp4",
    talking: "/videos/gd/mike_speaking.mp4",
    listening: "/videos/gd/mike_listening.mp4",
    nodding: "/videos/gd/mike_listening.mp4"
};

const PRIYA_VIDEOS = {
    idle: "/videos/gd/priya_listening.mp4",
    talking: "/videos/gd/priya_speaking.mp4",
    listening: "/videos/gd/priya_listening.mp4",
    nodding: "/videos/gd/priya_listening.mp4"
};

const SARAH_VIDEOS = {
    idle: "/videos/gd/sarah_listening.mp4",
    talking: "/videos/gd/sarah_speaking.mp4",
    listening: "/videos/gd/sarah_listening.mp4",
    nodding: "/videos/gd/sarah_listening.mp4"
};

const DAVID_VIDEOS = {
    idle: "/avatars/tech/tech_listening.mp4",
    talking: "/avatars/tech/tech_talking.mp4",
    listening: "/avatars/tech/tech_listening.mp4",
    nodding: "/avatars/tech/tech_nodding.mp4"
};

const GroupDiscussion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topic: initialTopic, timeLimit = 10 } = location.state || {};

    // User Info
    const [userInfo, setUserInfo] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem("userInfo");
        if (stored) setUserInfo(JSON.parse(stored));
    }, []);

    // State
    const [topic, setTopic] = useState(initialTopic || 'Universal Basic Income');
    const [isActive, setIsActive] = useState(false);
    const [isIntro, setIsIntro] = useState(true);
    const [isPreparing, setIsPreparing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const [discussionTimer, setDiscussionTimer] = useState(timeLimit * 60);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const transcriptRef = useRef<TranscriptItem[]>([]);
    useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
    const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
    const currentSpeakerRef = useRef<string | null>(currentSpeaker);
    useEffect(() => { currentSpeakerRef.current = currentSpeaker; }, [currentSpeaker]);
    const [processing, setProcessing] = useState(false);
    const processingRef = useRef(processing);
    useEffect(() => { processingRef.current = processing; }, [processing]);
    const [abuseCount, setAbuseCount] = useState(0);
    const [isMicThrottled, setIsMicThrottled] = useState(false);
    const abuseCountRef = useRef(0);
    useEffect(() => { abuseCountRef.current = abuseCount; }, [abuseCount]);
    const discussionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [inputText, setInputText] = useState("");

    // Voice Recognition
    const {
        isListening,
        transcript: userTranscript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript
    } = useSpeechRecognition();

    // Media & Hardware
    const [cameraActive, setCameraActive] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const userStream = useRef<MediaStream>();
    const isMounted = useRef(true);

    // 1. Initialize
    useEffect(() => {
        // Get Local Stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            userStream.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }).catch(err => {
            console.error("Media Error:", err);
            toast.error("Camera/Mic access denied.");
        });

        return () => {
            isMounted.current = false;
            userStream.current?.getTracks().forEach(track => track.stop());
            window.speechSynthesis.cancel();
            if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current);
        };
    }, []);

    // Re-attach stream when camera is toggled back on
    useEffect(() => {
        if (cameraActive && videoRef.current && userStream.current) {
            videoRef.current.srcObject = userStream.current;
        }
    }, [cameraActive]);

    // --- Logic ---

    // 1. On Mount: Play Intro
    useEffect(() => {
        const playIntro = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const text = `Hello everyone, good evening. The topic for today's group discussion is ${topic}. Please take 2 minutes to prepare your thoughts. You may begin preparation now.`;
            setCurrentSpeaker(MODERATOR.id);
            setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);
            await speakText(text, 'male');
            if (isMounted.current) {
                setCurrentSpeaker(null);
                setIsIntro(false);
                setIsPreparing(true);
            }
        };
        if (isIntro && timeLeft === 120 && !isPreparing) {
            playIntro();
        }
    }, [isIntro, timeLeft, isPreparing, topic]);

    // 2. Cool-off Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPreparing && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isPreparing && timeLeft === 0) {
            startSession();
        }
        return () => clearInterval(timer);
    }, [isPreparing, timeLeft]);

    // 3. Discussion Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && discussionTimer > 0) {
            timer = setInterval(() => setDiscussionTimer(prev => prev - 1), 1000);
        } else if (isActive && discussionTimer === 0) {
            concludeSession();
        }
        return () => clearInterval(timer);
    }, [isActive, discussionTimer]);

    const startSession = async () => {
        setIsPreparing(false);
        setCurrentSpeaker(MODERATOR.id);
        const text = "Time is up. Please start the discussion.";
        setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);
        await speakText(text, 'male');
        if (isMounted.current) {
            setCurrentSpeaker(null);
            setIsActive(true);
            toast.success("Discussion Started!", { description: "The floor is open." });
            // Initial Wait for User (5 seconds)
            handleTurnTransition(5000);
        }
    };

    const handleTurnTransition = (delayMs: number = 5000) => {
        if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current);

        discussionTimeoutRef.current = setTimeout(() => {
            if (!processingRef.current && !currentSpeakerRef.current && isActive) {
                // User didn't take the floor, trigger AI
                const currentTranscript = transcriptRef.current;
                const lastSpeakerId = currentTranscript[currentTranscript.length - 1]?.speakerId;

                // Pick next agent (ensure it's not the same as last speaker if possible)
                const availableAgents = AI_AGENTS.filter(a => a.id !== lastSpeakerId);
                const nextAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)] || AI_AGENTS[0];

                if (nextAgent) triggerAgentTurn(nextAgent);
            }
        }, delayMs);
    };

    const speakText = (text: string, voiceType: 'male' | 'female' = 'male'): Promise<void> => {
        return new Promise((resolve) => {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);

            const setVoiceAndSpeak = () => {
                const voices = synth.getVoices();
                let selectedVoice;

                if (voiceType === 'female') {
                    selectedVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.toLowerCase().includes('female')));
                } else {
                    selectedVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Google UK English Male') || v.name.toLowerCase().includes('male')));
                }

                if (!selectedVoice && voices.length > 0) {
                    if (voiceType === 'male') {
                        selectedVoice = voices.find(v => v.name.includes('Daniel') || v.name.includes('Google US English'));
                    }
                    selectedVoice = selectedVoice || voices[0];
                }

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                utterance.pitch = voiceType === 'female' ? 1.2 : 0.8;

                let isResolved = false;
                const resolveOnce = () => {
                    if (!isResolved) {
                        isResolved = true;
                        resolve();
                    }
                };

                utterance.onend = resolveOnce;
                utterance.onerror = (e) => {
                    console.error("Speech error", e);
                    resolveOnce();
                };
                
                synth.speak(utterance);
                
                // Absolute fallback timeout so the promise never hangs indefinitely
                setTimeout(resolveOnce, Math.max(3000, text.length * 80));
            };

            if (synth.getVoices().length === 0) {
                let didRun = false;
                synth.onvoiceschanged = () => {
                    if (!didRun) {
                        didRun = true;
                        setVoiceAndSpeak();
                    }
                };
                setTimeout(() => {
                    if (!didRun) {
                        didRun = true;
                        setVoiceAndSpeak();
                    }
                }, 1000);
            } else {
                setVoiceAndSpeak();
            }
        });
    };

    const [isEnding, setIsEnding] = useState(false);

    const concludeSession = async (abortedByAbuse: boolean | any = false, skipSpeech: boolean = false) => {
        if (isEnding) return;
        setIsEnding(true);

        window.speechSynthesis.cancel();
        if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current);
        setIsActive(false);

        const isAborted = abortedByAbuse === true;

        if (!skipSpeech) {
            setCurrentSpeaker(MODERATOR.id);
            const exitText = isAborted 
                ? "Stop it. This kind of inappropriate language is not permitted in a professional discussion. I am terminating this session."
                : "Time is up. Thank you all for participating in this group discussion. Let's conclude our session here.";
                
            setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text: exitText, timestamp: new Date().toLocaleTimeString() }]);
            
            await speakText(exitText, 'male');
            setCurrentSpeaker(null);
        }
        
        // Record Activity
        try {
            await api.post('/auth/activity', {
                title: `Group Discussion: ${topic}`,
                activityType: 'gd',
                score: '100%'
            });
        } catch (err) {
            console.error("Failed to record activity", err);
        }

        // Immediate termination and navigation to report
        const participantsData = allParticipants.map(p => ({
            id: p.id,
            name: p.name,
            role: p.role,
            avatar: p.avatar,
            isUser: p.isUser
        }));

        navigate('/dashboard/group-discussion/report', {
            state: {
                topic,
                transcript,
                participants: participantsData,
                abusiveKickout: isAborted
            },
            replace: true
        });
    };

    const triggerAgentTurn = async (agent: Participant) => {
        if (processingRef.current || currentSpeakerRef.current) return;
        setProcessing(true);
        try {
            const context = transcriptRef.current.map(t => `${t.speakerName}: ${t.text}`).join('\n');
            const res = await api.post('/groq/gd/response', {
                topic, agentName: agent.name, role: agent.role, style: agent.systemPrompt, context
            });
            const text = res.data.response;
            if (!isMounted.current) return;

            if (text) {
                setCurrentSpeaker(agent.id);
                setTranscript(prev => [...prev, { speakerId: agent.id, speakerName: agent.name, text, timestamp: new Date().toLocaleTimeString() }]);
                const isFemale = agent.name === 'Sarah' || agent.name === 'Priya';
                await speakText(text, isFemale ? 'female' : 'male');
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (isMounted.current) {
                setCurrentSpeaker(null);
                setProcessing(false);
                // After AI finishes, wait for user again (3 seconds)
                handleTurnTransition(3000);
            }
        }
    };

    // --- UI Helpers ---
    const isMicDisabled = isIntro || isPreparing || (currentSpeaker !== null && currentSpeaker !== 'user') || isMicThrottled || processing;

    const handleMicToggle = () => {
        if (isMicDisabled) return;

        setIsMicThrottled(true);
        setTimeout(() => setIsMicThrottled(false), 800);

        if (isListening || currentSpeaker === 'user') {
            stopListening();
            
            const textToSend = (userTranscript + " " + interimTranscript).trim();
            if (textToSend) {
                const isAbusive = ABUSIVE_WORDS.some(word => textToSend.toLowerCase().includes(word));
                if (isAbusive) {
                    stopListening();
                    resetTranscript();
                    setCurrentSpeaker(null);
                    
                    if (abuseCountRef.current === 0) {
                        setAbuseCount(1);
                        const warningText = "Please monitor your language. Inappropriate words are not permitted. Consider this a warning.";
                        setCurrentSpeaker(MODERATOR.id);
                        setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text: warningText, timestamp: new Date().toLocaleTimeString() }]);
                        
                        speakText(warningText, 'male').then(() => {
                            if (isMounted.current) {
                                setCurrentSpeaker(null);
                                handleTurnTransition(3000);
                            }
                        });
                    } else {
                        concludeSession(true);
                    }
                    return;
                }
                
                setTranscript(prev => [...prev, { speakerId: 'user', speakerName: 'You', text: textToSend, timestamp: new Date().toLocaleTimeString() }]);
            }
            resetTranscript();

            setCurrentSpeaker(null);
            handleTurnTransition(3000);
        } else {
            startListening();
            setCurrentSpeaker('user');
            if (discussionTimeoutRef.current) {
                clearTimeout(discussionTimeoutRef.current);
                discussionTimeoutRef.current = null;
            }
        }
    }

    const handleMicToggleRef = useRef<() => void>(handleMicToggle);
    useEffect(() => {
        handleMicToggleRef.current = handleMicToggle;
    });

    // 5-second Silence Timeout
    useEffect(() => {
        let silenceTimer: NodeJS.Timeout;
        if (isListening || currentSpeaker === 'user') {
            silenceTimer = setTimeout(() => {
                toast("Turn Automatically Ended", { description: "You remained silent for 5 seconds." });
                handleMicToggleRef.current?.();
            }, 5000);
        }
        return () => {
            if (silenceTimer) clearTimeout(silenceTimer);
        };
    }, [isListening, currentSpeaker, userTranscript, interimTranscript]);

    const toggleCam = () => {
        if (userStream.current) {
            userStream.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setCameraActive(track.enabled);
            });
        }
    }

    const handleStop = () => {
        window.speechSynthesis.cancel();
        if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current);
        setIsActive(false);
        navigate('/dashboard/group-discussion');
    };
    const handleSkipPreparation = () => { setTimeLeft(0); };

    // Participants list including Moderator
    const allParticipants = [
        { ...MODERATOR, isUser: false },
        { id: 'user', name: userInfo?.name?.split(' ')[0] || 'You', role: 'Candidate', isUser: true, color: 'bg-indigo-100 text-indigo-700', systemPrompt: '', avatar: '' },
        ...AI_AGENTS
    ];

    return (
        <div className="h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">

            {/* 1. Navbar / Header */}
            <div className="h-20 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 z-20 relative">
                <div className="flex items-center gap-4 z-10 w-1/4">
                    <Button variant="ghost" size="sm" onClick={handleStop} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Exit
                    </Button>
                </div>

                {/* Centered Topic */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-1/2">
                    <h1 className="text-lg md:text-xl font-bold text-indigo-700 text-center leading-tight line-clamp-2 max-w-full drop-shadow-sm">
                        {topic}
                    </h1>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                        {isActive ? "LIVE SESSION" : isIntro ? "INTRODUCTION" : isPreparing ? "PREPARATION" : "SESSION ENDED"}
                    </span>
                </div>

                <div className="flex items-center justify-end gap-3 z-10 w-1/4">
                    {/* Timer Pill */}
                    <div className={cn(
                        "flex items-center gap-2 rounded-full font-mono font-bold tracking-wider px-4 py-1.5 text-sm border",
                        isPreparing
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-white text-slate-700 border-slate-200"
                    )}>
                        <Clock className="w-4 h-4" />
                        {isPreparing ? (
                            <>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </>
                        ) : (
                            <>
                                {Math.floor(discussionTimer / 60)}:{(discussionTimer % 60).toString().padStart(2, '0')}
                            </>
                        )}
                    </div>

                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 text-slate-500" onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}>
                        <MessageSquare className="w-5 h-5" />
                    </Button>

                </div>
            </div>

            <div className={cn(
                "flex-1 relative flex flex-col justify-center overflow-hidden bg-slate-50 transition-all duration-300",
                isTranscriptOpen ? "pr-80" : ""
            )}>
                <div className={cn(
                    "grid gap-4 p-4 w-full h-full max-h-full",
                    "grid-cols-2 md:grid-cols-3 grid-rows-2"
                )}>
                    {allParticipants.map((p) => {
                        const isSpeaking = currentSpeaker === p.id;
                        const isMe = p.id === 'user';
                        const isMod = p.id === 'moderator';

                        return (
                            <div key={p.id} className="flex flex-col gap-2 group h-full min-h-0">
                                <div className={cn(
                                    "relative flex-1 rounded-2xl overflow-hidden bg-white border-2 transition-all duration-300 shadow-sm min-h-0",
                                    isSpeaking ? "border-green-500 shadow-md ring-2 ring-green-100" : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
                                )}>
                                    {/* Video/Avatar Area */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
                                        {isMe ? (
                                            !cameraActive ? (
                                                <Avatar className="w-20 h-20 lg:w-24 lg:h-24 opacity-80 border-2 border-slate-200 bg-white">
                                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 text-lg font-bold">YOU</AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
                                            )
                                        ) : (
                                            // AI Agents & Moderator
                                            <AvatarPlayer
                                                state={isSpeaking ? 'talking' : 'idle'}
                                                videoSet={
                                                    isMod ? DAVID_VIDEOS :
                                                    p.id === 'p1' ? ALEX_VIDEOS :
                                                    p.id === 'p2' ? SARAH_VIDEOS :
                                                    p.id === 'p3' ? MIKE_VIDEOS :
                                                    PRIYA_VIDEOS
                                                }
                                                isActive={isSpeaking}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Status Indicators (Top Right) */}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        {!isSpeaking && !isMe && (
                                            <div className="bg-black/20 backdrop-blur-md p-1.5 rounded-full">
                                                <MicOff className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name Label Below Card */}
                                <div className="flex flex-col items-center justify-center gap-1 shrink-0 h-auto">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "font-bold text-slate-700 text-sm",
                                            isSpeaking ? "text-green-600" : ""
                                        )}>
                                            {p.name} {isMe && "(You)"}
                                        </span>
                                        {isMod && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-indigo-100 text-indigo-700 border-indigo-200">HOST</Badge>}
                                    </div>
                                    {isSpeaking && (
                                        <div className="flex gap-1 h-3 items-end justify-center">
                                            <span className="w-0.5 bg-green-500 animate-[bounce_1s_infinite] h-2"></span>
                                            <span className="w-0.5 bg-green-500 animate-[bounce_1.2s_infinite] h-3"></span>
                                            <span className="w-0.5 bg-green-500 animate-[bounce_0.8s_infinite] h-1.5"></span>
                                            <span className="text-[10px] text-green-600 font-medium ml-1 leading-none">Speaking...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar (Transcript) */}
                <div className={cn(
                    "fixed top-16 right-0 bottom-0 w-80 bg-white border-l border-slate-200 transition-transform duration-300 z-40 flex flex-col shadow-xl",
                    isTranscriptOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-800">Session Transcript</h3>
                        <Button size="icon" variant="ghost" onClick={() => setIsTranscriptOpen(false)} className="h-6 w-6 text-slate-400 hover:text-slate-700">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {transcript.map((item, i) => (
                                <div key={i} className={cn(
                                    "flex flex-col gap-1",
                                    item.speakerId === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.speakerName}</span>
                                        <span className="text-[9px] text-slate-300">{item.timestamp}</span>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-2 rounded-2xl text-sm max-w-[90%]",
                                        item.speakerId === 'user' ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"
                                    )}>
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* 3. Bottom Controls */}
            <div className="h-24 flex items-center justify-center gap-6 bg-white/80 backdrop-blur-md border-t border-slate-200 shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant={cameraActive ? "outline" : "destructive"}
                                    onClick={toggleCam}
                                    className="w-12 h-12 rounded-full shadow-md"
                                >
                                    {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{cameraActive ? "Turn Camera Off" : "Turn Camera On"}</p>
                            </TooltipContent>
                        </Tooltip>

                        <div className="relative group">
                            <div className={cn(
                                "absolute -inset-1 bg-green-500 rounded-full blur opacity-0 transition duration-500 group-hover:opacity-30",
                                isListening && "opacity-50 animate-pulse"
                            )} />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant={isListening ? "default" : "outline"}
                                        onClick={handleMicToggle}
                                        disabled={isMicDisabled}
                                        className={cn(
                                            "w-16 h-16 rounded-full shadow-lg relative z-10 transition-all duration-300",
                                            isListening ? "bg-green-600 hover:bg-green-700 scale-110" : "hover:border-indigo-400"
                                        )}
                                    >
                                        {isListening ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isListening ? "Stop Speaking" : "Start Speaking"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>

                {!isIntro && (
                    <Button
                        variant="destructive"
                        onClick={() => concludeSession()}
                        disabled={isEnding}
                        className="rounded-full px-6 shadow-md ml-4 gap-2 h-12"
                    >
                        <PhoneOff className="w-4 h-4" /> {isEnding ? "Concluding..." : "End Discussion"}
                    </Button>
                )}

                {isPreparing && (
                    <Button onClick={handleSkipPreparation} className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 shadow-md ml-4">
                        Skip Preparation
                    </Button>
                )}
            </div>


        </div>
    );
};

export default GroupDiscussion;
