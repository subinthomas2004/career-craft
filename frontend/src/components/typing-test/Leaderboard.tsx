import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Crown, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface LeaderboardEntry {
    _id: string;
    userId: string;
    name: string;
    wpm: number;
    accuracy: number;
    consistency: number;
    completedAt: string;
}

interface LeaderboardProps {
    userRank?: number | null;
    refreshTrigger?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userRank, refreshTrigger }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/typing/leaderboard');
                setEntries(data);
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [refreshTrigger]);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{index + 1}</span>;
    };

    const getRankBg = (index: number) => {
        if (index === 0) return 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/30';
        if (index === 1) return 'bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/30';
        if (index === 2) return 'bg-gradient-to-r from-amber-700/10 to-amber-700/5 border-amber-700/30';
        return 'bg-muted/20 border-muted';
    };

    return (
        <Card className="border shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Global Leaderboard — Top 5
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Ranked mode: Fixed paragraph · 180 seconds
                </p>
            </CardHeader>
            <CardContent className="space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <Trophy className="w-10 h-10 mb-2 opacity-30" />
                        <p className="text-sm">No ranked scores yet. Be the first!</p>
                    </div>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={entry._id}
                            className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all hover:shadow-sm ${getRankBg(index)}`}
                        >
                            <div className="flex items-center gap-3">
                                {getRankIcon(index)}
                                <div>
                                    <p className="font-semibold text-sm">{entry.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(entry.completedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary">{entry.wpm}</p>
                                    <p className="text-xs text-muted-foreground">WPM</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">{entry.accuracy}%</p>
                                    <p className="text-xs text-muted-foreground">Accuracy</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {userRank !== null && userRank !== undefined && (
                    <div className="mt-4 text-center text-sm">
                        {userRank > 0 ? (
                            <p className="text-primary font-medium">🎉 You ranked #{userRank} on the leaderboard!</p>
                        ) : (
                            <p className="text-muted-foreground">Keep practicing to break into the Top 5!</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
