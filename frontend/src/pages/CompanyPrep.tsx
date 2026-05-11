import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, Search, ArrowRight, Loader2, Sparkles, BrainCircuit, X, CheckCircle, Star, Bookmark, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, ThumbsUp, ThumbsDown, HeartPulse } from "lucide-react";

export interface Company {
    _id: string;
    name: string;
    description: string;
    logoUrl: string;
    createdAt: string;
}

export default function CompanyPrep() {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // AI Insight State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiSearchQuery, setAiSearchQuery] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<any>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/companies');
                setCompanies(response.data);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const triggerAiInsight = async (manualName?: string) => {
        const targetName = manualName || aiSearchQuery || searchQuery;
        if (!targetName.trim()) {
            toast.error("Please enter a valid company name");
            return;
        }
        setAiLoading(true);
        setIsAiModalOpen(true);
        setAiInsight(null);
        try {
            const { data } = await api.get(`/companies/ai-search/insight?name=${encodeURIComponent(targetName)}`);
            if (data.success) {
                setAiInsight(data.insight);
            } else {
                toast.error("Failed to synthesize insight.");
            }
        } catch (error) {
            toast.error("AI Engine failed to respond.");
        } finally {
            setAiLoading(false);
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 p-6 md:p-8 min-h-screen bg-slate-50/30">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Premium Header Section */}
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none"><Briefcase className="w-64 h-64 -mr-16 -mt-16 text-indigo-600" /></div>
                    <div className="space-y-2 relative z-10">
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-indigo-100 font-bold mb-2 gap-1.5 px-3 py-1 rounded-lg">
                            <Briefcase className="h-3.5 w-3.5" />
                            Prep Central
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                            Company Preparation Kits
                        </h1>
                        <p className="text-slate-500 text-base md:text-lg max-w-2xl font-medium">
                            Curated materials, PYQs, and structured path syllabi tailored strictly for high-impact top tier hiring systems.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto relative z-10">
                        <div className="relative w-full sm:w-72 shrink-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Filter current list..."
                                className="h-11 pl-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Dedicated AI Synthesis Hub - Compact & Centered */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-center text-white shadow-lg shadow-indigo-100 relative overflow-hidden border border-white/10"
                >
                    <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                    
                    <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-3">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-200" /> AI Intelligence Engine
                        </h2>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                            Can't find a target company? Instantly synthesize comprehensive interview tracks, tech analytics, and preparation trajectories.
                        </p>
                        <Button 
                            onClick={() => {
                                setAiSearchQuery("");
                                setAiInsight(null);
                                setIsAiModalOpen(true);
                            }}
                            size="sm"
                            className="mt-1 h-11 bg-white hover:bg-slate-50 text-indigo-700 font-bold px-6 shadow-md gap-2 rounded-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            <BrainCircuit className="w-5 h-5" /> Launch AI Scanner
                        </Button>
                    </div>
                </motion.div>

                {/* Main Grid */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-80 space-y-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse">Retrieving curated profiles...</p>
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300 shadow-inner">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Record Not Found In Base</h3>
                            <p className="text-slate-500 max-w-md text-base font-medium mb-6">
                                We don't have cached static documents for "{searchQuery}", but our synthesis engine can construct dynamic intel instantly.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => triggerAiInsight(searchQuery)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2.5 h-12 px-8 rounded-xl shadow-xl"
                            >
                                <BrainCircuit className="w-5 h-5 text-indigo-400" /> Synthesize Intel for "{searchQuery}"
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredCompanies.map((company, index) => (
                                <motion.div
                                    key={company._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className="h-full"
                                >
                                    <Link to={`/dashboard/company-prep/${company._id}`} className="block h-full group">
                                        <Card className="h-full border border-slate-200 bg-white shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-indigo-300 transition-all duration-300 rounded-2xl flex flex-col overflow-hidden">
                                            <CardContent className="p-6 flex flex-col flex-1 relative bg-white">
                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                
                                                <div className="flex items-start justify-between mb-4 relative z-10">
                                                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-indigo-100 group-hover:bg-indigo-50 shadow-sm group-hover:shadow transition-all duration-300 shrink-0 overflow-hidden p-2">
                                                        {company.logoUrl ? (
                                                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 relative z-10 flex flex-col h-full">
                                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2 group-hover:text-indigo-700 transition-colors">
                                                        {company.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">
                                                        {company.description || "Access target specific syllabus modules, notes, and previous iteration questions."}
                                                    </p>
                                                    
                                                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                                        <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-600 text-[10px] font-black tracking-widest uppercase border-0 py-0.5 px-2 rounded">RESOURCES</Badge>
                                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* AI INSIGHT MODAL ENGINE */}
                <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                    <DialogContent className="max-w-3xl bg-white border-0 shadow-2xl p-0 rounded-3xl overflow-hidden">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 relative overflow-hidden flex justify-between items-center shrink-0 text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg"><Sparkles className="w-6 h-6 text-white" /></div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-white tracking-tight">AI Placement Intelligence</DialogTitle>
                                    <DialogDescription className="text-indigo-200 font-medium">Synthesizing real-time recruitment parameters.</DialogDescription>
                                </div>
                            </div>
                            <Button onClick={() => setIsAiModalOpen(false)} size="icon" variant="ghost" className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full hidden md:flex"><X className="w-4 h-4"/></Button>
                        </div>

                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex gap-3">
                            <Input 
                                placeholder="Type ANY company name (e.g. Netflix, Nvidia, Zoho...)" 
                                className="h-12 bg-white border-slate-200 text-base font-medium rounded-xl shadow-sm"
                                value={aiSearchQuery}
                                onChange={(e) => setAiSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && triggerAiInsight()}
                            />
                            <Button 
                                onClick={() => triggerAiInsight()} 
                                disabled={aiLoading || !aiSearchQuery.trim()}
                                className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl shadow-md gap-2 shrink-0"
                            >
                                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <BrainCircuit className="w-4 h-4" />} Generate
                            </Button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-8 bg-white custom-scrollbar">
                            {aiLoading ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                                    <motion.div 
                                        animate={{ rotate: 360 }} 
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center"
                                    >
                                        <BrainCircuit className="w-8 h-8 text-indigo-500" />
                                    </motion.div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 animate-pulse">Synthesizing Analytical Layers</h4>
                                        <p className="text-sm text-slate-500">Retrieving interview structures, tech domains, and advice metrics...</p>
                                    </div>
                                </div>
                            ) : aiInsight ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* High Impact Summary Banner */}
                                    <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-3 mb-1">
                                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{aiInsight.name}</h2>
                                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase text-[10px] font-black py-0.5 rounded">Deep Intelligence</Badge>
                                            </div>
                                            <p className="text-indigo-600 font-bold text-base mb-3">{aiInsight.tagline}</p>
                                            <p className="text-slate-600 font-medium leading-relaxed text-[15px]">{aiInsight.description}</p>
                                        </div>
                                        
                                        <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center flex-1 min-w-[120px]">
                                                <span className="block text-[10px] uppercase font-black text-slate-400 mb-1">Difficulty</span>
                                                <span className="text-2xl font-black text-rose-500">{aiInsight.recruitmentDifficulty || '8'}/10</span>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center flex-1 min-w-[120px]">
                                                <span className="block text-[10px] uppercase font-black text-slate-400 mb-1">Hiring Trend</span>
                                                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px] font-black px-2 py-0 mx-auto">{aiInsight.hiringTrend || 'Active'}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="overview" className="w-full">
                                        <TabsList className="w-full grid grid-cols-3 bg-slate-100 p-1 rounded-xl mb-6">
                                            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white font-bold data-[state=active]:shadow-sm">Structure</TabsTrigger>
                                            <TabsTrigger value="culture" className="rounded-lg data-[state=active]:bg-white font-bold data-[state=active]:shadow-sm">Culture & Perks</TabsTrigger>
                                            <TabsTrigger value="strategy" className="rounded-lg data-[state=active]:bg-white font-bold data-[state=active]:shadow-sm">Prep Strategy</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="space-y-6 outline-none mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                                                    <h4 className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">
                                                        <Bookmark className="w-4 h-4 text-indigo-500" /> Recruitment Flow
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {aiInsight.interviewRounds?.map((round: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i+1}</span>
                                                                <span>{round}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                                        <h4 className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">
                                                            <Star className="w-4 h-4 text-amber-500" /> Core Tech Ecosystem
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {aiInsight.techStack?.map((tech: string, i: number) => (
                                                                <Badge key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold rounded-lg shadow-sm px-3 py-1">{tech}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                                        <h4 className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" /> Heavily Weight Topics
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {aiInsight.codingTopics?.map((topic: string, i: number) => (
                                                                <Badge key={i} className="bg-slate-900 text-white font-bold rounded-lg px-3 py-1 text-xs">{topic}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="culture" className="space-y-6 outline-none mt-0">
                                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                                <h4 className="flex items-center gap-2 text-slate-800 font-extrabold text-lg mb-3"><HeartPulse className="w-5 h-5 text-pink-500" /> Ecosystem Health</h4>
                                                <p className="text-slate-600 font-medium leading-relaxed">{aiInsight.cultureHighlight || "Demanding and highly rewarding work cycle."}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5">
                                                    <h5 className="flex items-center gap-2 text-emerald-800 font-bold mb-3 text-sm"><ThumbsUp className="w-4 h-4" /> Core Advantages</h5>
                                                    <ul className="space-y-2">
                                                        {(aiInsight.topPros || []).map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-5">
                                                    <h5 className="flex items-center gap-2 text-rose-800 font-bold mb-3 text-sm"><ThumbsDown className="w-4 h-4" /> Observed Friction</h5>
                                                    <ul className="space-y-2">
                                                        {(aiInsight.topCons || []).map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="strategy" className="space-y-6 outline-none mt-0">
                                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl flex items-start gap-6 relative overflow-hidden">
                                                <Award className="absolute -right-8 -bottom-8 text-white opacity-10 w-40 h-40" />
                                                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shrink-0"><BrainCircuit className="w-8 h-8 text-white" /></div>
                                                <div className="relative z-10">
                                                    <h4 className="text-xl font-black mb-2">Strategic Integration Path</h4>
                                                    <p className="text-indigo-100 font-bold leading-relaxed italic text-lg">"{aiInsight.prepAdvice}"</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Compensation Intelligence</span>
                                                    <p className="text-xl font-black text-slate-900 mt-1">{aiInsight.avgSalary}</p>
                                                </div>
                                                <TrendingUp className="w-10 h-10 text-emerald-500 opacity-30" />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </motion.div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <Search className="w-12 h-12 text-slate-300 mb-3" />
                                    <p className="text-slate-500 font-medium max-w-xs">Enter a company name above and tap "Generate" to synthesize dynamic preparation intelligence.</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
