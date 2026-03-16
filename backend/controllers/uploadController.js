import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pdf;
try {
    pdf = require('pdf-parse');
} catch (e) {
    console.warn('Could not load pdf-parse:', e.message);
    pdf = null;
}
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
        console.log("Processing file from in-memory buffer");
        const dataBuffer = req.file.buffer;
        const data = await pdf(dataBuffer);

        const rawText = data.text;

        // Use Groq to structure the data
        let structuredData = null;
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert resume parser. Extract the resume text and return ONLY valid JSON exactly matching this structure:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "links": ["string - LinkedIn, GitHub, Portfolio URLs"],
  "summary": "string - professional summary",
  "skills": ["string", "string"],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "duration": "string",
      "summary": ["string", "string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "year": "string"
    }
  ],
  "certifications": ["string"],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "year": "string",
      "score": "string - CGPA/Percentage"
    }
  ]
}
If a field is not found, leave it as an empty string or empty array. Do NOT wrap in markdown block.`
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
        res.status(500).json({ success: false, error: "Failed to process PDF: " + error.message });
    }
};

export const parseProfileResume = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.resumeUrl) {
            return res.status(404).json({ success: false, error: "please upload the resume in profile" });
        }

        const __dirname = path.resolve();
        const filePath = path.join(__dirname, user.resumeUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: "Resume file not found on server. Please re-upload your resume." });
        }

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const rawText = data.text;

        // Use Groq to structure the data (same logic as parseResume)
        let structuredData = null;
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert resume parser. Extract the resume text and return ONLY valid JSON exactly matching this structure:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "links": ["string - LinkedIn, GitHub, Portfolio URLs"],
  "summary": "string - professional summary",
  "skills": ["string", "string"],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "duration": "string",
      "summary": ["string", "string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "year": "string"
    }
  ],
  "certifications": ["string"],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "year": "string",
      "score": "string - CGPA/Percentage"
    }
  ]
}
If a field is not found, leave it as an empty string or empty array. Do NOT wrap in markdown block.`
                    },
                    {
                        role: "user",
                        content: rawText.substring(0, 10000)
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                response_format: { type: "json_object" }
            });
            structuredData = JSON.parse(completion.choices[0]?.message?.content || "{}");
        } catch (aiError) {
            console.error("AI Parsing failed", aiError);
        }

        res.json({
            success: true,
            text: rawText,
            data: structuredData
        });

    } catch (error) {
        console.error("Profile Resume Parsing Error:", error);
        res.status(500).json({ success: false, error: "Failed to process profile resume: " + error.message });
    }
};
