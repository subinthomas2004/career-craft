import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Trophy, Target, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

interface DebateSession {
    _id: string;
    topic: string;
    overallScore: number;
    createdAt: string;
}

const DebatePerformance = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<DebateSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (!userInfo) {
                    setLoading(false);
                    return;
                }
                const { token } = JSON.parse(userInfo);
                if (!token) {
                    setLoading(false);
                    return;
                }
                const res = await api.get('/soft-skills/debate', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setSessions(res.data.sessions.reverse()); // oldest first for chart
                }
            } catch (err) {
                console.error("Failed to fetch debate sessions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const chartData = sessions.map((s, i) => ({
        name: `#${i + 1}`,
        score: s.overallScore,
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        topic: s.topic.length > 30 ? s.topic.substring(0, 30) + '...' : s.topic,
    }));

    const avgScore = sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length)
        : 0;

    const bestScore = sessions.length > 0
        ? Math.max(...sessions.map(s => s.overallScore))
        : 0;

    const latestScore = sessions.length > 0
        ? sessions[sessions.length - 1].overallScore
        : 0;

    const trend = sessions.length >= 2
        ? sessions[sessions.length - 1].overallScore - sessions[sessions.length - 2].overallScore
        : 0;

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-background">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-muted-foreground">Loading your debate history...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="space-y-8">


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                        Performance Evolution
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Track your debate skills improvement over time.
                    </p>
                </motion.div>

                {sessions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 space-y-4"
                    >
                        <Target className="w-16 h-16 text-muted-foreground/30" />
                        <h2 className="text-xl font-semibold text-muted-foreground">No debates yet</h2>
                        <p className="text-sm text-muted-foreground/70">Complete your first debate to see your performance here.</p>
                        <Button onClick={() => navigate('/dashboard/debate/topic')} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Start a Debate
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Average Score
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-4xl font-bold text-foreground">{avgScore}</span>
                                        <span className="text-lg text-muted-foreground ml-1">/100</span>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                            <Trophy className="w-3.5 h-3.5 text-emerald-500" /> Best Score
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-4xl font-bold text-emerald-600">{bestScore}</span>
                                        <span className="text-lg text-muted-foreground ml-1">/100</span>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="bg-card/50 border-border">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5 text-indigo-500" /> Latest Score
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-4xl font-bold text-foreground">{latestScore}</span>
                                        <span className="text-lg text-muted-foreground ml-1">/100</span>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                                <Card className="bg-card/50 border-border">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                                            Trend
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className={cn(
                                            "text-4xl font-bold",
                                            trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-muted-foreground"
                                        )}>
                                            {trend > 0 ? '+' : ''}{trend}
                                        </span>
                                        <span className="text-sm text-muted-foreground ml-2">vs last</span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Chart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="bg-card/50 backdrop-blur border-border p-6">
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle>Score Over Time</CardTitle>
                                    <CardDescription>Your debate performance evolution across all sessions.</CardDescription>
                                </CardHeader>
                                <div className="w-full h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                    padding: '12px 16px',
                                                }}
                                                formatter={(value: number, _name: string, props: any) => [
                                                    `${value}/100`,
                                                    `Score`
                                                ]}
                                                labelFormatter={(_label: string, payload: any[]) => {
                                                    if (payload && payload[0]) {
                                                        return `${payload[0].payload.date} — ${payload[0].payload.topic}`;
                                                    }
                                                    return '';
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                fill="url(#scoreGradient)"
                                                dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                                activeDot={{ r: 7, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Session History Table */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Card className="bg-card/50 backdrop-blur border-border">
                                <CardHeader>
                                    <CardTitle>Session History</CardTitle>
                                    <CardDescription>All your past debate sessions and scores.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {[...sessions].reverse().slice(0, 5).map((session, i) => (
                                            <div
                                                key={session._id}
                                                className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{session.topic}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date(session.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric', month: 'short', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className={cn(
                                                    "text-2xl font-bold tabular-nums ml-4",
                                                    session.overallScore >= 70 ? "text-emerald-600" :
                                                    session.overallScore >= 40 ? "text-amber-600" : "text-red-500"
                                                )}>
                                                    {session.overallScore}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DebatePerformance;
