export interface PracticeText {
    id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    content: string;
    wordCount: number;
}

export const practiceTexts: PracticeText[] = [
    // BEGINNER
    {
        id: 'b1',
        title: 'Simple Self-Introduction',
        difficulty: 'beginner',
        content: 'My name is Alex. I am a computer science student. I enjoy coding and solving problems. I am looking for an internship to learn new skills.',
        wordCount: 27,
    },
    {
        id: 'b2',
        title: 'Why This Job',
        difficulty: 'beginner',
        content: 'I want this job because it matches my skills. I have experience with web development. I believe I can contribute to your team and grow as a professional.',
        wordCount: 29,
    },
    {
        id: 'b3',
        title: 'My Strength',
        difficulty: 'beginner',
        content: 'My biggest strength is my ability to learn quickly. When I face a new challenge, I break it into smaller parts and tackle each one step by step.',
        wordCount: 29,
    },
    {
        id: 'b4',
        title: 'Team Player',
        difficulty: 'beginner',
        content: 'I enjoy working in teams. I listen to my teammates carefully. I share my ideas clearly. Together, we can achieve great results.',
        wordCount: 22,
    },
    {
        id: 'b5',
        title: 'Career Goal',
        difficulty: 'beginner',
        content: 'My goal is to become a full stack developer. I want to build applications that solve real problems and help people in their daily lives.',
        wordCount: 25,
    },

    // INTERMEDIATE
    {
        id: 'i1',
        title: 'Software Engineering Passion',
        difficulty: 'intermediate',
        content: 'I am passionate about software engineering because it allows me to solve real-world problems. During my internship, I worked on a team that built a scalable e-commerce platform using React and Node.js. This experience taught me the importance of clean code and collaboration.',
        wordCount: 45,
    },
    {
        id: 'i2',
        title: 'Handling Failure',
        difficulty: 'intermediate',
        content: 'During my final year project, our database migration failed two days before the deadline. Instead of panicking, I organized an emergency meeting with my team. We identified the root cause, implemented a rollback strategy, and rebuilt the migration with proper error handling. We delivered on time and learned the value of testing thoroughly.',
        wordCount: 52,
    },
    {
        id: 'i3',
        title: 'Leadership Experience',
        difficulty: 'intermediate',
        content: 'As the president of our college coding club, I organized weekly hackathons and mentored junior students. I delegated tasks based on individual strengths and ensured everyone had a chance to present their work. This role improved my communication skills and taught me how to motivate a diverse group of people.',
        wordCount: 49,
    },
    {
        id: 'i4',
        title: 'Problem-Solving Approach',
        difficulty: 'intermediate',
        content: 'When I encounter a complex problem, I first try to understand it completely before jumping into code. I break it down into smaller sub-problems, research existing solutions, and then design my approach. I believe that spending time on planning saves hours of debugging later.',
        wordCount: 44,
    },
    {
        id: 'i5',
        title: 'Why Our Company',
        difficulty: 'intermediate',
        content: 'I have been following your company for the past two years and I am impressed by your commitment to innovation. Your recent launch of the AI-powered analytics platform shows that you value cutting-edge technology. I want to be part of a team that pushes boundaries and creates meaningful impact in the industry.',
        wordCount: 51,
    },

    // ADVANCED
    {
        id: 'a1',
        title: 'System Design Discussion',
        difficulty: 'advanced',
        content: 'When designing a distributed system, I consider several key factors including scalability, fault tolerance, and data consistency. For instance, in my previous project, we implemented a microservices architecture with an event-driven communication pattern using Apache Kafka. Each service was independently deployable and had its own database, following the database-per-service pattern. We used circuit breakers to handle cascading failures and implemented eventual consistency where strong consistency was not required.',
        wordCount: 69,
    },
    {
        id: 'a2',
        title: 'Technical Trade-offs',
        difficulty: 'advanced',
        content: 'Choosing between SQL and NoSQL databases requires careful consideration of the application requirements. In our real-time analytics dashboard, we initially used PostgreSQL but faced performance bottlenecks with time-series data at scale. After evaluating our read and write patterns, access frequency, and data relationships, we migrated the time-series data to InfluxDB while keeping user and configuration data in PostgreSQL. This polyglot persistence approach reduced our query latency by seventy percent.',
        wordCount: 70,
    },
    {
        id: 'a3',
        title: 'Conflict Resolution',
        difficulty: 'advanced',
        content: 'In my previous team, two senior developers had fundamentally different approaches to implementing our authentication system. One advocated for OAuth 2.0 with JWT tokens, while the other preferred session-based authentication with Redis. I facilitated a technical discussion where both presented their proposals with pros and cons. We evaluated security implications, scalability requirements, and our client needs. Ultimately, we chose JWT for the mobile API and session-based auth for the web dashboard, satisfying both perspectives.',
        wordCount: 73,
    },
    {
        id: 'a4',
        title: 'Project Architecture Explanation',
        difficulty: 'advanced',
        content: 'Our placement preparation platform follows a modular architecture with clear separation of concerns. The frontend uses React with TypeScript for type safety and component reusability. We use a custom hook pattern for shared business logic and React Context for global state management. The backend is built with Node.js and Express, following the MVC pattern with dedicated controllers, services, and data access layers. We integrated Groq AI for natural language processing tasks like speech analysis and interview simulation.',
        wordCount: 74,
    },
    {
        id: 'a5',
        title: 'Explaining AI to Non-Technical Audience',
        difficulty: 'advanced',
        content: 'Imagine you are teaching a child to recognize animals. You show them hundreds of pictures of cats and dogs, and eventually they learn to tell the difference. Machine learning works similarly. We feed the computer thousands of examples, and it learns patterns from the data. The more diverse examples it sees, the better it becomes at making predictions. Natural language processing is like teaching a computer to understand human conversation by exposing it to millions of sentences and their meanings.',
        wordCount: 77,
    },
];

export const getTextsByDifficulty = (difficulty: string) =>
    practiceTexts.filter(t => t.difficulty === difficulty);

export const getRandomText = (difficulty?: string) => {
    const filtered = difficulty ? getTextsByDifficulty(difficulty) : practiceTexts;
    return filtered[Math.floor(Math.random() * filtered.length)];
};
