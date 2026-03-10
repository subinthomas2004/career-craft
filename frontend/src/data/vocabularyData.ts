export interface VocabularyWord {
    word: string;
    phonetic: string;
    meaning: string;
    usageExample: string;
    category: 'technical' | 'business' | 'general';
}

export const vocabularyWords: VocabularyWord[] = [
    // TECHNICAL
    { word: 'Algorithm', phonetic: 'AL-guh-ri-thum', meaning: 'A step-by-step procedure for solving a problem', usageExample: 'I optimized the sorting algorithm to improve performance.', category: 'technical' },
    { word: 'Asynchronous', phonetic: 'ay-SIN-kruh-nus', meaning: 'Not occurring at the same time; non-blocking', usageExample: 'We used asynchronous API calls to prevent UI freezing.', category: 'technical' },
    { word: 'Cache', phonetic: 'KASH', meaning: 'A temporary storage for frequently accessed data', usageExample: 'Implementing a cache layer reduced our database queries by 60%.', category: 'technical' },
    { word: 'Paradigm', phonetic: 'PAIR-uh-dime', meaning: 'A model or pattern of thinking', usageExample: 'Object-oriented paradigm helps organize code into reusable structures.', category: 'technical' },
    { word: 'Pseudocode', phonetic: 'SOO-doh-code', meaning: 'Informal description of an algorithm in plain language', usageExample: 'I always write pseudocode before implementing complex logic.', category: 'technical' },
    { word: 'Recursive', phonetic: 'reh-KUR-siv', meaning: 'A function that calls itself to solve smaller subproblems', usageExample: 'The recursive approach simplified the tree traversal logic.', category: 'technical' },
    { word: 'Latency', phonetic: 'LAY-ten-see', meaning: 'The delay before data transfer begins', usageExample: 'We reduced API latency from 500ms to 50ms using caching.', category: 'technical' },
    { word: 'Scalability', phonetic: 'skay-luh-BIL-uh-tee', meaning: 'Ability of a system to handle growing workload', usageExample: 'Microservices architecture improved our scalability significantly.', category: 'technical' },
    { word: 'Deprecated', phonetic: 'DEP-ruh-kay-ted', meaning: 'Outdated and no longer recommended for use', usageExample: 'That library function is deprecated; use the updated version instead.', category: 'technical' },
    { word: 'Idempotent', phonetic: 'eye-dem-POH-tent', meaning: 'An operation that produces the same result regardless of repetition', usageExample: 'PUT requests should be idempotent in RESTful API design.', category: 'technical' },
    { word: 'Polymorphism', phonetic: 'pol-ee-MOR-fiz-um', meaning: 'Ability of different objects to respond to the same method differently', usageExample: 'Polymorphism allows us to write flexible and extensible code.', category: 'technical' },
    { word: 'Abstraction', phonetic: 'ab-STRAK-shun', meaning: 'Hiding complex details and showing only essential features', usageExample: 'Good abstraction makes the codebase easier to maintain.', category: 'technical' },
    { word: 'Encapsulation', phonetic: 'en-KAP-soo-LAY-shun', meaning: 'Bundling data and methods that operate on it within a single unit', usageExample: 'Encapsulation protects internal state from unauthorized access.', category: 'technical' },
    { word: 'Middleware', phonetic: 'MID-ul-wair', meaning: 'Software that acts as a bridge between different applications', usageExample: 'We added authentication middleware to protect our API routes.', category: 'technical' },
    { word: 'Repository', phonetic: 'reh-POZ-ih-tor-ee', meaning: 'A central location for storing and managing code', usageExample: 'All team members push their code to the shared repository.', category: 'technical' },
    { word: 'Throughput', phonetic: 'THROO-put', meaning: 'The amount of data processed in a given time period', usageExample: 'Our system handles a throughput of ten thousand requests per second.', category: 'technical' },

    // BUSINESS
    { word: 'Synergy', phonetic: 'SIN-er-jee', meaning: 'Combined effort producing greater results than individual parts', usageExample: 'The synergy between our design and engineering teams was excellent.', category: 'business' },
    { word: 'Stakeholder', phonetic: 'STAYK-hohl-der', meaning: 'A person with interest or concern in a project', usageExample: 'We presented the project roadmap to all key stakeholders.', category: 'business' },
    { word: 'Deliverable', phonetic: 'deh-LIV-er-uh-bul', meaning: 'A tangible output produced as part of a project', usageExample: 'The MVP was our first deliverable for the client.', category: 'business' },
    { word: 'Agile', phonetic: 'AJ-ile', meaning: 'An iterative approach to project management and development', usageExample: 'Our team follows Agile methodology with two-week sprints.', category: 'business' },
    { word: 'Feasibility', phonetic: 'fee-zuh-BIL-uh-tee', meaning: 'The practicality of a proposed plan or method', usageExample: 'We conducted a feasibility study before starting the project.', category: 'business' },
    { word: 'Innovative', phonetic: 'IN-oh-vay-tiv', meaning: 'Introducing new ideas or methods', usageExample: 'Your company is known for its innovative approach to AI solutions.', category: 'business' },
    { word: 'Collaborate', phonetic: 'kuh-LAB-oh-rayt', meaning: 'To work jointly on an activity or project', usageExample: 'I enjoy collaborating with cross-functional teams.', category: 'business' },
    { word: 'Proactive', phonetic: 'pro-AK-tiv', meaning: 'Acting in anticipation of future problems or needs', usageExample: 'Being proactive helps me identify and resolve issues early.', category: 'business' },

    // GENERAL INTERVIEW
    { word: 'Articulate', phonetic: 'ar-TIK-yoo-late', meaning: 'To express ideas clearly and effectively', usageExample: 'I can articulate complex technical concepts in simple terms.', category: 'general' },
    { word: 'Meticulous', phonetic: 'meh-TIK-yoo-lus', meaning: 'Showing great attention to detail', usageExample: 'I am meticulous when writing test cases for critical features.', category: 'general' },
    { word: 'Perseverance', phonetic: 'per-suh-VEER-uns', meaning: 'Persistence in doing something despite difficulty', usageExample: 'My perseverance helped me debug a complex memory leak.', category: 'general' },
    { word: 'Initiative', phonetic: 'ih-NISH-uh-tiv', meaning: 'The ability to act independently and take charge', usageExample: 'I took the initiative to automate our deployment pipeline.', category: 'general' },
    { word: 'Versatile', phonetic: 'VER-suh-tile', meaning: 'Able to adapt to many different functions or activities', usageExample: 'I am a versatile developer comfortable with both frontend and backend.', category: 'general' },
    { word: 'Exemplary', phonetic: 'eg-ZEM-pluh-ree', meaning: 'Serving as a desirable model; representing the best', usageExample: 'Her exemplary code quality set the standard for the entire team.', category: 'general' },
    { word: 'Proficiency', phonetic: 'pro-FISH-en-see', meaning: 'A high degree of competence or skill', usageExample: 'I have proficiency in JavaScript, Python, and Java.', category: 'general' },
    { word: 'Resilient', phonetic: 'reh-ZIL-ee-ent', meaning: 'Able to recover quickly from difficulties', usageExample: 'Being resilient helped me handle project setbacks positively.', category: 'general' },
];

export const getWordsByCategory = (category: string) =>
    vocabularyWords.filter(w => w.category === category);

export const getRandomWord = (category?: string) => {
    const filtered = category ? getWordsByCategory(category) : vocabularyWords;
    return filtered[Math.floor(Math.random() * filtered.length)];
};
