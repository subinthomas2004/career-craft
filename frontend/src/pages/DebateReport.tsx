import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Share2, Loader2, AlertCircle, CheckCircle2, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface DebateReportData {
    overallScore: number;
    metrics: {
        clarity: number;
        confidence: number;
        reasoning: number;
        relevance: number;
        persuasiveness: number;
    };
    feedback: {
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
    };
    fillerWordsCount: number;
}

const DebateReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { transcript, topic, stance } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<DebateReportData | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!transcript || transcript.length === 0) {
            // Ideally redirect or show error, but for dev we might allow viewing empty
            // setError("No debate data found to analyze.");
            // setLoading(false);
            // return;

            // For testing layout without data, comment above and uncomment below:
            // Mock data if needed, or just handle error
        }

        if (transcript && transcript.length > 0) {
            generateReport();
        } else {
            // Fallback for direct access/testing
            setLoading(false);
            setError("No debate transcript found. Please complete a debate first.");
        }
    }, [transcript]);

    const generateReport = async () => {
        try {
            const fullConversation = transcript.map((t: any) => `${t.speaker}: ${t.text}`).join('\n');

            const prompt = `
            Analyze the following debate transcript.
            Topic: "${topic}"
            User Stance: ${stance}
            
            Transcript:
            ${fullConversation}
            
            Evaluate the "User" performance based on:
            1. Speech Clarity
            2. Confidence
            3. Logical Reasoning
            4. Relevance to Topic
            5. Persuasiveness
            6. Filler words usage (estimate count based on text like 'um', 'uh', 'like')

            Return ONLY a valid JSON object with this exact structure:
            {
                "overallScore": number (0-100),
                "metrics": {
                    "clarity": number (0-100),
                    "confidence": number (0-100),
                    "reasoning": number (0-100),
                    "relevance": number (0-100),
                    "persuasiveness": number (0-100)
                },
                "feedback": {
                    "strengths": ["string", "string"],
                    "weaknesses": ["string", "string"],
                    "suggestions": ["string", "string"]
                },
                "fillerWordsCount": number
            }
            `;

            // Use the api client to communicate with the backend
            // Assuming the backend proxies this or handles it.
            // If strictly replacing localhost:5000, we use relative path.
            const res = await api.post('/ollama/chat', {
                message: prompt,
                model: 'llama3.2:1b'
            });

            const jsonStr = res.data.response;
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);

            setReport(data);
        } catch (err) {
            console.error("Report generation failed:", err);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const radarData = report ? {
        labels: ['Clarity', 'Confidence', 'Reasoning', 'Relevance', 'Persuasiveness'],
        datasets: [
            {
                label: 'Performance',
                data: [
                    report.metrics.clarity,
                    report.metrics.confidence,
                    report.metrics.reasoning,
                    report.metrics.relevance,
                    report.metrics.persuasiveness,
                ],
                backgroundColor: 'rgba(99, 102, 241, 0.2)', // Indigo-500/20
                borderColor: '#6366f1', // Indigo-500
                borderWidth: 2,
                pointBackgroundColor: '#818cf8',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1'
            },
        ],
    } : null;

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: { size: 12 }
                },
                ticks: { display: false, backdropColor: 'transparent' },
                suggestedMin: 0,
                suggestedMax: 100,
            }
        },
        plugins: {
            legend: { display: false }
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-background">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Analyzing Debate...</h2>
                    <p className="text-muted-foreground">Evaluating your logic, confidence, and persuasion skills.</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-8 space-y-6">
                <Alert variant="destructive" className="max-w-md border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Error</AlertTitle>
                    <AlertDescription>{error || "No report data available."}</AlertDescription>
                </Alert>
                <Button onClick={() => navigate('/dashboard/debate/topic')} className="bg-indigo-600 hover:bg-indigo-700">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Return to Topics
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Actions */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <Button variant="ghost" onClick={() => navigate('/dashboard/debate')} className="w-fit -ml-2 hover:bg-white/5">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Debate Home
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5"><Share2 className="w-4 h-4 mr-2" /> Share Result</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
                    </div>
                </motion.div>

                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Performance Analysis
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Topic: <span className="text-foreground font-medium">"{topic}"</span>
                    </p>
                </motion.div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Overall Score */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 backdrop-blur-sm overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-400" /> Overall Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-bold text-white tracking-tighter">{report.overallScore}</span>
                                    <span className="text-xl text-muted-foreground">/100</span>
                                </div>
                                <Progress value={report.overallScore} className="h-2 mt-6 bg-white/10" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Filler Words */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="h-full bg-card/50 backdrop-blur border-white/10 hover:border-white/20 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Filler Words
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className={cn("text-6xl font-bold tracking-tighter", report.fillerWordsCount > 5 ? "text-amber-500" : "text-emerald-500")}>
                                        {report.fillerWordsCount}
                                    </span>
                                    <span className="text-sm text-muted-foreground">detected</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Words like "um", "uh", "like". <br />
                                    {report.fillerWordsCount < 5 ? "Great job speaking cleanly!" : "Try to pause instead of using fillers."}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Top Strength */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="h-full bg-card/50 backdrop-blur border-white/10 hover:border-white/20 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Top Strength
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl font-medium leading-relaxed text-emerald-100">
                                    "{report.feedback.strengths[0]}"
                                </p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Your strongest attribute in this debate.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Deep Dive Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Radar Chart */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                        <Card className="h-full bg-card/50 backdrop-blur border-white/10 p-6 flex flex-col items-center justify-center">
                            <CardHeader className="w-full text-left p-0 mb-6">
                                <CardTitle>Skill Breakdown</CardTitle>
                                <CardDescription>Visual mapping of your debate capabilities.</CardDescription>
                            </CardHeader>
                            <div className="w-full max-w-[400px] aspect-square relative">
                                {radarData && <Radar data={radarData} options={radarOptions} />}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Feedback Lists */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-4">

                        {/* Strengths */}
                        <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-emerald-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> What you did well
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.feedback.strengths.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-emerald-100/80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Weaknesses */}
                        <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Areas to improve
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.feedback.weaknesses.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-red-100/80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Suggestions */}
                        <Card className="bg-blue-500/5 border-blue-500/20 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Pro Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.feedback.suggestions.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-blue-100/80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DebateReport;
