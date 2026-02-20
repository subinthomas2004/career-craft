
const fs = require('fs');

const rawText = fs.readFileSync('cloud_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // Models & Services
    if (qLower.includes('iaas') || qLower.includes('paas') || qLower.includes('saas') || qLower.includes('faas') || qLower.includes('serverless') || qLower.includes('public cloud') || qLower.includes('private cloud') || qLower.includes('hybrid') || qLower.includes('community')) return 'Service Models';

    // Virtualization & Containers
    if (qLower.includes('virtual') || qLower.includes('vm') || qLower.includes('hypervisor') || qLower.includes('container') || qLower.includes('docker') || qLower.includes('kubernetes') || qLower.includes('orchestration') || qLower.includes('image')) return 'Virtualization';

    // Storage & Database
    if (qLower.includes('storage') || qLower.includes('block') || qLower.includes('object') || qLower.includes('database') || qLower.includes('sql') || qLower.includes('nosql') || qLower.includes('backup') || qLower.includes('snapshot') || qLower.includes('volume')) return 'Storage & Data';

    // Networking & Security
    if (qLower.includes('security') || qLower.includes('iam') || qLower.includes('vpc') || qLower.includes('subnet') || qLower.includes('firewall') || qLower.includes('encryption') || qLower.includes('auth') || qLower.includes('vpn') || qLower.includes('gateway') || qLower.includes('ddos') || qLower.includes('waf') || qLower.includes('acl')) return 'Network & Security';

    // Architecture & Design
    if (qLower.includes('scaling') || qLower.includes('elasticity') || qLower.includes('load balanc') || qLower.includes('latency') || qLower.includes('availability') || qLower.includes('fault tolerance') || qLower.includes('redundancy') || qLower.includes('recovery') || qLower.includes('design') || qLower.includes('microservices') || qLower.includes('cloud-native')) return 'Architecture';

    // DevOps & Management
    if (qLower.includes('cI/cd') || qLower.includes('automation') || qLower.includes('monitoring') || qLower.includes('logging') || qLower.includes('terraform') || qLower.includes('iac') || qLower.includes('billing') || qLower.includes('cost') || qLower.includes('governance') || qLower.includes('compliance')) return 'DevOps & Management';

    return 'Cloud Concepts';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Simple definitions
    if (qLower.includes('what is cloud') || qLower.includes('stand for') || qLower.includes('example of')) return "Easy";

    // Complex topics
    if (qLower.includes('kubernetes') || qLower.includes('orchestration') || qLower.includes('terraform') || qLower.includes('iac') || qLower.includes('cqrs') || qLower.includes('event sourcing') || qLower.includes('zero trust') || qLower.includes('hypervisor type')) return 'Hard';

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
    fs.writeFileSync('cloud_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to cloud_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
