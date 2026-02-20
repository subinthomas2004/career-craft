
const fs = require('fs');

const tsFile = 'technicalQuizData.ts';
const jsonFile = 'cn_json_final.json';

let tsContent = fs.readFileSync(tsFile, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Format new questions as string
const newQuestionsString = JSON.stringify(newQuestions, null, 8); // Indent 8

// We need to find `cn: generateQuestions("cn", 50),` and replace it with `cn: [ ... ],`
const searchString = 'cn: generateQuestions("cn", 50),';
const replacementString = `cn: ${newQuestionsString},`;

if (tsContent.includes(searchString)) {
    let newContent = tsContent.replace(searchString, replacementString);

    // Update totalQuestions for 'cn'
    // Pattern: { id: "cn", name: "Computer Networks", icon: "🌐", totalQuestions: 50, color: "text-orange-500", gradient: "from-orange-500 to-red-500" },
    const subjectRegex = /{ id: "cn", name: "Computer Networks", icon: "🌐", totalQuestions: \d+, color: "text-orange-500", gradient: "from-orange-500 to-red-500" }/;
    const subjectReplacement = `{ id: "cn", name: "Computer Networks", icon: "🌐", totalQuestions: ${newQuestions.length}, color: "text-orange-500", gradient: "from-orange-500 to-red-500" }`;

    if (subjectRegex.test(newContent)) {
        newContent = newContent.replace(subjectRegex, subjectReplacement);
        console.log(`Updated CN subject metadata. Total: ${newQuestions.length}`);
    } else {
        console.log("Could not find CN subject metadata to update.");
        // Try a more lenient regex if the first one fails due to spacing or minor differences
        const lenientRegex = /id:\s*"cn".*?totalQuestions:\s*\d+/;
        if (lenientRegex.test(newContent)) {
            console.log("Found loose match, but safer to do manual verification or exact match replacement.");
        }
    }

    fs.writeFileSync(tsFile, newContent);
    console.log("Updated technicalQuizData.ts with CN questions.");
} else {
    console.error("Could not find CN placeholder.");
    process.exit(1);
}
