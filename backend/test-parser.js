import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const filePath = path.join(process.cwd(), 'uploads', 'resume-696c92719606cea251a1ff34-1773478612429.pdf');
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return;
    }
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const rawText = data.text;
    console.log("Raw text length:", rawText.length);
    console.log("First 200 chars:", rawText.substring(0, 200));

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
  "summary": "string - professional summary, objective, or profile section",
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
IMPORTANT:
1. Treat 'Profile', 'Objective', 'About Me', or any introductory text as 'summary'.
2. Treat 'Academic Projects', 'Personal Projects', or 'Other Projects' as 'projects'.
3. Extract ALL education details into 'education' (e.g., Btech, High School).
4. If a field is not found, leave it as an empty string or empty array. Do NOT wrap in a markdown block.`
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
        const structuredData = JSON.parse(completion.choices[0]?.message?.content || "{}");
        console.log("Parsed JSON:\n", JSON.stringify(structuredData, null, 2));
    } catch (err) {
        console.error("AI Parsing failed", err);
    }
}
main();
