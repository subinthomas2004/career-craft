import { useState, useEffect, useCallback, useRef } from "react";
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
    const result = await executeCode(code, language, sampleTests);

    setTestResults(result.results);
    setCompilationError(result.compilationError || null);
    setIsRunning(false);
  }, [problem, code, language, isRunning]);

  // Submit code (all test cases)
  const handleSubmit = useCallback(async () => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    setShowResults(true);
    setBottomTab("result");
    setCompilationError(null);

    const result = await executeCode(code, language, problem.testCases);

    setTestResults(result.results);
    setCompilationError(result.compilationError || null);
    setIsSubmitting(false);

    if (result.summary.passed === result.summary.total && result.summary.total > 0) {
      setAllPassed(true);
      setTimerRunning(false);
      const saved = localStorage.getItem("solvedProblems");
      const solved: number[] = saved ? JSON.parse(saved) : [];
      if (!solved.includes(problem.id)) {
        solved.push(problem.id);
        localStorage.setItem("solvedProblems", JSON.stringify(solved));
      }

      // Record Activity
      try {
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
              title: `Solved: ${problem.title}`,
              activityType: 'coding',
              score: 'Solved'
            })
          });
        }
      } catch (err) {
        console.error("Failed to record activity", err);
      }
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

  if (!problem) return null;

  const currentIdx = codingProblems.findIndex((p) => p.id === problem.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < codingProblems.length - 1;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-[#0f0f18] border-b border-gray-800/60 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/coding")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Problems</span>
          </button>
          <div className="w-px h-5 bg-gray-800" />
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">{problem.id}. {problem.title}</span>
            <span className={cn(
              "px-2 py-0.5 rounded-md text-xs font-semibold border",
              problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                  "bg-red-500/10 text-red-400 border-red-500/30"
            )}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Execution mode indicator */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            {execMode === "browser" ? (
              <>
                <Globe className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500/70">In-Browser</span>
              </>
            ) : (
              <>
                <Monitor className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500/70">Server</span>
              </>
            )}
          </div>
          <div className="w-px h-5 bg-gray-800" />
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateProblem("prev")}
              disabled={!hasPrev}
              className="p-1.5 rounded-lg hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => navigateProblem("next")}
              disabled={!hasNext}
              className="p-1.5 rounded-lg hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Resizable Panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={38} minSize={25}>
          <div className="h-full overflow-y-auto bg-[#0d0d15] p-6 custom-scrollbar">
            <div className="prose prose-invert prose-sm max-w-none">
              <h2 className="text-lg font-bold text-white mb-4">{problem.title}</h2>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                {problem.description}
              </div>

              {/* Examples */}
              <h3 className="text-sm font-semibold text-gray-200 mb-3">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="mb-4 bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Example {i + 1}:</p>
                  <div className="font-mono text-sm space-y-1">
                    <p><span className="text-gray-500">Input: </span><span className="text-cyan-400">{ex.input}</span></p>
                    <p><span className="text-gray-500">Output: </span><span className="text-emerald-400">{ex.output}</span></p>
                    {ex.explanation && (
                      <p className="text-gray-500 text-xs mt-2 italic">{ex.explanation}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Constraints */}
              <h3 className="text-sm font-semibold text-gray-200 mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-1 mb-6">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="text-gray-400 text-sm font-mono">{c}</li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {problem.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-gray-800/50 border border-gray-700/30 text-xs text-gray-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hints */}
              <div className="border-t border-gray-800/60 pt-5">
                <button
                  onClick={() => setHintLevel((l) => Math.min(l + 1, problem.hints.length - 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-all"
                >
                  <Lightbulb className="w-4 h-4" />
                  {hintLevel < 0 ? "Get Hint" : hintLevel < problem.hints.length - 1 ? "Next Hint" : "No More Hints"}
                </button>
                {hintLevel >= 0 && (
                  <div className="mt-3 space-y-2">
                    {problem.hints.slice(0, hintLevel + 1).map((hint, i) => (
                      <div key={i} className="flex gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-200/80">{hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-gray-800/40 hover:bg-emerald-500/30 transition-colors" />

        {/* Right Panel - Code Editor + Output */}
        <ResizablePanel defaultSize={62} minSize={35}>
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col bg-[#0d0d15]">
                {/* Editor Toolbar */}
                <div className="h-10 flex items-center justify-between px-3 border-b border-gray-800/60 bg-[#0f0f18] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-500">Code</span>
                    </div>
                    {/* 8-Language Selector */}
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
                      className={cn(
                        "px-2.5 py-1 bg-gray-800/50 border border-gray-700/40 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500/50 cursor-pointer",
                        langColors[language] || "text-gray-300"
                      )}
                    >
                      {ALL_LANGUAGES.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    {language === "python" && pyodideStatus === "loading" && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading Python...
                      </div>
                    )}
                    {language === "python" && pyodideStatus === "ready" && (
                      <span className="text-xs text-emerald-400">Python ready ✓</span>
                    )}
                    {execMode === "server" && (
                      <span className="text-xs text-blue-400/70 flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        Server execution
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-all"
                      title="Copy code"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-all"
                      title="Reset code"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 flex overflow-hidden relative">
                  {/* Line Numbers */}
                  <div
                    ref={lineNumbersRef}
                    className="w-12 bg-[#0a0a12] border-r border-gray-800/40 overflow-hidden select-none shrink-0"
                  >
                    <div className="py-4 px-2 text-right">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i} className="text-[11px] leading-[20px] text-gray-600 font-mono">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className="flex-1 w-full py-4 px-4 bg-transparent text-gray-200 font-mono text-sm leading-[20px] resize-none focus:outline-none placeholder-gray-700"
                    spellCheck={false}
                    placeholder="Write your solution here..."
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-gray-800/40 hover:bg-emerald-500/30 transition-colors" />

            {/* Bottom Panel - Test Cases & Results */}
            <ResizablePanel defaultSize={40} minSize={15}>
              <div className="h-full flex flex-col bg-[#0d0d15]">
                {/* Bottom Tabs & Actions */}
                <div className="h-10 flex items-center justify-between px-3 border-b border-gray-800/60 bg-[#0f0f18] shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setBottomTab("testcase")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        bottomTab === "testcase" ? "bg-gray-800/60 text-gray-200" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      Testcase
                    </button>
                    <button
                      onClick={() => setBottomTab("result")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        bottomTab === "result" ? "bg-gray-800/60 text-gray-200" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      Result
                      {testResults.length > 0 && (
                        <span className={cn(
                          "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                          testResults.every(r => r.passed) ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 border border-gray-600/40 text-gray-200 text-xs font-medium hover:bg-gray-700/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isRunning ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      Run
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isRunning || isSubmitting}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Submit
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {bottomTab === "testcase" && (
                    <div>
                      {/* Sample Test Case Tabs */}
                      <div className="flex items-center gap-2 mb-4">
                        {problem.testCases.slice(0, 3).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveTestTab(i)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                              activeTestTab === i
                                ? "bg-gray-700/50 text-gray-200 border border-gray-600/40"
                                : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                            )}
                          >
                            Case {i + 1}
                          </button>
                        ))}
                        <div className="w-px h-5 bg-gray-800" />
                        <button
                          onClick={() => setActiveTestTab(-1)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            activeTestTab === -1
                              ? "bg-gray-700/50 text-gray-200 border border-gray-600/40"
                              : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                          )}
                        >
                          Custom
                        </button>
                      </div>

                      {activeTestTab >= 0 && activeTestTab < problem.testCases.length && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Input:</label>
                            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 font-mono text-sm text-cyan-400">
                              {problem.testCases[activeTestTab].input}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Expected Output:</label>
                            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 font-mono text-sm text-emerald-400">
                              {problem.testCases[activeTestTab].expected}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTestTab === -1 && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Custom Input Expression:</label>
                            <textarea
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              placeholder="e.g. twoSum([2,7,11,15], 9)"
                              className="w-full h-20 bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 font-mono text-sm text-gray-200 resize-none focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                          <button
                            onClick={handleRunCustom}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-200 text-xs font-medium hover:bg-gray-700/70 transition-all"
                          >
                            <Play className="w-3 h-3" />
                            Run Custom
                          </button>
                          {customOutput && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Output:</label>
                              <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 font-mono text-sm text-emerald-400">
                                {customOutput}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {bottomTab === "result" && (
                    <div>
                      {/* All Passed Banner */}
                      {allPassed && (
                        <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-emerald-400 font-semibold">All Test Cases Passed! 🎉</p>
                            <p className="text-emerald-400/60 text-xs mt-0.5">Solved in {formatTime(timer)} using {ALL_LANGUAGES.find(l => l.id === language)?.label}</p>
                          </div>
                        </div>
                      )}

                      {/* Compilation Error */}
                      {compilationError && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm font-semibold">Compilation Error</span>
                          </div>
                          <pre className="text-red-300/80 text-xs font-mono whitespace-pre-wrap">{compilationError}</pre>
                        </div>
                      )}

                      {/* Test Results */}
                      {testResults.length > 0 && !compilationError && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className={cn(
                              "text-sm font-semibold",
                              testResults.every(r => r.passed) ? "text-emerald-400" : "text-red-400"
                            )}>
                              {testResults.filter(r => r.passed).length}/{testResults.length} test cases passed
                            </span>
                            <span className="text-xs text-gray-600">
                              Runtime: {Math.round(testResults.reduce((s, r) => s + r.time, 0))}ms
                            </span>
                          </div>
                          <div className="space-y-2">
                            {testResults.map((result, i) => (
                              <TestResultCard key={i} result={result} index={i} />
                            ))}
                          </div>
                        </div>
                      )}

                      {testResults.length === 0 && !compilationError && (
                        <div className="text-center py-12">
                          <Terminal className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                          <p className="text-gray-600 text-sm">Run or submit your code to see results</p>
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
          background: #2d2d3f;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d3d5f;
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span className={cn("text-sm font-medium", result.passed ? "text-emerald-400" : "text-red-400")}>
            Test Case {index + 1}
          </span>
          <span className="text-xs text-gray-600">{result.time}ms</span>
        </div>
        {expanded ? (
          <EyeOff className="w-3.5 h-3.5 text-gray-600" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-gray-600" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-gray-800/30 pt-3">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Input</span>
            <div className="bg-gray-900/50 rounded-lg p-2 mt-1 font-mono text-xs text-gray-300 break-all">
              {result.input}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Expected</span>
            <div className="bg-gray-900/50 rounded-lg p-2 mt-1 font-mono text-xs text-emerald-400 break-all">
              {result.expected}
            </div>
          </div>
          {!result.passed && (
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Your Output</span>
              <div className="bg-gray-900/50 rounded-lg p-2 mt-1 font-mono text-xs text-red-400 break-all">
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
