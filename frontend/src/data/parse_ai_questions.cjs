
const fs = require('fs');

const rawText = fs.readFileSync('ai_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // Machine Learning
    if (qLower.includes('machine learning') || qLower.includes('supervised') || qLower.includes('unsupervised') || qLower.includes('reinforcement') || qLower.includes('classification') || qLower.includes('regression') || qLower.includes('clustering') || qLower.includes('overfitting') || qLower.includes('underfitting') || qLower.includes('ensemble') || qLower.includes('bias') || qLower.includes('variance')) return 'Machine Learning';

    // Deep Learning & Neural Networks
    if (qLower.includes('neural network') || qLower.includes('deep learning') || qLower.includes('cnn') || qLower.includes('rnn') || qLower.includes('lstm') || qLower.includes('gru') || qLower.includes('transformer') || qLower.includes('bert') || qLower.includes('gpt') || qLower.includes('activation') || qLower.includes('backpropagation') || qLower.includes('gradient')) return 'Deep Learning';

    // NLP
    if (qLower.includes('nlp') || qLower.includes('natural language') || qLower.includes('tokenization') || qLower.includes('stemming') || qLower.includes('chatbot') || qLower.includes('text') || qLower.includes('speech')) return 'NLP';

    // Computer Vision
    if (qLower.includes('vision') || qLower.includes('image') || qLower.includes('object detection') || qLower.includes('convolution')) return 'Computer Vision';

    // AI Concepts
    if (qLower.includes('artificial intelligence') || qLower.includes('turing') || qLower.includes('expert system') || qLower.includes('knowledge base') || qLower.includes('inference') || qLower.includes('agent') || qLower.includes('heuristic') || qLower.includes('search')) return 'AI Concepts';

    // Data Processing
    if (qLower.includes('data') || qLower.includes('feature') || qLower.includes('normalization') || qLower.includes('scaling') || qLower.includes('augmentation')) return 'Data Processing';

    // Evaluation
    if (qLower.includes('accuracy') || qLower.includes('precision') || qLower.includes('recall') || qLower.includes('f1-score') || qLower.includes('roc') || qLower.includes('auc') || qLower.includes('matrix') || qLower.includes('validation')) return 'Model Evaluation';

    return 'General AI';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Simple definitions
    if (qLower.includes('what is') || qLower.includes('stand for') || qLower.includes('goal of')) return "Easy";

    // Complex topics
    if (qLower.includes('transformer') || qLower.includes('lstm') || qLower.includes('backpropagation') || qLower.includes('vanishing gradient') || qLower.includes('hyperparameter') || qLower.includes('augmentation')) return 'Hard';

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
    fs.writeFileSync('ai_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to ai_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
