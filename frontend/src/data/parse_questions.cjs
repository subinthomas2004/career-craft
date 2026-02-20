
const fs = require('fs');

const rawText = fs.readFileSync('dsa_part2.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();
    if (qLower.includes('search') || qLower.includes('binary search') || qLower.includes('linear search')) return 'Searching';
    if (qLower.includes('sort') || qLower.includes('bubble') || qLower.includes('merge') || qLower.includes('quick') || qLower.includes('insertion') || qLower.includes('selection')) return 'Sorting';
    if (qLower.includes('tree') || qLower.includes('bst') || qLower.includes('balanced') || qLower.includes('traversal')) return 'Trees';
    if (qLower.includes('graph') || qLower.includes('dfs') || qLower.includes('bfs') || qLower.includes('dijkstra') || qLower.includes('prim') || qLower.includes('kruskal') || qLower.includes('bellman') || qLower.includes('shortest path') || qLower.includes('cycle') || qLower.includes('topological')) return 'Graphs';
    if (qLower.includes('stack') || qLower.includes('lifo') || qLower.includes('recursion') || qLower.includes('parsing') || qLower.includes('undo')) return 'Stacks';
    if (qLower.includes('queue') || qLower.includes('fifo')) return 'Queues';
    if (qLower.includes('linked list')) return 'Linked Lists';
    if (qLower.includes('heap') || qLower.includes('priority')) return 'Heaps';
    if (qLower.includes('hash') || qLower.includes('collision')) return 'Hashing';
    if (qLower.includes('array')) return 'Arrays';
    return 'Data Structures';
}

function inferDifficulty(question, explanation) {
    const combined = (question + explanation).length;
    if (combined < 100) return "Easy";
    if (combined > 200) return "Hard";
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


fs.writeFileSync('dsa_json_final.json', JSON.stringify(questions, null, 2));
console.log("Written to dsa_json_final.json");

