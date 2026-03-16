import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getProblemById, codingProblems, ALL_LANGUAGES, getStarterCode, type CodingProblem, type LanguageId } from "@/data/codingProblems";
import { executeCode, preloadPyodide, isPyodideLoaded, getExecutionMode, type TestResult } from "@/lib/codeRunner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Send,
  RotateCcw,
  Lightbulb,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Code,
  Terminal,
  FlaskConical,
  Eye,
  EyeOff,
  Globe,
  Monitor,
  Trophy,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Language colors for the selector
const langColors: Record<string, string> = {
  javascript: "text-yellow-400",
  python: "text-blue-400",
  java: "text-orange-400",
  cpp: "text-purple-400",
  c: "text-sky-400",
  csharp: "text-green-400",
  typescript: "text-blue-500",
  sql: "text-pink-400",
};

const CodingPractice = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<LanguageId>("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTestTab, setActiveTestTab] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(-1);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bottomTab, setBottomTab] = useState<"testcase" | "result">("testcase");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [pyodideStatus, setPyodideStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [allPassed, setAllPassed] = useState(false);
  const [groqAnalysis, setGroqAnalysis] = useState<{
    hasErrors: boolean;
    compilationError: string | null;
    analysis: string;
    feedback: string;
    score: number;
  } | null>(null);
  const [isGroqAnalyzing, setIsGroqAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Load problem
  useEffect(() => {
    if (id) {
      const p = getProblemById(Number(id));
      if (p) {
        setProblem(p);
        // Check if language was passed via query param
        const langParam = searchParams.get("lang") as LanguageId | null;
        const initialLang = langParam && ALL_LANGUAGES.some(l => l.id === langParam) ? langParam : "javascript";
        setLanguage(initialLang);
        setCode(getStarterCode(p, initialLang));
        setTestResults([]);
        setShowResults(false);
        setCompilationError(null);
        setHintLevel(-1);
        setTimer(0);
        setTimerRunning(true);
        setAllPassed(false);
      } else {
        navigate("/dashboard/coding");
      }
    }
  }, [id, navigate, searchParams]);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Preload Pyodide when Python is selected
  useEffect(() => {
    if (language === "python" && !isPyodideLoaded()) {
      setPyodideStatus("loading");
      preloadPyodide().then(() => setPyodideStatus("ready")).catch(() => setPyodideStatus("idle"));
    } else if (language === "python" && isPyodideLoaded()) {
      setPyodideStatus("ready");
    }
  }, [language]);

  // Handle language switch
  const handleLanguageChange = (lang: LanguageId) => {
    if (problem) {
      setLanguage(lang);
      setCode(getStarterCode(problem, lang));
      setTestResults([]);
      setShowResults(false);
      setCompilationError(null);
    }
  };

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Run code (sample test cases only)
  const handleRun = useCallback(async () => {
    if (!problem || isRunning) return;
    setIsRunning(true);
    setShowResults(true);
    setBottomTab("result");
    setCompilationError(null);

    const sampleTests = problem.testCases.slice(0, Math.min(3, problem.testCases.length));
    
    // Start Groq Analysis
    setIsGroqAnalyzing(true);
    setGroqAnalysis(null);
    
    // Record attempt
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      const { token } = JSON.parse(userInfoStr);
      api.post('/coding-scores/attempt', { problemId: problem.id }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }

    const runPromise = executeCode(code, language, sampleTests);
    const groqPromise = api.post('/groq/coding-practice/analyze', {
      code,
      language,
      problemTitle: problem.title,
      problemDescription: problem.description
    });

    try {
      const [result, groqRes] = await Promise.all([runPromise, groqPromise]);
      
      setTestResults(result.results);
      // Strictly use Groq for compilation errors as requested
      // If Groq says there's an error, show it.
      // If Groq says no error but execution failed, it's a runtime error or runner issue.
      if (groqRes.data.hasErrors) {
        setCompilationError(groqRes.data.compilationError);
      } else {
        setCompilationError(null);
      }
      setGroqAnalysis(groqRes.data);
    } catch (err) {
      console.error("Analysis failed", err);
      const result = await runPromise;
      setTestResults(result.results);
      setCompilationError(result.compilationError || null);
    } finally {
      setIsRunning(false);
      setIsGroqAnalyzing(false);
    }
  }, [problem, code, language, isRunning]);

  // Submit code (all test cases)
  const handleSubmit = useCallback(async () => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    setShowResults(true);
    setBottomTab("result");
    setCompilationError(null);
    setIsGroqAnalyzing(true);
    setGroqAnalysis(null);

    // Record attempt
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      const { token } = JSON.parse(userInfoStr);
      api.post('/coding-scores/attempt', { problemId: problem.id }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }

    const runPromise = executeCode(code, language, problem.testCases);
    const groqPromise = api.post('/groq/coding-practice/analyze', {
      code,
      language,
      problemTitle: problem.title,
      problemDescription: problem.description
    });

    try {
      const [result, groqRes] = await Promise.all([runPromise, groqPromise]);
      
      setTestResults(result.results);
      // Strictly use Groq for compilation errors
      if (groqRes.data.hasErrors) {
        setCompilationError(groqRes.data.compilationError);
      } else {
        setCompilationError(null);
      }
      setGroqAnalysis(groqRes.data);

      if (result.summary.passed === result.summary.total && result.summary.total > 0 && !groqRes.data.hasErrors) {
        setAllPassed(true);
        setTimerRunning(false);

        try {
          const userInfo = localStorage.getItem("userInfo");
          if (userInfo) {
            const { token } = JSON.parse(userInfo);
            
            // Save to MongoDB
            await api.post('/coding-scores/solve', { problemId: problem.id }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            // Record Activity
            await api.post('/auth/activity', {
              title: `Solved: ${problem.title}`,
              activityType: 'coding',
              score: 'Solved'
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        } catch (err) {
          console.error("Failed to save progress or record activity", err);
        }
      }
    } catch (err) {
      console.error("Submission failed", err);
      const result = await runPromise;
      setTestResults(result.results);
      setCompilationError(result.compilationError || null);
    } finally {
      setIsSubmitting(false);
      setIsGroqAnalyzing(false);
    }
  }, [problem, code, language, isSubmitting]);

  // Run custom input
  const handleRunCustom = useCallback(async () => {
    if (!customInput.trim()) return;
    try {
      const result = await executeCode(code, language, [{ input: customInput, expected: "" }]);
      if (result.results[0]) {
        setCustomOutput(result.results[0].actual || result.results[0].error || "No output");
      }
    } catch {
      setCustomOutput("Execution failed");
    }
  }, [code, language, customInput]);

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset code
  const handleReset = () => {
    if (problem) {
      setCode(getStarterCode(problem, language));
      setTestResults([]);
      setShowResults(false);
      setCompilationError(null);
    }
  };

  // Navigate to prev/next problem
  const navigateProblem = (direction: "prev" | "next") => {
    if (!problem) return;
    const idx = codingProblems.findIndex((p) => p.id === problem.id);
    const newIdx = direction === "prev" ? idx - 1 : idx + 1;
    if (newIdx >= 0 && newIdx < codingProblems.length) {
      navigate(`/dashboard/coding/problem/${codingProblems[newIdx].id}`);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const lineCount = code.split("\n").length;
  const execMode = getExecutionMode(language);

  const currentIdx = problem ? codingProblems.findIndex((p) => p.id === problem.id) : -1;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < codingProblems.length - 1;

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0c10]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Lab...</span>
        </div>
      </div>
    );
  }

  const difficultyStyles = {
    Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Hard: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Bar - Clean & Minimalist */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/dashboard/coding")}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all duration-300 group"
            title="Back to Problems"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="text-slate-300 font-mono text-xs font-normal">#{problem.id}</span>
              {problem.title}
            </h1>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              difficultyStyles[problem.difficulty]
            )}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Clean White Panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={38} minSize={25}>
          <div className="h-full overflow-y-auto bg-white p-8 custom-scrollbar">
            <div className="max-w-none">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">{problem.title}</h2>
                <div className="flex gap-2">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-slate-600 text-[15px] leading-relaxed mb-10 selection:bg-primary/10">
                {problem.description}
              </div>

              {/* Examples Section */}
              <div className="space-y-6 mb-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-100/50 transition-all duration-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Example {i + 1}</span>
                    </div>
                    <div className="font-mono text-sm space-y-3">
                      <div className="flex gap-4">
                        <span className="text-slate-300 w-16 shrink-0 underline decoration-slate-200 underline-offset-4 decoration-1">Input</span>
                        <span className="text-slate-700 font-bold break-all">{ex.input}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-slate-300 w-16 shrink-0 underline decoration-slate-200 underline-offset-4 decoration-1">Output</span>
                        <span className="text-emerald-600 font-bold break-all">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="pt-3 border-t border-slate-100 mt-2">
                          <p className="text-slate-500 text-xs italic leading-relaxed">{ex.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints Section */}
              <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Constraints</h3>
                <div className="space-y-2">
                  {problem.constraints.map((c, i) => (
                    <div key={i} className="flex gap-3 items-start group">
                      <div className="w-1 h-1 rounded-full bg-slate-200 mt-2 flex-shrink-0 group-hover:bg-primary/60 transition-colors" />
                      <code className="text-xs text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded leading-relaxed">{c}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints & Actions */}
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={() => setHintLevel((l) => Math.min(l + 1, problem.hints.length - 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm hover:bg-amber-500/20 transition-all"
                >
                  <Lightbulb className="w-4 h-4" />
                  {hintLevel < 0 ? "Get Hint" : hintLevel < problem.hints.length - 1 ? "Next Hint" : "No More Hints"}
                </button>
                {hintLevel >= 0 && (
                  <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {problem.hints.slice(0, hintLevel + 1).map((hint, i) => (
                      <div key={i} className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl shadow-sm">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900/80">{hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border/40 hover:bg-emerald-500/30 transition-colors" />

        {/* Right Panel - Premium Code Editor + Console */}
        <ResizablePanel defaultSize={62} minSize={35}>
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col bg-slate-50 border-white">
                {/* Editor Toolbar */}
                <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-white/5 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main.${language}</span>
                    </div>
                    
                    {/* Language Selector - Minimalist */}
                    <div className="relative group">
                      <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
                        className={cn(
                          "px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold tracking-wider uppercase focus:outline-none focus:bg-slate-200 cursor-pointer appearance-none transition-all",
                          langColors[language] || "text-slate-500"
                        )}
                        disabled={
                          (problem.supportedLanguages && problem.supportedLanguages.length === 1) ||
                          !!searchParams.get("lang")
                        }
                      >
                        {ALL_LANGUAGES.filter(lang =>
                          (searchParams.get("lang") ? lang.id === searchParams.get("lang") : true) &&
                          (!problem.supportedLanguages || problem.supportedLanguages.includes(lang.id as any))
                        ).map((lang) => (
                          <option key={lang.id} value={lang.id} className="bg-white text-slate-900">
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {language === "python" && pyodideStatus === "loading" && (
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-500/80">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Initializing...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                      title="Copy code"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                      title="Reset code"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 flex overflow-hidden relative">
                  <div
                    ref={lineNumbersRef}
                    className="w-10 bg-slate-100/50 border-r border-slate-200 overflow-hidden select-none shrink-0"
                  >
                    <div className="py-6 px-2 text-right">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i} className="text-[10px] leading-[22px] text-muted-foreground/20 font-mono">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (allPassed) setAllPassed(false);
                    }}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className="flex-1 w-full py-6 px-6 bg-white text-slate-800 font-mono text-sm leading-[22px] resize-none focus:outline-none placeholder-slate-300 selection:bg-primary/10"
                    spellCheck={false}
                    placeholder="// Solve the challenge..."
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-white/5 hover:bg-primary/20 transition-colors h-1" />

            {/* Bottom Panel - Console Tab System */}
            <ResizablePanel defaultSize={40} minSize={15}>
              <div className="h-full flex flex-col bg-white border-t border-slate-200">
                {/* Console Tabs */}
                <div className="h-12 flex items-center justify-between px-4 bg-white/[0.02] border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setBottomTab("testcase")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        bottomTab === "testcase" ? "bg-slate-100 text-slate-900 border border-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      Testsuite
                    </button>
                    <button
                      onClick={() => setBottomTab("result")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        bottomTab === "result" ? "bg-slate-100 text-slate-900 border border-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      Output
                      {testResults.length > 0 && (
                        <span className={cn(
                          "ml-1.5 px-2 py-0.5 rounded-full text-[9px]",
                          testResults.every(r => r.passed) ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {testResults.filter(r => r.passed).length}/{testResults.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRun}
                      disabled={isRunning || isSubmitting}
                      className="px-5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 disabled:opacity-30 transition-all flex items-center gap-2"
                    >
                      {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      Run
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isRunning || isSubmitting}
                      className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-30 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      Submit
                    </button>
                  </div>
                </div>

                {/* Bottom Content - Premium Console Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {bottomTab === "testcase" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        {problem.testCases.slice(0, 3).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveTestTab(i)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                              activeTestTab === i
                                ? "bg-slate-100 text-slate-900 border border-slate-200"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            Case {i + 1}
                          </button>
                        ))}
                        <div className="w-px h-4 bg-white/5 mx-2" />
                        <button
                          onClick={() => setActiveTestTab(-1)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                            activeTestTab === -1
                              ? "bg-slate-100 text-slate-900 border border-slate-200"
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          Custom
                        </button>
                      </div>

                      {activeTestTab >= 0 && activeTestTab < problem.testCases.length && (
                        <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Input</span>
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono text-sm text-slate-700 break-all leading-relaxed shadow-sm">
                              {problem.testCases[activeTestTab].input}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Expected</span>
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono text-sm text-emerald-600 font-bold break-all leading-relaxed shadow-sm">
                              {problem.testCases[activeTestTab].expected}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTestTab === -1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Custom Input Expression</span>
                            <textarea
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              placeholder="e.g. twoSum([2,7,11,15], 9)"
                              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-sm text-slate-800 resize-none focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleRunCustom}
                              className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                              <Play className="w-3 h-3 text-primary" />
                              Run Custom
                            </button>
                          </div>
                          {customOutput && (
                            <div className="space-y-2 animate-in zoom-in duration-300">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Output</span>
                              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono text-sm text-emerald-600 font-bold break-all shadow-sm">
                                {customOutput}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {bottomTab === "result" && (
                    <div className="space-y-6">
                      {/* Compilation Error Card */}
                      {compilationError && (
                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl animate-in shake-1 duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Compilation Error</span>
                          </div>
                          <pre className="text-red-900/80 text-xs font-mono whitespace-pre-wrap leading-relaxed bg-white border border-red-100 p-4 rounded-xl shadow-sm">{compilationError}</pre>
                        </div>
                      )}

                      {/* AI Code Analysis - Glassmorphic Integration */}
                      {(isGroqAnalyzing || groqAnalysis) && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 overflow-hidden animate-in fade-in duration-500 shadow-sm">
                          <div className="px-5 py-3 bg-blue-100/50 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Brain className="w-4 h-4 text-blue-600" />
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Logic Audit</span>
                            </div>
                            {groqAnalysis && !isGroqAnalyzing && (
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10">
                                <span className="text-[9px] font-bold text-blue-600 uppercase">Efficiency Score</span>
                                <span className="text-xs font-black text-blue-600">{groqAnalysis.score}%</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6">
                            {isGroqAnalyzing ? (
                              <div className="space-y-3">
                                <div className="h-2 bg-blue-200 rounded-full animate-pulse w-3/4" />
                                <div className="h-2 bg-blue-200 rounded-full animate-pulse w-1/2" />
                              </div>
                            ) : groqAnalysis ? (
                              <div className="space-y-6">
                                <div>
                                  <p className="text-sm text-blue-900/70 leading-relaxed italic font-serif">
                                    "{groqAnalysis.analysis}"
                                  </p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-blue-50/50 shadow-sm">
                                  <h4 className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter mb-2">Architectural Suggestion</h4>
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {groqAnalysis.feedback}
                                  </p>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}

                      {/* Celebration Message */}
                      {allPassed && (
                        <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-700">
                          <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full animate-pulse" />
                            <div className="relative w-full h-full rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
                              <Trophy className="w-10 h-10 text-emerald-600 drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Challenge Conquered</h3>
                          <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed px-4 font-medium">
                            Your solution passed all test cases with optimal logical structure. Ready for the next one?
                          </p>
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => navigateProblem("next")}
                              className="px-8 py-3 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
                            >
                              Next Challenge
                            </button>
                            <button
                              onClick={() => navigate("/dashboard/coding")}
                              className="px-8 py-3 rounded-2xl bg-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                            >
                              View All
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Test Result Cards */}
                      {testResults.length > 0 && !compilationError && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full",
                                testResults.every(r => r.passed) ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                              )}>
                                {testResults.filter(r => r.passed).length}/{testResults.length} Cases Passed
                              </span>
                              <div className="w-1 h-1 rounded-full bg-white/10" />
                              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                Total Runtime: {Math.round(testResults.reduce((s, r) => s + r.time, 0))}ms
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {testResults.map((result, i) => (
                              <TestResultCard key={i} result={result} index={i} />
                            ))}
                          </div>
                        </div>
                      )}

                      {testResults.length === 0 && !compilationError && !isRunning && !isSubmitting && (
                        <div className="py-20 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 grayscale opacity-40">
                            <Terminal className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Awaiting Execution</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.6);
        }
      `}</style>
    </div>
  );
};

// Test Result Card Component
const TestResultCard = ({ result, index }: { result: TestResult; index: number }) => {
  const [expanded, setExpanded] = useState(!result.passed);

  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden transition-all",
        result.passed
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-red-500/20 bg-red-500/5"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          {result.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span className={cn("text-sm font-medium", result.passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            Test Case {index + 1}
          </span>
          <span className="text-xs text-muted-foreground/60">{result.time}ms</span>
        </div>
        {expanded ? (
          <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-muted-foreground/60" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-border/30 pt-3">
          <div>
            <span className="text-[10px] text-muted-foreground/80 uppercase tracking-wider font-semibold">Input</span>
            <div className="bg-muted/80 rounded-lg p-2 mt-1 font-mono text-xs text-muted-foreground break-all">
              {result.input}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground/80 uppercase tracking-wider font-semibold">Expected</span>
            <div className="bg-muted/80 rounded-lg p-2 mt-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all">
              {result.expected}
            </div>
          </div>
          {!result.passed && (
            <div>
              <span className="text-[10px] text-muted-foreground/80 uppercase tracking-wider font-semibold">Your Output</span>
              <div className="bg-muted/80 rounded-lg p-2 mt-1 font-mono text-xs text-red-600 dark:text-red-400 break-all">
                {result.error || result.actual || "(empty)"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingPractice;
