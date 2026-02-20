
const fs = require('fs');

const rawText = fs.readFileSync('dbms_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // SQL Topics
    if (qLower.includes('select') || qLower.includes('insert') || qLower.includes('update') || qLower.includes('delete') || qLower.includes('clause') || qLower.includes('where') || qLower.includes('having') || qLower.includes('group by') || qLower.includes('order by') || qLower.includes('join') || qLower.includes('union') || qLower.includes('sql') || qLower.includes('query')) return 'SQL';

    // Keys
    if (qLower.includes('primary key') || qLower.includes('foreign key') || qLower.includes('candidate key') || qLower.includes('composite key') || qLower.includes('super key') || qLower.includes('surrogate key') || qLower.includes('key constraint')) return 'Keys';

    // Normalization
    if (qLower.includes('normalization') || qLower.includes('1nf') || qLower.includes('2nf') || qLower.includes('3nf') || qLower.includes('bcnf') || qLower.includes('form') || qLower.includes('dependency') || qLower.includes('redundancy') || qLower.includes('anomaly')) return 'Normalization';

    // Transactions
    if (qLower.includes('transaction') || qLower.includes('acid') || qLower.includes('commit') || qLower.includes('rollback') || qLower.includes('savepoint') || qLower.includes('isolation') || qLower.includes('concurrency') || qLower.includes('deadlock') || qLower.includes('lock') || qLower.includes('phantom')) return 'Transactions';

    // Indexing
    if (qLower.includes('index') || qLower.includes('idx') || qLower.includes('b-tree') || qLower.includes('hash') || qLower.includes('bitmap')) return 'Indexing';

    // Architecture & Concepts
    if (qLower.includes('schema') || qLower.includes('model') || qLower.includes('view') || qLower.includes('trigger') || qLower.includes('stored procedure') || qLower.includes('cursor') || qLower.includes('partitioning') || qLower.includes('sharding') || qLower.includes('replication') || qLower.includes('warehouse') || qLower.includes('mining') || qLower.includes('oltp') || qLower.includes('olap')) return 'Architecture';

    return 'Database Concepts';
}

function inferDifficulty(question, explanation) {
    // Simple heuristic: length of explanation + question
    // Also specific complex topics can be hard
    const qLower = question.toLowerCase();
    if (qLower.includes('normalization') || qLower.includes('transaction') || qLower.includes('concurrency') || qLower.includes('isolation')) return 'Hard';
    if (qLower.includes('join') || qLower.includes('index')) return 'Medium';

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
    fs.writeFileSync('dbms_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to dbms_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
