import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, ArrowRight, ArrowLeft, BookOpen, Sparkles, Code2, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const QuizSelection = () => {
  const quizTypes = [
    {
      id: "technical",
      title: "Technical Quiz",
      description: "Master core CS concepts: DBMS, OS, Networks, OOPS, and programming languages.",
      icon: Code2,
      path: "/dashboard/technical-quiz",
      color: "from-blue-600 to-indigo-600",
      bgLight: "bg-blue-50",
      features: [
        "8+ CS Subjects",
        "Practice & Exam Modes",
        "Anti-cheating System",
        "Global Leaderboard"
      ]
    },
    {
      id: "aptitude",
      title: "Aptitude Quiz",
      description: "Sharpen your Quantitative, Logical, and Verbal skills for placement exams.",
      icon: Calculator,
      path: "/dashboard/aptitude-quiz",
      color: "from-purple-600 to-pink-600",
      bgLight: "bg-purple-50",
      features: [
        "30+ Aptitude Topics",
        "Comprehensive Study Mode",
        "AI Monitored Exams",
        "Detailed Explanations"
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto">


        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" />
            Assessment Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Choose Your <span className="text-primary">Challenge</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Select a category to start practicing. Whether it's technical depth or aptitude speed, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 stagger-children">
          {quizTypes.map((quiz, index) => (
            <Link key={quiz.id} to={quiz.path} className="group">
              <Card className={cn(
                "relative h-full border-2 border-transparent transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2 overflow-hidden bg-white",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity group-hover:before:opacity-[0.03]",
                quiz.bgLight
              )}>
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl transition-opacity opacity-20",
                  quiz.id === 'technical' ? "bg-blue-400" : "bg-purple-400"
                )} />

                <CardHeader className="pb-4 relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 bg-gradient-to-br",
                    quiz.color
                  )}>
                    <quiz.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {quiz.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="space-y-3 mb-8">
                    {quiz.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          quiz.id === 'technical' ? "bg-blue-500" : "bg-purple-500"
                        )} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className={cn(
                    "flex items-center gap-2 font-bold text-sm uppercase tracking-wider transition-all",
                    quiz.id === 'technical' ? "text-blue-600" : "text-purple-600"
                  )}>
                    Start Now 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 p-8 rounded-3xl bg-gray-900 text-white overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Ready for the Big Day?</h3>
              <p className="text-gray-400">
                Our exams simulate real placement scenarios with strict time limits and proctoring controls to ensure you are fully prepared.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Questions</div>
              </div>
              <div className="text-center px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-primary">Live</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSelection;
