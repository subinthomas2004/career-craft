const axios = require('axios');
const prompt = `
Analyze the following debate transcript.
Topic: "AI will replace doctors"
User Stance: For

Transcript:
User: I think AI will replace doctors soon.

Evaluate the "User" performance based on:
1. Speech Clarity
2. Confidence
3. Logical Reasoning
4. Relevance to Topic
5. Persuasiveness
6. Filler words usage (estimate count based on text like 'um', 'uh', 'like')

Return ONLY a valid JSON object with this exact structure:
{
    "overallScore": 85,
    "metrics": {
        "clarity": 85,
        "confidence": 85,
        "reasoning": 85,
        "relevance": 85,
        "persuasiveness": 85
    },
    "feedback": {
        "strengths": ["string", "string"],
        "weaknesses": ["string", "string"],
        "suggestions": ["string", "string"]
    },
    "fillerWordsCount": 0
}
            `;
axios.post('http://localhost:5001/api/groq/debate/evaluate', { message: prompt })
.then(res => {
    console.log('Response string:', res.data.response);
    const jsonStr = res.data.response;
    const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);
    console.log('Parsed successfully:', !!data);
})
.catch(err => {
    console.error('Error:', err.message);
});
