
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'ai_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// Search string for AI placeholder
const searchString = 'ai: generateQuestions("ai", 50),';
const replacementString = `ai: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'ai'
    // Pattern: { id: "ai", name: "Artificial Intelligence", icon: "🤖", totalQuestions: 50, color: "text-violet-500", gradient: "from-violet-500 to-purple-500" },
    const subjectRegex = /{ id: "ai", name: "Artificial Intelligence", icon: "🤖", totalQuestions: \d+, color: "text-violet-500", gradient: "from-violet-500 to-purple-500" }/;
    const subjectReplacement = `{ id: "ai", name: "Artificial Intelligence", icon: "🤖", totalQuestions: ${newQuestions.length}, color: "text-violet-500", gradient: "from-violet-500 to-purple-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated AI Subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find AI Subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"ai".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with AI questions.");
} else {
    // Check if it's already updated (e.g., if generateQuestions was already replaced)
    if (tsContent.includes(newQuestionsString.substring(0, 50))) { // Check a chunk
        console.log("AI questions seem to be already present.");
    } else {
        console.error("Could not find AI placeholder.");
        process.exit(1);
    }
}
