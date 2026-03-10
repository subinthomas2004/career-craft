import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TypingState, TypingConfig } from '@/lib/typing/engine';
import { RefreshCw, Trophy, AlertCircle, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

interface ResultsDashboardProps {
    state: TypingState;
    config: TypingConfig;
    onRestart: () => void;
    isRankedMode?: boolean;
    consistencyScore?: number;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ state, config, onRestart, isRankedMode = false, consistencyScore: externalConsistency }) => {
    // Chart Data
    const chartData = state.history.map((h, i) => ({
        time: config.duration - h.time,
        wpm: h.wpm
    }));

    // Calculate Consistency — use external if provided, otherwise compute locally
    const computeConsistency = () => {
        const wpms = state.history.map(h => h.wpm).filter(w => w > 0);
        if (wpms.length < 2) return 100;
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        if (mean === 0) return 0;
        const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        return Math.max(0, Math.min(100, Math.round(100 - cv)));
    };
    const consistencyScore = externalConsistency ?? computeConsistency();

    // Error Analysis Data
    const errorData = Object.entries(state.missedKeys)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, count]) => ({ key: key === ' ' ? 'Space' : key, count }));

    const getRank = (wpm: number) => {
        if (wpm > 100) return { title: "Grandmaster", color: "text-purple-500" };
        if (wpm > 80) return { title: "Professional", color: "text-blue-500" };
        if (wpm > 60) return { title: "Advanced", color: "text-green-500" };
        if (wpm > 40) return { title: "Intermediate", color: "text-yellow-500" };
        return { title: "Beginner", color: "text-gray-500" };
    };

    const rank = getRank(state.wpm);

    return (
        <div className="animate-in fade-in zoom-in duration-300 space-y-8">

            {/* Hero Stats */}
            <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/30 mb-4 animate-bounce-slow`}>
                    <Trophy className={`w-12 h-12 ${rank.color}`} />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight">Test Complete!</h2>
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground font-medium">Performance Rank</span>
                    <span className={`text-2xl font-bold ${rank.color}`}>{rank.title}</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="text-5xl font-bold text-primary mb-1">{state.wpm}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Net WPM</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="text-5xl font-bold text-green-600 mb-1">{state.accuracy}%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Accuracy</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="text-5xl font-bold text-blue-600 mb-1">{consistencyScore}%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Consistency</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="text-5xl font-bold text-red-600 mb-1">{state.errors}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Errors</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart */}
                <Card className="col-span-1 border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" /> Speed Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="wpm"
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorWpm)"
                                    strokeWidth={3}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Error Analysis */}
                <Card className="col-span-1 border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-destructive" /> Most Frequent Typos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        {errorData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={errorData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="key" type="category" width={50} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={20}>
                                        {errorData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <Trophy className="w-12 h-12 mb-2 text-green-500 opacity-50" />
                                <p>Flawless! No errors detected.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4 max-w-lg mx-auto">
                <Button size="lg" className="flex-1 rounded-full shadow-lg" onClick={onRestart}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            </div>
        </div>
    );
};
