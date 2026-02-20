import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Copy, Users, MessageSquare, Send, Crown, Clock, Loader2,
    CheckCircle2, ArrowLeft, Play, Sparkles, UserPlus
} from 'lucide-react';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : window.location.origin;

interface LobbyParticipant {
    socketId: string;
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    isHost: boolean;
}

interface ChatMessage {
    sender: string;
    text: string;
    timestamp: string;
}

const GDLobby = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Determine if host or joiner
    const stateData = location.state || {};
    const isHost = stateData.isHost === true;
    const topicFromState = stateData.topic || '';
    const timeLimitFromState = stateData.timeLimit || 10;

    // Room code from URL param (for joiners via /join/:code) or query param
    const { code: codeFromPath } = useParams();
    const codeFromUrl = codeFromPath || searchParams.get('code') || '';
    const topicFromUrl = searchParams.get('topic') || '';

    // Generate room code for host
    const generateRoomId = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        return result;
    };

    const [roomCode] = useState(() => isHost ? generateRoomId() : codeFromUrl);
    const [topic] = useState(topicFromState || topicFromUrl || '');
    const [timeLimit] = useState(timeLimitFromState);

    // User info
    const [userInfo, setUserInfo] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            setUserInfo(JSON.parse(stored));
        } else {
            toast.error("Please log in to join a group discussion.");
            navigate('/auth');
        }
    }, []);

    // State
    const [participants, setParticipants] = useState<LobbyParticipant[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [copied, setCopied] = useState(false);

    const socketRef = useRef<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Socket connection
    useEffect(() => {
        if (!userInfo || !roomCode) return;

        socketRef.current = io(BACKEND_URL);

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            // Join lobby
            socketRef.current.emit('join-lobby', roomCode, {
                userId: userInfo._id || userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                avatar: userInfo.avatar || '',
                isHost
            });
        });

        // Lobby updates
        socketRef.current.on('lobby-update', (updatedParticipants: LobbyParticipant[]) => {
            setParticipants(updatedParticipants);
        });

        // Chat messages
        socketRef.current.on('lobby-chat', (message: ChatMessage) => {
            setChatMessages(prev => [...prev, message]);
        });

        // Discussion started by host
        socketRef.current.on('discussion-started', (data: { topic: string; timeLimit: number }) => {
            socketRef.current.disconnect();
            navigate('/group-discussion/room', {
                state: {
                    topic: data.topic,
                    timeLimit: data.timeLimit,
                    roomCode,
                    isMultiplayer: true,
                    peerUser: participants.find(p => !p.isHost)
                }
            });
        });

        // Room full
        socketRef.current.on('lobby-full', () => {
            toast.error("This room is already full (max 2 participants).");
            navigate('/dashboard/group-discussion');
        });

        // User left
        socketRef.current.on('lobby-user-left', (leftUser: { name: string }) => {
            toast.info(`${leftUser.name} left the lobby.`);
        });

        return () => {
            socketRef.current?.emit('leave-lobby', roomCode);
            socketRef.current?.disconnect();
        };
    }, [userInfo, roomCode]);

    // Send chat message
    const sendChat = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || !socketRef.current) return;

        socketRef.current.emit('lobby-chat-message', roomCode, {
            sender: userInfo.name,
            text: chatInput.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setChatInput('');
    };

    // Copy room code
    const copyCode = () => {
        const url = `${window.location.origin}/group-discussion/join/${roomCode}?topic=${encodeURIComponent(topic)}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Invite link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Copy just the code
    const copyCodeOnly = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        toast.success(`Code "${roomCode}" copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    // Start discussion (host only)
    const startDiscussion = () => {
        if (participants.length < 2) {
            toast.error("Wait for your friend to join before starting.");
            return;
        }
        socketRef.current?.emit('start-discussion', roomCode, { topic, timeLimit });
        // Host also navigates
        socketRef.current?.disconnect();
        const peerUser = participants.find(p => !p.isHost);
        navigate('/group-discussion/room', {
            state: {
                topic,
                timeLimit,
                roomCode,
                isMultiplayer: true,
                peerUser: peerUser ? { name: peerUser.name, email: peerUser.email, avatar: peerUser.avatar } : null
            }
        });
    };

    const friendJoined = participants.length >= 2;
    const hostParticipant = participants.find(p => p.isHost);
    const friendParticipant = participants.find(p => !p.isHost);

    // Format room code for display: ABC-DEF
    const formattedCode = roomCode.slice(0, 3) + '-' + roomCode.slice(3);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 flex flex-col font-sans">

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard/group-discussion')}
                    className="text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                        <Users className="w-3 h-3 mr-1" />
                        {participants.length}/2 Joined
                    </Badge>
                    {isConnected && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">

                {/* Left: Room Info & Participants */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* Room Code Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                <Sparkles className="w-3.5 h-3.5" />
                                {isHost ? 'Your Room Code' : 'Joined Room'}
                            </div>

                            {/* Large Room Code */}
                            <div
                                onClick={copyCodeOnly}
                                className="text-5xl md:text-6xl font-black tracking-[0.3em] text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors select-all"
                                title="Click to copy"
                            >
                                {formattedCode}
                            </div>

                            <p className="text-sm text-slate-500">
                                Share this code with your friend to join
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={copyCode}
                                    className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy Invite Link'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Topic Card (visible once in lobby) */}
                    {topic && (
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="text-xs uppercase tracking-widest font-bold text-indigo-200 mb-2">
                                Discussion Topic
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold leading-snug">
                                {topic}
                            </h2>
                            <div className="flex items-center gap-4 mt-3 text-indigo-200 text-sm">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {timeLimit} min
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" /> 2 users + 3 AI
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Participants */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Participants
                        </h3>
                        <div className="space-y-3">
                            {/* Host */}
                            <div className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all",
                                hostParticipant ? "bg-indigo-50 border border-indigo-100" : "bg-slate-50 border border-dashed border-slate-200"
                            )}>
                                {hostParticipant ? (
                                    <>
                                        <Avatar className="h-10 w-10 border-2 border-indigo-300">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hostParticipant.name}`} />
                                            <AvatarFallback>{hostParticipant.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-800 flex items-center gap-2">
                                                {hostParticipant.name}
                                                <Crown className="w-4 h-4 text-amber-500" />
                                                {hostParticipant.isHost && isHost && (
                                                    <Badge variant="secondary" className="text-[10px] py-0">You</Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500">Host</div>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Waiting for host...</span>
                                    </div>
                                )}
                            </div>

                            {/* Friend slot */}
                            <div className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all",
                                friendParticipant ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-dashed border-slate-200"
                            )}>
                                {friendParticipant ? (
                                    <>
                                        <Avatar className="h-10 w-10 border-2 border-emerald-300">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friendParticipant.name}`} />
                                            <AvatarFallback>{friendParticipant.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-800 flex items-center gap-2">
                                                {friendParticipant.name}
                                                {!friendParticipant.isHost && !isHost && (
                                                    <Badge variant="secondary" className="text-[10px] py-0">You</Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500">Friend</div>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3 text-slate-400 w-full">
                                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <UserPlus className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm">Waiting for friend to join...</span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Loader2 className="w-3 h-3 animate-spin text-slate-300" />
                                                <span className="text-xs text-slate-300">Share the code above</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AI Agents preview */}
                            <div className="pt-2 border-t border-slate-100 mt-2">
                                <div className="text-xs text-slate-400 mb-2 font-medium">+ 3 AI Participants will join</div>
                                <div className="flex items-center gap-2">
                                    {['Alex', 'Sarah', 'Mike'].map(name => (
                                        <div key={name} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full text-xs text-slate-500">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                                            </Avatar>
                                            {name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Button (Host only) */}
                    {isHost && (
                        <Button
                            size="lg"
                            onClick={startDiscussion}
                            disabled={!friendJoined}
                            className={cn(
                                "h-14 rounded-full text-lg font-bold shadow-lg transition-all",
                                friendJoined
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            <Play className="w-5 h-5 mr-2" />
                            {friendJoined ? 'Start Discussion' : 'Waiting for friend...'}
                        </Button>
                    )}

                    {!isHost && (
                        <div className="text-center text-sm text-slate-500 bg-white rounded-2xl p-4 border border-slate-200">
                            <Clock className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                            Waiting for the host to start the discussion...
                        </div>
                    )}
                </div>

                {/* Right: Chat */}
                <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-sm text-slate-700">Lobby Chat</span>
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                            {chatMessages.length}
                        </Badge>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[500px]">
                        {chatMessages.length === 0 && (
                            <div className="text-center text-slate-400 text-sm py-12">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                No messages yet. Say hi! 👋
                            </div>
                        )}
                        {chatMessages.map((msg, i) => {
                            const isOwn = msg.sender === userInfo?.name;
                            return (
                                <div key={i} className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                        isOwn
                                            ? "bg-indigo-600 text-white rounded-br-md"
                                            : "bg-slate-100 text-slate-800 rounded-bl-md"
                                    )}>
                                        {!isOwn && (
                                            <div className="text-[10px] font-bold text-indigo-500 mb-0.5">{msg.sender}</div>
                                        )}
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={sendChat} className="p-3 border-t border-slate-100 flex gap-2">
                        <Input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type a message..."
                            className="rounded-full text-sm bg-slate-50 border-slate-200"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!chatInput.trim()}
                            className="rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default GDLobby;
