
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'dsa_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8 spaces to match
// Remove outer [ and ]
const innerContent = newQuestionsString.substring(newQuestionsString.indexOf('[') + 1, newQuestionsString.lastIndexOf(']'));

// Find the end of dsa array
// Look for "dbms: generateQuestions"
const marker = 'dbms: generateQuestions("dbms", 50),';
const markerIndex = tsContent.indexOf(marker);

if (markerIndex === -1) {
    console.error("Could not find marker");
    process.exit(1);
}

// Find the closing "]," of dsa block before marker
const closingBracketIndex = tsContent.lastIndexOf('],', markerIndex);

if (closingBracketIndex === -1) {
    console.error("Could not find closing bracket");
    process.exit(1);
}

// Insert the new content
// We insert a comma and then the new questions before the closing bracket
const splitPoint = closingBracketIndex;
// Actually, we want to keep the closing bracket.
// So: content before "]," + "," + innerContent + "]," + content after
// But wait, the previous element didn't have a trailing comma inside the array if it was the last one?
// JSON usually doesn't enforce it, but TS allows trailing commas.
// However, my `innerContent` starts with `{...`.
// I need completely valid syntax.
// The file has: `... last_obj } ]`
// I want: `... last_obj }, new_obj, ... } ]`

const before = tsContent.substring(0, splitPoint);
const after = tsContent.substring(splitPoint);

// Check if `before` ends with newline/spaces
// We just blindly append "," + innerContent
const newContent = before + "," + innerContent + after;

// Update total questions
const finalContent = newContent.replace(
    'totalQuestions: 50, color: "text-blue-500"',
    'totalQuestions: 150, color: "text-blue-500"'
);

fs.writeFileSync(tsFile, finalContent);
console.log("Updated technicalQuizData.ts successfully");
