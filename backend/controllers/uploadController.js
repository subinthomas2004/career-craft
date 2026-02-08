import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const parseResume = async (req, res) => {
    console.log("📂 Upload Request Received");
    console.log("PDF Lib Type:", typeof pdf);
    console.log("PDF Lib Value:", pdf);
    console.log("File:", req.file);

    if (!req.file) {
        console.error("❌ No file received in request");
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    try {
        console.log("Processing file:", req.file.path);
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);

        // Clean up file immediately
        fs.unlinkSync(req.file.path);

        const rawText = data.text;

        // Use Groq to structure the data
        let structuredData = null;
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a resume parser. Extract the following fields from the resume text and return ONLY valid JSON. Fields: full_name (string), skills (array of strings), experience (array of objects with role, company, duration, summary), education (array of objects with degree, school, year). If not found, use empty strings/arrays. Do NOT add markdown blocks."
                    },
                    {
                        role: "user",
                        content: rawText.substring(0, 10000) // Limit context
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1, // Low temp for extraction
                response_format: { type: "json_object" }
            });
            structuredData = JSON.parse(completion.choices[0]?.message?.content || "{}");
        } catch (aiError) {
            console.error("AI Parsing failed, returning raw text only", aiError);
        }

        res.json({
            success: true,
            text: rawText,
            data: structuredData
        });

    } catch (error) {
        console.error("PDF Parsing Error:", error);
        // Ensure cleanup if fail
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, error: "Failed to process PDF: " + error.message });
    }
};
