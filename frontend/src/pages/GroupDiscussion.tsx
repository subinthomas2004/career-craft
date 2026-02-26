import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Mic, MicOff, Video, VideoOff, Copy, UserPlus, Monitor, ArrowLeft,
    MessageSquare, X, PhoneOff, Clock, SkipForward, Users, MoreVertical,
    Settings, LayoutGrid, Maximize2
} from 'lucide-react';
import AvatarPlayer from "@/components/interview/AvatarPlayer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from "@/lib/api";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
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
    isPeer?: boolean;
    stream?: MediaStream;
}

interface TranscriptItem {
    speakerId: string;
    speakerName: string;
    text: string;
    timestamp: string;
}

interface PeerData {
    peerId: string;
    peer: SimplePeer.Instance;
    stream?: MediaStream;
}

// --- Constants ---
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

const SARAH_VIDEOS = {
    idle: "/avatars/hr/hr_listening.mp4",
    talking: "/avatars/hr/hr_talking.mp4",
    listening: "/avatars/hr/hr_listening.mp4",
    nodding: "/avatars/hr/hr_nodding.mp4"
};

const DAVID_VIDEOS = {
    idle: "/avatars/tech/tech_listening.mp4",
    talking: "/avatars/tech/tech_talking.mp4",
    listening: "/avatars/tech/tech_listening.mp4",
    nodding: "/avatars/tech/tech_nodding.mp4"
};

const BACKEND_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : window.location.origin;

// --- Video Component for Peers ---
const PeerVideo = ({ stream, isSpeaking }: { stream: MediaStream, isSpeaking: boolean }) => {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (stream && ref.current) ref.current.srcObject = stream;
    }, [stream]);
    return (
        <video
            ref={ref}
            autoPlay
            playsInline
            className={cn("w-full h-full object-cover transition-transform duration-500 rounded-xl", isSpeaking ? "scale-105" : "")}
        />
    );
};

const GroupDiscussion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { topic: initialTopic, timeLimit = 10, isMultiplayer = false, peerUsers = [], roomCode: lobbyRoomCode = '' } = location.state || {}; // Default 10 mins

    // User Info
    const [userInfo, setUserInfo] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem("userInfo");
        if (stored) setUserInfo(JSON.parse(stored));
    }, []);
    // In multiplayer mode, reduce AI agents based on how many friends joined
    const peerCount = Array.isArray(peerUsers) ? peerUsers.length : (peerUsers ? 1 : 0);
    const activeAIAgents = AI_AGENTS.slice(0, Math.max(0, 4 - peerCount));

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
    const [processing, setProcessing] = useState(false);
    const [turnCycle, setTurnCycle] = useState<number>(0);
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

    const isUserSpeaking = interimTranscript.length > 0;

    // Sync Voice Input to Transcript
    useEffect(() => {
        if (userTranscript.trim()) {
            const text = userTranscript.trim();
            setTranscript(prev => [...prev, { speakerId: 'user', speakerName: 'You', text, timestamp: new Date().toLocaleTimeString() }]);
            resetTranscript(); // Clear hook buffer so we don't duplicate

            // Trigger Turn Transition
            handleTurnTransition(2000);
        }
    }, [userTranscript, resetTranscript]);

    // Media & Hardware
    const [cameraActive, setCameraActive] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const userStream = useRef<MediaStream>();

    // Multiplayer State
    const [peers, setPeers] = useState<PeerData[]>([]);
    const socketRef = useRef<any>();
    const peersRef = useRef<{ peerId: string; peer: SimplePeer.Instance }[]>([]);
    const sentParams = searchParams.get('room');

    // Generate 6-char random code
    const generateRoomId = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        return result;
    }

    const [roomId] = useState(sentParams || generateRoomId());
    const [userId] = useState(Math.random().toString(36).substring(7));

    // 1. Initialize & Socket Connection
    useEffect(() => {
        socketRef.current = io(BACKEND_URL);

        // Get Local Stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            userStream.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Join Room
            socketRef.current.emit('join-room', roomId, userId);

            // Socket Listeners
            socketRef.current.on('user-connected', (newUser: string) => {
                connectToNewUser(newUser, stream);
                toast.success("A new user joined!");
            });

            socketRef.current.on('user-disconnected', (disconnectedUser: string) => {
                const peerObj = peersRef.current.find(p => p.peerId === disconnectedUser);
                if (peerObj) peerObj.peer.destroy();
                const newPeers = peersRef.current.filter(p => p.peerId !== disconnectedUser);
                peersRef.current = newPeers;
                setPeers(prev => prev.filter(p => p.peerId !== disconnectedUser));
            });

            socketRef.current.on('signal', (data: any) => {
                const item = peersRef.current.find(p => p.peerId === data.callerID);
                if (item) item.peer.signal(data.signal);
            });

            socketRef.current.on("signal", (payload: any) => {
                const item = peersRef.current.find(p => p.peerId === payload.callerID);
                if (item) {
                    item.peer.signal(payload.signal);
                } else {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({ peerId: payload.callerID, peer });
                    setPeers(prev => [...prev, { peerId: payload.callerID, peer }]);
                }
            });
        });

        return () => {
            socketRef.current.disconnect();
            userStream.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    // Fix: Re-attach stream when camera is toggled back on
    useEffect(() => {
        if (cameraActive && videoRef.current && userStream.current) {
            videoRef.current.srcObject = userStream.current;
        }
    }, [cameraActive]);

    // Helper: Initiator 
    function connectToNewUser(userIdToCall: string, stream: MediaStream) {
        const peer = new SimplePeer({ initiator: true, trickle: false, stream });
        peer.on("signal", (signal) => socketRef.current.emit("signal", { target: userIdToCall, callerID: userId, signal }));
        peer.on("stream", (remoteStream) => setPeers(prev => prev.map(p => p.peerId === userIdToCall ? { ...p, stream: remoteStream } : p)));
        peersRef.current.push({ peerId: userIdToCall, peer });
        setPeers(prev => [...prev, { peerId: userIdToCall, peer }]);
    }

    // Helper: Receiver 
    function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
        const peer = new SimplePeer({ initiator: false, trickle: false, stream });
        peer.on("signal", (signal) => socketRef.current.emit("signal", { target: callerID, callerID: userId, signal }));
        peer.on("stream", (remoteStream) => setPeers(prev => prev.map(p => p.peerId === callerID ? { ...p, stream: remoteStream } : p)));
        return peer;
    }

    // --- Logic ---

    // 1. On Mount: Play Intro
    useEffect(() => {
        const playIntro = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const text = `Hello everyone, good evening. The topic for today's group discussion is ${topic}. Please take 2 minutes to prepare your thoughts. You may begin preparation now.`;
            setCurrentSpeaker(MODERATOR.id);
            setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);
            await speakText(text);
            setCurrentSpeaker(null);
            setIsIntro(false);
            setIsPreparing(true);
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
        await speakText(text);
        setCurrentSpeaker(null);
        setIsActive(true);
        toast.success("Discussion Started!", { description: "The floor is open." });

        // Initial Wait for User (3 seconds)
        handleTurnTransition(3000);
    };

    const handleTurnTransition = (delayMs: number = 2000) => {
        if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current);

        discussionTimeoutRef.current = setTimeout(() => {
            if (!isUserSpeaking && !processing && !currentSpeaker) {
                // User didn't take the floor, trigger AI
                const currentTranscript = transcriptRef.current;
                const lastSpeakerId = currentTranscript[currentTranscript.length - 1]?.speakerId;

                // Pick next agent (ensure it's not the same as last speaker if possible)
                const availableAgents = activeAIAgents.filter(a => a.id !== lastSpeakerId);
                const nextAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)] || activeAIAgents[0];

                triggerAgentTurn(nextAgent);
            }
        }, delayMs);
    };

    const speakText = (text: string): Promise<void> => {
        return new Promise((resolve) => {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => { resolve(); };
            utterance.onerror = () => { resolve(); };
            synth.speak(utterance);
        });
    };

    const concludeSession = async () => {
        setIsActive(false);
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
                participants: participantsData
            }
        });
    };

    const triggerAgentTurn = async (agent: Participant) => {
        if (processing || currentSpeaker) return;
        setProcessing(true);
        // await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000)); // Remove extra artificial delay, we handled it in transition
        try {
            const context = transcriptRef.current.map(t => `${t.speakerName}: ${t.text}`).join('\n');
            const res = await api.post('/groq/gd/response', {
                topic, agentName: agent.name, role: agent.role, style: agent.systemPrompt, context
            });
            const text = res.data.response;
            if (text) {
                setCurrentSpeaker(agent.id);
                setTranscript(prev => [...prev, { speakerId: agent.id, speakerName: agent.name, text, timestamp: new Date().toLocaleTimeString() }]);
                await speakText(text);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCurrentSpeaker(null);
            setProcessing(false);
            // After AI finishes, wait for user again (2 seconds)
            handleTurnTransition(2000);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        // If user sends message, cancel any pending AI turn
        if (discussionTimeoutRef.current) clearTimeout(discussionTimeoutRef.current);

        const text = inputText.trim();
        setInputText("");
        setTranscript(prev => [...prev, { speakerId: 'user', speakerName: 'You', text, timestamp: new Date().toLocaleTimeString() }]);

        // After user speaks, wait for other agents to respond (2 seconds)
        handleTurnTransition(2000);
    };

    // Monitor for User Voice Activity to Interrupt/Claim Turn
    useEffect(() => {
        if (isUserSpeaking) {
            // If user starts speaking, CANCEL the AI turn timer immediately
            if (discussionTimeoutRef.current) {
                clearTimeout(discussionTimeoutRef.current);
                discussionTimeoutRef.current = null;
            }
        }
    }, [isUserSpeaking]);

    // When User STOPS speaking (transcript receives data), trigger next turn
    // Note: useSpeechRecognition logic might need to trigger this explicitly or we observe transcript length change
    useEffect(() => {
        // Simple check: if last transcript message is from user, trigger next turn transition
        const lastMsg = transcript[transcript.length - 1];
        if (lastMsg && lastMsg.speakerId === 'user' && isActive && !processing && !currentSpeaker) {
            handleTurnTransition(2000);
        }
    }, [transcript, isActive, processing, currentSpeaker]);

    /* Removed Random Loop */



    // --- UI Helpers ---
    const copyLink = () => {
        const url = `${window.location.origin}/group-discussion/room?room=${roomId}&topic=${encodeURIComponent(topic)}`;
        navigator.clipboard.writeText(url);
        toast.success(`Invite Code: ${roomId} copied!`);
    };
    const handleMicToggle = () => {
        if (isListening) stopListening();
        else startListening();
    }

    const toggleCam = () => {
        if (userStream.current) {
            userStream.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setCameraActive(track.enabled);
            });
        }
    }

    const handleStop = () => navigate('/dashboard/group-discussion');
    const handleSkipPreparation = () => { setIsPreparing(false); setIsActive(true); setTimeLeft(0); };


    // Participants list including Moderator
    const normalizedPeerUsers = Array.isArray(peerUsers) ? peerUsers : (peerUsers ? [peerUsers] : []);
    const allParticipants = [
        { ...MODERATOR, isUser: false },
        { id: 'user', name: userInfo?.name?.split(' ')[0] || 'You', role: 'Candidate', isUser: true, color: 'bg-indigo-100 text-indigo-700', systemPrompt: '', avatar: '' },
        ...normalizedPeerUsers.map((pu: any, i: number) => ({
            id: `peer-${i}`, name: pu.name?.split(' ')[0] || `Friend ${i + 1}`, role: 'Candidate', isUser: false, isPeer: true, color: 'bg-teal-100 text-teal-700', systemPrompt: '', avatar: pu.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pu.name}`
        })),
        ...peers.map((p, i) => ({ ...activeAIAgents[i], ...p, isUser: false, isPeer: true })),
        ...activeAIAgents.slice(peers.length)
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
                        {isActive ? "LIVE SESSION" : isPreparing ? "PREPARATION" : "SESSION ENDED"}
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
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 text-slate-500">
                        <Users className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className={cn(
                "flex-1 relative flex flex-col justify-center overflow-hidden bg-slate-50 transition-all duration-300",
                isTranscriptOpen ? "pr-80" : ""
            )}>
                <div className={cn(
                    "grid gap-4 p-4 w-full h-full max-h-full",
                    "grid-cols-2 md:grid-cols-3 grid-rows-2" // 3 columns for 6 participants (2 rows)
                )}>
                    {allParticipants.map((p) => {
                        const isSpeaking = currentSpeaker === p.id;
                        const isMe = p.id === 'user';
                        const isMod = p.id === 'moderator';

                        return (
                            <div key={p.id} className="flex flex-col gap-2 group h-full min-h-0">
                                <div className={cn(
                                    "relative flex-1 rounded-2xl overflow-hidden bg-white border-2 transition-all duration-300 shadow-sm min-h-0",
                                    isSpeaking ? "border-green-500 shadow-md ring-2 ring-green-100 scale-[1.01]" : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
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
                                        ) : (p as any).isPeer && (p as any).stream ? (
                                            <PeerVideo stream={(p as any).stream} isSpeaking={isSpeaking} />
                                        ) : (
                                            // AI Agents & Moderator
                                            <AvatarPlayer
                                                state={isSpeaking ? 'talking' : 'idle'}
                                                videoSet={(isMod || ['Alex', 'Mike'].includes(p.name)) ? DAVID_VIDEOS : SARAH_VIDEOS}
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
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-4">
                            {transcript.map((t, i) => (
                                <div key={i} className={cn("flex flex-col gap-1", t.speakerId === 'user' ? "items-end" : "items-start")}>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                                        <span className={cn("font-bold", t.speakerId === 'user' ? "text-indigo-600" : "text-slate-600")}>{t.speakerName}</span>
                                        <span>{t.timestamp}</span>
                                    </div>
                                    <p className={cn(
                                        "text-sm p-3 rounded-2xl max-w-[90%] shadow-sm border",
                                        t.speakerId === 'user'
                                            ? "bg-indigo-600 text-white rounded-tr-none border-indigo-600"
                                            : "bg-white text-slate-700 rounded-tl-none border-slate-100"
                                    )}>{t.text}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* 3. Bottom Control Bar */}
            <div className="h-24 flex items-center justify-center gap-6 shrink-0 relative z-30 bg-transparent pointer-events-none mb-4">

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isListening ? "default" : "secondary"}
                                size="lg"
                                className={cn("rounded-full h-12 w-12 p-0 transition-all shadow-sm pointer-events-auto", isListening ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50")}
                                onClick={handleMicToggle}
                            >
                                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{isListening ? "Mute" : "Unmute"}</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={cameraActive ? "default" : "secondary"}
                                size="lg"
                                className={cn("rounded-full h-12 w-12 p-0 transition-all shadow-sm pointer-events-auto", cameraActive ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50")}
                                onClick={toggleCam}
                            >
                                {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{cameraActive ? "Turn Off Camera" : "Turn On Camera"}</p></TooltipContent>
                    </Tooltip>

                    {isPreparing && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="rounded-full px-6 h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold hover:scale-105 transition-all shadow-md shadow-amber-100 pointer-events-auto"
                                    onClick={handleSkipPreparation}
                                >
                                    Start Now <SkipForward className="w-4 h-4 ml-2" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Skip Preparation Time</p></TooltipContent>
                        </Tooltip>
                    )}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="rounded-full px-8 h-12 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 hover:border-red-200 font-bold hover:scale-105 transition-all shadow-sm pointer-events-auto"
                                onClick={concludeSession}
                            >
                                <PhoneOff className="w-5 h-5 mr-2" /> End Call
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Leave Discussion</p></TooltipContent>
                    </Tooltip>

                    <div className="w-px h-8 bg-slate-200 mx-2" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                className="rounded-full h-12 w-12 p-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 shadow-sm pointer-events-auto"
                                onClick={copyLink}
                            >
                                <UserPlus className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Invite Others</p></TooltipContent>
                    </Tooltip>

                </TooltipProvider>

            </div>
        </div>
    );
};

export default GroupDiscussion;
