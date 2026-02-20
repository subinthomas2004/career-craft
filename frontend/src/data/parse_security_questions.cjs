
const fs = require('fs');

const rawText = fs.readFileSync('security_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // Core Concepts
    if (qLower.includes('cia triad') || qLower.includes('confidentiality') || qLower.includes('integrity') || qLower.includes('availability') || qLower.includes('authentication') || qLower.includes('authorization') || qLower.includes('accounting') || qLower.includes('principle')) return 'Core Concepts';

    // Threats & Attacks
    if (qLower.includes('malware') || qLower.includes('virus') || qLower.includes('worm') || qLower.includes('trojan') || qLower.includes('ransomware') || qLower.includes('phishing') || qLower.includes('ddos') || qLower.includes('brute-force') || qLower.includes('injection') || qLower.includes('xss') || qLower.includes('csrf') || qLower.includes('mitm') || qLower.includes('spoofing')) return 'Threats & Attacks';

    // Cryptography
    if (qLower.includes('encrypt') || qLower.includes('decrypt') || qLower.includes('hashing') || qLower.includes('digital signature') || qLower.includes('pki') || qLower.includes('certificate') || qLower.includes('key') || qLower.includes('symmetric') || qLower.includes('asymmetric') || qLower.includes('cipher')) return 'Cryptography';

    // Network & Infrastructure
    if (qLower.includes('firewall') || qLower.includes('vpn') || qLower.includes('ids') || qLower.includes('ips') || qLower.includes('network') || qLower.includes('monitor') || qLower.includes('siem') || qLower.includes('security group') || qLower.includes('subnet') || qLower.includes('dmz')) return 'Network Security';

    // Governance & Compliance
    if (qLower.includes('governance') || qLower.includes('risk') || qLower.includes('compliance') || qLower.includes('audit') || qLower.includes('gdpr') || qLower.includes('nist') || qLower.includes('iso') || qLower.includes('policy') || qLower.includes('training') || qLower.includes('awareness')) return 'Governance & Compliance';

    // App & Data Security
    if (qLower.includes('secure coding') || qLower.includes('owasp') || qLower.includes('data loss') || qLower.includes('dlp') || qLower.includes('database') || qLower.includes('input validation') || qLower.includes('masking') || qLower.includes('tokenization')) return 'App & Data Security';

    // Identity & Access
    if (qLower.includes('password') || qLower.includes('mfa') || qLower.includes('sso') || qLower.includes('biometric') || qLower.includes('iam') || qLower.includes('pam') || qLower.includes('access control') || qLower.includes('rbac')) return 'Identity & Access';

    return 'General Security';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Simple definitions
    if (qLower.includes('what is') || qLower.includes('stand for') || qLower.includes('example of')) return "Easy";

    // Complex topics
    if (qLower.includes('cryptography') || qLower.includes('pki') || qLower.includes('advanced') || qLower.includes('buffer overflow') || qLower.includes('zero-day') || qLower.includes('forensics') || qLower.includes('penetration testing')) return 'Hard';

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
    fs.writeFileSync('security_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to security_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
