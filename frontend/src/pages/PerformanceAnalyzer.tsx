import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Cell, Legend
} from "recharts";
import { 
  TrendingUp, Brain, Code, Keyboard, MessageSquare, Award, 
  Trophy, Activity, Star, AlertCircle, CheckCircle2, Sparkles, 
  Zap, Target, ChevronRight, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface PerformanceData {
  stats: any;
  streak: number;
  confidenceScore: number;
  quizSummary: any;
  codingSummary: any;
  commSummary: any;
  typingSummary: any;
  debateSummary: any;
}

interface LeaderboardUser {
    _id: string;
    name: string;
    totalPoints: number;
    profilePicture?: string;
}

interface AIAnalysis {
  strengths?: string[];
  improvements?: string[];
  recommendations?: string[];
  verdict?: string;
  detailedAnalysis?: string;
}

const PerformanceAnalyzer = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [perfData, setPerfData] = useState<PerformanceData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const { data } = await api.get("/performance/summary");
      if (data.success) {
        setPerfData(data.performance);
        setAiAnalysis(data.aiAnalysis);
        setLeaderboard(data.leaderboard || []);
        setUserRank(data.userRank || null);
        setLastUpdated(new Date());
      } else {
        if (!isSilent) setError("Failed to fetch data.");
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) setError("Failed to connect to server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Poll every 45 seconds for realtime feeling
    const interval = setInterval(() => {
        fetchData(true);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-150 opacity-25"></div>
            <Loader2 className="h-16 w-16 animate-spin text-primary relative" />
        </div>
        <p className="mt-6 text-lg font-semibold text-foreground tracking-wide">Compiling Intelligence...</p>
        <p className="text-sm text-muted-foreground animate-pulse mt-1">Fetching your latest metrics across all nodes.</p>
      </div>
    );
  }

  if (error || !perfData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md border-destructive/30 border-t-4 border-t-destructive">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analysis Offline</h2>
            <p className="text-muted-foreground mb-4">{error || "Failed to retrieve performance payload."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare radar chart data (Skills snapshot)
  const radarData = [
    { subject: 'Quiz', A: Math.min(perfData.quizSummary.avgScore || 0, 100), fullMark: 100 },
    { subject: 'Debate', A: Math.min((perfData.debateSummary.highestScore || 0) * 10, 100), fullMark: 100 },
    { subject: 'Coding', A: Math.min((perfData.codingSummary.solvedProblemsCount / Math.max(perfData.codingSummary.attemptedProblemsCount, 1)) * 100 || 0, 100), fullMark: 100 },
    { subject: 'Typing', A: Math.min(perfData.typingSummary.avgAccuracy || 0, 100), fullMark: 100 },
    { subject: 'Comm.', A: Math.min(perfData.commSummary.avgScore || 0, 100), fullMark: 100 },
  ];

  // Format recent quiz for trend chart
  const quizTrendData = [...(perfData.quizSummary.recent || [])].reverse().map((item: any, i: number) => ({
    name: `Q${i + 1}`,
    score: Math.round((item.score / item.totalQuestions) * 100)
  }));

  // Typing trend
  const typingTrendData = [...(perfData.typingSummary.recent || [])].reverse().map((item: any, i: number) => ({
    name: `T${i + 1}`,
    wpm: item.wpm,
    accuracy: item.accuracy
  }));

  const totalModulesUsed = 
    (perfData.stats.interviewsAttended > 0 ? 1 : 0) +
    (perfData.quizSummary.count > 0 ? 1 : 0) +
    (perfData.codingSummary.attemptedProblemsCount > 0 ? 1 : 0) +
    (perfData.typingSummary.count > 0 ? 1 : 0) +
    (perfData.commSummary.count > 0 ? 1 : 0);

  const getConfidenceColor = (score: number) => {
      if (score >= 80) return "text-green-500 border-green-500/30 bg-green-500/10";
      if (score >= 50) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
      return "text-rose-500 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 border-border/40">
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Performance Analyzer
          </h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm font-medium">
            <div className={`h-2.5 w-2.5 rounded-full ${refreshing ? 'bg-amber-500 animate-ping' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
            <span>{refreshing ? 'Refreshing live data...' : 'Real-time active'}</span>
            <span className="text-xs opacity-60">• Last synced: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            {userRank && (
                <Badge variant="outline" className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 text-sm font-bold rounded-full flex items-center gap-2 hover:bg-yellow-500/20 transition-all">
                    <Award className="w-4 h-4 fill-current" />
                    Global Rank: #{userRank}
                </Badge>
            )}
            {aiAnalysis?.verdict && (
                <Badge variant="outline" className="px-3 py-1.5 bg-primary/10 text-primary border-primary/20 text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-primary/20 transition-all backdrop-blur">
                    <Trophy className="w-4 h-4" />
                    Verdict: {aiAnalysis.verdict}
                </Badge>
            )}
            <Badge variant="outline" className="px-3 py-1.5 bg-orange-500/10 text-orange-500 border-orange-500/20 text-sm font-bold rounded-full flex items-center gap-2 shadow-[0_0_15px_-5px_rgba(249,115,22,0.3)]">
                <Zap className="w-4 h-4 fill-current" />
                {perfData.streak} DAY STREAK
            </Badge>
        </div>
      </div>

      {/* Realtime Confidence, Leaderboard & Spotlight Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Peer Leaderboard (Top Positioned) */}
          <Card className="lg:col-span-4 border border-primary/20 bg-gradient-to-b from-background to-primary/5 shadow-lg overflow-hidden flex flex-col h-full order-2 lg:order-1">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3">
                  <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                          <Trophy className="w-4 h-4 fill-yellow-300 text-yellow-300" /> 
                          Global Leaderboard
                      </CardTitle>
                      <Badge className="bg-white/20 hover:bg-white/30 text-white text-[9px] font-black border-0 tracking-widest">TOP PEERS</Badge>
                  </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="divide-y divide-border/40 flex-1">
                      {leaderboard.length > 0 ? leaderboard.slice(0,3).map((entry, index) => (
                          <div key={entry._id} className="flex items-center justify-between px-4 py-3.5 hover:bg-accent/30 transition-colors relative group">
                              <div className="flex items-center gap-2.5 z-10">
                                  <div className="relative flex items-center justify-center w-6">
                                      {index === 0 ? (
                                          <span className="text-xl drop-shadow">🥇</span>
                                      ) : index === 1 ? (
                                          <span className="text-xl drop-shadow">🥈</span>
                                      ) : (
                                          <span className="text-xl drop-shadow">🥉</span>
                                      )}
                                  </div>
                                  
                                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase border border-indigo-200">
                                      {entry.name ? entry.name.charAt(0) : 'U'}
                                  </div>
                                  
                                  <div>
                                      <p className="text-xs font-bold text-foreground truncate max-w-[100px]">
                                          {entry.name}
                                      </p>
                                      <p className="text-[9px] text-muted-foreground font-medium uppercase">Score</p>
                                  </div>
                              </div>
                              
                              <div className="flex flex-col items-end z-10">
                                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{entry.totalPoints}</span>
                                  <div className="h-1 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden mt-1">
                                      <div 
                                        className="h-full bg-indigo-500 rounded-full" 
                                        style={{ width: `${Math.min((entry.totalPoints / leaderboard[0].totalPoints) * 100, 100)}%` }}
                                      ></div>
                                  </div>
                              </div>
                          </div>
                      )) : (
                          <div className="p-6 text-center text-muted-foreground italic text-xs">No activity data.</div>
                      )}
                  </div>
                  
                  {userRank && (
                      <div className="px-4 py-2 bg-indigo-500/5 border-t flex items-center justify-between text-[11px] border-indigo-500/10 mt-auto">
                          <span className="font-bold opacity-60 uppercase flex items-center gap-1"><Award className="w-3 h-3" /> Your Rank</span>
                          <Badge variant="secondary" className="bg-indigo-500 text-white text-[10px] px-2 py-0 h-5 font-black shadow-sm">#{userRank}</Badge>
                      </div>
                  )}
              </CardContent>
          </Card>

          {/* Confidence Gauge (Top Positioned) */}
          <Card className="lg:col-span-3 border shadow-md relative overflow-hidden group flex flex-col items-center justify-center min-h-[220px] order-3 lg:order-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <CardHeader className="pb-0 w-full text-center">
                  <CardTitle className="text-xs font-black text-muted-foreground flex items-center justify-center gap-2 uppercase tracking-widest">
                      <Activity className="w-3 h-3" /> Confidence Level
                  </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-4 pb-5">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-6 border-muted shadow-[inset_0_0_8px_rgba(0,0,0,0.05)]">
                      <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20"/>
                          <circle 
                              cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 42}`}
                              strokeDashoffset={`${2 * Math.PI * 42 * (1 - perfData.confidenceScore / 100)}`}
                              strokeLinecap="round"
                              className={`${perfData.confidenceScore >= 70 ? 'text-emerald-500' : perfData.confidenceScore >= 40 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                          />
                      </svg>
                      <div className="text-center relative z-10">
                          <span className="text-2xl font-black tracking-tighter">{perfData.confidenceScore}%</span>
                      </div>
                  </div>
                  <Badge className={`mt-3 font-bold border text-[10px] uppercase ${getConfidenceColor(perfData.confidenceScore)}`}>
                      {perfData.confidenceScore >= 80 ? "Ready" : perfData.confidenceScore >= 50 ? "Rising" : "Needs Focus"}
                  </Badge>
              </CardContent>
          </Card>

          {/* Spotlight AI */}
          <Card className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 border-0 text-white relative shadow-xl overflow-hidden order-1 lg:order-3">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full"></div>
              
              <CardHeader className="relative z-10 pb-1 pt-4 px-4 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-[10px] tracking-widest uppercase">
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>AI Diagnostic</span>
                    </div>
                    <CardTitle className="text-lg mt-0.5 font-bold tracking-tight">Performance Spotlight</CardTitle>
                  </div>
                  <Badge className="bg-indigo-500 hover:bg-indigo-600 text-[9px] font-black px-1.5 py-0 h-4">LIVEGEN</Badge>
              </CardHeader>
              <CardContent className="relative z-10 px-4 pb-4">
                  <p className="text-indigo-50 leading-relaxed text-xs font-medium opacity-90 border-l-2 border-indigo-500 pl-3 mb-3 italic">
                      "{aiAnalysis?.detailedAnalysis ? (aiAnalysis.detailedAnalysis.substring(0, 150) + '...') : "Gathering additional intelligence payloads."}"
                  </p>
                  
                  {aiAnalysis && aiAnalysis.strengths && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-white/5 backdrop-blur-md p-2 rounded-lg border border-white/10">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1 mb-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Strengths
                            </h4>
                            <ul className="space-y-1">
                                {aiAnalysis.strengths.slice(0,2).map((s, i) => (
                                    <li key={i} className="text-[10px] font-medium flex items-start gap-1 text-slate-200 truncate">
                                        <span className="text-emerald-500">✦</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-2 rounded-lg border border-white/10">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1 mb-1">
                                <Target className="w-2.5 h-2.5" /> Gaps
                            </h4>
                            <ul className="space-y-1">
                                {aiAnalysis.improvements?.slice(0,2).map((imp, i) => (
                                    <li key={i} className="text-[10px] font-medium flex items-start gap-1 text-slate-200 truncate">
                                        <span className="text-amber-500">✦</span> {imp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                  )}
              </CardContent>
          </Card>
      </div>

      {/* Recommendations Row - Critical Add */}
      {aiAnalysis && aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
          <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-foreground">
                  <Award className="w-5 h-5 text-primary fill-primary/20" /> Personalized Blueprint
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiAnalysis.recommendations.map((rec, idx) => (
                      <Card key={idx} className="border border-border/60 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 relative overflow-hidden cursor-default group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-cyan-500"></div>
                          <CardContent className="p-5 pt-6">
                              <div className="absolute -top-2 right-2 text-6xl font-black text-muted/10 tracking-tighter group-hover:text-muted/20 transition-colors">{idx+1}</div>
                              <Badge variant="outline" className="mb-3 bg-accent font-bold text-[10px]">ACTION ITEM</Badge>
                              <p className="text-sm font-semibold leading-snug text-foreground relative z-10 group-hover:text-primary transition-colors">
                                  {rec}
                              </p>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      )}

      {/* Module Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/40 hover:bg-card transition-all border shadow-sm hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <Code className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">Coding Ratio</p>
                    <h3 className="text-2xl font-black">{perfData.codingSummary.solvedProblemsCount}<span className="text-sm font-normal text-muted-foreground opacity-70">/{perfData.codingSummary.attemptedProblemsCount || 0}</span></h3>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 hover:bg-card transition-all border shadow-sm hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                    <Brain className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">Avg Quiz</p>
                    <h3 className="text-2xl font-black">{perfData.quizSummary.avgScore}%</h3>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 hover:bg-card transition-all border shadow-sm hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <Keyboard className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">Avg WPM</p>
                    <h3 className="text-2xl font-black">{perfData.typingSummary.avgWpm}</h3>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 hover:bg-card transition-all border shadow-sm hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">Comm Score</p>
                    <h3 className="text-2xl font-black">{perfData.commSummary.avgScore}%</h3>
                </div>
            </CardContent>
          </Card>
      </div>

      {/* Charts & Trends + Radar distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Chart */}
          <Card className="lg:col-span-2 border border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between bg-accent/5 pb-4 border-b border-border/40">
                  <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/> Quiz Timeline Matrix</CardTitle>
                      <CardDescription>Performance iteration history tracking</CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-black bg-primary text-primary-foreground shadow-sm">{perfData.quizSummary.highestScore}% PEAK</Badge>
              </CardHeader>
              <CardContent className="h-[300px] pt-6">
                  {quizTrendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={quizTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorScoreGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                              <YAxis domain={[0, 100]} tick={{fontSize: 11, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false} />
                              <Tooltip 
                                  contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                  itemStyle={{ color: "var(--primary)" }}
                                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4' }}
                              />
                              <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreGrad)" animationDuration={1500} />
                          </AreaChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium italic opacity-60">
                          Initialize quiz testing cycles to populate trajectory.
                      </div>
                  )}
              </CardContent>
          </Card>

          {/* Skill Radar repositioned here to look tight */}
          <Card className="border border-border/50 bg-gradient-to-br from-card to-accent/5 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-extrabold flex items-center gap-2 tracking-wider uppercase opacity-75">
                    <Star className="w-4 h-4 text-amber-500 fill-current" /> 
                    Skill Balance
                </CardTitle>
                <CardDescription>Unified attribution distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px] flex items-center justify-center pt-2">
                {totalModulesUsed === 0 ? (
                    <div className="text-xs text-muted-foreground text-center opacity-50">Dataset incomplete for matrix plot.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="var(--border)" opacity={0.5} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--foreground)", fontSize: 11, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Profile" dataKey="A" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary))" fillOpacity={0.35} animationDuration={1500} />
                        </RadarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
          </Card>
      </div>

      {/* Second row of trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Typing Chart */}
          <Card className="lg:col-span-1 border border-border/50 shadow-sm bg-card">
              <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2"><Keyboard className="w-5 h-5 text-emerald-500"/> Typing Performance</CardTitle>
                    <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 font-bold text-[10px]">{perfData.typingSummary.count} LOGS</Badge>
                  </div>
              </CardHeader>
              <CardContent className="h-[220px] pt-2">
                  {typingTrendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={typingTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                              <XAxis dataKey="name" tick={{fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                              <YAxis tick={{fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                              <Tooltip contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", fontSize: '12px', borderRadius: '6px' }} />
                              <Line type="monotone" dataKey="wpm" name="WPM" stroke="#10b981" strokeWidth={3} dot={{r: 3, fill: "#10b981"}} activeDot={{ r: 5 }} animationDuration={1200} />
                              <Line type="monotone" dataKey="accuracy" name="Acc" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 2" dot={false} animationDuration={1200} />
                          </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                          Null dataset.
                      </div>
                  )}
              </CardContent>
          </Card>

          {/* Detailed Usage Breakdown */}
          <Card className="lg:col-span-2 border border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-500" /> Module Engagement</CardTitle>
                  <CardDescription>Progress tracking across key learning activities</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2 bg-accent/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                          <span className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-80"><Award className="w-4 h-4 text-blue-500" /> Interviews</span>
                          <span className="font-black text-blue-600 dark:text-blue-400">{perfData.stats.interviewsAttended}</span>
                      </div>
                      <Progress value={Math.min((perfData.stats.interviewsAttended / 10) * 100, 100)} className="h-1.5 bg-slate-200 dark:bg-slate-800 [&>div]:bg-blue-500" />
                  </div>
                  
                  <div className="space-y-2 bg-accent/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                          <span className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-80"><Brain className="w-4 h-4 text-indigo-500" /> Tech Cycles</span>
                          <span className="font-black text-indigo-600 dark:text-indigo-400">{perfData.stats.technicalQuizCount}</span>
                      </div>
                      <Progress value={Math.min((perfData.stats.technicalQuizCount / 20) * 100, 100)} className="h-1.5 bg-slate-200 dark:bg-slate-800 [&>div]:bg-indigo-500" />
                  </div>

                  <div className="space-y-2 bg-accent/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                          <span className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-80"><Target className="w-4 h-4 text-emerald-500" /> Aptitude Tests</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">{perfData.stats.aptitudeExamCount}</span>
                      </div>
                      <Progress value={Math.min((perfData.stats.aptitudeExamCount / 20) * 100, 100)} className="h-1.5 bg-slate-200 dark:bg-slate-800 [&>div]:bg-emerald-500" />
                  </div>

                  <div className="space-y-2 bg-accent/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                          <span className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-80"><MessageSquare className="w-4 h-4 text-rose-500" /> Debate Load</span>
                          <span className="font-black text-rose-600 dark:text-rose-400">{(perfData.stats.debateCount || 0) + (perfData.stats.gdCount || 0)}</span>
                      </div>
                      <Progress value={Math.min((( (perfData.stats.debateCount || 0) + (perfData.stats.gdCount || 0) ) / 15) * 100, 100)} className="h-1.5 bg-slate-200 dark:bg-slate-800 [&>div]:bg-rose-500" />
                  </div>
              </CardContent>
          </Card>
      </div>
      
      {/* Activity Ledger now spanning FULL width or clean container at bottom */}
      <Card className="border border-border/40 bg-accent/5 shadow-inner overflow-hidden flex flex-col w-full">
          <CardHeader className="py-4 bg-muted/30 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black tracking-widest uppercase flex items-center gap-2"><Activity className="w-4 h-4"/> Recent Activity Log</CardTitle>
              <span className="text-[10px] font-medium text-muted-foreground">Recent Milestone Records</span>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-full max-h-[300px] overflow-y-auto scrollbar-thin">
                  {(perfData.stats.recentActivities || []).length > 0 ? (
                      <div className="divide-y divide-border/30">
                          {perfData.stats.recentActivities.map((act: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group">
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg border ${
                                          act.activityType === 'interview' ? 'bg-blue-500/5 border-blue-500/20 text-blue-500' :
                                          act.activityType === 'quiz' ? 'bg-purple-500/5 border-purple-500/20 text-purple-500' :
                                          act.activityType === 'coding' ? 'bg-orange-500/5 border-orange-500/20 text-orange-500' : 'bg-slate-500/5 border-slate-500/20 text-slate-500'
                                      }`}>
                                          {act.activityType === 'interview' ? <Award size={16} /> : 
                                           act.activityType === 'quiz' ? <Brain size={16} /> : <Activity size={16} />}
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{act.title}</p>
                                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{new Date(act.timestamp).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}</p>
                                      </div>
                                  </div>
                                  {act.score && <Badge variant="outline" className="text-xs font-black px-2 bg-background shadow-sm border-border/80">{act.score}</Badge>}
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center text-muted-foreground py-12 text-sm font-medium opacity-60 italic">No ledger entries documented.</div>
                  )}
              </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalyzer;
