import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SUBJECTS, getQuestionsForSubject, getAllQuestions, QuizQuestion } from "@/data/technicalQuizData";
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

const TechnicalQuiz = () => {
  const lastViolationTime = useRef(0);
  const [stage, setStage] = useState<"select" | "config" | "quiz" | "result" | "exam-rules">("select");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number | string, selected: number, correct: number }[]>([]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Exam Mode State
  const [isExamMode, setIsExamMode] = useState(false);

  const [showExamResults, setShowExamResults] = useState(false);
  const [terminationReason, setTerminationReason] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  // Anti-Cheating: Fullscreen & Tab Switch Detection
  useEffect(() => {
    if (!isExamMode || stage !== "quiz") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTerminationReason("Switching tabs or minimizing the window is prohibited.");
        setStage("result");
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => { });
        }
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



  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get("/scores/top");
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  const submitScore = async (score: number, totalQuestions: number, timeTaken: number, quizType: string = 'technical') => {
    try {
      const token = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")!).token : null;
      if (!token) return;

      await api.post("/scores", { score, totalQuestions, timeTaken, quizType });
      fetchLeaderboard(); // Refresh after submission
    } catch (err) {
      console.error("Failed to submit score", err);
    }
  };

  // Calculate score logic (Lifted to top-level to fix Hook rules)
  const calculateResult = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    quizQuestions.forEach(q => {
      const ans = answers.find(a => a.questionId === q.id);
      if (!ans) {
        unattempted++;
      } else if (ans.selected === q.correct) {
        correct++;
      } else {
        wrong++;
      }
    });
    return { correctCount: correct, wrongCount: wrong, unattemptedCount: unattempted };
  };

  const { correctCount, wrongCount, unattemptedCount } = calculateResult();

  // Auto-submit score effect (Lifted to top-level)
  useEffect(() => {
    if (stage === 'result' && isExamMode) {
      const penalty = 0; // Negative marking removed
      const calculatedScore = (correctCount * 1) - (wrongCount * penalty);
      const timeUsed = 720 - timeLeft; 
      submitScore(calculatedScore, quizQuestions.length, timeUsed, 'technical');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const handleSubjectSelect = (id: string) => {
    setSelectedSubject(id);
    setIsExamMode(false);
    setStage("config");
  };

  const handleExamSelect = () => {
    setSelectedSubject("exam");
    setIsExamMode(true);
    setStage("exam-rules");
  };

  const startQuiz = () => {
    if (selectedSubject === "exam") {
      // Exam Mode Setup
      const allQuestions = getAllQuestions();
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const questions = shuffled.slice(0, 40); // 40 Questions for Exam
      setTimeLeft(720); // 12 Minutes

      if (questions.length === 0) {
        toast.error("Not enough questions for Exam Mode.");
        return;
      }

      setQuizQuestions(questions);
      setStage("quiz");
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowExamResults(false);
      setTerminationReason(null);

      // Trigger Fullscreen
      document.documentElement.requestFullscreen().catch((err) => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (selectedSubject) {
      // Normal Quiz Setup
      const allQuestions = getQuestionsForSubject(selectedSubject);
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const questions = shuffled.slice(0, questionCount);

      if (questions.length === 0) {
        toast.error("No questions available for this configuration");
        return;
      }

      setQuizQuestions(questions);
      setStage("quiz");
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
    }
  };

  const handleNext = () => {
    if (isNavigating) return;

    const currentQ = quizQuestions[currentQuestionIndex];

    if (selectedAnswer !== null) {
      setAnswers(prev => {
        const filtered = prev.filter(a => a.questionId !== currentQ.id);
        return [...filtered, {
          questionId: currentQ.id,
          selected: selectedAnswer,
          correct: currentQ.correct
        }];
      });
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextQId = quizQuestions[currentQuestionIndex + 1].id;
      const existingAns = answers.find(a => a.questionId === nextQId);
      setSelectedAnswer(existingAns ? existingAns.selected : null);
    }

    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handlePrevious = () => {
    if (isNavigating || currentQuestionIndex === 0) return;

    const currentQ = quizQuestions[currentQuestionIndex];

    if (selectedAnswer !== null) {
      setAnswers(prev => {
        const filtered = prev.filter(a => a.questionId !== currentQ.id);
        return [...filtered, {
          questionId: currentQ.id,
          selected: selectedAnswer,
          correct: currentQ.correct
        }];
      });
    }

    setCurrentQuestionIndex(currentQuestionIndex - 1);
    const prevQId = quizQuestions[currentQuestionIndex - 1].id;
    const existingAns = answers.find(a => a.questionId === prevQId);
    setSelectedAnswer(existingAns ? existingAns.selected : null);

    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Navigation for Exam Palette
  const jumpToQuestion = (index: number) => {
    // Save current answer before jumping
    if (selectedAnswer !== null) {
      const currentQ = quizQuestions[currentQuestionIndex];
      setAnswers(prev => {
        const filtered = prev.filter(a => a.questionId !== currentQ.id);
        return [...filtered, {
          questionId: currentQ.id,
          selected: selectedAnswer,
          correct: currentQ.correct
        }];
      });
    }

    setCurrentQuestionIndex(index);
    // Restore answer for target question
    const targetQ = quizQuestions[index];
    const existingAns = answers.find(a => a.questionId === targetQ.id);
    setSelectedAnswer(existingAns ? existingAns.selected : null);
  };

  const submitQuiz = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    if (isExamMode) {
      document.exitFullscreen().catch(() => { });
    }
    setStage("result");
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

  const restart = () => {
    setStage("select");
    setSelectedSubject(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsExamMode(false);
    setShowExamResults(false);
  };

  // --- Stage: SELECT SUBJECT ---
  if (stage === "select") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-2">
              Technical Quizzes
            </h1>
            <p className="text-gray-500">
              Master core technical concepts with our curated question bank.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Exam Section Card */}
            <button
              onClick={handleExamSelect}
              className="group relative overflow-hidden p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 hover:border-primary text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 col-span-full md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl mb-4 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl shadow-md text-white">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Full Exam
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                Exam Section
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                40 Questions • Random Topics • 12 Mins
              </p>
              <div className="flex items-center text-sm font-medium text-primary">
                Start Challenge <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectSelect(subject.id)}
                className="group relative overflow-hidden p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-2xl shadow-md text-white`}>
                  {subject.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </button>
            ))}
          </div>

          {/* Leaderboard Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600 mb-6 flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" /> Top Performers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaderboard.map((entry, index) => (
                <Card key={index} className={cn(
                  "border-0 shadow-lg overflow-hidden relative",
                  index === 0 ? "bg-gradient-to-br from-yellow-50 to-amber-100 ring-2 ring-yellow-400" :
                    index === 1 ? "bg-gradient-to-br from-gray-50 to-gray-200 ring-1 ring-gray-300" :
                      index === 2 ? "bg-gradient-to-br from-orange-50 to-orange-100 ring-1 ring-orange-300" : "bg-white"
                )}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner",
                      index === 0 ? "bg-yellow-400 text-white" :
                        index === 1 ? "bg-gray-400 text-white" :
                          index === 2 ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{entry.username}</h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold text-primary">{entry.score}</span> / {entry.totalQuestions}
                        <span className="text-xs text-gray-400 ml-2">({Math.round(entry.timeTaken / 60)}m)</span>
                      </p>
                    </div>
                    {index === 0 && <Sparkles className="absolute top-2 right-2 text-yellow-400 w-6 h-6 animate-pulse" />}
                  </CardContent>
                </Card>
              ))}
              {leaderboard.length === 0 && <p className="text-gray-500 italic">No scores yet. Be the first!</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Stage: EXAM RULES ---
  if (stage === "exam-rules") {
    return (
      <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="w-full max-w-2xl">
          <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary text-gray-500" onClick={() => setStage("select")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sections
          </Button>

          <Card className="border-gray-200 bg-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-b border-gray-100">
              <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                <Trophy className="w-8 h-8 text-primary" />
                Exam Section Rules
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
                    <li>• Mix of all Technical Domains</li>
                    <li>• 12 Minutes Time Limit</li>
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
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>Switching tabs, minimizing, or exiting Full Screen results in <strong>IMMEDIATE TERMINATION</strong>.</span>
                  </li>
                </ul>
              </div>

              <Button onClick={startQuiz} className="w-full bg-primary hover:bg-primary/90 text-lg py-6 shadow-lg shadow-primary/20">
                I Agree & Start Exam <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Stage: CONFIG (Normal Quiz) ---
  if (stage === "config") {
    const subject = SUBJECTS.find(s => s.id === selectedSubject);
    return (
      <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="w-full max-w-lg">
          <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary text-gray-500" onClick={() => setStage("select")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
          </Button>

          <Card className="border-gray-200 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                <span className="text-3xl">{subject?.icon}</span>
                {subject?.name}
              </CardTitle>
              <CardDescription className="text-gray-500">Configure your practice session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Count */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Number of Questions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={cn(
                        "py-3 rounded-lg border transition-all font-semibold",
                        questionCount === count
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={startQuiz} className="w-full bg-primary hover:bg-primary/90 text-lg py-6 mt-4 shadow-lg shadow-primary/20">
                Start Quiz <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Stage: QUIZ (Shared for Exam/Normal) ---
  if (stage === "quiz") {
    const question = quizQuestions[currentQuestionIndex];

    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center">
        <div className="w-full transition-all duration-300 max-w-[1400px] grid lg:grid-cols-[1fr_300px] gap-6">

          {/* Left Column: Question */}
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
                <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                <span>{answers.length} / {quizQuestions.length} Questions Attended</span>
              </div>
            </div>

            {/* Question Card */}
            <Card className="border-gray-200 bg-white shadow-xl overflow-hidden h-fit">
              <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-gray-900">{question.question}</h2>
                  <span className="flex-shrink-0 px-3 py-1 bg-gray-200 rounded text-xs font-bold text-gray-600">
                    Q{currentQuestionIndex + 1}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                {question.options.map((option, idx) => (
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
              </div>
              <div className="p-6 pt-0 flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  size="lg"
                  disabled={isNavigating || currentQuestionIndex === 0}
                  className="px-8 font-bold gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  size="lg"
                  disabled={isNavigating || currentQuestionIndex === quizQuestions.length - 1}
                  className={cn("px-8 font-bold gap-2", currentQuestionIndex === quizQuestions.length - 1 && "hidden")}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Question Palette */}
          <div className="space-y-4">
            <Card className="border-gray-200 bg-white shadow-xl h-fit sticky top-6">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg">Question Palette</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-5 gap-2">
                  {quizQuestions.map((_, idx) => {
                    const isAnswered = answers.some(a => a.questionId === quizQuestions[idx].id);
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => jumpToQuestion(idx)}
                        className={cn(
                          "h-10 w-full rounded-lg text-sm font-bold transition-all border-2",
                          isCurrent
                            ? "border-primary bg-primary text-white scale-110 shadow-md z-10"
                            : isAnswered
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200"
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200" /> Not Attended
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" /> Current
                  </div>
                </div>

                <Button onClick={submitQuiz} variant="secondary" className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-800">
                  {isExamMode ? "Submit Exam" : "Submit Quiz"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Confirm Submission
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to submit your {isExamMode ? "exam" : "quiz"}? 
                You have attended {answers.length} out of {quizQuestions.length} questions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowSubmitConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={confirmSubmit} className="bg-gray-900 text-white hover:bg-gray-800">
                Confirm & Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quit Confirmation Dialog */}
        <Dialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Quit Session?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to quit this {isExamMode ? "exam" : "practice session"}? 
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
      </div>
    );
  }

  // --- Stage: RESULT ---
  if (stage === "result") {
    // Handle Terminated Exam View
    if (isExamMode && terminationReason) {
      return (
        <div className="p-6 lg:p-8 min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">Exam Terminated</h1>
            <p className="text-gray-700 font-medium mb-2">{terminationReason}</p>
            <p className="text-sm text-gray-500 mb-8">
              Your exam has been cancelled due to policy violations. No score will be recorded.
            </p>

            <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800" onClick={restart}>
              <RotateCcw className="w-4 h-4 mr-2" /> Return to Home
            </Button>
          </div>
        </div>
      );
    }

    // Scoring: +1 Correct, -1 Wrong (Exam) / 0 Wrong (Practice)
    const penalty = isExamMode ? 1 : 0; 
    const totalScore = Math.max(0, correctCount - (wrongCount * penalty));
    const subject = isExamMode ? { name: "Exam Section" } : SUBJECTS.find(s => s.id === selectedSubject);

    // Exam Result Hidden State
    if (isExamMode && !showExamResults) {
      return (
        <div className="p-6 lg:p-8 min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Submitted!</h1>
            <p className="text-gray-500 mb-8">Your response has been recorded.</p>

            <Button
              onClick={() => setShowExamResults(true)}
              size="lg"
              className="w-full font-bold shadow-lg"
            >
              Click Here to Show Results
            </Button>
            <Button variant="ghost" className="mt-4" onClick={restart}>
              Back to Home
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 lg:p-8 min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center">
        <div className="w-full max-w-4xl">

          <div className="text-center mb-10 animate-in zoom-in fade-in duration-500">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-blue-600 p-[2px] shadow-xl mb-6">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              {isExamMode ? "Exam Results" : "Quiz Complete!"}
            </h1>
            <p className="text-gray-500">
              {isExamMode ? "Exam results analyzed and verified." : `Review your performance in ${subject?.name}`}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <Card className="bg-primary/5 border-primary/20 shadow-md p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl font-black text-primary mb-1">{totalScore}</div>
              <div className="text-xs text-primary/70 font-bold uppercase tracking-wider">Total Marks</div>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-1">{correctCount}</div>
              <div className="text-xs text-emerald-600/70 font-medium uppercase tracking-wider">Correct</div>
            </Card>
            <Card className="bg-red-50 border-red-100 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-1">{wrongCount}</div>
              <div className="text-xs text-red-600/70 font-medium uppercase tracking-wider">Wrong</div>
            </Card>
            <Card className="bg-gray-50 border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-gray-500 mb-1">{quizQuestions.length - answers.length}</div>
              <div className="text-xs text-gray-500/70 font-medium uppercase tracking-wider">Skipped</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 max-w-2xl mx-auto mb-12">
            <Button variant="outline" size="lg" className="flex-1 bg-white hover:bg-gray-50 text-gray-700" onClick={restart}>
              <BookOpen className="w-4 h-4 mr-2" /> All Topics
            </Button>
            <Button size="lg" className="flex-1" onClick={restart}>
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>

          {/* Review Section */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Review Answers
              </CardTitle>
              <CardDescription>Detailed explanation for each question</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100">
              {quizQuestions.map((q, idx) => {
                const userAnswer = answers.find(a => a.questionId === q.id);
                const isCorrect = userAnswer?.selected === q.correct;
                const isSkipped = !userAnswer;

                return (
                  <div key={q.id} className="py-6 first:pt-4 last:pb-2">
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
                          {isSkipped ? "Not Attempted" : q.options[userAnswer?.selected || 0]}
                        </div>
                        <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800">
                          <span className="block text-xs font-bold opacity-70 mb-1">Correct Answer</span>
                          {q.options[q.correct]}
                        </div>
                      </div>

                      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3">
                        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                        <div>
                          <span className="font-bold block text-xs uppercase tracking-wider text-blue-600 mb-1">Explanation</span>
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>
      </div>
    );
  }

  return null;
};

export default TechnicalQuiz;
