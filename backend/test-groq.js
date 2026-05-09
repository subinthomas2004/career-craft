import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Return JSON: {\"hello\":\"world\"}"
                },
                {
                    role: "user",
                    content: "test"
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });
        console.log("Success:", completion.choices[0]?.message?.content);
    } catch (err) {
        console.error("Error:", err);
    }
}
main();
