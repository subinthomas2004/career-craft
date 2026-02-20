import { Link } from "react-router-dom";
import { Code, ArrowRight, ArrowLeft, Flame } from "lucide-react";
import { codingProblems } from "@/data/codingProblems";
import { useMemo } from "react";

// 8 Language cards with icons, colors matching the dashboard design
const languages = [
    {
        id: "javascript",
        label: "JavaScript",
        shortLabel: "JS",
        color: "from-yellow-500 to-amber-600",
        description: "Web development & scripting",
        icon: "{ }",
    },
    {
        id: "python",
        label: "Python",
        shortLabel: "PY",
        color: "from-blue-500 to-blue-600",
        description: "Data science & AI",
        icon: "🐍",
    },
    {
        id: "java",
        label: "Java",
        shortLabel: "JV",
        color: "from-orange-500 to-red-600",
        description: "Enterprise & Android",
        icon: "☕",
    },
    {
        id: "cpp",
        label: "C++",
        shortLabel: "C+",
        color: "from-purple-500 to-purple-700",
        description: "Systems & competitive coding",
        icon: "⚡",
    },
    {
        id: "c",
        label: "C",
        shortLabel: "C",
        color: "from-sky-500 to-cyan-600",
        description: "Low-level programming",
        icon: "⚙️",
    },
    {
        id: "csharp",
        label: "C#",
        shortLabel: "C#",
        color: "from-green-500 to-emerald-600",
        description: "Game dev & .NET",
        icon: "🎯",
    },
    {
        id: "typescript",
        label: "TypeScript",
        shortLabel: "TS",
        color: "from-blue-600 to-indigo-700",
        description: "Typed JavaScript",
        icon: "📘",
    },
    {
        id: "sql",
        label: "SQL",
        shortLabel: "SQ",
        color: "from-pink-500 to-rose-600",
        description: "Database queries",
        icon: "🗄️",
    },
];

const CodingPracticeHome = () => {
    const solvedCount = useMemo(() => {
        const saved = localStorage.getItem("solvedProblems");
        return saved ? JSON.parse(saved).length : 0;
    }, []);

    const totalCount = codingProblems.length;

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Link
                        to="/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                            Coding Practice
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Choose a language to start solving problems
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:p-5 mb-6 sm:mb-8 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-foreground">Overall Progress</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {solvedCount}/{totalCount} problems solved
                    </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2.5">
                    <div
                        className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-full h-2.5 transition-all duration-500"
                        style={{ width: `${totalCount > 0 ? (solvedCount / totalCount) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* 8 Language Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger-children">
                {languages.map((lang) => (
                    <Link
                        key={lang.id}
                        to={`/dashboard/coding/${lang.id}`}
                        className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 p-4 sm:p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Gradient Icon */}
                        <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                        >
                            <span className="text-xl sm:text-2xl">{lang.icon}</span>
                        </div>

                        {/* Label */}
                        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                            {lang.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">{lang.description}</p>

                        {/* Problem count */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-primary">
                                {codingProblems.filter(p => !p.supportedLanguages || p.supportedLanguages.includes(lang.id as any)).length} problems
                            </span>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CodingPracticeHome;
