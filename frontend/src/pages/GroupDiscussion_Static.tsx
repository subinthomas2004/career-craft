import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Square, Mic, Send, Users } from 'lucide-react';
import { toast } from "sonner";
import { GD_TOPICS_DATA, GENERIC_RESPONSES } from "@/data/gdTopics";
import { cn } from "@/lib/utils";

interface Participant {
    id: string;
    name: string;
    role: string;
    color: string;
    systemPrompt: string;
}

interface TranscriptItem {
    speakerId: string;
    speakerName: string;
    text: string;
    timestamp: string;
}

// Updated personas matching the visual description of the "5 diverse professionals"
// 1. Man in blue shirt (left) -> Alex (Initiator)
// 2. Woman in red blazer (mid-left) -> Sarah (Contrarian)
// 3. Man in green shirt (mid-right) -> Mike (Analyst)
// 4. Woman in purple top (right) -> Priya (Mediator)
// 5. Man in orange sweater (far right) -> David (Summarizer)

const PERSONAS: Participant[] = [
    {
        id: 'p1',
        name: 'Alex',
        role: 'Initiator',
        color: 'text-blue-500',
        systemPrompt: "You are Alex. You are the initiator. Start conversation."
    },
    {
        id: 'p2',
        name: 'Sarah',
        role: 'Contrarian',
        color: 'text-red-500',
        systemPrompt: "You are Sarah. You are a contrarian. Challenge points."
    },
    {
        id: 'p3',
        name: 'Mike',
        role: 'Analyst',
        color: 'text-green-500',
        systemPrompt: "You are Mike. You are a data analyst. Use facts."
    },
    {
        id: 'p4',
        name: 'Priya',
        role: 'Mediator',
        color: 'text-purple-500',
        systemPrompt: "You are Priya. You are a mediator. Resolve conflicts."
    },
    {
        id: 'p5',
        name: 'David',
        role: 'Summarizer',
        color: 'text-orange-500',
        systemPrompt: "You are David. You are the summarizer. Conclude points."
    }
];

const GroupDiscussion = () => {
    const [topic, setTopic] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    useEffect(() => {
        if (!isActive || processing || !topic) return;

        if (transcript.length === 0) {
            triggerAgentTurn(PERSONAS[0]); // Alex (Blue shirt) starts
            return;
        }

        const lastSpeakerId = transcript[transcript.length - 1].speakerId;

        if (lastSpeakerId === 'user') {
            const randomAgent = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
            triggerAgentTurn(randomAgent);
            return;
        }

        const timeout = setTimeout(() => {
            const availableSpeakers = PERSONAS.filter(p => p.id !== lastSpeakerId);
            const nextSpeaker = availableSpeakers[Math.floor(Math.random() * availableSpeakers.length)];
            triggerAgentTurn(nextSpeaker);
        }, 4000);

        return () => clearTimeout(timeout);
    }, [isActive, transcript, processing, topic]);

    const triggerAgentTurn = async (agent: Participant) => {
        setProcessing(true);
        setCurrentSpeaker(agent.id);

        // Simulate thinking time naturalistically
        const thinkingTime = Math.random() * 1000 + 1500; // 1.5s to 2.5s
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        try {
            // Find data for the current topic
            const topicData = GD_TOPICS_DATA.find(t => t.topic === topic);

            let points: string[] = [];

            // 1. Try to find specific points for this topic and role
            if (topicData) {
                const roleData = topicData.responses.find(r => r.role === agent.role);
                if (roleData && roleData.points.length > 0) {
                    points = roleData.points;
                }
            }

            // 2. Fallback to generic points for the role if no specific topic data is found
            if (points.length === 0) {
                const genericRoleData = GENERIC_RESPONSES.find(r => r.role === agent.role);
                if (genericRoleData) {
                    points = genericRoleData.points;
                }
            }

            // 3. Select a response
            let responseText = "";
            if (points.length > 0) {
                // simple random selection
                responseText = points[Math.floor(Math.random() * points.length)];
            } else {
                responseText = "I agree with the previous speaker."; // Ultimate fallback
            }

            addTranscriptItem(agent.id, agent.name, responseText);
        } catch (error) {
            console.error('Agent failed:', error);
            toast.error(`${agent.name} failed to speak.`);
        } finally {
            setProcessing(false);
            setCurrentSpeaker(null);
        }
    };

    const addTranscriptItem = (speakerId: string, speakerName: string, text: string) => {
        setTranscript(prev => [...prev, {
            speakerId,
            speakerName,
            text,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const handleStart = () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic first.");
            return;
        }
        setIsActive(true);
        setTranscript([]);
        toast.success("Discussion started!");
    };

    const handleStop = () => {
        setIsActive(false);
        setProcessing(false);
        setCurrentSpeaker(null);
        toast.info("Discussion stopped.");
    };

    const handleUserSubmit = () => {
        if (!userInput.trim()) return;
        addTranscriptItem('user', 'You', userInput);
        setUserInput('');
    };

    // Adjusted Positions for the static background image of 5 people
    // We place overlay "tags" or speech bubbles near their heads/positions in the image.

    const peoplePositions = [
        { id: 'p1', left: '15%', top: '45%' }, // Man in blue (Left)
        { id: 'p2', left: '32%', top: '48%' }, // Woman in red (Mid-Left)
        { id: 'p3', left: '50%', top: '48%' }, // Man in green (Center)
        { id: 'p4', left: '68%', top: '48%' }, // Woman in purple (Mid-Right)
        { id: 'p5', left: '85%', top: '45%' }, // Man in orange (Right)
    ];

    const getAgentPosition = (id: string) => {
        return peoplePositions.find(p => p.id === id) || { left: '50%', top: '50%' };
    };

    return (
        <div className="container p-4 space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Group Discussion Simulator
                    </h1>
                    <p className="text-sm text-muted-foreground bg-primary/10 px-2 py-0.5 rounded inline-block">Immersive Reality Mode</p>
                </div>
                <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg border shadow-sm">
                    <Input
                        placeholder="Enter discussion topic..."
                        className="w-64 h-9"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={isActive}
                    />
                    {!isActive ? (
                        <Button onClick={handleStart} size="sm" className="gap-2">
                            <Play className="w-4 h-4" /> Start
                        </Button>
                    ) : (
                        <Button variant="destructive" size="sm" onClick={handleStop} className="gap-2">
                            <Square className="w-4 h-4" /> Stop
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
                {/* Main Immersive View - Realistic Scene */}
                <div className="lg:col-span-3 bg-black rounded-xl border relative overflow-hidden flex items-center justify-center shadow-2xl group">

                    {/* Background Room Image - With People */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100 group-hover:scale-[1.01]"
                        style={{ backgroundImage: 'url("/meeting-room.png")' }}
                    >
                        {/* Dim overlay that lightens when active */}
                        <div className={cn("absolute inset-0 transition-opacity duration-1000", isActive ? "bg-black/10" : "bg-black/40")} />
                    </div>

                    {/* AI Agents Visual Overlays */}
                    {PERSONAS.map((agent) => {
                        const pos = getAgentPosition(agent.id);
                        const isSpeaking = currentSpeaker === agent.id;

                        return (
                            <div
                                key={agent.id}
                                className="absolute"
                                style={{
                                    left: pos.left,
                                    top: pos.top,
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10
                                }}
                            >
                                <div className="flex flex-col items-center">

                                    {/* Speaking Indicator Glow around the person's head location */}
                                    <div className={cn(
                                        "w-32 h-32 rounded-full absolute -top-10 transition-all duration-300",
                                        isSpeaking ? "bg-white/20 blur-xl scale-125 opacity-100" : "opacity-0 scale-90"
                                    )} />

                                    {/* Speech Bubble */}
                                    {isSpeaking && (
                                        <div className="mb-24 bg-white/95 text-black px-5 py-3 rounded-2xl rounded-bl-none shadow-2xl min-w-[220px] max-w-[300px] text-sm font-medium animate-in fade-in slide-in-from-bottom-4 border border-white/40">
                                            <p className="line-clamp-4 leading-relaxed">
                                                {transcript.slice().reverse().find(t => t.speakerId === agent.id)?.text || "..."}
                                            </p>
                                        </div>
                                    )}

                                    {/* Name Tag (Always visible but subtle) */}
                                    <div className={cn(
                                        "absolute top-20 transition-all duration-300 backdrop-blur-md border px-3 py-1 rounded-full shadow-lg cursor-default",
                                        isSpeaking ? "bg-black/80 border-white/20 scale-110" : "bg-black/40 border-white/10 opacity-70 hover:opacity-100"
                                    )}>
                                        <div className="flex flex-col items-center">
                                            <p className={cn("font-bold text-xs text-white", isSpeaking ? "text-shadow-glow" : "")}>{agent.name}</p>
                                            <p className="text-[9px] text-gray-300 uppercase tracking-wider hidden group-hover:block">{agent.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* User Interface Overlay (HUD) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/90 backdrop-blur-xl p-3 rounded-2xl border shadow-2xl z-50 ring-1 ring-white/20">
                        <div className="flex items-center gap-3 pr-4 border-r border-border/50">
                            <Avatar className="w-10 h-10 border-2 border-primary ring-2 ring-primary/20">
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">YO</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-bold">You</p>
                                <p className="text-xs text-muted-foreground">Participant</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
                                placeholder="Type your discussion point..."
                                className="w-[20rem] bg-transparent border-muted-foreground/30 focus-visible:ring-primary h-10"
                                disabled={!isActive}
                            />
                            <Button onClick={handleUserSubmit} disabled={!isActive} className="rounded-xl shadow-lg shadow-primary/20 bg-primary/90 hover:bg-primary h-10 px-6">
                                <Send className="w-4 h-4 mr-2" /> Speak
                            </Button>
                        </div>
                    </div>

                    {/* Topic Overlay */}
                    {topic && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg border border-white/10 px-8 py-2.5 rounded-full text-white text-sm font-medium shadow-2xl">
                            Discussion Topic: <span className="text-primary-foreground font-bold ml-1">{topic}</span>
                        </div>
                    )}
                </div>

                {/* Transcript Panel (Sidebar) */}
                <Card className="flex flex-col h-full overflow-hidden shadow-lg border-l-0 rounded-l-none lg:rounded-xl">
                    <CardHeader className="bg-muted/30 border-b py-3 px-4">
                        <CardTitle className="text-md flex items-center gap-2">
                            <Mic className="w-4 h-4 text-primary" /> Live Transcript
                        </CardTitle>
                        <CardDescription className="text-xs">Real-time conversation log</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden relative bg-muted/10">
                        <ScrollArea className="h-full px-4 py-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {transcript.length === 0 && (
                                    <div className="text-center text-muted-foreground text-sm mt-10 p-4 border-2 border-dashed rounded-xl flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 opacity-50" />
                                        <p>Waiting for discussion to start...</p>
                                    </div>
                                )}
                                {transcript.map((item, i) => (
                                    <div key={i} className={`flex flex-col ${item.speakerId === 'user' ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className="flex items-center gap-2 mb-1 px-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.speakerId === 'user' ? 'text-primary' : 'text-foreground'}`}>{item.speakerName}</span>
                                            <span className="text-[9px] text-muted-foreground">{item.timestamp}</span>
                                        </div>
                                        <div className={`px-4 py-2.5 rounded-2xl max-w-[95%] text-sm leading-relaxed shadow-sm ${item.speakerId === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'bg-white dark:bg-card border rounded-tl-sm'
                                            }`}>
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                                {processing && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse pl-2 py-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="italic">AI is listening...</span>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GroupDiscussion;
