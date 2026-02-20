import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Video,
    Mic,
    ArrowRight,
    Lightbulb,
    FileText,
    CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import InterviewTimer from "@/components/interview/InterviewTimer";
import HrOnlyView from "@/components/interview/HrOnlyView";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { Difficulty } from "@/lib/interview/types";

const IntroPrep = () => {
    const [stage, setStage] = useState<"setup" | "instructions" | "interview" | "feedback">("setup");
    const [resumeText, setResumeText] = useState<string>("");
    const [parsedResumeData, setParsedResumeData] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);

    // Hardcoded config for Intro Prep
    const {
        sessionState,
        avatarState,
        currentTranscript,
        startSession,
        submitResponse,
        isListening,
        startListening,
        stopListening,
        endSession,
        ready
    } = useInterviewSession({
        domain: "",
        includeHr: false, // We handle this manually in engine for intro-prep
        interviewType: 'intro-prep',
        difficulty: 'beginner' as Difficulty,
        resumeText: resumeText
    });

    // Local Video Assets (Sarah Only)
    const hrVideos = useMemo(() => ({
        idle: "/avatars/hr/hr_listening.mp4",
        talking: "/avatars/hr/hr_talking.mp4",
        listening: "/avatars/hr/hr_listening.mp4",
        nodding: "/avatars/hr/hr_nodding.mp4"
    }), []);

    const handleStartSetup = () => {
        if (resumeText) {
            setStage("instructions");
        } else {
            toast.error("Please upload your resume to continue.");
        }
    };

    const handleStartInterview = () => {
        setStage("interview");
        startSession();
        toast.success("Session started! Listen to Sarah.");
    };

    const handleEndInterview = useCallback(async () => {
        endSession();
        setIsMicOn(false);
        setIsVideoOn(false);
        setStage("feedback");

        // Record Activity
        try {
            if (sessionState && sessionState.history.length > 0) {
                const avgScore = Math.round(sessionState.history.reduce((a, b) => a + b.score, 0) / sessionState.history.length);

                const userInfo = localStorage.getItem("userInfo");
                if (userInfo) {
                    const { token } = JSON.parse(userInfo);
                    await fetch('http://localhost:5003/api/auth/activity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            title: `Intro Prep Session`,
                            activityType: 'interview', // Reusing interview type for now
                            score: `${avgScore}%`
                        })
                    });
                }
            }
        } catch (err) {
            console.error("Failed to record activity", err);
        }
    }, [endSession, sessionState]);

    const handleManualSubmit = () => {
        setIsMicOn(false);
        submitResponse();
    };

    // Track previous avatar state to detect "Finish Talking" event
    const prevAvatarState = useRef(avatarState);

    useEffect(() => {
        if (stage === 'interview') {
            // Logic: 
            // 1. If Avatar is talking -> Force Mic OFF and Stop Listening
            if (avatarState === 'talking') {
                if (isMicOn) setIsMicOn(false);
                if (isListening) stopListening();
            }

            // 2. AUTO-MIC: Detect transition directly from 'talking' to 'idle'
            if (prevAvatarState.current === 'talking' && avatarState === 'idle') {
                console.log("Avatar finished talking -> Auto-starting Mic");
                setIsMicOn(true);
            }

            // Update ref
            prevAvatarState.current = avatarState;

            // 3. If Avatar is IDLE (or listening), respect the Manual Toggle
            if (avatarState !== 'talking') {
                if (isMicOn) {
                    if (!isListening) startListening();
                } else {
                    stopListening();
                }
            }
        }
    }, [isMicOn, stage, startListening, stopListening, isListening, avatarState]);

    useEffect(() => {
        if (stage === 'interview' && sessionState?.isOver) {
            handleEndInterview();
            toast.success("Session completed!");
        }
    }, [sessionState?.isOver, stage, handleEndInterview]);

    const calculateScores = () => {
        if (!sessionState?.history.length) return { overall: 0, clarity: 0, confidence: 0, content: 0 };
        const avgScore = Math.round(sessionState.history.reduce((a, b) => a + b.score, 0) / sessionState.history.length);
        return {
            overall: avgScore,
            clarity: Math.min(100, avgScore + 10),
            confidence: Math.min(100, avgScore + 5),
            content: avgScore
        };
    };

    const scores = calculateScores();

    if (stage === "setup") {
        return (
            <div className="p-6 lg:p-8 min-h-screen bg-background">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Introduction Preparation
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Master your self-introduction with Sarah, your AI Coach. Upload your resume, and she will help you listen, analyze, and refine your pitch.
                        </p>
                    </div>

                    <Card className="mb-8 border-2 border-primary/10 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Upload Resume
                            </CardTitle>
                            <CardDescription>
                                We need your resume to provide personalized feedback on your introduction.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <div className="text-center w-full max-w-md">
                                        {resumeText ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                                </div>
                                                <p className="font-semibold text-lg text-foreground">Resume Uploaded Successfully</p>
                                                <p className="text-sm text-muted-foreground">{parsedResumeData?.full_name || "Candidate"}'s Resume</p>
                                                <Button variant="outline" size="sm" onClick={() => { setResumeText(""); setParsedResumeData(null); }} className="mt-2">
                                                    Upload Different File
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <FileText className="w-8 h-8 text-primary" />}
                                                </div>
                                                <p className="text-foreground font-medium mb-2">Drag and drop or click to upload</p>
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    id="resume-upload"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setIsUploading(true);
                                                        const formData = new FormData();
                                                        formData.append("resume", file);

                                                        try {
                                                            const { data } = await axios.post("http://localhost:5003/api/upload/resume", formData);
                                                            if (data.success) {
                                                                setResumeText(data.text);
                                                                setParsedResumeData(data.data);
                                                                toast.success("Resume parsed successfully!");
                                                            }
                                                        } catch (error: any) {
                                                            toast.error("Failed to upload resume.");
                                                        } finally {
                                                            setIsUploading(false);
                                                        }
                                                    }}
                                                    disabled={isUploading}
                                                />
                                                <Button variant="secondary" onClick={() => document.getElementById('resume-upload')?.click()} disabled={isUploading}>
                                                    Select PDF File
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full text-lg h-12"
                                    disabled={!resumeText}
                                    onClick={handleStartSetup}
                                >
                                    Start Preparation <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (stage === "instructions") {
        return (
            <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center bg-background">
                <Card className="max-w-2xl w-full shadow-xl border-2 border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-2xl">Session Instructions</CardTitle>
                        <CardDescription>Get ready to introduce yourself.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Video className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Meet Sarah</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sarah is your AI Coach. She will ask you to introduce yourself.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Mic className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Speak Clearly</h3>
                                <p className="text-sm text-muted-foreground">
                                    You'll have about 60-90 seconds. Try to cover your role, experience, and key skills.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-md border border-border/50">
                            <Button
                                size="sm"
                                variant={isListening ? "destructive" : "outline"}
                                onClick={isListening ? stopListening : startListening}
                            >
                                {isListening ? "Stop Test" : "Test Mic"}
                            </Button>
                            <p className="text-sm italic text-foreground/80 flex-1 truncate">
                                {isListening ? (currentTranscript || "Listening...") : "Click to test microphone"}
                            </p>
                        </div>

                        <Button size="lg" className="w-full text-lg" onClick={handleStartInterview} disabled={!ready}>
                            {ready ? "I'm Ready" : "Loading Sarah..."}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (stage === "interview" && sessionState) {
        return (
            <div className="h-screen flex flex-col bg-foreground/5">
                <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-medium text-foreground">Live Coaching Session</span>
                    </div>
                    <InterviewTimer isRunning={true} />
                </div>

                <div className="flex-1 p-4 lg:p-6 overflow-hidden">
                    <HrOnlyView
                        sessionState={sessionState}
                        avatarState={avatarState}
                        hrVideos={hrVideos}
                        isMicOn={isMicOn}
                        setIsMicOn={setIsMicOn}
                        isVideoOn={isVideoOn}
                        setIsVideoOn={setIsVideoOn}
                        isListening={isListening}
                        currentTranscript={currentTranscript}
                        onManualSubmit={handleManualSubmit}
                        onEndInterview={handleEndInterview}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Session Completed!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's how you performed.
                    </p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Overall", score: scores.overall, color: "text-primary" },
                        { label: "Clarity", score: scores.clarity, color: "text-blue-500" },
                        { label: "Structure", score: scores.confidence, color: "text-green-500" }, // Reusing confidence for Structure roughly
                        { label: "Relevance", score: scores.content, color: "text-purple-500" },
                    ].map((item, index) => (
                        <Card key={index}>
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold mb-1">{item.score}</div>
                                <div className={cn("text-sm font-medium", item.color)}>{item.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Feedback */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Feedback Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {sessionState?.history.map((h, i) => (
                            <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-semibold text-foreground/90">{h.question.text}</p>
                                </div>
                                <div className="ml-4 space-y-3">
                                    <div className="bg-background p-3 rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground uppercase mb-1 font-bold">You Said</p>
                                        <p className="text-sm text-foreground/80">{h.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-center">
                    <Button onClick={() => setStage("setup")} className="w-full max-w-sm">
                        Practice Again
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default IntroPrep;
