export type TypingMode = 'general' | 'technical' | 'business' | 'interview';
export type Difficulty = 'beginner' | 'intermediate' | 'professional';

export interface TypingText {
    id: string;
    text: string;
    source?: string;
}

export const TYPING_DATA: Record<TypingMode, Record<Difficulty, TypingText[]>> = {
    general: {
        beginner: [
            { id: 'g_b_1', text: "The sun rises in the east and sets in the west. Every morning brings a new chance to start fresh. Birds sing in the trees, and the world wakes up. It is a beautiful time to be alive and enjoy nature." },
            { id: 'g_b_2', text: "Reading is a wonderful habit. It opens doors to new worlds and ideas. When you read a book, you can travel without moving your feet. You can meet characters from the past or the future." },
            { id: 'g_b_3', text: "Health is wealth, as the saying goes. Eating fruits and vegetables keeps your body strong. diverse diet provides the vitamins you need. Drinking water is also very important for your energy." }
        ],
        intermediate: [
            { id: 'g_i_1', text: "The rapid advancement of technology has transformed the way we communicate. In the past, letters took days to arrive, but now emails are delivered instantly. This shift has not only increased efficiency but also created a global village where information flows freely across borders." },
            { id: 'g_i_2', text: "Biodiversity refers to the variety of life on Earth. It includes all living things, from microscopic bacteria to huge whales. Each species plays a role in the ecosystem, and the loss of even one can have a ripple effect on the environment. Protecting our planet is crucial for future generations." }
        ],
        professional: [
            { id: 'g_p_1', text: "The concept of neuroplasticity challenges the traditional view that the adult brain is static. Research demonstrates that the brain can reorganize itself by forming new neural connections throughout life. This adaptability allows for recovery from injuries and the ability to learn new skills, regardless of age, provided there is sufficient cognitive stimulation." },
            { id: 'g_p_2', text: "In the realm of cognitive psychology, the Dunning-Kruger effect describes a cognitive bias where individuals with low ability at a task overestimate their ability. Conversely, experts may underestimate their competence, assuming that tasks easy for them are also easy for others. Understanding this bias is essential for accurate self-assessment and effective team management." }
        ]
    },
    technical: {
        beginner: [
            { id: 't_b_1', text: "A variable in programming is like a container. It stores data that can be used later. You can name variables anything, but it is best to use names that describe what is inside." },
            { id: 't_b_2', text: "The internet is a vast network of computers. They talk to each other using special rules called protocols. The most common protocol is HTTP, which allows you to view websites." },
            { id: 't_b_3', text: "Debugging is the process of finding and fixing mistakes in code. It requires patience and logic. Sometimes the error is just a missing semicolon or a typo." }
        ],
        intermediate: [
            { id: 't_i_1', text: "Object-Oriented Programming (OOP) is a paradigm based on the concept of 'objects', which can contain data and code. The four main principles of OOP are encapsulation, abstraction, inheritance, and polymorphism. These concepts help in managing complexity in large software systems." },
            { id: 't_i_2', text: "In database design, normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, less redundant tables and defining relationships between them. The first three normal forms are standard practice in most applications." }
        ],
        professional: [
            { id: 't_p_1', text: "Microservices architecture structures an application as a collection of loosely coupled services. This approach improves modularity and makes the application easier to understand, develop, and test. However, it also introduces complexity in inter-service communication and distributed data consistency, often requiring eventual consistency models." },
            { id: 't_p_2', text: "The CAP theorem states that a distributed data store can only provide two of the following three guarantees: Consistency, Availability, and Partition Tolerance. In the event of a network partition, a system must choose between availability (responding to requests) and consistency (ensuring all nodes have the same data)." }
        ]
    },
    business: {
        beginner: [
            { id: 'b_b_1', text: "Good morning team, please send me your weekly reports by Friday. We need to track our progress carefully. Let me know if you have any questions." },
            { id: 'b_b_2', text: "We value our customers very much. If a client has a problem, listen to them patiently. Solvng their issue quickly will build trust and loyalty." },
            { id: 'b_b_3', text: "Meeting deadlines is important for the success of our project. Use your calendar to plan your tasks. Time management is a key skill for everyone." }
        ],
        intermediate: [
            { id: 'b_i_1', text: "The quarterly financial review indicates a positive trend in revenue growth. However, operating expenses have also increased due to the recent expansion. We need to implement cost-saving measures in the logistics department to maximize our net profit margin for the next fiscal year." },
            { id: 'b_i_2', text: "Effective communication is the cornerstone of a successful organization. When drafting emails to stakeholders, ensure your message is clear, concise, and professional. Avoid jargon that might confuse the recipient and always proofread before hitting send." }
        ],
        professional: [
            { id: 'b_p_1', text: "Leveraging synergy across cross-functional teams is paramount for our strategic initiatives. By dismantling silos and fostering a culture of collaboration, we can accelerate innovation and reduce time-to-market. The leadership team is committed to providing the necessary resources to facilitate this organizational transformation." },
            { id: 'b_p_2', text: "A robust risk management framework is essential for navigating market volatility. We must identify potential threats, assess their impact, and develop mitigation strategies. This proactive approach ensures business continuity and protects shareholder value in an unpredictable economic landscape." }
        ]
    },
    interview: {
        beginner: [
            { id: 'i_b_1', text: "I am a hard worker and I enjoy learning new things. In my last job, I was always on time. I like working with others to solve problems." },
            { id: 'i_b_2', text: "My biggest strength is my attention to detail. I check my work carefully to avoid mistakes. I am also very organized and keep my desk clean." },
            { id: 'i_b_3', text: "I want to work here because your company has a great reputation. I admire your products and would be proud to be part of the team." }
        ],
        intermediate: [
            { id: 'i_i_1', text: "Can you describe a time when you had to handle a difficult client? I listened to their concerns without interrupting and empathized with their situation. I then offered a solution that addressed their specific needs, which resulted in them renewing their contract." },
            { id: 'i_i_2', text: "Where do you see yourself in five years? I hope to have grown within this role and taken on more leadership responsibilities. I am passionate about mentorship and would love to help train new team members as I gain more experience." }
        ],
        professional: [
            { id: 'i_p_1', text: "Describe a complex problem you solved using data analysis. I noticed a decline in user retention, so I analyzed the engagement metrics. The data revealed a bottleneck in the onboarding process. By redesigning the UI workflow, we improved retention by 15% within three months." },
            { id: 'i_p_2', text: "How do you prioritize tasks when working on multiple projects with tight deadlines? I utilize the Eisenhower Matrix to categorize tasks by urgency and importance. This helps me focus on high-impact activities while delegating or scheduling less critical items, ensuring all project milestones are met efficiently." }
        ]
    }
};

export const getRandomText = (mode: TypingMode, difficulty: Difficulty): string => {
    const options = TYPING_DATA[mode][difficulty];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex].text;
};
