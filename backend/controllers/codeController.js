import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, '../temp');

// Ensure temp directory exists (wrapped for Vercel compatibility)
try {
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
} catch (e) {
    console.warn('Could not create temp directory (expected on Vercel):', e.message);
}

export const executeCode = async (req, res) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    const timestamp = Date.now();
    let fileName, command;

    try {
        switch (language) {
            case 'python':
                fileName = `script_${timestamp}.py`;
                command = `python3 "${path.join(tempDir, fileName)}"`;
                break;
            case 'javascript':
                fileName = `script_${timestamp}.js`;
                command = `node "${path.join(tempDir, fileName)}"`;
                break;
            case 'typescript':
                fileName = `script_${timestamp}.ts`;
                // Requires: npm install -g ts-node typescript
                command = `npx ts-node "${path.join(tempDir, fileName)}"`;
                break;
            case 'c':
                fileName = `program_${timestamp}.c`;
                const outC = path.join(tempDir, `program_${timestamp}.out`);
                // Requires: gcc
                command = `gcc "${path.join(tempDir, fileName)}" -o "${outC}" && "${outC}"`;
                break;
            case 'cpp':
                fileName = `program_${timestamp}.cpp`;
                const outCpp = path.join(tempDir, `program_${timestamp}.out`);
                // Requires: g++
                command = `g++ "${path.join(tempDir, fileName)}" -o "${outCpp}" && "${outCpp}"`;
                break;
            case 'java':
                // Java: Main.java in unique subdir
                const javaDir = path.join(tempDir, `java_${timestamp}`);
                if (!fs.existsSync(javaDir)) fs.mkdirSync(javaDir);

                fileName = `Main.java`;
                const fullJavaPath = path.join(javaDir, fileName);
                fs.writeFileSync(fullJavaPath, code);

                // Requires: javac, java
                command = `javac "${fullJavaPath}" && java -cp "${javaDir}" Main`;
                break;
            case 'csharp':
                fileName = `program_${timestamp}.cs`;
                const outCs = path.join(tempDir, `program_${timestamp}.exe`);
                // Using 'mcs' (Mono Compiler)
                command = `mcs -out:"${outCs}" "${path.join(tempDir, fileName)}" && mono "${outCs}"`;
                break;
            case 'sql':
                fileName = `script_${timestamp}.sql`;
                // Requires: sqlite3
                command = `sqlite3 :memory: < "${path.join(tempDir, fileName)}"`;
                break;
            case 'pseudocode':
                return res.json({ output: "Pseudocode Logic Analysis:\n\n> Syntax Check: N/A (Logic Only)\n> Structure: Good\n> Complexity: O(n)\n\n(This is a logic-only mode, no actual execution happened)." });
            default:
                return res.json({ output: `Execution for ${language} is not yet supported.` });
        }

        // Write file (except for Java which was handled specially above)
        let filePath;
        if (language !== 'java') {
            filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, code);
        } else {
            filePath = path.join(tempDir, `java_${timestamp}`, `Main.java`);
        }

        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            // Cleanup logic (same as before)
            try {
                if (language === 'java') {
                    const javaDir = path.join(tempDir, `java_${timestamp}`);
                    if (fs.existsSync(javaDir)) fs.rmSync(javaDir, { recursive: true, force: true });
                } else {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    if (['c', 'cpp'].includes(language)) {
                        const binary = path.join(tempDir, `program_${timestamp}.out`);
                        if (fs.existsSync(binary)) fs.unlinkSync(binary);
                    }
                    if (language === 'csharp') {
                        const binary = path.join(tempDir, `program_${timestamp}.exe`);
                        if (fs.existsSync(binary)) fs.unlinkSync(binary);
                    }
                }
            } catch (cleanupErr) {
                console.error("Cleanup error:", cleanupErr);
            }

            if (error) {
                if (error.killed) return res.json({ output: "Error: Execution Timed Out (10s limit)" });

                // Check for "Command not found" (code 127)
                if (error.code === 127) {
                    return res.json({ output: `Error: Compiler/Interpreter not found on server.\n\nCommand failed: ${command}\n\nPlease ensure the language runtime is installed.` });
                }

                return res.json({ output: stderr || error.message });
            }
            res.json({ output: stdout || stderr || "Executed successfully." });
        });

    } catch (err) {
        console.error("Execution error:", err);
        res.status(500).json({ error: "Internal Server Error during execution" });
    }
};
