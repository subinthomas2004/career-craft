import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  XCircle,
  Trophy,
  BarChart3,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const subjects = [
  { id: "dsa", name: "Data Structures & Algorithms", icon: "🔢", questions: 50 },
  { id: "dbms", name: "Database Management", icon: "🗃️", questions: 35 },
  { id: "os", name: "Operating Systems", icon: "💻", questions: 40 },
  { id: "cn", name: "Computer Networks", icon: "🌐", questions: 30 },
  { id: "oops", name: "Object-Oriented Programming", icon: "📦", questions: 45 },
  { id: "web", name: "Web Development", icon: "🌍", questions: 55 },
];

const sampleQuestions = [
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1
  },
  {
    question: "Which data structure uses LIFO principle?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    correct: 2
  },
  {
    question: "What is the worst case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correct: 2
  }
];

const Quiz = () => {
  const [stage, setStage] = useState<"select" | "config" | "quiz" | "result">("select");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = () => {
    setStage("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const submitAnswer = () => {
    if (selectedAnswer !== null) {
      setAnswers([...answers, selectedAnswer]);
      setShowResult(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setStage("result");
    }
  };

  if (stage === "select") {
    return (
      <div className="p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Technical & Aptitude Quizzes
            </h1>
            <p className="text-muted-foreground">
              Test your knowledge and track your progress across topics.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select a Subject</CardTitle>
              <CardDescription>Choose a topic to practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setStage("config");
                    }}
                    className="p-6 rounded-xl border border-border/40 bg-card/60 backdrop-blur-xl hover:border-primary/50 hover:bg-accent/50 transition-all text-left group shadow-lg hover:shadow-xl"
                  >
                    <span className="text-4xl mb-3 block">{subject.icon}</span>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.questions} questions available
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === "config") {
    return (
      <div className="p-6 lg:p-8 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Configure Your Quiz
            </h1>
            <p className="text-muted-foreground">
              {subjects.find(s => s.id === selectedSubject)?.name}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Number of Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border-2 transition-all text-center font-semibold backdrop-blur-md",
                      questionCount === count
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-background/40 hover:border-primary/50"
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Difficulty Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {[
                  { id: "easy", label: "Easy", color: "text-green-500" },
                  { id: "medium", label: "Medium", color: "text-amber-500" },
                  { id: "hard", label: "Hard", color: "text-red-500" },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setDifficulty(level.id as any)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border-2 transition-all text-center font-semibold backdrop-blur-md",
                      difficulty === level.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-background/40 hover:border-primary/50"
                    )}
                  >
                    <span className={level.color}>{level.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStage("select")} className="flex-1">
              Back
            </Button>
            <Button onClick={startQuiz} className="flex-1">
              Start Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const question = sampleQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    return (
      <div className="p-6 lg:p-8 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono">02:30</span>
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 backdrop-blur-md",
                      showResult
                        ? index === question.correct
                          ? "border-green-500 bg-green-500/10"
                          : index === selectedAnswer
                            ? "border-red-500 bg-red-500/10"
                            : "border-border/50 opacity-50"
                        : selectedAnswer === index
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-background/40 hover:border-primary/50"
                    )}
                  >
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      showResult && index === question.correct
                        ? "bg-green-500 text-white"
                        : showResult && index === selectedAnswer
                          ? "bg-red-500 text-white"
                          : selectedAnswer === index
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-foreground">{option}</span>
                    {showResult && index === question.correct && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                    {showResult && index === selectedAnswer && index !== question.correct && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={cn(
                  "mt-6 p-4 rounded-xl",
                  isCorrect 
                    ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                    : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                )}>
                  <p className={cn(
                    "font-medium mb-1",
                    isCorrect ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"
                  )}>
                    {isCorrect ? "Correct! 🎉" : "Incorrect"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The correct answer is: {question.options[question.correct]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            {!showResult ? (
              <Button 
                onClick={submitAnswer} 
                className="flex-1"
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="flex-1">
                {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "See Results"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result Stage
  const correctAnswers = answers.filter((a, i) => a === sampleQuestions[i].correct).length;
  const percentage = Math.round((correctAnswers / sampleQuestions.length) * 100);

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Quiz Complete!
          </h1>
          <p className="text-muted-foreground">
            Here's how you performed
          </p>
        </div>

        {/* Score Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${percentage * 3.52} ${100 * 3.52}`}
                    className={cn(
                      percentage >= 70 ? "text-green-500" :
                      percentage >= 50 ? "text-amber-500" : "text-red-500"
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{percentage}%</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-foreground">
                  {correctAnswers}/{sampleQuestions.length}
                </p>
                <p className="text-muted-foreground">Correct Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-foreground">
                  Focus more on time complexity analysis - this was a weak area.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-foreground">
                  Practice sorting algorithms concepts for better understanding.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-foreground">
                  Review stack and queue operations fundamentals.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => setStage("select")}>
            Try Another Topic
          </Button>
          <Button className="flex-1" onClick={startQuiz}>
            Retry Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
