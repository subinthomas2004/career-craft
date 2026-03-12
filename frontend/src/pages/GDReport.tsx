import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Play, Timer, Award, MessageSquare, BarChart3, Download, Share2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Participant {
    id: string;
    name: string;
    role: string;
    color: string;
    avatar?: string;
    isUser?: boolean;
}

interface TranscriptItem {
    speakerId: string;
    speakerName: string;
    text: string;
    timestamp: string;
}

interface ParticipantStats {
    id: string;
    name: string;
    avatar?: string;
    isUser?: boolean;
    turns: number;
    words: number;
    speakingTime: number; // in seconds (estimated)
    score: number;
    rank: number;
}

const GDReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, transcript = [], participants = [], abusiveKickout = false } = location.state || {};

    if (!topic || transcript.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <Card className="w-full max-w-md text-center p-6">
                    <CardHeader>
                        <CardTitle className="text-xl text-red-600">No Report Data Found</CardTitle>
                        <CardDescription>Please complete a discussion to generate a report.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/dashboard/group-discussion')}>
                            Go to Group Discussion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Record Activity
    React.useEffect(() => {
        const recordActivity = async () => {
            window.speechSynthesis.cancel();
            try {
                // Prevent duplicate recording if possible (e.g. check a flag or just do it)
                // Using a simple check to see if we have valid data
                if (topic && userStats) {
                    const userInfo = localStorage.getItem("userInfo");
                    if (userInfo) {
                        const { token } = JSON.parse(userInfo);
                        await api.post('/auth/activity', {
                            title: `Group Discussion: ${topic}`,
                            activityType: 'interview', // Reusing interview icon/type or maybe 'learning'
                            score: `Rank #${userStats.rank}`
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to record activity", err);
            }
        };

        // Small delay to ensure stats are calculated
        const timer = setTimeout(recordActivity, 1000);
        return () => clearTimeout(timer);
    }, [topic]);

    // --- Metrics Calculation ---
    const calculateStats = (): ParticipantStats[] => {
        const statsMap = new Map<string, ParticipantStats>();

        // Initialize stats for known participants
        (participants as Participant[]).forEach(p => {
            statsMap.set(p.id, {
                id: p.id,
                name: p.name,
                avatar: p.avatar,
                isUser: p.isUser,
                turns: 0,
                words: 0,
                speakingTime: 0,
                score: 0,
                rank: 0
            });
        });

        // Add 'user' if not in list (fallback)
        if (!statsMap.has('user')) {
            statsMap.set('user', {
                id: 'user',
                name: 'You',
                isUser: true,
                turns: 0,
                words: 0,
                speakingTime: 0,
                score: 0,
                rank: 0
            });
        }

        // Add 'moderator' if not in list
        if (!statsMap.has('moderator')) {
            statsMap.set('moderator', {
                id: 'moderator',
                name: 'Interviewer',
                turns: 0,
                words: 0,
                speakingTime: 0,
                score: 0,
                rank: 0
            });
        }


        // Process Transcript
        (transcript as TranscriptItem[]).forEach(t => {
            const pStats = statsMap.get(t.speakerId);
            if (pStats) {
                pStats.turns += 1;
                const wordCount = t.text.trim().split(/\s+/).length;
                pStats.words += wordCount;
                // Estimate: 150 words per minute => 2.5 words per second
                pStats.speakingTime += Math.ceil(wordCount / 2.5);
            }
        });

        // Calculate Scores (Simple Algorithm)
        const allStats = Array.from(statsMap.values()).map(s => {
            // Score = (Turns * 10) + (Words * 0.5)
            // Bonus for even distribution (not implemented simply here)
            s.score = Math.round((s.turns * 10) + (s.words * 0.1));
            return s;
        });

        // Rank
        return allStats
            .filter(s => s.id !== 'moderator') // Exclude moderator from ranking
            .sort((a, b) => b.score - a.score)
            .map((s, index) => ({ ...s, rank: index + 1 }));
    };

    const stats = calculateStats();
    const winner = stats[0];
    const userStats = stats.find(s => s.isUser);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <Button variant="ghost" className="-ml-2 mb-2 text-slate-500" onClick={() => navigate('/dashboard/group-discussion')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Report</h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            Topic: <span className="font-semibold text-slate-800">{topic}</span>
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Winner Card */}
                    <Card className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-indigo-100 uppercase tracking-widest text-xs font-semibold">
                                <Award className="w-4 h-4 text-yellow-300" /> Top Speaker
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                                    {winner.avatar ? <img src={winner.avatar} className="w-full h-full rounded-full object-cover" /> : winner.name[0]}
                                </div>
                                <h2 className="text-2xl font-bold">{winner.name} {winner.isUser && "(You)"}</h2>
                                <p className="text-indigo-200 text-sm">Most influential contributor</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-center">
                                <div>
                                    <p className="text-2xl font-bold">{winner.score}</p>
                                    <p className="text-xs text-indigo-300 uppercase">Impact Score</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{winner.turns}</p>
                                    <p className="text-xs text-indigo-300 uppercase">Turns Taken</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Summary - User */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Your Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <MessageSquare className="w-4 h-4" /> Speaking Turns
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{userStats?.turns || 0}</p>
                                    <p className="text-xs text-slate-400">Times you spoke</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <Timer className="w-4 h-4" /> Speaking Time
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{formatTime(userStats?.speakingTime || 0)}</p>
                                    <p className="text-xs text-slate-400">Estimated duration</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <BarChart3 className="w-4 h-4" /> Contribution
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{userStats ? Math.round((userStats.turns / transcript.length) * 100) : 0}%</p>
                                    <p className="text-xs text-slate-400">Of total discussion</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <Award className="w-4 h-4" /> Rank
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">#{abusiveKickout ? 'DQ' : (userStats?.rank || '-')}</p>
                                    <p className="text-xs text-slate-400">Among {stats.length} participants</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Participation Analytics</CardTitle>
                        <CardDescription>A breakdown of every participant's contribution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-4">Participant</div>
                                <div className="col-span-2 text-right">Turns</div>
                                <div className="col-span-2 text-right">Speaking Time</div>
                                <div className="col-span-3 text-right">Impact Score</div>
                            </div>
                            <ScrollArea className="h-[300px]">
                                {stats.map((s) => (
                                    <div key={s.id} className={cn(
                                        "grid grid-cols-12 gap-4 p-4 border-b last:border-0 hover:bg-slate-50/50 transition-colors items-center text-sm",
                                        s.isUser ? "bg-indigo-50/50 hover:bg-indigo-50" : ""
                                    )}>
                                        <div className="col-span-1 font-bold text-slate-400">#{s.rank}</div>
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                                                {s.avatar ? <img src={s.avatar} alt={s.name} /> : s.name[0]}
                                            </div>
                                            <div>
                                                <p className={cn("font-medium", s.isUser ? "text-indigo-700" : "text-slate-700")}>
                                                    {s.name} {s.isUser && "(You)"}
                                                </p>
                                                <p className="text-[10px] text-slate-400">{s.isUser ? 'Candidate (User)' : 'Candidate (AI)'}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-right font-mono">{s.turns}</div>
                                        <div className="col-span-2 text-right font-mono text-slate-500">{formatTime(s.speakingTime)}</div>
                                        <div className="col-span-3 text-right">
                                            <Badge variant={s.rank === 1 ? "default" : "secondary"} className={cn(s.rank === 1 ? "bg-green-600" : "")}>
                                                {s.score} pts
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center pt-8 pb-16">
                    <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/dashboard/group-discussion')}>
                        Start New Discussion <Play className="w-4 h-4 ml-2" />
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default GDReport;
