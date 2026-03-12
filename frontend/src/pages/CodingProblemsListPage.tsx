import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { codingProblems } from "@/data/codingProblems";
import {
    Search,
    Filter,
    CheckCircle2,
    Circle,
    ChevronRight,
    ArrowLeft,
    Trophy,
    Zap,
    BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Language metadata for headers
const langMeta: Record<string, { label: string; icon: string; color: string; gradient: string }> = {
    javascript: { label: "JavaScript", icon: "{ }", color: "text-yellow-500", gradient: "from-yellow-500 to-amber-600" },
    python: { label: "Python", icon: "🐍", color: "text-blue-500", gradient: "from-blue-500 to-blue-600" },
    java: { label: "Java", icon: "☕", color: "text-orange-500", gradient: "from-orange-500 to-red-600" },
    cpp: { label: "C++", icon: "⚡", color: "text-purple-500", gradient: "from-purple-500 to-purple-700" },
    c: { label: "C", icon: "⚙️", color: "text-sky-500", gradient: "from-sky-500 to-cyan-600" },
    csharp: { label: "C#", icon: "🎯", color: "text-green-500", gradient: "from-green-500 to-emerald-600" },
    typescript: { label: "TypeScript", icon: "📘", color: "text-blue-600", gradient: "from-blue-600 to-indigo-700" },
    sql: { label: "SQL", icon: "🗄️", color: "text-pink-500", gradient: "from-pink-500 to-rose-600" },
};

const CodingProblemsListPage = () => {
    const { language } = useParams<{ language: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"id" | "difficulty" | "acceptance">("id");

    const lang = langMeta[language || ""] || langMeta.javascript;

    const baseProblems = useMemo(() => {
        return language
            ? codingProblems.filter(p => !p.supportedLanguages || p.supportedLanguages.includes(language as any))
            : codingProblems;
    }, [language]);

    const categories = useMemo(() => {
        return Array.from(new Set(baseProblems.map(p => p.category)));
    }, [baseProblems]);

    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const userInfoStr = localStorage.getItem("userInfo");
                if (!userInfoStr) {
                    navigate('/auth');
                    return;
                }
                const { token } = JSON.parse(userInfoStr);
                const { api } = await import('@/lib/api');
                const res = await api.get('/coding-scores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data?.success) {
                    setSolvedProblems(new Set(res.data.solvedProblems || []));
                }
            } catch (err) {
                console.error("Failed to fetch coding progress:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchScores();
    }, [navigate]);

    const filteredProblems = useMemo(() => {
        let problems = [...baseProblems];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            problems = problems.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q)) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        if (selectedDifficulty.length > 0) {
            problems = problems.filter((p) => selectedDifficulty.includes(p.difficulty));
        }

        if (selectedCategory) {
            problems = problems.filter((p) => p.category === selectedCategory);
        }

        if (sortBy === "difficulty") {
            const order = { Easy: 0, Medium: 1, Hard: 2 };
            problems.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        } else if (sortBy === "acceptance") {
            problems.sort((a, b) => b.acceptance - a.acceptance);
        } else {
            problems.sort((a, b) => a.id - b.id);
        }

        return problems;
    }, [baseProblems, searchQuery, selectedDifficulty, selectedCategory, sortBy]);

    const stats = useMemo(() => {
        const problemSet = baseProblems;

        const total = problemSet.length;
        const easy = problemSet.filter((p) => p.difficulty === "Easy").length;
        const medium = problemSet.filter((p) => p.difficulty === "Medium").length;
        const hard = problemSet.filter((p) => p.difficulty === "Hard").length;
        const easySolved = problemSet.filter((p) => p.difficulty === "Easy" && solvedProblems.has(p.id)).length;
        const mediumSolved = problemSet.filter((p) => p.difficulty === "Medium" && solvedProblems.has(p.id)).length;
        const hardSolved = problemSet.filter((p) => p.difficulty === "Hard" && solvedProblems.has(p.id)).length;
        return { total, easy, medium, hard, easySolved, mediumSolved, hardSolved };
    }, [solvedProblems, baseProblems]);

    const toggleDifficulty = (diff: string) => {
        setSelectedDifficulty((prev) =>
            prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
        );
    };

    const difficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "text-emerald-500";
            case "Medium": return "text-amber-500";
            case "Hard": return "text-red-500";
            default: return "text-muted-foreground";
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Link
                        to="/dashboard/coding"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${lang.gradient} flex items-center justify-center shadow-lg`}>
                        <span className="text-xl sm:text-2xl">{lang.icon}</span>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                            {lang.label} Problems
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Solve coding challenges in {lang.label}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-4 sm:p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-xs text-muted-foreground">Easy</span>
                    </div>
                    <p className="text-xl font-bold text-emerald-500">
                        {stats.easySolved}<span className="text-sm text-muted-foreground font-normal">/{stats.easy}</span>
                    </p>
                </div>
                <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-4 sm:p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-xs text-muted-foreground">Medium</span>
                    </div>
                    <p className="text-xl font-bold text-amber-500">
                        {stats.mediumSolved}<span className="text-sm text-muted-foreground font-normal">/{stats.medium}</span>
                    </p>
                </div>
                <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-4 sm:p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-xs text-muted-foreground">Hard</span>
                    </div>
                    <p className="text-xl font-bold text-red-500">
                        {stats.hardSolved}<span className="text-sm text-muted-foreground font-normal">/{stats.hard}</span>
                    </p>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Filters */}
                <div className="w-56 shrink-0 hidden lg:block">
                    <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-5 sticky top-24 shadow-lg">
                        <div className="flex items-center gap-2 mb-5">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Filters</h3>
                        </div>

                        {/* Difficulty */}
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Difficulty</h4>
                            <div className="space-y-2">
                                {["Easy", "Medium", "Hard"].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => toggleDifficulty(diff)}
                                        className={cn(
                                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all",
                                            selectedDifficulty.includes(diff)
                                                ? "bg-primary/10 border border-primary/30 text-primary"
                                                : "hover:bg-muted/30 text-muted-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-3 h-3 rounded-sm border transition-all",
                                            selectedDifficulty.includes(diff)
                                                ? "bg-primary border-primary"
                                                : "border-muted-foreground/40"
                                        )} />
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Category</h4>
                            <div className="space-y-1.5">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-xl text-sm transition-all",
                                        !selectedCategory
                                            ? "bg-primary/10 text-primary border border-primary/30"
                                            : "text-muted-foreground hover:bg-muted/30"
                                    )}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-xl text-sm transition-all",
                                            selectedCategory === cat
                                                ? "bg-primary/10 text-primary border border-primary/30"
                                                : "text-muted-foreground hover:bg-muted/30"
                                        )}
                                    >
                                        {cat}
                                        <span className="text-muted-foreground/50 ml-1 text-xs">
                                            ({baseProblems.filter(p => p.category === cat).length})
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="flex-1 min-w-0">
                    {/* Search & Sort */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search problems by title, tag, or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-4 py-2.5 bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                        >
                            <option value="id">Sort by #</option>
                            <option value="difficulty">Sort by Difficulty</option>
                            <option value="acceptance">Sort by Acceptance</option>
                        </select>
                    </div>

                    {/* Problems Table */}
                    <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-lg">
                        {/* Header Row */}
                        <div className="grid grid-cols-[40px_1fr_90px_110px_80px_36px] gap-3 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40 bg-muted/10">
                            <span></span>
                            <span>Title</span>
                            <span>Difficulty</span>
                            <span>Category</span>
                            <span>Accept.</span>
                            <span></span>
                        </div>

                        {/* Problem Rows */}
                        <div className="divide-y divide-border/30">
                            {filteredProblems.map((problem) => {
                                const isSolved = solvedProblems.has(problem.id);
                                return (
                                    <button
                                        key={problem.id}
                                        onClick={() => navigate(`/dashboard/coding/problem/${problem.id}?lang=${language}`)}
                                        className="w-full grid grid-cols-[40px_1fr_90px_110px_80px_36px] gap-3 items-center px-5 py-4 hover:bg-muted/20 transition-all group text-left"
                                    >
                                        <div>
                                            {isSolved ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-muted-foreground/30" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <span className="text-muted-foreground text-sm mr-2">{problem.id}.</span>
                                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                                {problem.title}
                                            </span>
                                            <div className="flex gap-1.5 mt-1.5">
                                                {problem.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 rounded-md bg-muted/30 text-[10px] text-muted-foreground font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <span className={cn("text-sm font-medium", difficultyColor(problem.difficulty))}>
                                            {problem.difficulty}
                                        </span>

                                        <span className="text-sm text-muted-foreground">{problem.category}</span>

                                        <span className="text-sm text-muted-foreground">{problem.acceptance}%</span>

                                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                    </button>
                                );
                            })}
                        </div>

                        {filteredProblems.length === 0 && (
                            <div className="text-center py-16">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground text-lg">No problems found</p>
                                <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingProblemsListPage;
