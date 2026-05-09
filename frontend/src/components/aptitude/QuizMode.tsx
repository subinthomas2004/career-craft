import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Brain,
    Clock,
    ChevronRight,
    CheckCircle,
    XCircle,
    Trophy,
    Target,
    Loader2,
    AlertCircle,
    ArrowLeft, ArrowRight,
    ChevronLeft,
    Sparkles,
    BookOpen,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

import { aptitudeTopics, getQuestionsForTopic, getQuestionsForTopics, getAllAptitudeQuestions, Question } from "@/data/aptitudeQuestions";

interface QuizModeProps {
    onBack: () => void;
}

export const QuizMode = ({ onBack }: QuizModeProps) => {
    const [stage, setStage] = useState<"select" | "loading" | "quiz" | "result" | "exam-rules">("select");
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isExamMode, setIsExamMode] = useState(false);
    
    const [questionCount, setQuestionCount] = useState(10);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ questionId: number | string, selected: number | null, correct: number }[]>([]);
    const [score, setScore] = useState(0);
    const [quizStats, setQuizStats] = useState({ correct: 0, wrong: 0, unattempted: 0 });
    
    // Exam State
    const [timeLeft, setTimeLeft] = useState(0);
    const [terminationReason, setTerminationReason] = useState<string | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);

    // Timer Effect
    useEffect(() => {
        if (!isExamMode || stage !== "quiz" || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isExamMode, stage, timeLeft]);

    // Anti-Cheating Logic
    useEffect(() => {
        if (!isExamMode || stage !== "quiz") return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTerminationReason("Switching tabs or minimizing the window is prohibited.");
                setStage("result");
                document.exitFullscreen().catch(() => { });
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && stage === "quiz" && isExamMode) {
                setTerminationReason("Exiting fullscreen mode is prohibited during the exam.");
                setStage("result");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [isExamMode, stage]);



    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const toggleTopic = (id: string) => {
        if (selectedTopics.includes(id)) {
            setSelectedTopics(selectedTopics.filter(t => t !== id));
        } else {
            setSelectedTopics([...selectedTopics, id]);
        }
    };

    const handleFullExamSelect = () => {
        setIsExamMode(true);
        // If no topics selected, default to all
        if (selectedTopics.length === 0) {
            setSelectedTopics(aptitudeTopics.map(t => t.id));
        }
        setStage("exam-rules");
    };

    const generateQuiz = () => {
        setStage("loading");
        setTimeout(() => {
            let fetchedQuestions: Question[] = [];
            
            if (isExamMode) {
                // Use selected topics if available, otherwise fallback to all for the 40-q exam
                const sourceTopics = selectedTopics.length > 0 ? selectedTopics : aptitudeTopics.map(t => t.id);
                fetchedQuestions = getQuestionsForTopics(sourceTopics, 40);
                
                setTimeLeft(1500); // 25 mins
                document.documentElement.requestFullscreen().catch(() => {
                    toast.error("Fullscreen is required for exam mode");
                });
            } else {
                fetchedQuestions = getQuestionsForTopics(selectedTopics, questionCount);
            }

            if (fetchedQuestions.length > 0) {
                setQuestions(fetchedQuestions);
                setStage("quiz");
                setCurrentQuestion(0);
                setAnswers([]);
                setSelectedAnswer(null);
                setScore(0);
                setTerminationReason(null);
            } else {
                toast.error("No questions found for the selected topics.");
                setStage("select");
            }
        }, 600);
    };

    const jumpToQuestion = (index: number) => {
        // Save current answer
        saveCurrentAnswer();
        setCurrentQuestion(index);
        // Restore previous answer if any
        const existing = answers.find(a => a.questionId === index);
        setSelectedAnswer(existing ? existing.selected : null);
    };

    const saveCurrentAnswer = () => {
        if (selectedAnswer !== null) {
            setAnswers(prev => {
                const filtered = prev.filter(a => a.questionId !== currentQuestion);
                return [...filtered, {
                    questionId: currentQuestion,
                    selected: selectedAnswer,
                    correct: questions[currentQuestion].correct
                }];
            });
        }
    };

    const handlePrevious = () => {
        if (isNavigating || currentQuestion === 0) return;
        
        saveCurrentAnswer();

        setCurrentQuestion(currentQuestion - 1);
        const prevIdx = currentQuestion - 1;
        const existing = answers.find(a => a.questionId === prevIdx);
        setSelectedAnswer(existing ? existing.selected : null);

        setIsNavigating(true);
        setTimeout(() => setIsNavigating(false), 300);
    };

    const handleNext = () => {
        if (isNavigating) return;
        
        saveCurrentAnswer();

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            const nextIdx = currentQuestion + 1;
            const existing = answers.find(a => a.questionId === nextIdx);
            setSelectedAnswer(existing ? existing.selected : null);
        }

        setIsNavigating(true);
        setTimeout(() => setIsNavigating(false), 300);
    };

    const submitQuiz = async () => {
        setStage("result");
        if (isExamMode) {
            document.exitFullscreen().catch(() => { });
        }
        
        // Calculate final score
        let correct = 0;
        let wrong = 0;
        let finalAnswers = [...answers];
        
        // Ensure final answer is preserved
        if (selectedAnswer !== null) {
            const filtered = finalAnswers.filter(a => a.questionId !== currentQuestion);
            finalAnswers = [...filtered, {
                questionId: currentQuestion,
                selected: selectedAnswer,
                correct: questions[currentQuestion].correct
            }];
        }

        finalAnswers.forEach(ans => {
            if (ans.selected === ans.correct) {
                correct++;
            } else if (ans.selected !== null && ans.selected !== undefined) {
                wrong++;
            }
        });

        const unattempted = questions.length - correct - wrong;
        const penalty = isExamMode ? 1 : 0;
        const calculatedScore = correct - (wrong * penalty);

        setQuizStats({ correct, wrong, unattempted });
        setScore(calculatedScore);

        // Submit Score only if it's an exam
        if (isExamMode) {
            try {
                const userInfo = localStorage.getItem("userInfo");
                if (userInfo) {
                    await api.post("/scores", {
                        score: calculatedScore,
                        totalQuestions: questions.length,
                        timeTaken: 1500 - timeLeft,
                        quizType: 'aptitude',
                        isExamMode
                    });
                }
            } catch (err) {
                console.error("Failed to submit score", err);
            }
        }
    };

    const handleQuitRequest = () => {
        setShowQuitConfirm(true);
    };

    const confirmQuit = () => {
        setShowQuitConfirm(false);
        if (isExamMode && document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        setStage("select");
    };

    const restartQuiz = () => {
        setStage("select");
        setSelectedTopics([]);
        setQuestions([]);
        setAnswers([]);
        setScore(0);
        setIsExamMode(false);
    };

    if (stage === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Generating Your {isExamMode ? "Exam" : "Quiz"}</h2>
                <p className="text-muted-foreground mt-2">Preparing your challenge questions...</p>
            </div>
        );
    }

    if (stage === "exam-rules") {
        return (
            <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
                <div className="w-full max-w-2xl">
                    <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary text-gray-500" onClick={() => setStage("select")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    <Card className="border-gray-200 bg-white shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                                <Trophy className="w-8 h-8 text-primary" />
                                Aptitude Exam Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-500" /> Format
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• 40 Random Questions</li>
                                        <li>• All Aptitude Topics</li>
                                        <li>• 25 Minutes Time Limit</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Scoring
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• +1 for Correct Answer</li>
                                        <li>• <span className="text-red-500 font-bold">-1 for Wrong Answer</span></li>
                                        <li>• 0 for Unattempted</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Strict Exam Policy
                                </h4>
                                <ul className="text-sm text-red-600 space-y-2">
                                    <li>• Switching tabs, minimizing, or exiting Full Screen results in <strong>IMMEDIATE TERMINATION</strong>.</li>
                                </ul>
                            </div>

                            <Button onClick={generateQuiz} className="w-full bg-primary hover:bg-primary/90 text-lg py-6 shadow-lg">
                                I Agree & Start Exam <Sparkles className="w-5 h-5 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (stage === "select") {
        return (
            <div className="p-0 animate-in fade-in zoom-in duration-300">
                <div className="max-w-6xl mx-auto">
                    <Button variant="ghost" onClick={onBack} className="mb-6 gap-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back to Menu
                    </Button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Aptitude Exam Section</h1>
                        <p className="text-muted-foreground text-lg">
                            Take a full challenge or practice specific modules.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Topic Selection */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Select Topics</CardTitle>
                                    <CardDescription>Practice specific areas (Multiple allowed)</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setSelectedTopics(aptitudeTopics.map(t => t.id))} 
                                        className="text-primary h-8"
                                    >
                                        Select All
                                    </Button>
                                    {selectedTopics.length > 0 && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setSelectedTopics([])} 
                                            className="text-primary h-8"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
                                {aptitudeTopics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => toggleTopic(topic.id)}
                                        className={cn(
                                            "p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all duration-200",
                                            selectedTopics.includes(topic.id) 
                                                ? "border-primary bg-primary/10 shadow-sm" 
                                                : "bg-card hover:border-primary/50"
                                        )}
                                    >
                                        <span className="text-2xl">{topic.icon}</span>
                                        <span className="text-xs font-semibold">{topic.name}</span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Configuration */}
                        <div className="space-y-6">
                            <Card className="border-primary/30 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Full Challenge
                                    </CardTitle>
                                    <CardDescription>40 Questions • 25 Mins • strict</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {selectedTopics.length > 0 
                                            ? `Test your skills on ${selectedTopics.length} selected topics with AI monitoring.`
                                            : "Test your skills against the full question bank with AI monitoring."}
                                    </p>
                                    <Button className="w-full" onClick={handleFullExamSelect}>
                                        {selectedTopics.length > 0 ? "Start Topic Exam" : "Start Full Exam"}
                                    </Button>
                                    {selectedTopics.length > 0 && (
                                        <button 
                                            onClick={() => setSelectedTopics([])}
                                            className="w-full mt-3 text-xs text-primary hover:underline"
                                        >
                                            Reset to All Topics
                                        </button>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Practice Config</CardTitle>
                                    <CardDescription>Set your practice volume</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-3">Questions</label>
                                        <div className="flex gap-2">
                                            {[5, 10, 15].map((count) => (
                                                <button
                                                    key={count}
                                                    onClick={() => setQuestionCount(count)}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-lg border font-medium transition-all text-sm",
                                                        questionCount === count
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : "hover:bg-accent"
                                                    )}
                                                >
                                                    {count}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full" 
                                        disabled={selectedTopics.length === 0}
                                        onClick={() => {
                                            setIsExamMode(false);
                                            generateQuiz();
                                        }}
                                    >
                                        Start Practice
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === "quiz") {
        const q = questions[currentQuestion];

        return (
            <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center animate-in fade-in duration-500">
                <div className="w-full transition-all duration-300 max-w-[1400px] grid lg:grid-cols-[1fr_300px] gap-6">
                    
                    {/* Left Column: Question Area */}
                    <div className="space-y-6">
                        {/* Header Bar */}
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" size="sm" onClick={handleQuitRequest} className="text-gray-500 hover:text-red-500">
                                <XCircle className="w-5 h-5 mr-2" /> Quit
                            </Button>
                            
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono font-bold",
                                isExamMode ? (timeLeft < 60 ? "bg-red-100 border-red-200 text-red-600 animate-pulse" : "bg-primary/10 border-primary/20 text-primary") : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                                <Clock className="w-4 h-4" />
                                {isExamMode ? `Time Left: ${formatTime(timeLeft)}` : "Practice Mode"}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500 px-1">
                                <span>Question {currentQuestion + 1} of {questions.length}</span>
                                <span>{answers.length} / {questions.length} Questions Attended</span>
                            </div>
                        </div>

                        <Card className="border-gray-200 bg-white shadow-xl overflow-hidden h-fit">
                            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex justify-between items-start gap-4">
                                    <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-gray-900">{q.question}</h2>
                                    <span className="flex-shrink-0 px-3 py-1 bg-gray-200 rounded text-xs font-bold text-gray-600">
                                        Q{currentQuestion + 1}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-6 sm:p-8 space-y-3">
                                {q.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedAnswer(idx)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                                            selectedAnswer === idx
                                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                : "border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/50 text-gray-700"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors",
                                                selectedAnswer === idx
                                                    ? "bg-primary border-primary text-white"
                                                    : "bg-gray-100 border-gray-200 text-gray-500 group-hover:border-primary/50 group-hover:text-primary"
                                            )}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="font-medium">{option}</span>
                                        </div>
                                        {selectedAnswer === idx && <CheckCircle className="w-5 h-5 text-primary" />}
                                    </button>
                                ))}
                            </CardContent>

                            <CardFooter className="p-6 sm:p-8 pt-0 flex justify-between gap-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    size="lg"
                                    disabled={isNavigating || currentQuestion === 0}
                                    className="px-8 font-bold gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    size="lg"
                                    disabled={isNavigating || currentQuestion === questions.length - 1}
                                    className={cn("px-8 font-bold gap-2", currentQuestion === questions.length - 1 && "hidden")}
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Exam Palette */}
                    <div className="space-y-4">
                        <Card className="border-gray-200 bg-white shadow-xl h-fit sticky top-6">
                                <CardHeader className="pb-3 border-b border-gray-100">
                                    <CardTitle className="text-lg">Question Palette</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-5 gap-2">
                                        {questions.map((_, idx) => {
                                            const ansState = answers.find(a => a.questionId === idx);
                                            const isCurr = currentQuestion === idx;
                                            
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => jumpToQuestion(idx)}
                                                    className={cn(
                                                        "h-10 rounded-lg text-sm font-bold transition-all border-2",
                                                        isCurr 
                                                            ? "border-primary bg-primary text-white shadow-lg scale-110" 
                                                            : ansState 
                                                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                                                : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                                                    )}
                                                >
                                                    {idx + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-8 space-y-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded bg-emerald-500" /> 
                                            <span>Answered</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded bg-muted border-border" /> 
                                            <span>Not Attended</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded bg-primary" /> 
                                            <span>Current</span>
                                        </div>
                                    </div>
                                    <Button onClick={submitQuiz} variant="secondary" className="w-full mt-10 bg-gray-900 text-white hover:bg-gray-800">
                                        {isExamMode ? "Submit Final Exam" : "Submit Quiz"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                </div>
            </div>
        );
    }

    if (stage === "result") {
        const percentage = Math.max(0, Math.round((score / questions.length) * 100));
        
        if (isExamMode && terminationReason) {
            return (
                <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-8 shadow-inner">
                        <XCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-600 mb-4">Exam Terminated</h2>
                    <p className="text-lg text-muted-foreground mb-8 text-balance">
                        {terminationReason}
                    </p>
                    <Button size="lg" className="w-full bg-gray-900" onClick={restartQuiz}>
                        Return to Menu
                    </Button>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto text-center animate-in fade-in duration-700">
                <div className="mb-10 relative inline-block">
                    <div className="h-48 w-48 rounded-full border-8 border-muted flex items-center justify-center relative overflow-hidden shadow-2xl">
                        <div
                            className="absolute inset-0 bg-primary opacity-20"
                            style={{ top: `${100 - percentage}%` }}
                        />
                        <span className="text-5xl font-black relative z-10">{percentage}%</span>
                    </div>
                    {percentage >= 70 && <Trophy className="absolute -top-6 -right-6 h-16 w-16 text-yellow-500 animate-bounce drop-shadow-lg" />}
                </div>

                <h2 className="text-5xl font-black mb-4 tracking-tight">
                    {isExamMode ? "Exam Concluded" : "Quiz Mastered!"}
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                    Final Score: <span className={cn("font-black text-2xl", score < 0 ? "text-red-500" : "text-foreground")}>{score}</span> / {questions.length}
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-8 border-none shadow-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <div className="text-4xl font-black text-emerald-600 mb-2">{quizStats.correct}</div>
                        <div className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest text-sm">Correct Hits</div>
                    </Card>
                    <Card className="p-8 border-none shadow-lg bg-red-50 dark:bg-red-950/20">
                        <div className="text-4xl font-black text-red-600 mb-2">{quizStats.wrong}</div>
                        <div className="font-bold text-red-800 dark:text-red-400 uppercase tracking-widest text-sm">Wrong</div>
                    </Card>
                    <Card className="p-8 border-none shadow-lg bg-gray-50 dark:bg-gray-900/20">
                        <div className="text-4xl font-black text-gray-600 mb-2">{quizStats.unattempted}</div>
                        <div className="font-bold text-gray-800 dark:text-gray-400 uppercase tracking-widest text-sm">Skipped</div>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-12">
                    <Button variant="outline" size="lg" className="flex-1 text-lg py-8 shadow-sm" onClick={restartQuiz}>
                        Explore New Topics
                    </Button>
                    <Button size="lg" className="flex-1 text-lg py-8 shadow-xl" onClick={() => {
                        setIsExamMode(isExamMode);
                        generateQuiz();
                    }}>
                        Restart Session
                    </Button>
                </div>

                {/* Review Section */}
                <Card className="bg-white border-gray-200 shadow-lg text-left mt-8">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            Review Answers
                        </CardTitle>
                        <CardDescription>Detailed explanation for each question</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y divide-gray-100">
                        {questions.map((q, idx) => {
                            const userAnswer = answers.find(a => a.questionId === idx);
                            const isCorrect = userAnswer?.selected === q.correct;
                            const isSkipped = !userAnswer;

                            return (
                                <div key={idx} className="py-6 first:pt-4 last:pb-2">
                                    <div className="flex gap-3 mb-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <h3 className="font-semibold text-gray-900">{q.question}</h3>
                                    </div>

                                    <div className="pl-9 space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div className={cn(
                                                "p-3 rounded-lg border",
                                                isSkipped ? "bg-gray-50 border-gray-200 text-gray-500" :
                                                    isCorrect
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                                        : "bg-red-50 border-red-200 text-red-800"
                                            )}>
                                                <span className="block text-xs font-bold opacity-70 mb-1">Your Answer</span>
                                                {isSkipped ? "Not Attempted" : q.options[userAnswer.selected || 0]}
                                            </div>
                                            <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800">
                                                <span className="block text-xs font-bold opacity-70 mb-1">Correct Answer</span>
                                                {q.options[q.correct]}
                                            </div>
                                        </div>

                                        {q.explanation && (
                                            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3">
                                                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                                                <div>
                                                    <span className="font-bold block text-xs uppercase tracking-wider text-blue-600 mb-1">Explanation</span>
                                                    {q.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            {/* Quit Confirmation Dialog */}
            <Dialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Quit Session?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to quit this {isExamMode ? "aptitude exam" : "practice session"}? 
                            {isExamMode ? " Your progress will be lost and this will count as an incomplete attempt." : " Your current progress will not be saved."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-end gap-2">
                        <Button variant="ghost" onClick={() => setShowQuitConfirm(false)}>
                            Stay
                        </Button>
                        <Button onClick={confirmQuit} className="bg-red-600 text-white hover:bg-red-700">
                            Quit Anyway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
