import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
    Brain, MessageCircle, Target, Route, RefreshCw, CheckCircle2, Circle, 
    Trophy, Zap, UserCheck, Clock, Sparkles, TrendingUp, BrainCircuit,
    SendHorizontal, ChevronRight, LineChart, Activity, BarChart2, Gauge
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AIMentor() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([
        { role: 'assistant', content: "Welcome back! I'm here to help refine your strategies and monitor your placement growth. How can I support you today?" }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages, sending]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/mentor/profile");
            if (data.success) {
                setProfile(data.profile);
                if (data.profile.chatHistory && data.profile.chatHistory.length > 0) {
                     setChatMessages(data.profile.chatHistory.filter((h:any)=>h.role !== 'system').slice(-15));
                }
            }
        } catch (error) {
            toast.error("Error fetching profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMsg: Message = { role: 'user', content: inputMessage };
        setChatMessages(prev => [...prev, newMsg]);
        setInputMessage("");
        setSending(true);

        try {
            const { data } = await api.post("/mentor/chat", {
                message: inputMessage,
                chatHistory: [...chatMessages, newMsg]
            });
            if (data.success) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            }
        } catch (error) {
            toast.error("Connection with AI interrupted.");
        } finally {
            setSending(false);
        }
    };

    const updatePersonality = async (mode: string) => {
        try {
            await api.put("/mentor/personality", { personalityMode: mode });
            toast.success(`Switched style to ${mode}`);
            fetchProfile();
        } catch (err) { toast.error("Update failed."); }
    };

    const generateDailyGoals = async () => {
        setLoading(true);
        try {
            const { data } = await api.post("/mentor/goals/generate");
            if (data.success) {
                setProfile((prev:any) => ({ ...prev, dailyGoals: data.goals }));
                toast.success("Daily targets initialized.");
            }
        } catch (err) { toast.error("Task creation error"); }
        finally { setLoading(false); }
    };

    const toggleGoalCompletion = async (goalId: string) => {
        try {
            const { data } = await api.patch("/mentor/goals/toggle", { goalId });
            if (data.success) {
                setProfile(data.profile);
            }
        } catch (err) { toast.error("Progress save failed"); }
    };

    const generateBehaviorReport = async () => {
        setLoading(true);
        try {
            const { data } = await api.post("/mentor/behavior/analyze");
            if (data.success) {
                setProfile((prev:any) => ({ ...prev, behavioralMetrics: data.metrics }));
                toast.success("Analysis complete.");
            }
        } catch (err) { toast.error("Deep scan failed"); }
        finally { setLoading(false); }
    };

    const generateNewRoadmap = async () => {
        setLoading(true);
        try {
            const { data } = await api.post("/mentor/roadmap/generate", { goal: "Placement Success Plan" });
            if (data.success) {
                setProfile((prev:any) => ({ ...prev, learningRoadmap: data.roadmap }));
                toast.success("Roadmap successfully generated.");
            }
        } catch (err) { toast.error("Roadmap construct failure"); }
        finally { setLoading(false); }
    };

    const generateWeeklyReflection = async () => {
        setLoading(true);
        try {
            const { data } = await api.post("/mentor/reflection/generate");
            if (data.success) {
                setProfile((prev:any) => ({ ...prev, progressReflection: data.reflection }));
                toast.success("Reflection Report populated.");
            }
        } catch (err) { toast.error("Report failure"); }
        finally { setLoading(false); }
    };

    const totalGoals = profile?.dailyGoals?.length || 0;
    const completedGoals = profile?.dailyGoals?.filter((g:any) => g.isCompleted).length || 0;
    const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 lg:p-8 relative">
            
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
                
                {/* ===================== ROW 1: PREMIUM LIGHT HEADER ===================== */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="xl:col-span-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm gap-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 flex items-center justify-center shrink-0 transform rotate-3">
                            <BrainCircuit className="w-10 h-10 text-white transform -rotate-3" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Mentor Space</h1>
                            <p className="text-slate-500 text-base mt-1 font-medium">Your strategic continuous companion for placement execution.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-4">
                            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><Gauge className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Consistency</p>
                                <p className="text-xl font-black text-emerald-600">{profile?.behavioralMetrics?.consistencyScore || 0}%</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-4">
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><Target className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Progress</p>
                                <p className="text-xl font-black text-slate-800">{completedGoals}/{totalGoals}</p>
                            </div>
                        </div>
                        
                        <div className="h-14 w-[1px] bg-slate-200 hidden md:block mx-2" />

                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5 pl-1">Coach Tone</span>
                            <div className="bg-white border border-slate-300 rounded-xl shadow-sm px-3 py-2 flex items-center hover:border-indigo-400 transition-colors">
                                <Select value={profile?.personalityMode || "friendly"} onValueChange={updatePersonality}>
                                    <SelectTrigger className="h-6 bg-transparent border-none text-slate-900 focus:ring-0 p-0 font-bold text-sm capitalize shadow-none min-w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200">
                                        <SelectItem value="friendly">🤝 Friendly Mentor</SelectItem>
                                        <SelectItem value="strict">🔥 Strict Coach</SelectItem>
                                        <SelectItem value="corporate">🏢 Professional</SelectItem>
                                        <SelectItem value="motivational">⚡ Hyper Dynamic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ===================== LEFT COLUMN: CRISP CHAT TERMINAL ===================== */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="xl:col-span-5 xl:row-span-2 h-[700px] xl:h-[800px] flex flex-col"
                >
                    <div className="bg-white border border-slate-200 rounded-3xl h-full flex flex-col overflow-hidden shadow-xl shadow-slate-200/50 relative group">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative w-3 h-3">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">Interactive Mentorship</h3>
                            </div>
                            <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-100 text-xs font-bold px-3 py-1 shadow-sm">Online Now</Badge>
                        </div>

                        <ScrollArea className="flex-1 p-6 bg-white">
                            <div className="space-y-6">
                                {chatMessages.map((m, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                                            m.role === 'user' 
                                            ? 'bg-indigo-600 text-white font-medium rounded-br-sm' 
                                            : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-sm'
                                        }`}>
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {sending && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-100 border border-slate-200 px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center text-indigo-600">
                                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s'}} />
                                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s'}} />
                                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s'}} />
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-5 border-t border-slate-100 bg-slate-50/80 shrink-0">
                            <form onSubmit={handleSendMessage} className="relative">
                                <Input 
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Query the mentor logic board..."
                                    disabled={sending}
                                    className="h-14 bg-white border-slate-200 shadow-inner rounded-2xl pl-5 pr-14 text-slate-900 text-[15px] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                                />
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl"
                                    disabled={sending || !inputMessage.trim()}
                                >
                                    <SendHorizontal className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* ===================== RIGHT DASHBOARD GRID (CLEAN WHITES) ===================== */}
                <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* BLOCK 1: SMART GOALS LIST */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-100/50 overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><Target className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-extrabold text-xl text-slate-900">Active Mission List</h3>
                                    <p className="text-sm font-medium text-slate-500">Dynamic targeted checklist for continuous calibration.</p>
                                </div>
                            </div>
                            <Button onClick={generateDailyGoals} variant="outline" size="sm" disabled={loading} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 shadow-sm font-bold rounded-xl h-10 gap-2">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Recalculate
                            </Button>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-bold text-slate-600 uppercase tracking-wider">
                                <span>Completion Rate</span>
                                <span className="text-emerald-600 font-black">{Math.round(goalProgress)}%</span>
                            </div>
                            <Progress value={goalProgress} className="h-3 bg-slate-200 border-0 rounded-full overflow-hidden shadow-inner [&>div]:bg-emerald-500" />
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[350px]">
                            {(!profile?.dailyGoals || profile.dailyGoals.length === 0) ? (
                                <div className="col-span-full py-12 text-center flex flex-col items-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <Target className="w-12 h-12 text-slate-300 mb-3" />
                                    <p className="text-slate-600 font-medium mb-5">Target parameters not loaded.</p>
                                    <Button onClick={generateDailyGoals} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 h-11 shadow-lg shadow-emerald-200">Initialize Checklist</Button>
                                </div>
                            ) : (
                                profile.dailyGoals.map((g:any, i:number) => (
                                    <motion.div 
                                        key={g._id || g.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => toggleGoalCompletion(g._id || g.id)}
                                        className={`group cursor-pointer relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
                                            g.isCompleted 
                                            ? 'bg-emerald-50/50 border-emerald-200' 
                                            : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {g.isCompleted 
                                                ? <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" /> 
                                                : <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[15px] font-bold leading-snug mb-2 ${g.isCompleted ? 'text-emerald-700 line-through font-medium opacity-70' : 'text-slate-900'}`}>
                                                {g.title}
                                            </p>
                                            <div className="flex gap-2">
                                                <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">{g.category}</Badge>
                                                <Badge className={`border font-bold text-[10px] uppercase px-2 py-0.5 rounded-md ${
                                                    g.difficulty === 'Hard' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                                    g.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                }`}>{g.difficulty}</Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* BLOCK 2: PSYCH ENGINE (COLORFUL ON WHITE) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white border border-slate-200 rounded-3xl shadow-lg p-7 flex flex-col border-t-4 border-t-rose-400"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100"><BarChart2 className="w-5 h-5" /></div>
                                <h4 className="font-extrabold text-slate-900 text-lg">Analytics Graph</h4>
                            </div>
                            <Button onClick={generateBehaviorReport} size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500"><RefreshCw className="w-4 h-4"/></Button>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center pt-2">
                            <div className="relative w-32 h-32 flex items-center justify-center bg-rose-50 rounded-full p-2 border border-rose-100">
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#ffe4e6" strokeWidth="8" fill="transparent" />
                                    <motion.circle 
                                        cx="50" cy="50" r="40" stroke="#f43f5e" strokeWidth="8" fill="transparent"
                                        strokeDasharray="251.2"
                                        initial={{ strokeDashoffset: 251.2 }}
                                        animate={{ strokeDashoffset: 251.2 * (1 - (profile?.behavioralMetrics?.consistencyScore || 0) / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="text-center relative z-10">
                                    <span className="text-4xl font-black text-slate-900 leading-none">{profile?.behavioralMetrics?.consistencyScore || 0}</span>
                                    <p className="text-[10px] uppercase font-black text-rose-500 tracking-wider mt-1">PTS</p>
                                </div>
                            </div>
                            <div className="w-full">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Telemetry Prime Hours</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {profile?.behavioralMetrics?.peakProductiveHours?.length > 0 
                                        ? profile.behavioralMetrics.peakProductiveHours.map((h:any,i:number) => (
                                            <Badge key={i} className="bg-white border border-slate-200 text-slate-800 font-extrabold py-1.5 px-4 rounded-xl shadow-sm text-xs">{h}</Badge>
                                        ))
                                        : <span className="text-xs italic text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-full inline-block">Pending Data Streams</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* BLOCK 3: REFLECTION MODULE */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border border-slate-200 rounded-3xl shadow-lg p-7 border-t-4 border-t-blue-500 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100"><Trophy className="w-5 h-5" /></div>
                                    <h4 className="font-extrabold text-slate-900 text-lg">Weekly Review</h4>
                                </div>
                                <Button onClick={generateWeeklyReflection} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 shadow-md rounded-xl" disabled={loading}>Compile</Button>
                            </div>

                            {profile?.progressReflection?.weeklyReport ? (
                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-slate-700 text-[13px] leading-relaxed italic font-medium mb-6 relative shadow-inner">
                                    "{profile.progressReflection.weeklyReport.length > 160 ? profile.progressReflection.weeklyReport.substring(0, 160) + '...' : profile.progressReflection.weeklyReport}"
                                </div>
                            ) : (
                                <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center mb-6 text-slate-400 text-sm text-center px-6">
                                    <FileText className="w-6 h-6 mb-2 opacity-50" />
                                    Await active data reflection.
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-indigo-50 rounded-2xl p-5 flex items-center justify-between border border-indigo-100 shadow-sm shadow-indigo-100/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Readiness Velocity</span>
                            </div>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-3xl font-black text-indigo-900">{profile?.progressReflection?.predictedReadiness || 0}</span>
                                <span className="text-sm font-bold text-indigo-600">%</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* BLOCK 4: ADAPTIVE ROADMAP */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden border-t-4 border-t-violet-500"
                    >
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100"><Route className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-extrabold text-xl text-slate-900">Strategic Sequence Maps</h3>
                                    <p className="text-sm font-medium text-slate-500">Phased milestone reconstruction based on skills drift.</p>
                                </div>
                            </div>
                            <Button onClick={generateNewRoadmap} variant="outline" size="sm" className="h-10 bg-white border-slate-200 text-violet-700 hover:bg-violet-50 font-bold rounded-xl shadow-sm gap-2">
                                <Sparkles className="w-4 h-4" /> Project Path
                            </Button>
                        </div>
                        <div className="p-7 bg-white">
                            {(!profile?.learningRoadmap || profile.learningRoadmap.length === 0) ? (
                                <div className="py-10 text-center flex flex-col items-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                    <Route className="w-10 h-10 text-slate-300 mb-3" />
                                    <p className="text-slate-500 font-bold text-sm mb-4">Strategy map offline.</p>
                                    <Button onClick={generateNewRoadmap} size="sm" className="bg-violet-600 hover:bg-violet-700 font-bold px-5 rounded-xl shadow-lg shadow-violet-200">Build Sequence</Button>
                                </div>
                            ) : (
                                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profile.learningRoadmap.slice(0, 4).map((milestone:any, idx:number) => (
                                        <div key={idx} className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-400 shadow-sm hover:shadow-md transition-all group">
                                            <div className="absolute top-4 right-4 text-[10px] font-black text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100 shadow-sm tracking-wider">STEP {idx + 1}</div>
                                            <h5 className="font-extrabold text-slate-900 text-base mb-3 pr-14 group-hover:text-violet-700 transition-colors leading-tight">{milestone.title}</h5>
                                            
                                            <div className="h-[1px] bg-slate-100 w-full mb-3" />
                                            
                                            <ul className="space-y-2">
                                                {milestone.steps?.slice(0, 2).map((step:any, sid:number) => (
                                                    <li key={sid} className="text-sm text-slate-600 flex gap-3 items-start leading-snug">
                                                        <div className="w-2 h-2 bg-violet-500 rounded-full mt-1 shrink-0 shadow-sm shadow-violet-200" />
                                                        <span className="font-semibold">{step.title}</span>
                                                    </li>
                                                ))}
                                                {milestone.steps?.length > 2 && <li className="text-[11px] text-slate-400 font-bold pl-5 mt-1">+ {milestone.steps.length - 2} sequential tactics</li>}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

// Simple missing import hack for fallback display in components code block logic
function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}
