import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BookOpen, Sparkles, ArrowLeft, Loader2, RotateCcw, Target, Hash } from "lucide-react";
import AudioRecorder from "@/components/communication/AudioRecorder";
import AnalysisResult from "@/components/communication/AnalysisResult";
import PracticeTextSelector from "@/components/communication/PracticeTextSelector";
import VocabularyBuilder from "@/components/communication/VocabularyBuilder";
import TimerDisplay from "@/components/communication/TimerDisplay";
import SessionHistory from "@/components/communication/SessionHistory";
import { PracticeText } from '@/data/practiceTexts';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { api } from '@/lib/api';
import { auth } from '@/firebase';
import { cn } from "@/lib/utils";

const CommunicationCoach = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"read" | "impromptu" | "vocabulary" | "history">("read");
    const [transcript, setTranscript] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    // Read Along State
    const [selectedText, setSelectedText] = useState<PracticeText | null>(null);

    // Impromptu State
    const [topic, setTopic] = useState<string | null>(null);
    const [timerActive, setTimerActive] = useState(false);
    const [timerDuration, setTimerDuration] = useState(60);
    const [forceStopRecord, setForceStopRecord] = useState(false);

    // Final calculated WPM
    const [wpm, setWpm] = useState<number | undefined>(undefined);

    const topics = [
        "Tell me about a time you failed.",
        "Describe your dream job.",
        "What is your biggest weakness?",
        "Explain a complex technical concept to a 5-year-old.",
        "Where do you see yourself in 5 years?",
        "What motivates you?",
        "Describe a conflict you resolved in a team.",
        "Why should we hire you?",
        "What is your greatest professional achievement?",
        "Tell me about a time you showed leadership."
    ];

    const generateTopic = () => {
        const random = topics[Math.floor(Math.random() * topics.length)];
        setTopic(random);
        reset();
    };

    const handleRecordingStart = () => {
        if (mode === 'impromptu') {
            setTimerActive(true);
            setForceStopRecord(false);
        }
    };

    const handleTimerEnd = () => {
        setTimerActive(false);
        setForceStopRecord(true);
        toast("Time's up! Generating analysis...", { icon: "⏱️" });
        // Give a little time for the transcript to finalize before analyzing
        setTimeout(() => {
            if (transcript.length > 20) {
                // handleAnalyze(); // Triggered manually by user for now to ensure they are ready
            }
        }, 1500);
    };

    const handleRecordingComplete = (calculatedWpm: number, duration: number) => {
        setWpm(calculatedWpm);
        setTimerActive(false);
    };

    const handleAnalyze = async () => {
        if (!transcript || transcript.length < 10) {
            toast.error("Please record at least a full sentence before analyzing.");
            return;
        }

        setIsAnalyzing(true);
        try {
            // Include reference text if in read mode
            const referenceText = mode === 'read' && selectedText ? selectedText.content : undefined;

            const response = await api.post('/groq/speech-analysis', {
                transcript,
                referenceText,
                wpm
            });

            const data = response.data;
            if (data.success) {
                setAnalysis(data.analysis);
                toast.success("Analysis complete!");

                // Save to MongoDB
                if (auth.currentUser) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        try {
                            await api.post('/soft-skills/communication', {
                                mode: mode,
                                score: data.analysis.score || 0,
                                wpm: wpm || 0,
                                grammarErrorCount: data.analysis.grammarCorrections?.length || 0,
                                fillerWordCount: Object.values(data.analysis.fillerWordCount || {}).reduce((a: any, b: any) => a + b, 0)
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                        } catch (apiError) {
                            console.error("Failed to save to history:", apiError);
                            // Don't interrupt user flow for history failure
                        }
                    }
                }
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
        setWpm(undefined);
        setTimerActive(false);
        setForceStopRecord(false);
    };

    const handleModeChange = (v: any) => {
        setMode(v);
        reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900 mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Communication Coach</h1>
                        <p className="text-gray-500">Refine your speech, grammar, and delivery confidence.</p>
                    </div>
                </div>

                {!analysis ? (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Left: Configuration & Prompts */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                            <Card className="border-gray-200 bg-white shadow-sm overflow-hidden border-2">
                                <Tabs value={mode} className="w-full" onValueChange={handleModeChange}>
                                    <TabsList className="grid w-full grid-cols-4 rounded-none h-14 bg-gray-50/50 border-b">
                                        <TabsTrigger value="read" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Read</TabsTrigger>
                                        <TabsTrigger value="impromptu" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Topic</TabsTrigger>
                                        <TabsTrigger value="vocabulary" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Vocab</TabsTrigger>
                                        <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Stats</TabsTrigger>
                                    </TabsList>

                                    <div className="p-4 sm:p-6 min-h-[400px]">
                                        <TabsContent value="read" className="mt-0 space-y-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                                                    <BookOpen className="w-5 h-5" />
                                                    <h3 className="font-semibold">Read Along Practice</h3>
                                                </div>
                                                <p className="text-sm text-gray-500">Practice your pronunciation and pacing by reading selected texts.</p>

                                                <PracticeTextSelector
                                                    selectedText={selectedText}
                                                    onSelectText={setSelectedText}
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="impromptu" className="mt-0 space-y-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2 text-purple-700">
                                                    <Sparkles className="w-5 h-5" />
                                                    <h3 className="font-semibold">Impromptu Practice</h3>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-4">Test your ability to think on your feet with timed random topics.</p>

                                                {!topic ? (
                                                    <div className="text-center py-8 space-y-4 bg-purple-50 rounded-xl border border-purple-100">
                                                        <Button onClick={generateTopic} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                                                            Generate Random Topic
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6 animate-in fade-in duration-300">
                                                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 text-center space-y-3 shadow-inner">
                                                            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Your Topic</span>
                                                            <h2 className="text-xl font-bold text-gray-900 leading-tight">"{topic}"</h2>
                                                        </div>

                                                        {/* Timer Controls */}
                                                        <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-gray-700">Timer</span>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant={timerDuration === 60 ? 'default' : 'outline'}
                                                                        size="sm"
                                                                        onClick={() => setTimerDuration(60)}
                                                                        disabled={timerActive}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        60s
                                                                    </Button>
                                                                    <Button
                                                                        variant={timerDuration === 120 ? 'default' : 'outline'}
                                                                        size="sm"
                                                                        onClick={() => setTimerDuration(120)}
                                                                        disabled={timerActive}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        120s
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-center py-2">
                                                                <TimerDisplay
                                                                    duration={timerDuration}
                                                                    isActive={timerActive}
                                                                    onTimeUp={handleTimerEnd}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" onClick={generateTopic} disabled={timerActive} className="flex-1">
                                                                New Topic
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="vocabulary" className="mt-0">
                                            <VocabularyBuilder />
                                        </TabsContent>

                                        <TabsContent value="history" className="mt-0 space-y-4">
                                            <div className="flex items-center gap-2 mb-4 text-emerald-700">
                                                <Target className="w-5 h-5" />
                                                <h3 className="font-semibold">Your Progress</h3>
                                            </div>
                                            <SessionHistory />
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </Card>
                        </div>

                        {/* Right: Recorder */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            <Card className={cn(
                                "border-gray-200 bg-white shadow-lg min-h-[500px] flex flex-col transition-all duration-300",
                                (mode === 'vocabulary' || mode === 'history') ? 'opacity-50 pointer-events-none' : 'opacity-100'
                            )}>
                                <CardHeader className="border-b bg-gray-50/50">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <Mic className="w-5 h-5 text-red-500" /> Voice Recording
                                        </CardTitle>
                                        {transcript.length > 0 && (
                                            <Button onClick={handleAnalyze} disabled={isAnalyzing || timerActive} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                Generate AI Report
                                            </Button>
                                        )}
                                    </div>
                                    <CardDescription>
                                        {mode === 'read' ? "Click the microphone and read the text aloud." : "Click the microphone to start your impromptu speech timer."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-center p-6 bg-white">
                                    <AudioRecorder
                                        onTranscriptChange={setTranscript}
                                        isProcessing={isAnalyzing}
                                        onRecordingStart={handleRecordingStart}
                                        onRecordingComplete={handleRecordingComplete}
                                        forceStop={forceStopRecord}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">AI Analysis Report</h3>
                                    <p className="text-sm text-gray-500 capitalize">{mode} Mode Session</p>
                                </div>
                            </div>
                            <Button variant="outline" onClick={reset} className="gap-2 font-medium">
                                <RotateCcw className="w-4 h-4" /> Start New Session
                            </Button>
                        </div>

                        <AnalysisResult
                            analysis={analysis}
                            referenceText={mode === 'read' && selectedText ? selectedText.content : undefined}
                            transcript={transcript}
                            wpm={wpm}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunicationCoach;
