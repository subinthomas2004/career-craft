import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff, Copy, UserPlus, Monitor, ArrowLeft, MessageSquare, X, Play, RefreshCw, PhoneOff, Clock, SkipForward } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

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
    color: 'bg-slate-900 text-white',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Interviewer&clothing=graphicShirt'
};

const AI_AGENTS: Participant[] = [
    { id: 'p1', name: 'Alex', role: 'Candidate', color: 'bg-blue-100 text-blue-700', systemPrompt: "You are a confident candidate in a Group Discussion. Keep your points concise, relevant, and build upon others' ideas.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: 'p2', name: 'Sarah', role: 'Candidate', color: 'bg-red-100 text-red-700', systemPrompt: "You are a participant in a Group Discussion. Be polite but firm in your opinions. Agree or disagree constructively.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 'p3', name: 'Mike', role: 'Candidate', color: 'bg-green-100 text-green-700', systemPrompt: "You are a candidate in a Group Discussion. Use data or logical reasoning to support your arguments.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: 'p4', name: 'Priya', role: 'Candidate', color: 'bg-purple-100 text-purple-700', systemPrompt: "You are a candidate in a Group Discussion. Focus on bringing a balanced perspective to the topic.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: 'p5', name: 'David', role: 'Candidate', color: 'bg-orange-100 text-orange-700', systemPrompt: "You are a candidate in a Group Discussion. Listen well and summarize or extend the current point of discussion.", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
];

const BACKEND_URL = 'http://localhost:5001';

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
            className={cn("w-full h-full object-cover transition-transform duration-500", isSpeaking ? "scale-105" : "")}
        />
    );
};

const GroupDiscussion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { topic: initialTopic } = location.state || {};

    // State
    const [topic, setTopic] = useState(initialTopic || 'Universal Basic Income');
    const [isActive, setIsActive] = useState(false);
    const [isIntro, setIsIntro] = useState(true); // New state for Intro
    const [isPreparing, setIsPreparing] = useState(false); // Starts false, waits for intro
    const [timeLeft, setTimeLeft] = useState(120); // 2 Minutes Cool-off
    const [discussionTimer, setDiscussionTimer] = useState(600); // 10 Minutes Discussion Limit
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // Voice Recognition
    const {
        isListening,
        transcript: userTranscript,
        startListening,
        stopListening,
        resetTranscript
    } = useSpeechRecognition();

    const isUserSpeaking = isListening && userTranscript.length > 0;

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
            // Wait a bit for page load
            await new Promise(resolve => setTimeout(resolve, 1000));

            const text = `Hello everyone, good evening. The topic for today's group discussion is ${topic}. Please take 2 minutes to prepare your thoughts. You may begin preparation now.`;

            setCurrentSpeaker(MODERATOR.id);
            setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);

            await speakText(text);

            setCurrentSpeaker(null);
            setIsIntro(false);
            setIsPreparing(true); // Start Cool-off
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

        // Moderator "Please Start" Signal
        setCurrentSpeaker(MODERATOR.id);
        const text = "Time is up. Please start the discussion.";
        setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);

        await speakText(text);

        setCurrentSpeaker(null);
        setIsActive(true); // Start Discussion (Enable Random Turns)
        toast.success("Discussion Started!", { description: "The floor is open." });

        // Randomly pick someone to start (30% chance User, 70% chance AI)
        // Wait a tiny bit after Moderator speaks
        setTimeout(() => {
            if (Math.random() > 0.3) {
                const randomAgent = AI_AGENTS[Math.floor(Math.random() * AI_AGENTS.length)];
                triggerAgentTurn(randomAgent);
            }
        }, 1000);
    };

    const speakText = (text: string): Promise<void> => {
        return new Promise((resolve) => {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);

            utterance.onend = () => {
                resolve();
            };

            // Handle error case to prevent hanging
            utterance.onerror = () => {
                resolve();
            };

            synth.speak(utterance);
        });
    };

    const concludeSession = async () => {
        setIsActive(false); // Stop everyone

        // MODERATOR speaks
        const text = "Alright everyone, that's enough. We've had a good discussion. Thank you for your participation.";

        // 1. Set Visuals
        setCurrentSpeaker(MODERATOR.id);
        setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);

        // 2. Speak and Wait
        await speakText(text);

        // 3. Clear Visuals
        setCurrentSpeaker(null);
        toast.info("Session Ended by Interviewer.");
    };

    const triggerAgentTurn = async (agent: Participant) => {
        if (processing || currentSpeaker) return; // Prevent double speak override

        setProcessing(true);

        // Simulating "Thinking" pause (but no visuals yet)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));

        try {
            const context = transcript.map(t => `${t.speakerName}: ${t.text}`).join('\n');
            const res = await axios.post('http://localhost:5003/api/groq/gd/response', {
                topic, agentName: agent.name, role: agent.role, style: agent.systemPrompt, context
            });
            const text = res.data.response;
            if (text) {
                // 1. Set Visuals (Red Border + Transcript) ONLY when ready to speak
                setCurrentSpeaker(agent.id);
                setTranscript(prev => [...prev, { speakerId: agent.id, speakerName: agent.name, text, timestamp: new Date().toLocaleTimeString() }]);

                // 2. Speak and Wait for completion
                await speakText(text);
            }
        } catch (e) {
            console.error(e);
            // Don't need to reset currentSpeaker here as it only sets on success
        } finally {
            // 3. Clear Visuals & Unlock
            setCurrentSpeaker(null);
            setProcessing(false);

            // Small pause before next chance to prevent instant jumps
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    // Moderator interjection logic
    const triggerModerator = async () => {
        if (Math.random() > 0.3) return;

        setProcessing(true);
        const text = "That's an interesting perspective. Does anyone else have thoughts on that?";

        setCurrentSpeaker(MODERATOR.id);
        setTranscript(prev => [...prev, { speakerId: MODERATOR.id, speakerName: MODERATOR.name, text, timestamp: new Date().toLocaleTimeString() }]);

        await speakText(text);

        setCurrentSpeaker(null);
        setProcessing(false);
    }

    // Random Loop for Turn Taking
    useEffect(() => {
        if (!isActive || isPreparing || processing || currentSpeaker) return;

        // Check every 2 seconds if someone should speak
        const interval = setInterval(() => {
            // Processing check double-verification
            if (Math.random() > 0.5 && !processing && !currentSpeaker) {
                const availableAgents = AI_AGENTS.filter(a => a.id !== transcript[transcript.length - 1]?.speakerId); // Don't speak twice in row if possible
                const agent = availableAgents[Math.floor(Math.random() * availableAgents.length)] || AI_AGENTS[0];
                triggerAgentTurn(agent);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [isActive, isPreparing, processing, currentSpeaker, transcript]);


    // --- UI Helpers ---
    const copyLink = () => {
        const url = `${window.location.origin}/dashboard/group-discussion/room?room=${roomId}&topic=${encodeURIComponent(topic)}`;
        navigator.clipboard.writeText(url);
        toast.success(`Invite Code: ${roomId} copied!`);
    };
    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
        // Also toggle actual stream track
        if (userStream.current) {
            userStream.current.getAudioTracks().forEach(track => track.enabled = !isListening);
        }

    };
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

    // Layout Calculation
    // We need 6 participants: 1 User + 5 Agents (or Peers if multiplayer, replacing Agents)
    // For now, let's assume we fill slots with Agents if no peers.
    const participants = [
        { id: 'user', name: 'You', role: 'Candidate', isUser: true, color: 'bg-indigo-100 text-indigo-700', systemPrompt: '' },
        ...peers.map((p, i) => ({ ...AI_AGENTS[i], ...p, isUser: false, isPeer: true })),
        ...AI_AGENTS.slice(peers.length) // Fill remaining slots
    ];


    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">

            {/* Header */}
            <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleStop} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Exit
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 max-w-xl truncate" title={topic}>{topic}</h1>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            {isActive ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-amber-500" />}
                            {isActive ? "Live Session" : "Preparation"} • {participants.length + 1} Participants
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isPreparing ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 font-bold">
                                <Clock className="w-3 h-3" />
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                            <Button size="sm" variant="ghost" onClick={handleSkipPreparation} className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 h-8">
                                Skip <SkipForward className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            TIME: {Math.floor(discussionTimer / 60)}:{(discussionTimer % 60).toString().padStart(2, '0')}
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 font-medium">CODE:</span>
                        <span className="text-sm font-mono font-bold text-slate-800 tracking-wider text-slate-900">{roomId}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 ml-1 text-slate-400 hover:text-slate-700" onClick={copyLink}>
                            <Copy className="w-3 h-3" />
                        </Button>
                    </div>
                    <Button onClick={copyLink} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-md shadow-indigo-200">
                        <UserPlus className="w-4 h-4" /> Invite
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Background Decoration - REMOVED for Light Mode */}

                {/* Stage Area */}
                <div className={cn("flex-1 p-6 lg:p-10 transition-all duration-300 flex flex-col items-center justify-center", isTranscriptOpen ? "mr-96" : "mr-0")}>

                    {/* 4x2 GRID Container */}
                    <div className="w-full max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 p-4">

                        {/* 1. MODERATOR (Top Center - 2x1 Spanning, but constrained to Square) */}
                        <div className="col-span-1 md:col-span-2 row-span-1 md:col-start-2 md:row-start-1 flex justify-center items-center py-2">
                            <div className={cn(
                                "relative group h-full aspect-square rounded-2xl bg-white shadow-lg border-2 transition-all duration-500 overflow-hidden",
                                currentSpeaker === MODERATOR.id ? "border-indigo-500 shadow-xl scale-110 z-20" : "border-slate-100"
                            )}>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                    <Avatar className="w-24 h-24 mb-3 border-4 border-slate-50 shadow-inner">
                                        <AvatarImage src={MODERATOR.avatar} />
                                        <AvatarFallback>MOD</AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-slate-800">{MODERATOR.name}</h3>
                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 mt-1 inline-block">Moderator</span>
                                    </div>
                                </div>
                                {currentSpeaker === MODERATOR.id && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 animate-pulse" />
                                )}
                            </div>
                        </div>

                        {/* 2. PARTICIPANTS */}
                        {participants.map((p, i) => {
                            const isSpeaking = currentSpeaker === p.id;

                            // 4x2 Grid Positioning Map
                            // Row 1: User (L), Mod (C), AI 1 (R)
                            // Row 2: AI 2 (L), AI 3 (C-L), AI 4 (C-R), AI 5 (R)
                            // User request: Left 2, Right 2, Bottom 2.

                            const gridClasses = [
                                "md:col-start-1 md:row-start-1", // 0: User (Top Left)
                                "md:col-start-4 md:row-start-1", // 1: AI 1 (Top Right)
                                "md:col-start-1 md:row-start-2", // 2: AI 2 (Bottom Left)
                                "md:col-start-2 md:row-start-2", // 3: AI 3 (Bottom Center Left)
                                "md:col-start-3 md:row-start-2", // 4: AI 4 (Bottom Center Right)
                                "md:col-start-4 md:row-start-2", // 5: AI 5 (Bottom Right)
                            ];

                            const positionClass = gridClasses[i] || "hidden";

                            return (
                                <div key={p.id} className={cn(
                                    "relative w-full h-full bg-white rounded-2xl shadow-md border-2 transition-all duration-500 overflow-hidden group hover:border-slate-300",
                                    positionClass,
                                    isSpeaking ? "border-green-500 shadow-lg scale-[1.02] z-10" : "border-slate-100"
                                )}>

                                    {/* Content */}
                                    {p.isUser ? (
                                        <div className="relative w-full h-full bg-slate-900">
                                            {!cameraActive ? (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <div className="text-center">
                                                        <VideoOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                                        <p className="text-xs font-medium">Camera Off</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
                                            )}

                                            {/* User Controls */}
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                <button onClick={(e) => { e.stopPropagation(); toggleMic(); }} className={cn("p-2 rounded-full transition-all", isListening ? "bg-white text-black" : "bg-red-500 text-white")}>
                                                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); toggleCam(); }} className={cn("p-2 rounded-full transition-all", cameraActive ? "bg-white/20 text-white" : "bg-red-500 text-white")}>
                                                    {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            <div className="absolute top-3 right-3">
                                                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded shadow-sm">YOU</span>
                                            </div>
                                        </div>
                                    ) : (p as any).isPeer && (p as any).stream ? (
                                        <PeerVideo stream={(p as any).stream} isSpeaking={isSpeaking} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-4">
                                            <Avatar className={cn("w-20 h-20 mb-3 border-2 shadow-sm transition-all", isSpeaking ? "border-green-200" : "border-white")}>
                                                <AvatarImage src={(p as any).avatar} />
                                                <AvatarFallback>{p.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}

                                    {/* Name & Role Label */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 leading-none">{p.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">{p.role}</p>
                                        </div>
                                        {isSpeaking && <Mic className="w-4 h-4 text-green-500 animate-pulse" />}
                                    </div>

                                    {/* Speaking Border Glow (Simulated) */}
                                    {isSpeaking && <div className="absolute inset-0 border-4 border-green-500 rounded-2xl pointer-events-none animate-pulse" />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Controls */}
                    <div className="mt-8 flex justify-center gap-4 pb-8">
                        {isActive && (
                            <Button size="lg" variant="destructive" onClick={concludeSession} className="px-8 rounded-full shadow-lg shadow-red-100 hover:shadow-red-200 transition-all font-semibold">
                                <PhoneOff className="w-5 h-5 mr-2" /> End Session
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="lg"
                            className={cn("rounded-full border shadow-sm hover:shadow-md transition-all", isTranscriptOpen ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-700")}
                            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                        >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            {isTranscriptOpen ? "Hide Chat" : "Show Chat"}
                        </Button>
                    </div>

                </div>

                {/* Collapsible Transcript Panel (Right Side) */}
                <div className={cn(
                    "absolute top-0 right-0 bottom-0 w-96 bg-white/95 border-l border-slate-200 shadow-2xl backdrop-blur-xl transition-transform duration-300 transform z-40 flex flex-col",
                    isTranscriptOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-indigo-600" /> Live Transcript
                        </h3>
                        <Button variant="ghost" size="icon" onClick={() => setIsTranscriptOpen(false)} className="text-slate-400 hover:text-slate-700">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        {transcript.length === 0 ? (
                            <div className="text-center text-slate-500 mt-20 text-sm">
                                <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                Discussion hasn't started yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transcript.map((t, i) => {
                                    const isMe = t.speakerId === 'user';
                                    const isMod = t.speakerId === MODERATOR.id;

                                    return (
                                        <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-2 flex flex-col", isMe ? "items-end" : "items-start")}>
                                            <div className="flex items-center gap-2 mb-1.5 px-1">
                                                <Avatar className="w-4 h-4">
                                                    <AvatarImage src={isMod ? MODERATOR.avatar : participants.find(p => p.id === t.speakerId)?.avatar} />
                                                    <AvatarFallback className="text-[6px]">{t.speakerName[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className={cn("text-xs font-bold", isMe ? "text-indigo-400" : isMod ? "text-amber-400" : "text-slate-400")}>{t.speakerName}</span>
                                                <span className="text-[10px] text-slate-500">{t.timestamp}</span>
                                            </div>
                                            <p className={cn(
                                                "text-sm p-3.5 rounded-2xl max-w-[90%] leading-relaxed shadow-sm border",
                                                isMe ? "bg-indigo-600 text-white rounded-tr-none border-indigo-600 shadow-indigo-100" :
                                                    isMod ? "bg-white text-slate-800 rounded-tl-none border-slate-200" :
                                                        "bg-slate-50 text-slate-700 rounded-tl-none border-slate-100"
                                            )}>
                                                {t.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Status Bar */}
                    <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-500 sticky bottom-0">
                        {processing ? (
                            <span className="flex items-center justify-center gap-2 text-indigo-600 animate-pulse font-medium">
                                <RefreshCw className="w-3 h-3 animate-spin" /> AI is analyzing...
                            </span>
                        ) : isUserSpeaking ? (
                            <span className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                <Mic className="w-3 h-3 animate-pulse" /> Listening to you...
                            </span>
                        ) : (
                            <span>Listening for activity...</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GroupDiscussion;
