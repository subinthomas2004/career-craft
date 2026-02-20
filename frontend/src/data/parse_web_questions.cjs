
const fs = require('fs');

const rawText = fs.readFileSync('web_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // Frontend Basics
    if (qLower.includes('html') || qLower.includes('tag') || qLower.includes('semantic') || qLower.includes('attribute') || qLower.includes('dom') || qLower.includes('doctype')) return 'HTML';
    if (qLower.includes('css') || qLower.includes('style') || qLower.includes('color') || qLower.includes('flexbox') || qLower.includes('grid') || qLower.includes('responsive') || qLower.includes('media query') || qLower.includes('bootstrap')) return 'CSS/Styling';
    if (qLower.includes('javascript') || qLower.includes('script') || qLower.includes('variable') || qLower.includes('let') || qLower.includes('const') || qLower.includes('function') || qLower.includes('array') || qLower.includes('object') || qLower.includes('promise') || qLower.includes('async')) return 'JavaScript';

    // Frameworks & Libs
    if (qLower.includes('react') || qLower.includes('angular') || qLower.includes('vue') || qLower.includes('component') || qLower.includes('props') || qLower.includes('state') || qLower.includes('hook') || qLower.includes('jsx') || qLower.includes('virtual dom')) return 'Frontend Frameworks';

    // Backend & API
    if (qLower.includes('node') || qLower.includes('express') || qLower.includes('server') || qLower.includes('api') || qLower.includes('rest') || qLower.includes('http') || qLower.includes('get') || qLower.includes('post') || qLower.includes('put') || qLower.includes('delete') || qLower.includes('json') || qLower.includes('xml') || qLower.includes('ajax') || qLower.includes('fetch') || qLower.includes('graphql')) return 'Backend & APIs';

    // Data & Storage
    if (qLower.includes('database') || qLower.includes('sql') || qLower.includes('mongodb') || qLower.includes('cookie') || qLower.includes('localstorage') || qLower.includes('session') || qLower.includes('cache') || qLower.includes('store')) return 'Data & Storage';

    // Security & DevOps
    if (qLower.includes('security') || qLower.includes('auth') || qLower.includes('token') || qLower.includes('jwt') || qLower.includes('cors') || qLower.includes('xss') || qLower.includes('csrf') || qLower.includes('encrypt') || qLower.includes('https') || qLower.includes('ssl') || qLower.includes('deployment') || qLower.includes('git') || qLower.includes('docker') || qLower.includes('ci/cd')) return 'Security & DevOps';

    // Concepts & Architecture
    if (qLower.includes('mvc') || qLower.includes('spa') || qLower.includes('pwa') || qLower.includes('seo') || qLower.includes('performance') || qLower.includes('accessibility') || qLower.includes('browser') || qLower.includes('network') || qLower.includes('dns') || qLower.includes('url')) return 'Web Concepts';

    return 'General Web Dev';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Simple checks
    if (qLower.includes('html') && qLower.length < 50) return 'Easy';
    if (qLower.includes('stand for') || qLower.includes('what is the')) return "Easy";

    // Complex topics
    if (qLower.includes('cors') || qLower.includes('jwt') || qLower.includes('csrf') || qLower.includes('xss') || qLower.includes('graphql') || qLower.includes('microservices') || qLower.includes('docker') || qLower.includes('hydration') || qLower.includes('tree shaking')) return 'Hard';

    const combined = (question + explanation).length;
    if (combined < 100) return "Easy";
    if (combined > 250) return "Hard";
    return "Medium";
}

blocks.forEach(block => {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 5) return;

    // Extract Question
    const questionLine = lines[0];
    const idMatch = questionLine.match(/^(\d+)\.\s+(.*)/);
    if (!idMatch) return;

    const id = parseInt(idMatch[1]);
    const questionText = idMatch[2];

    // Extract Options
    const options = [];
    let correctIndex = -1;
    let explanation = "";

    // Find options
    lines.forEach(line => {
        const optMatch = line.match(/^([A-D])\.\s+(.*)/);
        if (optMatch) {
            options.push(optMatch[2]);
        }

        if (line.startsWith("Answer:")) {
            const letter = line.split(":")[1].trim();
            correctIndex = letter.charCodeAt(0) - 65;
        }

        if (line.startsWith("Why:")) {
            explanation = line.substring(4).trim();
        }
    });

    if (options.length === 4 && correctIndex !== -1) {
        questions.push({
            id: id,
            question: questionText,
            options: options,
            correct: correctIndex,
            explanation: explanation,
            difficulty: inferDifficulty(questionText, explanation),
            topic: inferTopic(questionText)
        });
    }
});

// Output
if (questions.length > 0) {
    fs.writeFileSync('web_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to web_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
