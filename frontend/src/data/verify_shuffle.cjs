
const fs = require('fs');
const vm = require('vm');

const filePath = 'technicalQuizData.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

const startMarker = 'export const quizData: Record<string, QuizQuestion[]> =';
const startIndex = fileContent.indexOf(startMarker);
const openBraceIndex = fileContent.indexOf('{', startIndex);

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

const objectSource = fileContent.substring(openBraceIndex, closeBraceIndex + 1);

let quizData;
try {
    const sandbox = {};
    vm.createContext(sandbox);
    quizData = vm.runInContext(`(${objectSource})`, sandbox);
} catch (e) {
    console.error('Error parsing quizData object:', e);
    process.exit(1);
}

let totalQ = 0;
let counts = { 0: 0, 1: 0, 2: 0, 3: 0 };

Object.keys(quizData).forEach(subject => {
    const questions = quizData[subject];
    questions.forEach(q => {
        counts[q.correct]++;
        totalQ++;
    });
});

console.log('Total Questions:', totalQ);
console.log('Option A (0):', counts[0], `(${((counts[0] / totalQ) * 100).toFixed(2)}%)`);
console.log('Option B (1):', counts[1], `(${((counts[1] / totalQ) * 100).toFixed(2)}%)`);
console.log('Option C (2):', counts[2], `(${((counts[2] / totalQ) * 100).toFixed(2)}%)`);
console.log('Option D (3):', counts[3], `(${((counts[3] / totalQ) * 100).toFixed(2)}%)`);
