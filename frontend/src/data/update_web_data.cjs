
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'web_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// Search string for Web Dev placeholder
const searchString = 'web: generateQuestions("web", 50),';
const replacementString = `web: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'web'
    // Pattern: { id: "web", name: "Web Development", icon: "🌍", totalQuestions: 50, color: "text-pink-500", gradient: "from-pink-500 to-rose-500" },
    const subjectRegex = /{ id: "web", name: "Web Development", icon: "🌍", totalQuestions: \d+, color: "text-pink-500", gradient: "from-pink-500 to-rose-500" }/;
    const subjectReplacement = `{ id: "web", name: "Web Development", icon: "🌍", totalQuestions: ${newQuestions.length}, color: "text-pink-500", gradient: "from-pink-500 to-rose-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated Web Dev subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find Web Dev subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"web".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with Web Dev questions.");
} else {
    console.error("Could not find Web Dev placeholder.");
    process.exit(1);
}
