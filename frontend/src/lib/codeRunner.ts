// In-browser code execution engine
// JavaScript: Sandboxed eval in-browser
// Python: Pyodide (WebAssembly) in-browser
// Java, C, C++, C#, TypeScript, SQL: Backend API at /api/code/execute

import { api } from "@/lib/api";

export interface TestResult {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
    time: number; // ms
}

export interface ExecutionResult {
    results: TestResult[];
    summary: { total: number; passed: number; failed: number };
    compilationError?: string;
}

export const SUPPORTED_LANGUAGES = [
    { id: "javascript", label: "JavaScript", icon: "JS" },
    { id: "python", label: "Python", icon: "PY" },
    { id: "java", label: "Java", icon: "JV" },
    { id: "cpp", label: "C++", icon: "C+" },
    { id: "c", label: "C", icon: "C" },
    { id: "csharp", label: "C#", icon: "C#" },
    { id: "typescript", label: "TypeScript", icon: "TS" },
    { id: "sql", label: "SQL", icon: "SQ" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["id"];

// ==================== JAVASCRIPT EXECUTION (In-Browser) ====================

function runJavaScriptTests(
    code: string,
    testCases: { input: string; expected: string }[]
): Promise<ExecutionResult> {
    return new Promise((resolve) => {
        const results: TestResult[] = [];
        let compilationError: string | undefined;

        for (const tc of testCases) {
            const startTime = performance.now();
            try {
                const fn = new Function(`
          "use strict";
          ${code}
          return String(${tc.input});
        `);
                const actual = fn();
                const elapsed = performance.now() - startTime;
                const normalizedActual = String(actual).trim();
                const normalizedExpected = String(tc.expected).trim();

                results.push({
                    passed: normalizedActual === normalizedExpected,
                    input: tc.input,
                    expected: tc.expected,
                    actual: normalizedActual,
                    time: Math.round(elapsed * 100) / 100,
                });
            } catch (err: unknown) {
                const elapsed = performance.now() - startTime;
                const errorMsg = err instanceof Error ? err.message : String(err);

                if (err instanceof SyntaxError) {
                    compilationError = `SyntaxError: ${errorMsg}`;
                    results.push({
                        passed: false, input: tc.input, expected: tc.expected,
                        actual: "", error: compilationError, time: Math.round(elapsed * 100) / 100,
                    });
                    for (let i = results.length; i < testCases.length; i++) {
                        results.push({
                            passed: false, input: testCases[i].input, expected: testCases[i].expected,
                            actual: "", error: compilationError, time: 0,
                        });
                    }
                    break;
                }

                results.push({
                    passed: false, input: tc.input, expected: tc.expected,
                    actual: "", error: errorMsg, time: Math.round(elapsed * 100) / 100,
                });
            }
        }

        const passed = results.filter((r) => r.passed).length;
        resolve({
            results,
            summary: { total: results.length, passed, failed: results.length - passed },
            compilationError,
        });
    });
}

// ==================== PYTHON EXECUTION (Pyodide WebAssembly) ====================

let pyodideInstance: unknown = null;
let pyodideLoading: Promise<unknown> | null = null;

async function loadPyodide(): Promise<unknown> {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoading) return pyodideLoading;

    pyodideLoading = new Promise(async (resolve, reject) => {
        try {
            if (!(window as Record<string, unknown>).loadPyodide) {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
                script.onload = async () => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const pyodide = await (window as any).loadPyodide({
                            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
                        });
                        pyodideInstance = pyodide;
                        resolve(pyodide);
                    } catch (e) { reject(e); }
                };
                script.onerror = () => reject(new Error("Failed to load Pyodide CDN"));
                document.head.appendChild(script);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pyodide = await (window as any).loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
                });
                pyodideInstance = pyodide;
                resolve(pyodide);
            }
        } catch (e) { reject(e); }
    });

    return pyodideLoading;
}

async function runPythonTests(
    code: string,
    testCases: { input: string; expected: string }[]
): Promise<ExecutionResult> {
    const results: TestResult[] = [];
    let compilationError: string | undefined;

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pyodide = (await loadPyodide()) as any;

        try {
            pyodide.runPython(code);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            compilationError = errorMsg;
            for (const tc of testCases) {
                results.push({ passed: false, input: tc.input, expected: tc.expected, actual: "", error: compilationError, time: 0 });
            }
            return { results, summary: { total: results.length, passed: 0, failed: results.length }, compilationError };
        }

        for (const tc of testCases) {
            const startTime = performance.now();
            try {
                const pythonTestExpr = convertJsToPythonTestExpr(tc.input.trim());
                const result = pyodide.runPython(`str(${pythonTestExpr})`);
                const elapsed = performance.now() - startTime;
                const normalizedActual = normalizePythonOutput(String(result).trim());
                const normalizedExpected = normalizePythonOutput(String(tc.expected).trim());

                results.push({
                    passed: normalizedActual === normalizedExpected,
                    input: tc.input, expected: tc.expected,
                    actual: String(result).trim(), time: Math.round(elapsed * 100) / 100,
                });
            } catch (err: unknown) {
                const elapsed = performance.now() - startTime;
                const errorMsg = err instanceof Error ? err.message : String(err);
                results.push({ passed: false, input: tc.input, expected: tc.expected, actual: "", error: errorMsg, time: Math.round(elapsed * 100) / 100 });
            }
        }
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        compilationError = `Failed to load Python runtime: ${errorMsg}`;
        for (const tc of testCases) {
            results.push({ passed: false, input: tc.input, expected: tc.expected, actual: "", error: compilationError, time: 0 });
        }
    }

    const passed = results.filter((r) => r.passed).length;
    return { results, summary: { total: results.length, passed, failed: results.length - passed }, compilationError };
}

function convertJsToPythonTestExpr(jsExpr: string): string {
    let expr = jsExpr;
    if (expr.startsWith("JSON.stringify(")) {
        expr = expr.replace(/^JSON\.stringify\(/, "").replace(/\)$/, "");
    }

    if (expr.startsWith("(() =>")) {
        expr = expr.replace(/^\(\(\) => \{/, "").replace(/\}\)\(\)$/, "")
            .replace(/const /g, "").replace(/let /g, "").replace(/;/g, "")
            .replace(/new MinStack\(\)/g, "MinStack()")
            .replace(/(\w+)\.push\(/g, "$1.push(")
            .replace(/(\w+)\.pop\(\)/g, "$1.pop()")
            .replace(/(\w+)\.top\(\)/g, "$1.top()")
            .replace(/(\w+)\.getMin\(\)/g, "$1.getMin()");
        const lines = expr.trim().split("\n").map((l: string) => l.trim()).filter((l: string) => l);
        const lastReturn = lines.findIndex((l: string) => l.startsWith("return "));
        if (lastReturn >= 0) {
            const retExpr = lines[lastReturn].replace("return ", "");
            lines[lastReturn] = `__result__ = ${retExpr}`;
        }
        return `(lambda: (exec("""${lines.join("\\n")}"""), __result__))()`;
    }

    return expr;
}

function normalizePythonOutput(output: string): string {
    return output
        .replace(/True/g, "true")
        .replace(/False/g, "false")
        .replace(/None/g, "null")
        .replace(/'/g, '"')
        .replace(/\s+/g, "");
}

// ==================== BACKEND API EXECUTION (C, C++, Java, C#, TS, SQL) ====================

// const BACKEND_URL = "http://localhost:5003/api/code";

async function runBackendTests(
    code: string,
    language: string,
    testCases: { input: string; expected: string }[]
): Promise<ExecutionResult> {
    const results: TestResult[] = [];
    let compilationError: string | undefined;

    // For backend languages, we wrap the code with test harness
    for (const tc of testCases) {
        const startTime = performance.now();
        try {
            const wrappedCode = wrapCodeForBackend(code, language, tc.input);

            // const response = await fetch(`${BACKEND_URL}/execute`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ language, code: wrappedCode }),
            // });
            const response = await api.post('/code/execute', { language, code: wrappedCode });

            const data = response.data;
            const elapsed = performance.now() - startTime;

            if (data.error) {
                compilationError = data.error;
                results.push({ passed: false, input: tc.input, expected: tc.expected, actual: "", error: data.error, time: Math.round(elapsed * 100) / 100 });
                continue;
            }

            const output = String(data.output || "").trim();

            // Check for compilation/runtime errors in output
            if (output.startsWith("Error:") || output.includes("error:") || output.includes("Exception")) {
                if (!compilationError) compilationError = output;
                results.push({ passed: false, input: tc.input, expected: tc.expected, actual: output, error: output, time: Math.round(elapsed * 100) / 100 });
                continue;
            }

            const normalizedActual = output.replace(/\s+/g, "");
            const normalizedExpected = String(tc.expected).trim().replace(/\s+/g, "");

            results.push({
                passed: normalizedActual === normalizedExpected,
                input: tc.input, expected: tc.expected,
                actual: output, time: Math.round(elapsed * 100) / 100,
            });
        } catch (err: unknown) {
            const elapsed = performance.now() - startTime;
            const errorMsg = err instanceof Error ? err.message : String(err);
            results.push({ passed: false, input: tc.input, expected: tc.expected, actual: "", error: `Network Error: ${errorMsg}`, time: Math.round(elapsed * 100) / 100 });
        }
    }

    const passed = results.filter((r) => r.passed).length;
    return { results, summary: { total: results.length, passed, failed: results.length - passed }, compilationError };
}

function wrapCodeForBackend(code: string, language: string, testExpr: string): string {
    // The code already contains the function, we just need to add a print/console.log call
    switch (language) {
        case "java":
            // For Java, the user writes the solution method, we wrap in a class
            return `${code}
// Auto-generated test runner
class Main {
  public static void main(String[] args) {
    Solution sol = new Solution();
    System.out.println(${testExpr});
  }
}`;
        case "c":
        case "cpp":
            return `${code}
// Auto-generated test runner
#include <stdio.h>
int main() {
  printf("%s", ${testExpr});
  return 0;
}`;
        case "typescript":
            return `${code}\nconsole.log(String(${testExpr}));`;
        case "csharp":
            return code; // C# typically includes Main
        case "sql":
            return code; // SQL runs directly
        default:
            return `${code}\nconsole.log(String(${testExpr}));`;
    }
}

// ==================== MAIN EXPORT ====================

export async function executeCode(
    code: string,
    language: string,
    testCases: { input: string; expected: string }[]
): Promise<ExecutionResult> {
    switch (language) {
        case "javascript":
            return runJavaScriptTests(code, testCases);
        case "python":
            return runPythonTests(code, testCases);
        case "java":
        case "c":
        case "cpp":
        case "csharp":
        case "typescript":
        case "sql":
            return runBackendTests(code, language, testCases);
        default:
            return {
                results: [],
                summary: { total: 0, passed: 0, failed: 0 },
                compilationError: `Language "${language}" is not supported.`,
            };
    }
}

export function isPyodideLoaded(): boolean {
    return pyodideInstance !== null;
}

export async function preloadPyodide(): Promise<void> {
    try { await loadPyodide(); } catch { /* retry on use */ }
}

// Returns how the language runs
export function getExecutionMode(language: string): "browser" | "server" {
    return language === "javascript" || language === "python" ? "browser" : "server";
}
