
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'cloud_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// Search string for Cloud placeholder
const searchString = 'cloud: generateQuestions("cloud", 50),';
const replacementString = `cloud: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'cloud'
    // Pattern: { id: "cloud", name: "Cloud Computing", icon: "☁️", totalQuestions: 50, color: "text-sky-500", gradient: "from-sky-500 to-blue-500" },
    const subjectRegex = /{ id: "cloud", name: "Cloud Computing", icon: "☁️", totalQuestions: \d+, color: "text-sky-500", gradient: "from-sky-500 to-blue-500" }/;
    const subjectReplacement = `{ id: "cloud", name: "Cloud Computing", icon: "☁️", totalQuestions: ${newQuestions.length}, color: "text-sky-500", gradient: "from-sky-500 to-blue-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated Cloud Subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find Cloud Subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"cloud".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with Cloud questions.");
} else {
    console.error("Could not find Cloud placeholder.");
    process.exit(1);
}
