
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'os_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// We need to find `os: generateQuestions("os", 50),` and replace it with `os: [ ... ],`
const searchString = 'os: generateQuestions("os", 50),';
const replacementString = `os: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'os'
    // Pattern: { id: "os", name: "Operating Systems", icon: "💻", totalQuestions: 50, color: "text-purple-500", gradient: "from-purple-500 to-pink-500" },
    const subjectRegex = /{ id: "os", name: "Operating Systems", icon: "💻", totalQuestions: \d+, color: "text-purple-500", gradient: "from-purple-500 to-pink-500" }/;
    const subjectReplacement = `{ id: "os", name: "Operating Systems", icon: "💻", totalQuestions: ${newQuestions.length}, color: "text-purple-500", gradient: "from-purple-500 to-pink-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated OS subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find OS subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"os".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with OS questions.");
} else {
    console.error("Could not find OS placeholder.");
    process.exit(1);
}
