import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Play, RotateCcw, Copy, Check, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LANGUAGES = [
    { id: "python", label: "Python 3" },
    { id: "javascript", label: "JavaScript" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "c", label: "C" },
    { id: "csharp", label: "C#" },
    { id: "sql", label: "SQL" },
    { id: "typescript", label: "TypeScript" },
    { id: "pseudocode", label: "Pseudocode (Logic Only)" },
];

interface CodeEditorPanelProps {
    defaultLanguage?: string;
    onRun?: (code: string, language: string) => void;
    onSubmit?: (code: string, language: string) => void;
    question?: string;
}

export default function CodeEditorPanel({ defaultLanguage = "python", onRun, onSubmit, question }: CodeEditorPanelProps) {
    const [language, setLanguage] = useState(defaultLanguage);

    // Parse question to restrict languages
    const getAllowedLanguages = () => {
        if (!question) return LANGUAGES;
        const q = question.toLowerCase();

        // Map keywords to language IDs
        const map: Record<string, string[]> = {
            "python": ["python"],
            "javascript": ["javascript", "typescript"],
            "java": ["java"],
            "c++": ["cpp"],
            "c#": ["csharp"],
            "sql": ["sql"],
            "typescript": ["typescript", "javascript"],
        };

        const allowedIds = new Set<string>();
        Object.keys(map).forEach(key => {
            if (q.includes(key)) {
                map[key].forEach(id => allowedIds.add(id));
            }
        });

        if (allowedIds.size > 0) {
            return LANGUAGES.filter(l => allowedIds.has(l.id));
        }
        return LANGUAGES;
    };

    const allowedLanguages = getAllowedLanguages();

    // Reset language if current is not allowed (unless empty allowed list)
    /* useEffect(() => {
       if (allowedLanguages.length > 0 && !allowedLanguages.find(l => l.id === language)) {
           setLanguage(allowedLanguages[0].id);
       }
    }, [question]); */

    const [code, setCode] = useState(`# Write your ${LANGUAGES.find(l => l.id === language)?.label} code here\n\ndef solve():\n    # Your solution\n    pass\n`);
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleLanguageChange = (value: string) => {
        setLanguage(value);

        let template = "";
        switch (value) {
            case 'python': template = `def solve():\n    print("Hello from Python!")\n\nsolve()`; break;
            case 'javascript': template = `console.log("Hello from JavaScript!");`; break;
            case 'java': template = `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`; break;
            case 'c': template = `#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}`; break;
            case 'cpp': template = `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`; break;
            case 'csharp': template = `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}`; break;
            case 'sql': template = `CREATE TABLE Users (id INT, name TEXT);\nINSERT INTO Users VALUES (1, 'Alice');\nSELECT * FROM Users;`; break;
            case 'typescript': template = `const greeting: string = "Hello from TypeScript!";\nconsole.log(greeting);`; break;
            case 'pseudocode': template = `FUNCTION Solve(arr):\n    FOR each item IN arr:\n        PRINT item\n    END FOR\nEND FUNCTION`; break;
            default: template = `// Write your code here`;
        }

        if (code.trim().length === 0 || code.includes("# Write your") || code.includes("def solve") || code.length < 60) {
            setCode(template);
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running code...\n");

        try {
            const response = await fetch("http://localhost:5003/api/code/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, code })
            });

            const data = await response.json();

            if (data.output) {
                setOutput(data.output);
            } else if (data.error) {
                setOutput(`Error: ${data.error}`);
            } else {
                setOutput("Execution completed with no output.");
            }

        } catch (error) {
            setOutput(`Error connecting to execution server:\n${error}`);
        } finally {
            setIsRunning(false);
            if (onRun) {
                onRun(code, language);
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success("Code copied to clipboard");
    };

    const handleReset = () => {
        setCode("");
        setOutput("");
    };

    // Simple line number generator
    const lineNumbers = code.split('\n').map((_, i) => i + 1);

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-white/10 text-gray-300 font-mono text-sm relative">

            {/* Context/Question Header */}
            {question && (
                <div className="bg-[#0e0e0e] border-b border-white/10 p-3 shrink-0">
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Current Task</div>
                    <div className="text-sm text-gray-200 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                        {question}
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black/40">
                <div className="flex items-center gap-3">
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[140px] h-8 bg-[#333333] border-none text-white hover:bg-[#3e3e3e] focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#252526] border-black/40 text-gray-300">
                            {allowedLanguages.map((lang) => (
                                <SelectItem key={lang.id} value={lang.id} className="focus:bg-[#094771] focus:text-white cursor-pointer">
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                        onClick={handleCopy}
                        title="Copy Code"
                    >
                        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                        onClick={handleReset}
                        title="Reset Code"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all gap-2"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        {isRunning ? "Running..." : "Run"}
                    </Button>
                    {onSubmit && (
                        <Button
                            size="sm"
                            onClick={() => onSubmit(code, language)}
                            disabled={isRunning || code.trim().length < 10}
                            className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all gap-2"
                            title="Submit code as your answer"
                        >
                            <ArrowRight className="w-3 h-3" />
                            Submit
                        </Button>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden relative flex">
                {/* Line Numbers */}
                <div className="w-12 bg-[#1e1e1e] border-r border-white/5 flex flex-col items-end pr-3 pt-4 text-gray-600 select-none font-mono">
                    {lineNumbers.map(num => (
                        <div key={num} className="h-6 leading-6">{num}</div>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-transparent text-gray-200 p-0 pl-3 pt-4 border-none outline-none resize-none font-mono leading-6 whitespace-pre"
                    spellCheck={false}
                    style={{ tabSize: 4 }}
                />
            </div>

            {/* Output Console (Bottom) */}
            <div className="h-1/3 min-h-[120px] bg-[#1e1e1e] border-t border-white/10 flex flex-col">
                <div className="flex items-center px-4 py-1.5 bg-[#252526] border-b border-black/40">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Console Output</span>
                </div>
                <ScrollArea className="flex-1 p-3 font-mono text-sm">
                    {output ? (
                        <pre className="text-gray-300 whitespace-pre-wrap font-inherit">{output}</pre>
                    ) : (
                        <span className="text-gray-600 italic">Run execution to see output...</span>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
