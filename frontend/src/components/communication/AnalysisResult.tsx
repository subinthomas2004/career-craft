import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Sparkles, Activity, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultProps {
    analysis: {
        score: number;
        grammarCorrections: Array<{ original: string; correction: string; reason: string }>;
        fillerWordCount: Record<string, number>;
        tone: string;
        feedback: string;
    };
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
    const { score, grammarCorrections, fillerWordCount, tone, feedback } = analysis;

    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-emerald-500";
        if (s >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const scoreColor = getScoreColor(score);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Top Stats Row */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Overall Score */}
                <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className={scoreColor} strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * score) / 100} />
                            </svg>
                            <span className={`absolute text-3xl font-bold ${scoreColor}`}>{score}</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Overall Score</p>
                    </CardContent>
                </Card>

                {/* Tone Analysis */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-blue-500" /> Tone Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-4xl font-bold text-gray-800">{tone}</div>
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Detected Sentiment</div>
                        </div>
                        <p className="text-gray-600">{feedback}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Grammar Corrections */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-red-100 bg-red-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" /> Grammar Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {grammarCorrections.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-gray-400 italic">No grammar errors found! Great job!</div>
                        ) : (
                            grammarCorrections.map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                    <div className="flex items-start gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                        <span className="line-through text-gray-500 decoration-red-400">{item.original}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="font-medium text-gray-900">{item.correction}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded block">
                                        <strong>Why:</strong> {item.reason}
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Filler Words */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-500" /> Filler Words
                        </CardTitle>
                        <CardDescription>Frequent pauses or hesitations used</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(fillerWordCount).length === 0 ? (
                                <span className="text-gray-400 italic">No filler words detected.</span>
                            ) : (
                                Object.entries(fillerWordCount).map(([word, count]) => (
                                    <div key={word} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
                                        <span className="font-medium text-gray-700 capitalize">{word}</span>
                                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-900 shadow-sm border">{count}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Visual Representation roughly */}
                        <div className="mt-6 space-y-2">
                            <p className="text-xs text-gray-500 font-medium uppercase">Fluency Meter</p>
                            <Progress value={Math.max(0, 100 - (Object.values(fillerWordCount).reduce((a, b) => a + b, 0) * 5))} className="h-2" />
                            <p className="text-xs text-right text-gray-400">Fewer fillers = Higher fluency</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default AnalysisResult;
