
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'dbms_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// We need to find `dbms: generateQuestions("dbms", 50),` and replace it with `dbms: [ ... ],`
const searchString = 'dbms: generateQuestions("dbms", 50),';
const replacementString = `dbms: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Also update total questions if needed. 
    // Wait, the total questions logic is inside the `subjects` array usually.
    // Let's check where the subject metadata is defined.
    // It's likely in `export const subjects = [...]`

    // I need to update the totalQuestions for 'dbms'
    // Pattern: { id: "dbms", name: "DBMS", icon: Database, totalQuestions: 50, color: "text-purple-500" },
    const subjectRegex = /{ id: "dbms", name: "DBMS", icon: Database, totalQuestions: \d+, color: "text-purple-500" }/;
    const subjectReplacement = '{ id: "dbms", name: "DBMS", icon: Database, totalQuestions: 150, color: "text-purple-500" }';

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log("Updated DBMS subject metadata.");
    } else {
        console.log("Could not find DBMS subject metadata to update.");
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with DBMS questions.");
} else {
    console.error("Could not find DBMS placeholder.");
    process.exit(1);
}
