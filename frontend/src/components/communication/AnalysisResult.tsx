import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Activity, MessageSquare, Lightbulb, TrendingUp } from "lucide-react";
import WordComparison from './WordComparison';
import PronunciationScore from './PronunciationScore';

export interface AnalysisData {
    score: number;
    grammarCorrections: Array<{ original: string; correction: string; reason: string }>;
    fillerWordCount: Record<string, number>;
    tone: string;
    feedback: string;
    wpmFeedback?: string;
    sentenceReframing?: Array<{ original: string; improved: string; reason: string }>;
}

interface AnalysisResultProps {
    analysis: AnalysisData;
    referenceText?: string;
    transcript?: string;
    wpm?: number;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, referenceText, transcript, wpm }) => {
    const { score, grammarCorrections, fillerWordCount, tone, feedback, wpmFeedback, sentenceReframing } = analysis;

    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-emerald-500";
        if (s >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const scoreColor = getScoreColor(score);
    const showComparison = referenceText && transcript;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Top Stats Row */}
            <div className="grid md:grid-cols-4 gap-4">
                {/* Overall Score */}
                <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                    <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className={scoreColor} strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * score) / 100} />
                            </svg>
                            <span className={`absolute text-3xl font-bold ${scoreColor}`}>{score}</span>
                        </div>
                        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Overall Score</p>
                    </CardContent>
                </Card>

                {/* Tone & WPM Analysis */}
                <Card className="md:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-blue-500" /> Delivery Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase">Tone</div>
                                    <div className="text-xl font-bold text-gray-800">{tone}</div>
                                </div>
                                <p className="text-sm text-gray-600">{feedback}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">Pace</div>
                                    <div className="text-xl font-bold text-gray-800">
                                        {wpm ? `${wpm} WPM` : 'Unknown'}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">{wpmFeedback || (wpm ? `Your speaking pace was ${wpm} words per minute.` : 'No pace data available.')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Read Along Specific Analysis (Word Match & Pronunciation) */}
            {showComparison && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <PronunciationScore referenceText={referenceText} transcript={transcript} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <WordComparison referenceText={referenceText} transcript={transcript} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Grammar and Reframing */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Grammar Corrections */}
                <Card className="border-red-100 bg-red-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" /> Grammar Check
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {!grammarCorrections || grammarCorrections.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                                <CheckCircle className="w-8 h-8 mb-2" />
                                <span className="font-medium">No grammar errors found! Great job!</span>
                            </div>
                        ) : (
                            grammarCorrections.map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm transition-hover hover:border-red-300">
                                    <div className="flex items-start gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                        <span className="line-through text-gray-500 decoration-red-400 text-sm">{item.original}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="font-medium text-gray-900 text-sm">{item.correction}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-blue-700 bg-blue-50/50 p-2 rounded block">
                                        <strong>Why:</strong> {item.reason}
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Sentence Reframing Suggestions */}
                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-700">
                            <Lightbulb className="w-5 h-5 text-indigo-500" /> Better Ways to Say It
                        </CardTitle>
                        <CardDescription>Professional reframing suggestions for interviews</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {!sentenceReframing || sentenceReframing.length === 0 ? (
                            <div className="flex items-center justify-center p-6 text-gray-500 italic">
                                Your phrasing was very natural and professional. No major suggestions.
                            </div>
                        ) : (
                            sentenceReframing.map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                                    <p className="text-gray-500 italic text-sm mb-2 border-l-2 border-gray-300 pl-2">
                                        "{item.original}"
                                    </p>
                                    <div className="flex gap-2 p-2 bg-indigo-50 rounded text-sm text-indigo-900 mb-2">
                                        <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <span className="font-medium">"{item.improved}"</span>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">💡 {item.reason}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filler Words */}
            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <MessageSquare className="w-5 h-5 text-purple-500" /> Filler Words
                    </CardTitle>
                    <CardDescription>Frequent pauses or hesitations used</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {!fillerWordCount || Object.entries(fillerWordCount).length === 0 ? (
                            <span className="text-emerald-500 font-medium flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                                <CheckCircle className="w-4 h-4" /> No filler words detected!
                            </span>
                        ) : (
                            Object.entries(fillerWordCount).map(([word, count]) => (
                                <div key={word} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
                                    <span className="font-medium text-gray-700 capitalize text-sm">{word}</span>
                                    <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-900 shadow-sm border">{count}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 space-y-2 max-w-md">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Fluency Score</p>
                        <Progress
                            value={Math.max(0, 100 - (Object.values(fillerWordCount || {}).reduce((a, b: any) => a + b, 0) * 5))}
                            className="h-2"
                        />
                        <p className="text-xs text-gray-400">Fewer fillers = Higher fluency</p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default AnalysisResult;
