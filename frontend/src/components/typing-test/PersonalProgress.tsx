import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, BarChart3, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HistoryEntry {
    _id: string;
    mode: string;
    difficulty: string;
    duration: number;
    wpm: number;
    accuracy: number;
    consistency: number;
    errors: number;
    completedAt: string;
}

interface PersonalBest {
    bestWpm: number;
    bestAccuracy: number;
    bestMode: string | null;
    bestDate: string | null;
    totalTests: number;
}

export const PersonalProgress: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [personalBest, setPersonalBest] = useState<PersonalBest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userInfo = localStorage.getItem('userInfo');
                if (!userInfo) return;

                const { token } = JSON.parse(userInfo);
                const headers = { Authorization: `Bearer ${token}` };

                const [historyRes, bestRes] = await Promise.all([
                    api.get('/typing/history', { headers }),
                    api.get('/typing/personal-best', { headers })
                ]);

                setHistory(historyRes.data);
                setPersonalBest(bestRes.data);
            } catch (err) {
                console.error('Failed to fetch progress:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <Card className="border shadow-sm">
                <CardContent className="flex items-center justify-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    // No data yet
    if (!personalBest || personalBest.totalTests === 0) {
        return (
            <Card className="border shadow-sm">
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <BarChart3 className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm">Complete a typing test to see your progress!</p>
                </CardContent>
            </Card>
        );
    }

    // Prepare chart data (reverse to show oldest first)
    const chartData = [...history]
        .reverse()
        .slice(-20) // last 20 tests
        .map((h, i) => ({
            test: i + 1,
            wpm: h.wpm,
            accuracy: h.accuracy
        }));

    // Calculate average WPM
    const avgWpm = history.length > 0
        ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length)
        : 0;

    return (
        <Card className="border shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Your Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Personal Best + Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-4 text-center border border-yellow-500/20">
                        <Award className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                        <p className="text-2xl font-bold text-yellow-600">{personalBest.bestWpm}</p>
                        <p className="text-xs text-muted-foreground">Best WPM</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center border border-primary/20">
                        <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="text-2xl font-bold text-primary">{avgWpm}</p>
                        <p className="text-xs text-muted-foreground">Avg WPM</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 text-center border border-green-500/20">
                        <BarChart3 className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <p className="text-2xl font-bold text-green-600">{personalBest.totalTests}</p>
                        <p className="text-xs text-muted-foreground">Tests Taken</p>
                    </div>
                </div>

                {/* WPM Over Time Chart */}
                {chartData.length >= 2 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">WPM Over Time</p>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="test" tick={{ fontSize: 11 }} />
                                    <YAxis hide domain={[0, 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                        formatter={(value: number, name: string) => [value, name === 'wpm' ? 'WPM' : 'Accuracy']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="wpm"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#progressGradient)"
                                        strokeWidth={2}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Recent Tests */}
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Recent Tests</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {history.slice(0, 10).map((entry) => (
                            <div key={entry._id} className="flex items-center justify-between text-sm rounded-lg px-3 py-2 bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="capitalize font-medium">{entry.mode}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {entry.difficulty} · {entry.duration}s
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-primary">{entry.wpm} WPM</span>
                                    <span className="text-green-600">{entry.accuracy}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
