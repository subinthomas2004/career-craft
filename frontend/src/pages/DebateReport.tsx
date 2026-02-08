import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Share2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Line, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
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
    const { transcript, topic, stance } = location.state || {}; // Expect transcript array

    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<DebateReportData | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!transcript || transcript.length === 0) {
            setError("No debate data found to analyze.");
            setLoading(false);
            return;
        }
        generateReport();
    }, [transcript]);

    const generateReport = async () => {
        try {
            // Filter user messages for analysis
            const userMessages = transcript
                .filter((t: any) => t.speaker === 'User')
                .map((t: any) => t.text)
                .join(' ');

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
            6. Filler words usage (estimate count)

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

            const response = await axios.post('http://localhost:5000/api/ollama/chat', {
                message: prompt,
                model: 'llama3.2:1b'
            });

            const jsonStr = response.data.response;
            // Clean markdown code blocks if present
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
                label: 'Your Performance',
                data: [
                    report.metrics.clarity,
                    report.metrics.confidence,
                    report.metrics.reasoning,
                    report.metrics.relevance,
                    report.metrics.persuasiveness,
                ],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
            },
        ],
    } : null;

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Generating Debate Analysis...</h2>
                <p className="text-muted-foreground">Evaluating your logic, confidence, and persuasion skills.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container p-8 flex flex-col items-center justify-center space-y-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => navigate('/dashboard/debate/topic')}>Try New Debate</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/dashboard/debate')} className="mb-2 -ml-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Debate Home
                    </Button>
                    <h1 className="text-3xl font-bold">Debate Performance Report</h1>
                    <p className="text-muted-foreground mt-1">Topic: <span className="font-semibold text-foreground">{topic}</span></p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                    <Button><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Overall Score */}
                <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-6xl font-bold text-primary">{report?.overallScore}</span>
                            <span className="text-xl text-muted-foreground mb-2">/100</span>
                        </div>
                        <Progress value={report?.overallScore} className="h-2 mt-4" />
                    </CardContent>
                </Card>

                {/* Filler Words */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Filler Words Detected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-bold text-orange-500">{report?.fillerWordsCount}</span>
                            <span className="text-sm text-muted-foreground mb-2">words</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            (um, uh, like, you know)
                        </p>
                    </CardContent>
                </Card>

                {/* Top Strength */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Key Strength</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-2 mt-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                            <p className="font-medium text-lg leading-tight">{report?.feedback.strengths[0] || "Good participation"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Radar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Analysis</CardTitle>
                        <CardDescription>Graphical breakdown of your debating skills.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center p-6">
                        <div className="w-full max-w-[400px] aspect-square">
                            {radarData && <Radar data={radarData} options={{ scales: { r: { suggestedMin: 0, suggestedMax: 100 } } }} />}
                        </div>
                    </CardContent>
                </Card>

                {/* Qualitative Feedback */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {report?.feedback.strengths.map((item, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-green-500">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-500">Areas for Improvement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {report?.feedback.weaknesses.map((item, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-red-500">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-500">Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {report?.feedback.suggestions.map((item, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-blue-500">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default DebateReport;
