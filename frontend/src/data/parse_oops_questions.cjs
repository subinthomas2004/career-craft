
const fs = require('fs');

const rawText = fs.readFileSync('oops_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // OOP Principles
    if (qLower.includes('encapsulation') || qLower.includes('inheritance') || qLower.includes('polymorphism') || qLower.includes('abstraction') || qLower.includes('oop') || qLower.includes('oriented')) return 'OOP Principles';

    // Best Practices & Design
    if (qLower.includes('solid') || qLower.includes('dry') || qLower.includes('kiss') || qLower.includes('yagni') || qLower.includes('coupling') || qLower.includes('cohesion') || qLower.includes('law of demeter') || qLower.includes('principle') || qLower.includes('refactoring') || qLower.includes('code smell') || qLower.includes('anti-pattern') || qLower.includes('contract') || qLower.includes('tdd') || qLower.includes('mock') || qLower.includes('fail-fast') || qLower.includes('maintainability')) return 'Design & Best Practices';

    // Design Patterns
    if (qLower.includes('pattern') || qLower.includes('singleton') || qLower.includes('factory') || qLower.includes('observer') || qLower.includes('strategy') || qLower.includes('adapter') || qLower.includes('decorator') || qLower.includes('facade') || qLower.includes('command') || qLower.includes('iterator') || qLower.includes('composite') || qLower.includes('proxy') || qLower.includes('mvc') || qLower.includes('builder')) return 'Design Patterns';

    // Classes, Objects & Relationships
    if (qLower.includes('class') || qLower.includes('object') || qLower.includes('constructor') || qLower.includes('destructor') || qLower.includes('interface') || qLower.includes('mixins') || qLower.includes('composition') || qLower.includes('aggregation') || qLower.includes('association') || qLower.includes('dependency') || qLower.includes('uml') || qLower.includes('diagram') || qLower.includes('lifecycle') || qLower.includes('identity') || qLower.includes('equality') || qLower.includes('cloning')) return 'Classes & Objects';

    // Advanced OOP Concepts
    if (qLower.includes('overloading') || qLower.includes('overriding') || qLower.includes('virtual') || qLower.includes('static') || qLower.includes('dynamic') || qLower.includes('binding') || qLower.includes('dispatch') || qLower.includes('reflection') || qLower.includes('serialization') || qLower.includes('exception') || qLower.includes('thread') || qLower.includes('concurrency') || qLower.includes('lambda') || qLower.includes('anonymous') || qLower.includes('generics') || qLower.includes('callback') || qLower.includes('covariance') || qLower.includes('contravariance')) return 'Advanced OOP';

    return 'OOP Concepts';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Abstract methodologies are harder
    if (qLower.includes('solid') || qLower.includes('principle') || qLower.includes('pattern') || qLower.includes('reflection') || qLower.includes('dispatch') || qLower.includes('covariance') || qLower.includes('injection') || qLower.includes('architecture')) return 'Medium';

    // Very complex topics
    if (qLower.includes('liskov') || qLower.includes('demeter') || qLower.includes('contravariance') || qLower.includes('race condition') || qLower.includes('deadlock') || qLower.includes('visitor pattern') || qLower.includes('flyweight')) return 'Hard';

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
    fs.writeFileSync('oops_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to oops_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
