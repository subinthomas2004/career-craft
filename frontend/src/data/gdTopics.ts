export interface TopicResponse {
    role: string; // 'Initiator' | 'Contrarian' | 'Analyst' | 'Mediator' | 'Summarizer'
    points: string[];
}

export interface TopicData {
    topic: string;
    category: string;
    responses: TopicResponse[];
}

// Helper to get generic responses if a specific topic isn't fully populated
export const GENERIC_RESPONSES: TopicResponse[] = [
    {
        role: 'Initiator',
        points: [
            "Let's bring this discussion to order. The topic at hand is quite significant.",
            "I'd like to start by defining what we are actually discussing here.",
            "From my perspective, this topic has two main sides we should explore.",
            "Let's open the floor. What are everyone's initial thoughts?",
            "I think we should look at the long-term implications of this."
        ]
    },
    {
        role: 'Contrarian',
        points: [
            "I have to disagree with the popular opinion here.",
            "is that really true in all cases? I can think of several exceptions.",
            "We might be overlooking the downsides.",
            "That sounds good on paper, but practically, it's flawed.",
            "I'm not convinced that's the only way to look at it."
        ]
    },
    {
        role: 'Analyst',
        points: [
            "If we look at the data, the trends suggest otherwise.",
            "Statistically speaking, this impacts a significant percentage of the population.",
            "We need to be objective and look at the facts.",
            "The numbers don't lie, and they point to a different conclusion.",
            "Let's analyze the cost-benefit ratio here."
        ]
    },
    {
        role: 'Mediator',
        points: [
            "I see valid points on both sides.",
            "Let's try to find a middle ground.",
            "We are drifting a bit; let's get back to the core topic.",
            "That's a great point, but let's also consider what was said earlier.",
            "Both of you are right in different contexts."
        ]
    },
    {
        role: 'Summarizer',
        points: [
            "To wrap things up, we've covered several key aspects.",
            "In conclusion, while there are challenges, the opportunities are also significant.",
            "Let's summarize the main arguments we've heard so far.",
            "It seems we all agree on the fundamental issue, even if our solutions differ.",
            "Bringing it all together, the consensus seems to be cautious optimism."
        ]
    }
];

export const GD_TOPICS_DATA: TopicData[] = [
    {
        topic: "Impact of Social Media on Youth",
        category: "Social Issues",
        responses: [
            {
                role: 'Initiator',
                points: [
                    "I believe social media has revolutionized how we connect, but we must ask: at what cost to our mental health?",
                    "Let's discuss whether social media is a tool for empowerment or a distraction for the youth.",
                    "In today's world, a young person's identity is often shaped by their online presence. Is this healthy?",
                    "We need to examine if social media bridges gaps or creates more isolation among teenagers."
                ]
            },
            {
                role: 'Contrarian',
                points: [
                    "Everyone blames social media, but isn't it just a reflection of society? The problem might be us, not the platform.",
                    "I disagree that it's all bad. Think about the educational resources and communities available to youth now.",
                    "Blaming social media for mental health issues is a convenient scapegoat for broader parenting and societal failures.",
                    "We focus too much on the addiction aspect and ignore the creativity and entrepreneurship it fosters."
                ]
            },
            {
                role: 'Analyst',
                points: [
                    "Studies show that excessive screen time correlates with higher rates of anxiety in teens.",
                    "Data suggests that 70% of youth use social media as their primary news source, which leads to misinformation bubbles.",
                    "If we look at the metrics, cyberbullying incidents have risen by 40% alongside social media adoption.",
                    "However, we also see a 30% increase in youth-led social movements organized entirely online."
                ]
            },
            {
                role: 'Mediator',
                points: [
                    "Let's not demonize technology entirely; it's about how we use it.",
                    "I think Alex made a good point about mental health, but Sarah is right about the educational value.",
                    "Can we agree that moderation is the key missing factor here?",
                    "It seems the platform itself isn't the enemy, but the lack of digital literacy is."
                ]
            },
            {
                role: 'Summarizer',
                points: [
                    "To conclude, while social media poses risks like addiction and anxiety, it also offers unparalleled connectivity.",
                    "We've discussed both the mental health toll and the opportunities for learning. The consensus is a need for better regulation.",
                    "Wrapping up, it's clear that social media is a double-edged sword that requires responsible usage.",
                    "In the end, the impact depends largely on individual usage habits and parental guidance."
                ]
            }
        ]
    },
    {
        topic: "Impact of AI on Jobs",
        category: "Technology",
        responses: [
            {
                role: 'Initiator',
                points: [
                    "Artificial Intelligence is automating tasks at an unprecedented rate. Will this lead to mass unemployment?",
                    "We need to discuss whether AI is a collaborator that boosts productivity or a competitor that replaces humans.",
                    "Let's start by looking at how AI is reshaping industries like coding, writing, and customer service."
                ]
            },
            {
                role: 'Contrarian',
                points: [
                    "People feared computers would kill jobs too, but they created millions more. AI will do the same.",
                    "The idea that AI will replace everyone is alarmist. It lacks human empathy and genuine creativity.",
                    "Automation only removes the boring parts of jobs, allowing us to focus on higher-level thinking."
                ]
            },
            {
                role: 'Analyst',
                points: [
                    "Reports indicate that while 85 million jobs may be displaced, 97 million new roles could emerge by 2025.",
                    "The shift is real—routine cognitive jobs are declining, while demand for AI ethics and maintenance is skyrocketing.",
                    "We can't ignore the short-term disruption. The transition period will be painful for many low-skilled workers."
                ]
            },
            {
                role: 'Mediator',
                points: [
                    "Maybe the answer isn't 'vs' but 'with'. AI augmentation seems more likely than full replacement.",
                    "I hear the fear of job loss, but also the optimism about efficiency. We need to bridge this with reskilling.",
                    "Let's focus on how the education system needs to adapt to prepare youth for this AI-driven market."
                ]
            },
            {
                role: 'Summarizer',
                points: [
                    "Today's discussion highlighted that AI will transform rather than destroy the job market.",
                    "We agreed that while automation is inevitable, human skills like empathy and complex problem-solving remain unique.",
                    "The key takeaway is that adaptation and continuous learning are no longer optional."
                ]
            }
        ]
    },
    {
        topic: "Women Empowerment in India",
        category: "Social Issues",
        responses: [
            {
                role: 'Initiator',
                points: [
                    "India has seen progress in women's rights, but are we truly empowered, or is it just on paper?",
                    "Let's discuss the gap between urban and rural women when it comes to empowerment.",
                    "I want to bring up the issue of financial independence as a core pillar of empowerment."
                ]
            },
            {
                role: 'Contrarian',
                points: [
                    "We talk about laws, but implementation is zero in many states. Safety is still a huge barrier.",
                    "Is it really empowerment if the burden of household chores still falls 100% on working women?",
                    "I think corporate 'diversity hiring' is often tokenism rather than genuine empowerment."
                ]
            },
            {
                role: 'Analyst',
                points: [
                    "Statistics show women's participation in the workforce in India has actually declined in some sectors recently.",
                    "On the bright side, the literacy rate gap between men and women is narrowing faster than ever.",
                    "We have more women in STEM in India compared to many developed nations, which is a positive data point."
                ]
            },
            {
                role: 'Mediator',
                points: [
                    "We must acknowledge the cultural shifts happening, even if they are slow.",
                    "It's valid to say safety is an issue, but we shouldn't overlook the milestones achieved in education.",
                    "Let's look at how government schemes are actually reaching the grassroots level."
                ]
            },
            {
                role: 'Summarizer',
                points: [
                    "To wrap up, women empowerment in India is a work in progress with significant milestones but deep-rooted challenges.",
                    "We covered economic independence, safety, and cultural barriers. The consensus is that mindset change is key.",
                    "Ultimately, true empowerment will come when society treats women as equals not just in law, but in practice."
                ]
            }
        ]
    }
];
