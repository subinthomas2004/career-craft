
const fs = require('fs');

const rawText = fs.readFileSync('cn_questions.txt', 'utf8');

const questions = [];
const blocks = rawText.split(/\n(?=\d+\.)/);

function inferTopic(question) {
    const qLower = question.toLowerCase();

    // Layers & Models
    if (qLower.includes('osi') || qLower.includes('layer') || qLower.includes('tcp/ip') || qLower.includes('application') || qLower.includes('transport') || qLower.includes('network') || qLower.includes('data link') || qLower.includes('physical') || qLower.includes('mask') || qLower.includes('subnet')) return 'Network Models & Layers';

    // Protocols
    if (qLower.includes('protocol') || qLower.includes('http') || qLower.includes('ftp') || qLower.includes('smtp') || qLower.includes('pop3') || qLower.includes('imap') || qLower.includes('dns') || qLower.includes('dhcp') || qLower.includes('arp') || qLower.includes('icmp') || qLower.includes('snmp') || qLower.includes('tcp') || qLower.includes('udp') || qLower.includes('ssh') || qLower.includes('telnet')) return 'Protocols';

    // Hardware & Devices
    if (qLower.includes('router') || qLower.includes('switch') || qLower.includes('hub') || qLower.includes('bridge') || qLower.includes('repeater') || qLower.includes('gateway') || qLower.includes('modem') || qLower.includes('nic') || qLower.includes('cable') || qLower.includes('firewall') || qLower.includes('access point')) return 'Network Hardware';

    // Addressing & Routing
    if (qLower.includes('ip address') || qLower.includes('mac address') || qLower.includes('routing') || qLower.includes('router') || qLower.includes('ipv4') || qLower.includes('ipv6') || qLower.includes('cidr') || qLower.includes('nat') || qLower.includes('port') || qLower.includes('socket')) return 'Addressing & Routing';

    // Security
    if (qLower.includes('security') || qLower.includes('encryption') || qLower.includes('ssl') || qLower.includes('tls') || qLower.includes('vpn') || qLower.includes('firewall') || qLower.includes('attack') || qLower.includes('phishing') || qLower.includes('spoofing') || qLower.includes('firewall') || qLower.includes('malware') || qLower.includes('hacker') || qLower.includes('honeypot') || qLower.includes('wpa')) return 'Network Security';

    // Wireless & Mobile
    if (qLower.includes('wireless') || qLower.includes('wifi') || qLower.includes('wlan') || qLower.includes('ssid') || qLower.includes('mobile') || qLower.includes('cellular') || qLower.includes('hotspot')) return 'Wireless Networking';

    // Concepts & Measurements
    if (qLower.includes('bandwidth') || qLower.includes('latency') || qLower.includes('throughput') || qLower.includes('jitter') || qLower.includes('qos') || qLower.includes('topology') || qLower.includes('lan') || qLower.includes('wan') || qLower.includes('man') || qLower.includes('duplex')) return 'Network Concepts';

    return 'General Networking';
}

function inferDifficulty(question, explanation) {
    const qLower = question.toLowerCase();

    // Deeper topics
    if (qLower.includes('subnet') || qLower.includes('cidr') || qLower.includes('routing protocol') || qLower.includes('bgp') || qLower.includes('ospf') || qLower.includes('three-way handshake') || qLower.includes('fragmentation') || qLower.includes('sliding window')) return 'Medium';
    if (qLower.includes('mask') || qLower.includes('ipv6 header') || qLower.includes('congestion control') || qLower.includes('handshake')) return 'Hard';

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
    fs.writeFileSync('cn_json_final.json', JSON.stringify(questions, null, 2));
    console.log(`Parsed ${questions.length} questions. Written to cn_json_final.json`);
} else {
    console.log("No questions parsed. Check input format.");
}
