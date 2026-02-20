
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'security_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// Search string for Cybersecurity placeholder
const searchString = 'cyber: generateQuestions("cyber", 50),';
const replacementString = `cyber: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'cyber'
    // Pattern: { id: "cyber", name: "Cybersecurity", icon: "🔒", totalQuestions: 50, color: "text-red-500", gradient: "from-red-500 to-rose-500" },
    const subjectRegex = /{ id: "cyber", name: "Cybersecurity", icon: "🔒", totalQuestions: \d+, color: "text-red-500", gradient: "from-red-500 to-rose-500" }/;
    const subjectReplacement = `{ id: "cyber", name: "Cybersecurity", icon: "🔒", totalQuestions: ${newQuestions.length}, color: "text-red-500", gradient: "from-red-500 to-rose-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated Cybersecurity Subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find Cybersecurity Subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"cyber".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with Cybersecurity questions.");
} else {
    console.error("Could not find Cybersecurity placeholder.");
    process.exit(1);
}
