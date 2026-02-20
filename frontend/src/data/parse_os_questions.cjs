
const fs = require('fs');

const rawText = fs.readFileSync('os_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // Process & Threads
    if (qLower.includes('process') || qLower.includes('thread') || qLower.includes('fork') || qLower.includes('exec') || qLower.includes('context switching') || qLower.includes('zombie') || qLower.includes('orphan') || qLower.includes('daemon') || qLower.includes('pcb')) return 'Process Management';

    // Scheduling
    if (qLower.includes('scheduling') || qLower.includes('fcfs') || qLower.includes('round robin') || qLower.includes('sjf') || qLower.includes('priority') || qLower.includes('multilevel') || qLower.includes('preemptive') || qLower.includes('turnaround') || qLower.includes('waiting time') || qLower.includes('response time')) return 'CPU Scheduling';

    // Memory Management
    if (qLower.includes('memory') || qLower.includes('paging') || qLower.includes('segmentation') || qLower.includes('virtual') || qLower.includes('ram') || qLower.includes('cache') || qLower.includes('swapping') || qLower.includes('thrashing') || qLower.includes('fragmentation') || qLower.includes('page fault') || qLower.includes('tlb') || qLower.includes('belady') || qLower.includes('lru') || qLower.includes('fifo')) return 'Memory Management';

    // Concurrency & Synchronization
    if (qLower.includes('deadlock') || qLower.includes('mutex') || qLower.includes('semaphore') || qLower.includes('monitor') || qLower.includes('race') || qLower.includes('critical section') || qLower.includes('synchronization') || qLower.includes('atomic') || qLower.includes('spinlock')) return 'Concurrency';

    // File Systems
    if (qLower.includes('file') || qLower.includes('directory') || qLower.includes('disk') || qLower.includes('raid') || qLower.includes('inode') || qLower.includes('mount') || qLower.includes('link') || qLower.includes('journaling')) return 'File Systems';

    // I/O & Hardware
    if (qLower.includes('device') || qLower.includes('driver') || qLower.includes('interrupt') || qLower.includes('dma') || qLower.includes('spooling') || qLower.includes('hardware') || qLower.includes('bios') || qLower.includes('boot')) return 'I/O Management';

    // Security & Protection
    if (qLower.includes('security') || qLower.includes('protection') || qLower.includes('virus') || qLower.includes('auth') || qLower.includes('encryption') || qLower.includes('sandboxing') || qLower.includes('mode')) return 'Security';

    // Distributed & Advanced
    if (qLower.includes('distributed') || qLower.includes('cloud') || qLower.includes('virtualization') || qLower.includes('hypervisor') || qLower.includes('real-time') || qLower.includes('embedded') || qLower.includes('multiprocessor')) return 'Advanced OS';

    return 'OS Concepts';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Complex topics
    if (qLower.includes('deadlock') || qLower.includes('scheduling algorithm') || qLower.includes('synchronization') || qLower.includes('paging') || qLower.includes('virtual memory')) return 'Medium';
    if (qLower.includes('belady') || qLower.includes('tlb') || qLower.includes('u-turn') || qLower.includes('c-scan')) return 'Hard';

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
    fs.writeFileSync('os_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to os_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
