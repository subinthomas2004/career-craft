import axios from 'axios';

export const chat = async (req, res) => {
    const { message, model } = req.body;
    const ollamaModel = model || 'llama3.2:1b';

    try {
        const response = await axios.post('http://127.0.0.1:11434/api/generate', {
            model: ollamaModel,
            prompt: message,
            stream: false
        });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error('Error connecting to Ollama:', error.message);
        if (error.response) {
            console.error('Ollama Error Response:', error.response.data);
            res.status(500).json({ error: 'Ollama API Error', details: error.response.data });
        } else {
            res.status(500).json({ error: 'Failed to connect to Ollama', details: error.message });
        }
    }
};

// Fallback questions to ensure the feature works even if AI fails
const FALLBACK_QUESTIONS = {
    "default": [
        {
            "question": "What comes next in the sequence: 2, 6, 12, 20, 30, ...?",
            "options": ["42", "40", "38", "44"],
            "correct": 0,
            "explanation": "The pattern is n(n+1). 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, so next is 6*7=42."
        },
        {
            "question": "If A can do a work in 10 days and B in 15 days, how long will they take together?",
            "options": ["5 days", "6 days", "8 days", "9 days"],
            "correct": 1,
            "explanation": "1/10 + 1/15 = 5/30 = 1/6. So 6 days."
        },
        {
            "question": "A train 240m long passes a pole in 24 seconds. How long will it take to pass a platform 650m long?",
            "options": ["65 sec", "89 sec", "100 sec", "150 sec"],
            "correct": 1,
            "explanation": "Speed = 240/24 = 10 m/s. Total distance = 240 + 650 = 890m. Time = 890/10 = 89 seconds."
        },
        {
            "question": "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
            "options": ["His own", "His son", "His father", "His nephew"],
            "correct": 1,
            "explanation": "Since he has no siblings, 'my father's son' is himself. So 'that man's father is ME'. Thus, it's his son."
        },
        {
            "question": "A shopkeeper sells an article at a loss of 12.5%. Had he sold it for $51.80 more, he would have earned a profit of 6%. The cost price of the article is:",
            "options": ["$280", "$300", "$380", "$400"],
            "correct": 0,
            "explanation": "Difference in percentage = 6 - (-12.5) = 18.5%. 18.5% of CP = 51.8. CP = 51.8 / 0.185 = 280."
        }
    ]
};

const getBackupQuestions = (topic, count) => {
    return FALLBACK_QUESTIONS["default"].slice(0, count);
};

export const generateQuiz = async (req, res) => {
    const { topic, difficulty, count } = req.body;
    const model = 'llama3.2:1b';

    const prompt = `Generate ${count} multiple-choice aptitude questions on "${topic}" (${difficulty}).
    Return ONLY a JSON array. DO NOT include any text before or after the JSON.
    Format: [{"question": "...", "options": ["A","B","C","D"], "correct": 0, "explanation": "..."}]`;

    try {
        console.log(`Generating quiz for ${topic}...`);
        const response = await axios.post('http://127.0.0.1:11434/api/generate', {
            model: model,
            prompt: prompt,
            stream: false,
            format: "json",
            options: {
                temperature: 0.7
            }
        });

        let data = response.data.response;
        let quiz = [];

        // Robust JSON extraction
        const jsonMatch = data.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            try {
                quiz = JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.error("JSON parse failed, using fallback");
            }
        }

        // Validate quiz structure
        const isValid = Array.isArray(quiz) && quiz.length > 0 && quiz.every(q => q.question && Array.isArray(q.options) && typeof q.correct === 'number');

        if (!isValid) {
            console.warn("AI generated invalid quiz, using fallback data.");
            quiz = getBackupQuestions(topic, count);
        }

        res.json({ quiz });

    } catch (error) {
        console.error('Error generating quiz:', error.message);
        // Fallback on error too
        const fallbackQuiz = getBackupQuestions(topic, count);
        res.json({ quiz: fallbackQuiz });
    }
};

export const checkConnection = async (req, res) => {
    try {
        await axios.get('http://127.0.0.1:11434/');
        res.status(200).json({ status: 'connected', message: 'Ollama is running' });
    } catch (error) {
        res.status(503).json({ status: 'disconnected', message: 'Ollama is not reachable' });
    }
};
