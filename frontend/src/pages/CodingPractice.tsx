import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Play, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Clock,
  Trophy,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
    ],
    starterCode: `function twoSum(nums, target) {
  // Your code here
  
}`
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    testCases: [],
    starterCode: `function reverseString(s) {
  // Your code here
  
}`
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Medium",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
    ],
    testCases: [],
    starterCode: `function isValid(s) {
  // Your code here
  
}`
  },
];

const CodingPractice = () => {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [code, setCode] = useState(selectedProblem.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{passed: boolean; message: string}[]>([]);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    setTestResults([]);

    // Simulate code execution
    setTimeout(() => {
      setOutput([
        "> Running test cases...",
        "> Test 1: [2,7,11,15], target = 9",
        "> Output: [0,1]",
        "> Expected: [0,1]",
        "> Result: PASSED ✓",
        "",
        "> Test 2: [3,2,4], target = 6",
        "> Output: [1,2]",
        "> Expected: [1,2]",
        "> Result: PASSED ✓",
        "",
        "> All test cases passed!"
      ]);
      setTestResults([
        { passed: true, message: "Test 1 passed" },
        { passed: true, message: "Test 2 passed" },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Code className="w-5 h-5 text-primary" />
          <select 
            className="bg-transparent border-none text-foreground font-medium focus:outline-none cursor-pointer"
            value={selectedProblem.id}
            onChange={(e) => {
              const problem = problems.find(p => p.id === Number(e.target.value));
              if (problem) {
                setSelectedProblem(problem);
                setCode(problem.starterCode);
                setOutput([]);
                setTestResults([]);
              }
            }}
          >
            {problems.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}. {p.title}
              </option>
            ))}
          </select>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            selectedProblem.difficulty === "Easy" ? "bg-green-100 text-green-700" :
            selectedProblem.difficulty === "Medium" ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          )}>
            {selectedProblem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Lightbulb className="w-4 h-4 mr-1" />
            Hint
          </Button>
          <Button size="sm" onClick={runCode} disabled={isRunning}>
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/3 border-r border-border overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-foreground mb-4">
            {selectedProblem.id}. {selectedProblem.title}
          </h1>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground mb-6">{selectedProblem.description}</p>
            
            <h3 className="text-sm font-semibold text-foreground mb-2">Examples:</h3>
            {selectedProblem.examples.map((example, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4 mb-4 font-mono text-sm">
                <p className="text-muted-foreground mb-1">Input: {example.input}</p>
                <p className="text-foreground">Output: {example.output}</p>
              </div>
            ))}
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Test Results:</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg",
                      result.passed 
                        ? "bg-green-50 dark:bg-green-950/30" 
                        : "bg-red-50 dark:bg-red-950/30"
                    )}
                  >
                    {result.passed 
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className={cn(
                      "text-sm",
                      result.passed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                    )}>
                      {result.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 w-fit">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="flex-1 p-4">
              <div className="h-full bg-foreground/5 rounded-lg overflow-hidden">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 bg-transparent font-mono text-sm text-foreground resize-none focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 p-4">
              <div className="h-full bg-foreground/5 rounded-lg p-4 font-mono text-sm overflow-auto">
                {output.length > 0 ? (
                  output.map((line, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        line.includes("PASSED") ? "text-green-500" :
                        line.includes("FAILED") ? "text-red-500" :
                        "text-foreground"
                      )}
                    >
                      {line || "\u00A0"}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Run your code to see output...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Problems List Sidebar */}
      <div className="hidden lg:block w-64 border-l border-border bg-card overflow-y-auto fixed right-0 top-16 bottom-0">
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Problems</h3>
          <div className="space-y-2">
            {problems.map(problem => (
              <button
                key={problem.id}
                onClick={() => {
                  setSelectedProblem(problem);
                  setCode(problem.starterCode);
                  setOutput([]);
                  setTestResults([]);
                }}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-colors",
                  selectedProblem.id === problem.id
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {problem.id}. {problem.title}
                  </span>
                </div>
                <span className={cn(
                  "text-xs",
                  problem.difficulty === "Easy" ? "text-green-600" :
                  problem.difficulty === "Medium" ? "text-amber-600" :
                  "text-red-600"
                )}>
                  {problem.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
