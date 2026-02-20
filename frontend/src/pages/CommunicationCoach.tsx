import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BookOpen, Sparkles, ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import AudioRecorder from "@/components/communication/AudioRecorder";
import AnalysisResult from "@/components/communication/AnalysisResult";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { api } from '@/lib/api';

const CommunicationCoach = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"read">("read");
    const [transcript, setTranscript] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [topic, setTopic] = useState<string | null>(null);

    const topics = [
        "Tell me about a time you failed.",
        "Describe your dream job.",
        "What is your biggest weakness?",
        "Explain a complex technical concept to a 5-year-old.",
        "Where do you see yourself in 5 years?",
        "What motivates you?",
        "Describe a conflict you resolved in a team.",
    ];

    const generateTopic = () => {
        const random = topics[Math.floor(Math.random() * topics.length)];
        setTopic(random);
        reset();
    };

    const handleAnalyze = async () => {
        if (!transcript || transcript.length < 10) {
            toast.error("Please record at least a sentence before analyzing.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await api.post('/groq/speech-analysis', { transcript });

            const data = response.data;
            if (data.success) {
                setAnalysis(data.analysis);
                toast.success("Analysis complete!");
            } else {
                toast.error("Analysis failed. Please try again.");
            }
        } catch (error) {
            console.error("Analysis error:", error);
            toast.error("Failed to connect to server.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setAnalysis(null);
        setTranscript("");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900 mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Communication Coach</h1>
                        <p className="text-gray-500">Refine your speech, grammar, and delivery confidence.</p>
                    </div>
                </div>

                {!analysis ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Configuration & Prompts */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-gray-200 bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Select Mode</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="read" className="w-full" onValueChange={(v) => { setMode(v as any); reset(); }}>
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="read">Read Along</TabsTrigger>
                                            <TabsTrigger value="impromptu">Impromptu</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="read" className="mt-4 space-y-4">
                                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" /> Practice Text
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed italic">
                                                    "I am passionate about software engineering because it allows me to solve real-world problems.
                                                    During my internship, I worked on a team that built a scalable e-commerce platform using React and Node.js.
                                                    This experience taught me the importance of clean code and collaboration."
                                                </p>
                                            </div>
                                            <p className="text-xs text-center text-gray-500">Read the text above clearly.</p>
                                        </TabsContent>
                                        <TabsContent value="impromptu" className="mt-4 space-y-4">
                                            <div className="p-6 bg-purple-50 rounded-lg border border-purple-100 text-center">
                                                {!topic ? (
                                                    <div className="space-y-4">
                                                        <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
                                                        <h3 className="text-lg font-semibold text-purple-900">Impromptu Speaking Mode</h3>
                                                        <p className="text-sm text-purple-700 max-w-sm mx-auto">
                                                            Test your ability to think on your feet! You'll get a random topic and 60 seconds to prepare.
                                                        </p>
                                                        <Button onClick={generateTopic} className="bg-purple-600 hover:bg-purple-700">
                                                            Generate Topic
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                                        <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Your Topic</span>
                                                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">"{topic}"</h2>
                                                        <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Thinking time... Speak when you are ready!
                                                        </div>
                                                        <Button variant="outline" size="sm" onClick={generateTopic}>
                                                            New Topic
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-gray-500">Speak naturally and confidently.</p>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right: Recorder */}
                        <div className="lg:col-span-2">
                            <Card className="border-gray-200 bg-white shadow-lg min-h-[500px] flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Mic className="w-5 h-5 text-red-500" /> voice Recorder
                                        </CardTitle>
                                        {transcript.length > 0 && (
                                            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
                                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                Analyze Speech
                                            </Button>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Click the microphone to start recording. Speak for at least 30 seconds for best results.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-center">
                                    <AudioRecorder
                                        onTranscriptChange={setTranscript}
                                        isProcessing={isAnalyzing}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Button variant="outline" onClick={reset} className="mb-4">
                            <RotateCcw className="w-4 h-4 mr-2" /> Start New Session
                        </Button>
                        <AnalysisResult analysis={analysis} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunicationCoach;
