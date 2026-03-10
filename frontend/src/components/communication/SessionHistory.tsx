import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { auth } from '@/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { History, Target, TrendingUp, Clock } from 'lucide-react';

interface SessionData {
    id: string;
    mode: string;
    score: number;
    wpm: number;
    grammarErrorCount: number;
    createdAt: any;
}

const SessionHistory = () => {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!auth.currentUser) return;
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.get('/soft-skills/communication', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        // Map _id to id to keep compatibility
                        const data = response.data.sessions.map((doc: any) => ({
                            ...doc,
                            id: doc._id
                        })) as SessionData[];
                        setSessions(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div className="h-40 flex items-center justify-center text-gray-400">Loading history...</div>;
    }

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <History className="w-8 h-8 text-gray-300" />
                <div>
                    <p className="font-semibold text-gray-700">No History Yet</p>
                    <p className="text-sm text-gray-500">Complete a practice session to see your progress here.</p>
                </div>
            </div>
        );
    }

    // Averages
    const avgScore = Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length);
    const avgWpm = Math.round(sessions.reduce((acc, s) => acc + (s.wpm || 0), 0) / sessions.filter(s => s.wpm).length || 1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Target className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Score</p>
                            <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Pace</p>
                            <p className="text-2xl font-bold text-gray-900">{avgWpm || '-'} <span className="text-sm text-gray-500 font-medium">WPM</span></p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm pt-2">
                    <Clock className="w-4 h-4" /> Past Sessions
                </h4>
                {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 capitalize">{session.mode} Mode</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Recent'} • {session.wpm || '-'} WPM
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right flex flex-col items-end">
                                <span className={`text-xl font-bold ${session.score >= 80 ? 'text-emerald-500' : session.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {session.score}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Score</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionHistory;
