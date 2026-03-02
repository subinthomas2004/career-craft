import { useState } from "react";
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
    ArrowLeft,
    ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { aptitudeTopics, getQuestionsForTopic, Question } from "@/data/aptitudeQuestions";

interface QuizModeProps {
    onBack: () => void;
}

export const QuizMode = ({ onBack }: QuizModeProps) => {
    const [stage, setStage] = useState<"select" | "loading" | "quiz" | "result">("select");
    const [selectedTopic, setSelectedTopic] = useState<{ id: string, name: string } | null>(null);

    const [questionCount, setQuestionCount] = useState(5);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const generateQuiz = () => {
        if (!selectedTopic) return;

        setStage("loading");

        // Simulate a brief loading for UX (optional, can be removed for instant load)
        setTimeout(() => {
            const fetchedQuestions = getQuestionsForTopic(selectedTopic.id, questionCount, "medium");

            if (fetchedQuestions.length > 0) {
                setQuestions(fetchedQuestions);
                setStage("quiz");
                setCurrentQuestion(0);
                setAnswers([]);
                setSelectedAnswer(null);
                setScore(0);
            } else {
                toast.error(`No questions found for ${selectedTopic.name} yet. Check the data file!`);
                setStage("select");
            }
        }, 600);
    };

    const handleAnswer = (index: number) => {
        setSelectedAnswer(index);
    };

    const submitAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === questions[currentQuestion].correct;
        if (isCorrect) setScore(score + 1);

        setAnswers([...answers, selectedAnswer]);
        setShowResult(true);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setStage("result");
        }
    };

    const restartQuiz = () => {
        setStage("select");
        setSelectedTopic(null);
        setQuestions([]);
        setAnswers([]);
        setScore(0);
    };

    if (stage === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Generating Your Quiz</h2>
                <p className="text-muted-foreground mt-2">Consulting AI for challenging questions...</p>
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Aptitude Quiz</h1>
                        <p className="text-muted-foreground text-lg">
                            Challenge yourself with dynamically generated questions across various categories.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Topic Selection */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Select Topic</CardTitle>
                                <CardDescription>Choose an area to practice</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                                {aptitudeTopics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSelectedTopic({ id: topic.id, name: topic.name })}
                                        className={cn(
                                            "p-4 rounded-xl border flex flex-col items-center text-center gap-2 hover:border-primary transition-all",
                                            selectedTopic?.id === topic.id ? "border-primary bg-primary/10" : "bg-card"
                                        )}
                                    >
                                        <span className="text-3xl">{topic.icon}</span>
                                        <span className="font-medium">{topic.name}</span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Configuration */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>Customize your quiz experience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">


                                {/* Question Count */}
                                <div>
                                    <label className="block text-sm font-medium mb-3">Number of Questions</label>
                                    <div className="flex gap-3">
                                        {[5, 10, 15].map((count) => (
                                            <button
                                                key={count}
                                                onClick={() => setQuestionCount(count)}
                                                className={cn(
                                                    "flex-1 py-3 px-4 rounded-lg border font-medium transition-all",
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

                                {selectedTopic && (
                                    <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
                                        <h3 className="font-medium mb-1">Summary</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Topic: <span className="text-foreground font-medium">{selectedTopic.name}</span>
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Questions: <span className="text-foreground font-medium">{questionCount}</span>
                                        </p>
                                    </div>
                                )}

                            </CardContent>
                            <CardFooter>
                                <Button
                                    size="lg"
                                    className="w-full"
                                    disabled={!selectedTopic}
                                    onClick={generateQuiz}
                                >
                                    <Brain className="mr-2 h-5 w-5" />
                                    Start Quiz
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === "quiz") {
        const q = questions[currentQuestion];
        return (
            <div className="max-w-3xl mx-auto p-0 min-h-[80vh] animate-in fade-in slide-in-from-bottom-5 duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold">{selectedTopic?.name} Quiz</h2>

                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold font-mono">{currentQuestion + 1}<span className="text-muted-foreground text-lg">/{questions.length}</span></span>
                    </div>
                </div>

                <Progress value={((currentQuestion) / questions.length) * 100} className="h-2 mb-10" />

                {/* Question */}
                <div className="mb-8">
                    <h3 className="text-2xl font-medium leading-relaxed">{q.question}</h3>
                </div>

                {/* Options */}
                <div className="grid gap-4 mb-8">
                    {q.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => !showResult && handleAnswer(idx)}
                            disabled={showResult}
                            className={cn(
                                "text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between",
                                showResult
                                    ? idx === q.correct
                                        ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300"
                                        : idx === selectedAnswer
                                            ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300"
                                            : "border-border/50 opacity-60"
                                    : selectedAnswer === idx
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                            )}
                        >
                            <span className="font-medium">{option}</span>
                            {showResult && idx === q.correct && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {showResult && idx === selectedAnswer && idx !== q.correct && <XCircle className="h-5 w-5 text-red-600" />}
                        </button>
                    ))}
                </div>

                {/* Explanation */}
                {showResult && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-8 flex gap-3 animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Explanation</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200 text-opacity-90 leading-relaxed">
                                {q.explanation}
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end">
                    {!showResult ? (
                        <Button size="lg" onClick={submitAnswer} disabled={selectedAnswer === null}>
                            Submit Answer
                        </Button>
                    ) : (
                        <Button size="lg" onClick={nextQuestion}>
                            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

            </div>
        );
    }

    if (stage === "result") {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="max-w-2xl mx-auto p-0 min-h-[50vh] text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">

                <div className="mb-6 relative">
                    <div className="h-32 w-32 rounded-full border-8 border-muted flex items-center justify-center relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-primary opacity-20"
                            style={{ top: `${100 - percentage}%` }}
                        />
                        <span className="text-3xl font-bold relative z-10">{percentage}%</span>
                    </div>
                    {percentage >= 70 && <Trophy className="absolute -top-4 -right-4 h-12 w-12 text-yellow-500 animate-bounce" />}
                </div>

                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    You scored <span className="text-foreground font-bold">{score}</span> out of <span className="text-foreground font-bold">{questions.length}</span>
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="p-4 rounded-xl bg-card border">
                        <p className="text-sm text-muted-foreground mb-1">Topic</p>
                        <p className="font-medium">{selectedTopic?.name}</p>
                    </div>

                </div>

                <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={onBack}>
                        Back to Menu
                    </Button>
                    <Button className="flex-1" onClick={restartQuiz}>
                        Retry Quiz
                    </Button>
                </div>
            </div>
        );
    }

    return null;
};
