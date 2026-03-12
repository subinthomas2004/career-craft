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
import { auth } from '@/firebase';

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
            You are an Expert Debate Coach and Speech Evaluator. Analyze the following debate transcript with EXTREME precision and accuracy.
            
            Topic: "${topic}"
            User Stance: ${stance}
            
            FULL TRANSCRIPT:
            ${fullConversation}
            
            YOUR TASK: Evaluate ONLY the "User" speaker's performance. The "AI" speaker is the opponent — ignore their quality.

            SCORING CRITERIA (be HONEST and CRITICAL — do NOT inflate scores):

            1. **Speech Clarity** (0-100): How clearly did the user articulate their points? Were their sentences well-structured and easy to understand? Did they use proper grammar and vocabulary? Deduct points for rambling, incomplete sentences, or unclear phrasing.

            2. **Confidence** (0-100): Did the user sound confident and assertive? Did they make definitive claims or were they wishy-washy? Did they use hedge words excessively ("maybe", "I think", "kind of")? Did they hold their ground against the AI's counter-arguments?

            3. **Logical Reasoning** (0-100): Did the user provide logical, well-structured arguments? Did they use evidence, examples, or analogies effectively? Were there logical fallacies in their reasoning? Did they address the AI's counter-points or ignore them?

            4. **Relevance to Topic** (0-100): Did the user stay on topic throughout? Did their arguments directly relate to the motion being debated? Did they go off on tangents? 

            5. **Persuasiveness** (0-100): Overall, how persuasive was the user? Would an impartial judge be convinced by their arguments? Did they have strong opening and closing statements? Did they adapt their strategy during the debate?

            6. **Filler Words**: Carefully scan ONLY the User's lines in the transcript. Count EVERY occurrence of these filler words/phrases: "um", "uh", "like" (when used as filler, not comparison), "you know", "basically", "actually", "literally", "I mean", "sort of", "kind of", "right", "so yeah". Return the EXACT total count. If none are found, return 0.

            OVERALL SCORE CALCULATION:
            - The overallScore should be a WEIGHTED assessment: Reasoning (30%), Persuasiveness (25%), Clarity (20%), Confidence (15%), Relevance (10%).
            - CONTENT QUALITY IS KING: A user who speaks a lot but says nothing meaningful (rambling, repeating the same point, saying "blah blah" filler content) should score LOW. Only substantive, well-argued content gets high marks.
            - Conversely, a user who speaks briefly but makes sharp, powerful arguments can score HIGH. Length alone does NOT matter.
            - A score of 80+ = excellent debater who made compelling, well-reasoned arguments
            - A score of 60-79 = decent but with clear room for improvement
            - A score of 40-59 = needs significant work on argumentation
            - A score below 40 = struggled to make coherent arguments
            - If the user barely spoke or gave very short responses with no substance, score should be LOW (20-40)
            - If the user contradicted themselves, the score should reflect that negatively

            FEEDBACK RULES:
            - Strengths: cite SPECIFIC quotes from the user's actual speech that were effective
            - Weaknesses: cite SPECIFIC examples of where the user was weak, with quotes
            - Suggestions: give ACTIONABLE, specific tips (not generic advice)

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
                    "strengths": ["string", "string", "string"],
                    "weaknesses": ["string", "string", "string"],
                    "suggestions": ["string", "string", "string"]
                },
                "fillerWordsCount": number
            }
            `;

            // Use the api client to communicate with the backend
            console.log("Calling Groq API...");
            const res = await api.post('/groq/debate/evaluate', {
                message: prompt
            });
            console.log("Response received from Groq");

            const jsonStr = res.data.response;
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);

            setReport(data);

            // Save to MongoDB for Performance Analytics (non-blocking)
            try {
                let userInfoStr = localStorage.getItem('userInfo');
                
                // FALLBACK: If user is logged in via Firebase but has no backend token
                if (!userInfoStr && auth.currentUser) {
                    console.log("[DEBUG] No userInfo found, but user is logged into Firebase. Attempting silent auth sync...");
                    const user = auth.currentUser;
                    try {
                        const authSyncRes = await api.post('/auth/google', {
                            name: user.displayName || "Debater",
                            email: user.email,
                            googleId: user.uid,
                            picture: user.photoURL || ""
                        });
                        if (authSyncRes.data && authSyncRes.data.token) {
                            localStorage.setItem('userInfo', JSON.stringify(authSyncRes.data));
                            userInfoStr = JSON.stringify(authSyncRes.data);
                            console.log("[DEBUG] Silent auth sync successful.");
                        }
                    } catch (syncErr) {
                        console.error("[DEBUG] Failed silent auth sync:", syncErr);
                    }
                }

                console.log("[DEBUG] userInfo from localStorage:", userInfoStr ? "EXISTS" : "NULL");
                if (userInfoStr) {
                    const userInfoParsed = JSON.parse(userInfoStr);
                    const token = userInfoParsed.token;
                    console.log("[DEBUG] Token extracted:", token ? "YES (length: " + token.length + ")" : "NULL/UNDEFINED");
                    console.log("[DEBUG] Topic:", topic);
                    console.log("[DEBUG] overallScore:", data.overallScore, "type:", typeof data.overallScore);
                    if (token) {
                        const saveRes = await api.post('/soft-skills/debate', {
                            topic: topic,
                            overallScore: Number(data.overallScore)
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        console.log("[DEBUG] Save response:", saveRes.data);
                    } else {
                        console.error("[DEBUG] No token found in userInfo object. Keys:", Object.keys(userInfoParsed));
                    }
                } else {
                    console.error("[DEBUG] userInfo not found in localStorage and Firebase fallback failed.");
                }
            } catch (saveErr: any) {
                console.error("[DEBUG] Failed to save report to MongoDB:", saveErr?.response?.data || saveErr.message);
            }
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
                angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                pointLabels: {
                    color: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity for light mode
                    font: { size: 12, weight: 'bold' as const }
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
                    <Button variant="ghost" onClick={() => navigate('/dashboard/debate')} className="w-fit -ml-2 hover:bg-black/5 dark:hover:bg-white/5">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Debate Home
                    </Button>
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
                                    <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Overall Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-bold text-foreground tracking-tighter">{report.overallScore}</span>
                                    <span className="text-xl text-muted-foreground">/100</span>
                                </div>
                                <Progress value={report.overallScore} className="h-2 mt-6 bg-black/10 dark:bg-white/10" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
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
                        <Card className="h-full bg-card/50 backdrop-blur border-border hover:border-border/80 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Top Strength
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl font-medium leading-relaxed text-emerald-700 dark:text-emerald-100">
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
                        <Card className="h-full bg-card/50 backdrop-blur border-border p-6 flex flex-col items-center justify-center">
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
                                <CardTitle className="text-base text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> What you did well
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.feedback.strengths.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-emerald-800/90 dark:text-emerald-100/80">
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
                                <CardTitle className="text-base text-red-700 dark:text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Areas to improve
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.feedback.weaknesses.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-red-800/90 dark:text-red-100/80">
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
                                <CardTitle className="text-base text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Pro Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.feedback.suggestions.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-blue-800/90 dark:text-blue-100/80">
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
