import { useState } from "react";
import { QuizMode } from "@/components/aptitude/QuizMode";
import { StudyMode } from "@/components/aptitude/StudyMode";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Brain, ArrowLeft } from "lucide-react";

const AptitudeQuiz = () => {
    const [mode, setMode] = useState<"menu" | "study" | "quiz">("menu");

    if (mode === "quiz") {
        return <QuizMode onBack={() => setMode("menu")} />;
    }

    if (mode === "study") {
        return <StudyMode onBack={() => setMode("menu")} />;
    }

    return (
        <div className="min-h-screen p-6 lg:p-10 animate-in fade-in duration-500">

            {/* Header */}
            <div className="text-center mb-12 mx-auto max-w-2xl">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Aptitude Mastery
                </h1>
                <p className="text-xl text-muted-foreground">
                    Prepare for your career with our comprehensive study materials and adaptive practice tests.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Study Card */}
                <Card
                    className="group cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
                    onClick={() => setMode("study")}
                >
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl">Study Section</CardTitle>
                        <CardDescription>Learn concepts, formulas, and tips</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                        Access detailed notes and solved examples for 30+ aptitude topics to build your foundation.
                    </CardContent>
                </Card>

                {/* Quiz Card */}
                <Card
                    className="group cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
                    onClick={() => setMode("quiz")}
                >
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardTitle className="text-2xl">Exam Section</CardTitle>
                        <CardDescription>Test your skills with AI quizzes</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                        Take customizable practice tests with real-time scoring and detailed explanations.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AptitudeQuiz;
