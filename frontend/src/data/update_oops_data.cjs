
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'oops_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// Search string for OOP placeholder
const searchString = 'oops: generateQuestions("oops", 50),';
const replacementString = `oops: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'oops'
    // Pattern: { id: "oops", name: "Object-Oriented Programming", icon: "💎", totalQuestions: 50, color: "text-yellow-500", gradient: "from-yellow-500 to-orange-500" },
    const subjectRegex = /{ id: "oops", name: "Object-Oriented Programming", icon: "💎", totalQuestions: \d+, color: "text-yellow-500", gradient: "from-yellow-500 to-orange-500" }/;
    const subjectReplacement = `{ id: "oops", name: "Object-Oriented Programming", icon: "💎", totalQuestions: ${newQuestions.length}, color: "text-yellow-500", gradient: "from-yellow-500 to-orange-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated OOP subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find OOP subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"oops".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with OOP questions.");
} else {
    console.error("Could not find OOP placeholder.");
    process.exit(1);
}
