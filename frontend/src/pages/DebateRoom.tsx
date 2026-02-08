import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, MicOff, Clock, ArrowLeft, StopCircle, Trophy, History, PanelRightClose, PanelRightOpen, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from 'react-router-dom';
import { TalkingAvatar } from '@/components/debate/TalkingAvatar';
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
    const { topic, stance } = location.state || {};

    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [userInput, setUserInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(300);
    const [aiSpeaking, setAiSpeaking] = useState(false);

    // UI State
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

    // Voice Interaction State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!topic) {
            toast.error("No topic selected.");
            navigate('/dashboard/debate/topic');
        }
    }, [topic, navigate]);

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

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        // If already recognized, don't re-init
        if (recognitionRef.current && isListening) {
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            toast.success("Listening...");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                toast.error("Microphone access denied. Please allow permission.");
            } else if (event.error === 'no-speech') {
                // specific notification not always needed for no-speech, but good for debugging
            } else {
                toast.error(`Error: ${event.error}`);
            }
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            // We can handle interim results if we want to show real-time typing effect
            // For now, let's just grab final results to append to input

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

    const handleUserSubmit = async () => {
        if (!userInput.trim()) return;

        const userMsg = userInput;
        setUserInput('');
        addTranscriptItem('User', userMsg);
        setProcessing(true);

        try {
            const aiStance = stance === 'Pro' ? 'Con' : 'Pro';
            const context = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');

            // Backend now handles the prompt construction
            const res = await api.post('/groq/debate/response', {
                topic,
                aiStance,
                userStance: stance,
                context,
                userMsg
            });

            // Depending on how I implemented the backend, checking return structure
            // Controller: res.json({ success: true, response });
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
        toast.info("Debate ended. Generating report...");
        navigate('/dashboard/debate/report', {
            state: { transcript, topic, stance }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-slate-50/50 p-4 gap-4 max-w-[1800px] mx-auto animate-in fade-in duration-500">

            {/* Header Status Bar */}
            <div className="flex flex-nowrap items-center justify-between bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm z-20 sticky top-0 gap-4">

                {/* Left: Navigation & Topic */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/debate/topic')} className="rounded-full hover:bg-slate-100 shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-base md:text-lg font-bold text-slate-800 truncate pr-2" title={topic}>{topic}</h1>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="flex items-center space-x-1">
                                <span className={cn("px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200")}>
                                    You: <span className={stance === 'Pro' ? "text-green-600" : "text-red-600"}>{stance}</span>
                                </span>
                                <span className="text-slate-300">vs</span>
                                <span className={cn("px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200")}>
                                    AI: <span className={stance === 'Pro' ? "text-red-600" : "text-green-600"}>{stance === 'Pro' ? 'Con' : 'Pro'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Controls & Timer */}
                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                        className={cn("hidden md:flex items-center gap-2 text-slate-500 hover:text-slate-700", isTranscriptOpen && "bg-slate-100")}
                    >
                        {isTranscriptOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                        <span className="text-xs font-medium">{isTranscriptOpen ? "Hide" : "Transcript"}</span>
                    </Button>

                    <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                        {/* Animated Hourglass Timer */}
                        <HourglassTimer timeLeft={timeLeft} totalTime={300} />

                        <Button variant="destructive" size="icon" onClick={handleEndDebate} className="rounded-full w-10 h-10 shadow-red-200 shadow-lg hover:shadow-red-300 transition-all" title="End Debate">
                            <StopCircle className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden relative">

                {/* Left: VS Stage */}
                <motion.div
                    layout
                    className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative flex flex-col min-w-0"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 opacity-50 pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.02] bg-[url('/debate-bg-pattern.svg')] pointer-events-none" />

                    {/* Stage Content */}
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 md:p-12 overflow-y-auto">

                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full max-w-5xl">

                            {/* AI Opponent */}
                            <div className="flex flex-col items-center relative group">
                                <div className="absolute -inset-4 bg-gradient-to-b from-transparent to-black/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <TalkingAvatar isSpeaking={aiSpeaking} stance={stance === 'Pro' ? 'Con' : 'Pro'} />
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 mb-2">
                                        Opponent
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Debater</h3>
                                    {processing && <span className="text-xs text-blue-500 animate-pulse font-medium">Formulating argument...</span>}
                                </div>
                            </div>

                            {/* VS Emblem */}
                            <div className="relative shrink-0">
                                <span className="text-6xl md:text-8xl font-black text-slate-100 italic select-none">VS</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1 h-24 bg-gradient-to-b from-transparent via-slate-200 to-transparent rotate-12" />
                                </div>
                            </div>

                            {/* User Avatar */}
                            <div className="flex flex-col items-center relative">
                                <motion.div
                                    className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden"
                                    animate={{ scale: isListening ? 1.05 : 1, borderColor: isListening ? '#818cf8' : '#ffffff' }}
                                >
                                    <span className="text-6xl text-white">👤</span>
                                    {/* Mic interaction ring */}
                                    {isListening && (
                                        <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping" />
                                    )}
                                </motion.div>
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 mb-2">
                                        You
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Challenger</h3>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Input Controls - Floating at bottom of stage */}
                    <div className="p-6 md:px-12 pb-8 w-full z-20">
                        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex gap-3 transition-all focus-within:ring-2 ring-primary/20 focus-within:border-primary/50">
                            <Button
                                variant={isListening ? "destructive" : "secondary"}
                                size="icon"
                                onClick={toggleMic}
                                className={cn("h-14 w-14 rounded-xl shrink-0 transition-all duration-300", isListening ? "animate-pulse shadow-red-200 shadow-lg" : "hover:bg-slate-100")}
                            >
                                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </Button>

                            <Input
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                autoComplete="off"
                                placeholder="Type your argument or use microphone..."
                                className="h-14 bg-transparent border-none text-lg px-4 focus-visible:ring-0 placeholder:text-slate-400"
                            />

                            <Button
                                onClick={handleUserSubmit}
                                disabled={processing || !userInput.trim()}
                                className="h-14 w-14 rounded-xl shrink-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                            >
                                <Send className="w-6 h-6 text-white" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Transcript Panel (Collapsible) */}
                <AnimatePresence mode="wait">
                    {isTranscriptOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0, scaleX: 0.9 }}
                            animate={{ width: 350, opacity: 1, scaleX: 1 }}
                            exit={{ width: 0, opacity: 0, scaleX: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="h-full flex-shrink-0 origin-right"
                        >
                            <Card className="h-full border-none shadow-lg flex flex-col bg-white/80 backdrop-blur overflow-hidden">
                                <CardHeader className="py-4 px-5 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-10 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <History className="w-4 h-4 text-slate-400" /> Debate Transcript
                                    </CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" onClick={() => setIsTranscriptOpen(false)}>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-1 p-0 overflow-hidden relative">
                                    <ScrollArea className="h-full px-4 py-4" ref={scrollRef}>
                                        <div className="space-y-6">
                                            {transcript.length === 0 && (
                                                <div className="flex flex-col items-center justify-center text-center mt-20 text-slate-400 space-y-2">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Trophy className="w-6 h-6 opacity-50" />
                                                    </div>
                                                    <p className="text-sm font-medium">Ready to start?</p>
                                                    <p className="text-xs max-w-[200px]">Make your opening statement to begin the debate.</p>
                                                </div>
                                            )}
                                            {transcript.map((item, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={i}
                                                    className={cn("flex flex-col gap-1 max-w-[95%]", item.speaker === 'User' ? "ml-auto items-end" : "mr-auto items-start")}
                                                >
                                                    <div className="flex items-center gap-2 px-1 mb-1">
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", item.speaker === 'User' ? "text-indigo-600" : "text-slate-600")}>{item.speaker}</span>
                                                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border",
                                                        item.speaker === 'User'
                                                            ? "bg-indigo-600 text-white border-indigo-600 rounded-tr-sm"
                                                            : "bg-white text-slate-700 border-slate-200 rounded-tl-sm"
                                                    )}>
                                                        {item.text}
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {processing && (
                                                <div className="flex flex-col gap-1 max-w-[85%] mr-auto items-start">
                                                    <div className="px-5 py-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DebateRoom;
