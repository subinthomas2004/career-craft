
const fs = require('fs');
const vm = require('vm');

const filePath = 'technicalQuizData.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Identify the quizData block
// Look for: export const quizData: Record<string, QuizQuestion[]> = {
const startMarker = 'export const quizData: Record<string, QuizQuestion[]> =';
const startIndex = fileContent.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find quizData export.');
    process.exit(1);
}

// Find the first '{' after the marker
const openBraceIndex = fileContent.indexOf('{', startIndex);
if (openBraceIndex === -1) {
    console.error('Could not find opening brace for quizData.');
    process.exit(1);
}

// Find the matching closing brace
let openCount = 0;
let closeBraceIndex = -1;

for (let i = openBraceIndex; i < fileContent.length; i++) {
    if (fileContent[i] === '{') openCount++;
    else if (fileContent[i] === '}') openCount--;

    if (openCount === 0) {
        closeBraceIndex = i;
        break;
    }
}

if (closeBraceIndex === -1) {
    console.error('Could not find closing brace for quizData.');
    process.exit(1);
}

// Extract the object literal source code
const objectSource = fileContent.substring(openBraceIndex, closeBraceIndex + 1);

// Parse it using VM to handle unquoted keys
let quizData;
try {
    const sandbox = {};
    vm.createContext(sandbox);
    // Wrap in parens to ensure it evaluates as expression
    quizData = vm.runInContext(`(${objectSource})`, sandbox);
} catch (e) {
    console.error('Error parsing quizData object:', e);
    process.exit(1);
}

console.log('Successfully parsed quizData. Processing subjects...');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let totalUpdated = 0;

Object.keys(quizData).forEach(subject => {
    const questions = quizData[subject];
    console.log(`Processing ${subject}: ${questions.length} questions.`);

    questions.forEach(q => {
        const options = q.options;
        const correctAnswerText = options[q.correct];

        // Map to objects to preserve link to correctness
        const richOptions = options.map((text, idx) => ({
            text,
            isCorrect: idx === q.correct
        }));

        // Shuffle
        shuffleArray(richOptions);

        // Update question object
        q.options = richOptions.map(o => o.text);
        q.correct = richOptions.findIndex(o => o.isCorrect);

        // Update explanation if it references "Option X"
        if (q.explanation) {
            const newChar = String.fromCharCode(65 + q.correct);
            // Replace "Option [A-D] is correct" with new char
            q.explanation = q.explanation.replace(/Option [A-D] is correct/g, `Option ${newChar} is correct`);
        }
        totalUpdated++;
    });
});

console.log(`Shuffled options for ${totalUpdated} questions.`);

// Serialize back to JSON string
// We format it nicely
const newObjectSource = JSON.stringify(quizData, null, 8);

// Replace in file
const newFileContent = fileContent.substring(0, openBraceIndex) +
    newObjectSource +
    fileContent.substring(closeBraceIndex + 1);

fs.writeFileSync(filePath, newFileContent);
console.log('Updated technicalQuizData.ts');
