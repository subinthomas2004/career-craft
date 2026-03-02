const fs = require('fs');
const path = require('path');

const rawText = fs.readFileSync(path.join('D:', 'VISWA', 'career', 'question', 'questions.txt'), 'utf8');

const sectionMap = {
    'decision making': 'decision_making',
    'cause and effect reasoning': 'cause_effect',
    'statement- assumption/conclusion': 'statement_assumption',
    'logical  deductions': 'logical_deductions',
    'logical deductions': 'logical_deductions',
    'clock and calenders': 'clocks_calendars',
    'average and mixtures': 'averages_mixtures',
    'perumation combination and probabaility': 'permutation_combination',
    'simple and compound inteerst': 'simple_compound_interest',
    'profit loss and discount': 'profit_loss_discount',
    'time work wages': 'time_work_wages',
    'time speed distance': 'time_speed_distance',
    'letter series': 'letter_series',
    'number series': 'number_series',
    'puzzles': 'puzzles',
    'seating arragment': 'seating_arrangement',
    'syloogism': 'syllogism',
    'coding-decoding': 'coding_decoding',
    'direction sense': 'direction_sense',
    'blood relations': 'blood_relations',
    'non verbal reasooning': 'non_verbal_reasoning',
    'verbal reasonimg': 'verbal_reasoning',
    'data suffienecy': 'data_sufficiency',
    'data interpreation': 'data_interpretation',
    'geometry and mensuartion': 'geometry_mensuration',
    'algebra and equations': 'algebra_equations',
    'arithematic ability': 'arithmetic_ability',
    'quanttive aptitude': 'quantitative_aptitude',
    'anaytical reaosisng': 'analytical_reasoning',
    'logical reasosng(general).': 'logical_reasoning',
    'ratio proprtion and partnership': 'ratio_proportion',
};

function topicIdToVarName(topicId) {
    return topicId.replace(/_([a-z])/g, (_, c) => c.toUpperCase()) + 'Questions';
}

function topicIdToFileName(topicId) {
    const parts = topicId.split('_');
    return parts.map((p, i) => i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'Data.ts';
}

const lines = rawText.split(/\r?\n/);

// Step 1: Find all section boundaries
const sectionStarts = [];
for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed) {
        const lowerTrimmed = trimmed.toLowerCase().replace(/\s+/g, ' ').trim();
        if (sectionMap[lowerTrimmed]) {
            sectionStarts.push({ line: i, header: lowerTrimmed, topicId: sectionMap[lowerTrimmed] });
        }
    }
}

console.log(`Found ${sectionStarts.length} section headers`);

// Step 2: For each section, find its JSON array
const sections = [];
for (let s = 0; s < sectionStarts.length; s++) {
    const startLine = sectionStarts[s].line;
    const endLine = s + 1 < sectionStarts.length ? sectionStarts[s + 1].line : lines.length;

    // Find the JSON array within this section
    let jsonStart = -1;
    let jsonEnd = -1;
    let bracketDepth = 0;

    for (let i = startLine; i < endLine; i++) {
        const trimmed = lines[i].trim();
        if (jsonStart === -1 && trimmed.startsWith('[')) {
            jsonStart = i;
            bracketDepth = 0;
        }

        if (jsonStart !== -1) {
            for (const ch of trimmed) {
                if (ch === '[') bracketDepth++;
                if (ch === ']') bracketDepth--;
            }
            if (bracketDepth === 0) {
                jsonEnd = i;
                break;
            }
        }
    }

    if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = lines.slice(jsonStart, jsonEnd + 1).join('\n');
        sections.push({
            header: sectionStarts[s].header,
            topicId: sectionStarts[s].topicId,
            json: jsonText
        });
    } else {
        console.warn(`  ⚠ No JSON found for section "${sectionStarts[s].header}" (line ${startLine + 1})`);
    }
}

console.log(`Found ${sections.length} sections with JSON data`);

// Create output directory
const outputDir = path.join(__dirname, 'aptitudeData');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
let totalQuestions = 0;
const generatedTopics = new Map(); // track unique topics

sections.forEach(section => {
    const topicId = section.topicId;

    let parsed;

    // Pre-fix common JSON issues in the raw text
    let fixedJson = section.json;
    // Fix double-quotes like ""B" -> "B"
    fixedJson = fixedJson.replace(/""([A-D])":/g, '"$1":');
    fixedJson = fixedJson.replace(/""\s*([A-D])"\s*:/g, '"$1":');
    // Fix invalid backslash escapes (e.g. \pi, \cdot from LaTeX)
    // Replace backslash followed by non-JSON-escape chars with double backslash
    fixedJson = fixedJson.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');
    // Fix trailing commas before ] or }
    fixedJson = fixedJson.replace(/,\s*([\]}])/g, '$1');
    // Fix smart quotes
    fixedJson = fixedJson.replace(/[\u201C\u201D]/g, '"');
    fixedJson = fixedJson.replace(/[\u2018\u2019]/g, "'");

    try {
        parsed = JSON.parse(fixedJson);
    } catch (e) {
        console.error(`  ✗ JSON parse error for "${section.header}": ${e.message}`);
        // Try more aggressive fixes
        try {
            // Remove any non-standard characters and try again
            fixedJson = fixedJson.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ');
            // Fix any remaining issues
            fixedJson = fixedJson.replace(/,\s*([\]}])/g, '$1');
            parsed = JSON.parse(fixedJson);
            console.log(`    Fixed with aggressive cleanup for "${section.header}"`);
        } catch (e2) {
            console.error(`    Cannot fix JSON for "${section.header}": ${e2.message}`);
            console.error(`    First 200 chars: ${fixedJson.substring(0, 200)}`);
            return;
        }
    }

    const questions = parsed.map(q => {
        const options = [];
        if (q.options) {
            if (typeof q.options === 'object' && !Array.isArray(q.options)) {
                options.push(q.options.A || q.options.a || '');
                options.push(q.options.B || q.options.b || '');
                options.push(q.options.C || q.options.c || '');
                options.push(q.options.D || q.options.d || '');
            } else if (Array.isArray(q.options)) {
                options.push(...q.options);
            }
        }

        const answerLetter = (q.answer || q.correctAnswer || 'A').toString().toUpperCase().trim();
        const correct = answerMap[answerLetter] ?? 0;

        return {
            question: q.question || '',
            options: options,
            correct: correct,
            explanation: q.explanation || ''
        };
    });

    totalQuestions += questions.length;

    // If we already have this topic, merge (don't overwrite)
    if (generatedTopics.has(topicId)) {
        console.log(`  ⚠ Duplicate topic "${topicId}" from header "${section.header}" — merging`);
        generatedTopics.get(topicId).push(...questions);
    } else {
        generatedTopics.set(topicId, questions);
    }
});

// Write files
generatedTopics.forEach((questions, topicId) => {
    const varName = topicIdToVarName(topicId);
    const fileName = topicIdToFileName(topicId);

    const cleanTs = `import { Question } from "../aptitudeQuestions";

export const ${varName}: Question[] = [
${questions.map(q => `    {
        question: ${JSON.stringify(q.question)},
        options: ${JSON.stringify(q.options)},
        correct: ${q.correct},
        explanation: ${JSON.stringify(q.explanation)}
    }`).join(',\n')}
];
`;

    fs.writeFileSync(path.join(outputDir, fileName), cleanTs, 'utf8');
    console.log(`  ✓ ${fileName}: ${questions.length} questions (topic: ${topicId})`);
});

console.log(`\nTotal: ${totalQuestions} questions across ${generatedTopics.size} topic files`);

// Generate index file
const indexLines = ['// Auto-generated index of all aptitude question data files\n'];
const exportsList = [];

generatedTopics.forEach((_, topicId) => {
    const varName = topicIdToVarName(topicId);
    const fileName = topicIdToFileName(topicId).replace('.ts', '');
    indexLines.push(`export { ${varName} } from "./${fileName}";`);
    exportsList.push({ topicId, varName });
});

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexLines.join('\n') + '\n', 'utf8');
console.log('\n✓ Generated index.ts');
