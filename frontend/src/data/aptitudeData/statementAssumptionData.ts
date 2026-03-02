import { Question } from "../aptitudeQuestions";

export const statementAssumptionQuestions: Question[] = [
    {
        question: "Statement: 'To open a zero-balance salary account, please submit your company ID and PAN card.' - A notice at a bank branch. \nAssumption I: People without a company ID cannot open this specific account. \nAssumption II: Everyone reading the notice wants to open a salary account.",
        options: ["Neither Assumption I nor II is implicit.","Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Only Assumption I is implicit."],
        correct: 3,
        explanation: "The notice states the mandatory requirements for the account, making I implicit. However, not everyone reading a public notice necessarily wants the account, making II invalid."
    },
    {
        question: "Statement: The government has decided to reduce taxes on electric vehicles (EVs) by 10%. \nAssumption I: The government wants to encourage the purchase of EVs. \nAssumption II: People are currently not buying EVs because they are too expensive.",
        options: ["Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption I is implicit."],
        correct: 1,
        explanation: "Tax reductions are typically incentives designed to boost sales (I), assuming that cost is currently a barrier for consumers (II)."
    },
    {
        question: "Statement: 'Use our software to detect grammar errors in your emails instantly.' - An advertisement. \nAssumption I: People make grammar errors while writing emails. \nAssumption II: People care about writing grammatically correct emails.",
        options: ["Only Assumption I is implicit.","Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit."],
        correct: 2,
        explanation: "The ad exists because the problem (errors) exists, and it assumes consumers desire a solution to that problem."
    },
    {
        question: "Statement: A startup company announced a policy of 'unlimited paid time off' for all its employees. \nAssumption I: Employees will not abuse the policy and take 300 days off. \nAssumption II: The company's productivity will immediately double.",
        options: ["Only Assumption I is implicit.","Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit."],
        correct: 0,
        explanation: "Implementing trust-based policies assumes employees will act responsibly (I). There is no logical guarantee that productivity will double (II)."
    },
    {
        question: "Statement: 'Due to severe fog, all flights departing before 10 AM have been rescheduled.' - Airport Authority. \nAssumption I: The fog will clear up after 10 AM. \nAssumption II: Passengers will be willing to wait for the rescheduled flights.",
        options: ["Both Assumptions I and II are implicit.","Only Assumption I is implicit.","Neither Assumption I nor II is implicit.","Only Assumption II is implicit."],
        correct: 1,
        explanation: "The authority reschedules based on a weather forecast assuming conditions will improve (I). They cannot assume passenger willingness (II)."
    },
    {
        question: "Statement: The city police have installed high-definition speed cameras on the main highway. \nAssumption I: The cameras will physically stop cars from speeding. \nAssumption II: Drivers will reduce their speed to avoid being fined.",
        options: ["Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption I is implicit."],
        correct: 0,
        explanation: "Cameras monitor and penalize; they do not physically stop cars (I). The assumption is that the fear of a penalty deters speeding (II)."
    },
    {
        question: "Statement: 'Invest in our mutual fund for tax-free returns up to $5,000.' - A bank's promotional email. \nAssumption I: The recipients of the email pay taxes and want to save on them. \nAssumption II: The bank's mutual fund is the only tax-free option in the market.",
        options: ["Only Assumption I is implicit.","Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit."],
        correct: 0,
        explanation: "Promotions target a specific consumer desire (saving tax). The ad does not assume it is the *only* option, just a viable one."
    },
    {
        question: "Statement: The HR department sent a memo stating, 'All employees must complete the cybersecurity training by Friday.' \nAssumption I: Employees have the necessary equipment to complete the training. \nAssumption II: Cybersecurity is a priority for the company.",
        options: ["Only Assumption II is implicit.","Only Assumption I is implicit.","Neither Assumption I nor II is implicit.","Both Assumptions I and II are implicit."],
        correct: 3,
        explanation: "Mandating a task assumes the resources to do it exist (I) and that the task holds significant value to the organization (II)."
    },
    {
        question: "Statement: 'If you are a computer science graduate, you are eligible to apply for the Junior Developer role.' \nAssumption I: The role requires knowledge typically taught in a computer science degree. \nAssumption II: All computer science graduates will apply for this role.",
        options: ["Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption I is implicit.","Only Assumption II is implicit."],
        correct: 2,
        explanation: "Eligibility criteria are based on required skills (I). However, eligibility does not guarantee intent to apply (II)."
    },
    {
        question: "Statement: The local council has banned single-use plastic bags in all supermarkets. \nAssumption I: Supermarkets can provide alternative types of bags. \nAssumption II: Plastic bags were causing environmental issues in the locality.",
        options: ["Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Only Assumption I is implicit.","Neither Assumption I nor II is implicit."],
        correct: 1,
        explanation: "A ban assumes the existence of alternatives (I) and is driven by an underlying problem the banned item caused (II)."
    },
    {
        question: "Statement: 'For better network coverage, switch to our 5G premium plan today.' - A telecom operator. \nAssumption I: The current plan the user is on has coverage issues. \nAssumption II: The 5G premium plan actually provides better coverage.",
        options: ["Neither Assumption I nor II is implicit.","Only Assumption I is implicit.","Both Assumptions I and II are implicit.","Only Assumption II is implicit."],
        correct: 2,
        explanation: "The ad targets a pain point (current bad coverage) and assumes its product genuinely solves it."
    },
    {
        question: "Statement: 'Warning: This medicine may cause drowsiness. Do not drive heavy machinery after consumption.' \nAssumption I: Drowsiness impairs the ability to operate heavy machinery safely. \nAssumption II: Patients will read and follow the warning label.",
        options: ["Both Assumptions I and II are implicit.","Only Assumption I is implicit.","Only Assumption II is implicit.","Neither Assumption I nor II is implicit."],
        correct: 0,
        explanation: "The warning links the side effect to a danger (I) and is printed with the expectation that it will be adhered to (II)."
    },
    {
        question: "Statement: The manager praised Alex in front of the whole team to boost morale. \nAssumption I: Public praise has a positive effect on team morale. \nAssumption II: Alex was the only person who did good work.",
        options: ["Only Assumption I is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption II is implicit."],
        correct: 0,
        explanation: "The action is taken with the belief that it works (I). Praising one person does not assume others did poorly (II)."
    },
    {
        question: "Statement: A sign outside a restaurant reads, 'No outside food or drinks allowed.' \nAssumption I: Customers might bring their own food if the sign wasn't there. \nAssumption II: The restaurant serves food and drinks of higher quality than outside sources.",
        options: ["Neither Assumption I nor II is implicit.","Only Assumption II is implicit.","Both Assumptions I and II are implicit.","Only Assumption I is implicit."],
        correct: 3,
        explanation: "Rules are made to prevent likely behaviors (I). The rule is about business revenue, not a claim about quality (II)."
    },
    {
        question: "Statement: The government has doubled the budget for public healthcare this year. \nAssumption I: The previous healthcare budget was insufficient. \nAssumption II: The new budget will completely eradicate all diseases.",
        options: ["Both Assumptions I and II are implicit.","Only Assumption I is implicit.","Neither Assumption I nor II is implicit.","Only Assumption II is implicit."],
        correct: 1,
        explanation: "Increasing funds assumes a past deficit or rising need (I). Eradicating all diseases is an extreme, unrealistic assumption (II)."
    },
    {
        question: "Statement: 'To ensure your account security, change your password every 90 days.' - IT Security Protocol. \nAssumption I: Passwords kept for longer than 90 days are more vulnerable to being hacked. \nAssumption II: Hackers only attack accounts that have old passwords.",
        options: ["Only Assumption II is implicit.","Neither Assumption I nor II is implicit.","Both Assumptions I and II are implicit.","Only Assumption I is implicit."],
        correct: 3,
        explanation: "The policy is based on the risk of password staleness (I). It does not assume hackers exclusively target old passwords (II)."
    },
    {
        question: "Statement: 'Buy two pairs of shoes and get the third one free!' - A retail store offer. \nAssumption I: Customers will be tempted to buy more to get a free item. \nAssumption II: The store makes a profit even after giving away a free pair.",
        options: ["Only Assumption I is implicit.","Both Assumptions I and II are implicit.","Only Assumption II is implicit.","Neither Assumption I nor II is implicit."],
        correct: 1,
        explanation: "Sales tactics rely on consumer psychology (I) and must be financially viable for the business to implement them (II)."
    },
    {
        question: "Statement: The school principal declared that mobile phones will be confiscated if found during class hours. \nAssumption I: Mobile phones cause distractions during class hours. \nAssumption II: Confiscation is a strict enough penalty to deter students.",
        options: ["Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption I is implicit.","Only Assumption II is implicit."],
        correct: 0,
        explanation: "The ban assumes the device is harmful to the learning environment (I) and that the chosen punishment will work (II)."
    },
    {
        question: "Statement: 'Download our app to get real-time stock market updates.' \nAssumption I: People using the app are interested in the stock market. \nAssumption II: Real-time updates are essential for stock market investors.",
        options: ["Only Assumption I is implicit.","Neither Assumption I nor II is implicit.","Only Assumption II is implicit.","Both Assumptions I and II are implicit."],
        correct: 3,
        explanation: "The product targets a specific demographic (I) by highlighting a feature that that demographic values highly (II)."
    },
    {
        question: "Statement: A famous athlete was dropped from a brand's endorsement deal after a public scandal. \nAssumption I: Endorsing a scandalous figure negatively impacts the brand's image. \nAssumption II: The athlete will stop playing sports entirely.",
        options: ["Only Assumption I is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption II is implicit."],
        correct: 0,
        explanation: "Brands drop ambassadors to protect their own reputation (I). The brand's action does not assume anything about the athlete's sporting career (II)."
    },
    {
        question: "Statement: 'We require a minimum 70% aggregate in graduation for this entry-level engineering position.' \nAssumption I: Students with less than 70% cannot be good engineers. \nAssumption II: Academic aggregate is a valid metric to filter candidates.",
        options: ["Only Assumption II is implicit.","Only Assumption I is implicit.","Neither Assumption I nor II is implicit.","Both Assumptions I and II are implicit."],
        correct: 0,
        explanation: "The policy uses scores as a filtering tool (II), but it does not definitively declare that lower scorers are inherently incapable (I)."
    },
    {
        question: "Statement: The railway authority added five extra trains to the schedule during the festival week. \nAssumption I: There will be a significant increase in passenger traffic during the festival. \nAssumption II: The existing trains cannot handle the festival rush.",
        options: ["Only Assumption II is implicit.","Only Assumption I is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit."],
        correct: 2,
        explanation: "Capacity is increased because high demand is anticipated (I) and current capacity is deemed insufficient for that peak (II)."
    },
    {
        question: "Statement: 'Please do not feed the animals.' - A sign at the zoo. \nAssumption I: Human food might be harmful to the zoo animals. \nAssumption II: Visitors have a tendency to try and feed the animals.",
        options: ["Neither Assumption I nor II is implicit.","Both Assumptions I and II are implicit.","Only Assumption I is implicit.","Only Assumption II is implicit."],
        correct: 1,
        explanation: "Prohibitions are based on protecting safety/health (I) and preventing a common human behavior (II)."
    },
    {
        question: "Statement: The CEO stepped down, citing 'personal health reasons' during a period of massive company losses. \nAssumption I: The CEO is actually in poor health. \nAssumption II: 'Personal health' is a polite excuse to resign due to the losses.",
        options: ["Only Assumption I is implicit.","Only Assumption II is implicit.","Neither Assumption I nor II is implicit.","Both Assumptions I and II are implicit."],
        correct: 2,
        explanation: "Neither can be definitively assumed from the statement alone. It could be genuinely health, or it could be an excuse, but logic requires taking the statement at face value without assuming hidden motives unless stated."
    },
    {
        question: "Statement: 'Submit your project by 5 PM, or a 10% penalty will be applied.' - A professor. \nAssumption I: The threat of a penalty will ensure students submit on time. \nAssumption II: The professor will not accept any project after 5 PM.",
        options: ["Only Assumption I is implicit.","Both Assumptions I and II are implicit.","Neither Assumption I nor II is implicit.","Only Assumption II is implicit."],
        correct: 0,
        explanation: "Penalties are designed as deterrents to enforce deadlines (I). Assumption II is false because a '10% penalty' implies late submissions *are* accepted, just graded lower."
    },
    {
        question: "Statement: All the developers in the startup are proficient in Python. Mark is a developer in the startup. \nConclusion I: Mark is proficient in Python. \nConclusion II: Mark is proficient in Java.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusions I and II follow."],
        correct: 1,
        explanation: "Since Mark belongs to the group 'developers in the startup', he shares their defined trait (Python proficiency). Nothing is mentioned about Java."
    },
    {
        question: "Statement: Company X's profit increased by 40% after they shifted to a remote work model. \nConclusion I: Remote work always leads to higher profits for every company. \nConclusion II: Shifting to remote work had a positive financial impact on Company X.",
        options: ["Both Conclusions I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 2,
        explanation: "We can conclude it helped Company X specifically (II), but we cannot generalize this to 'every company' (I) based on one example."
    },
    {
        question: "Statement: The stock market indices fell sharply today following the central bank's announcement of an interest rate hike. \nConclusion I: Interest rate hikes generally cause panic among stock investors. \nConclusion II: The central bank should not have hiked the interest rates.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusions I and II follow."],
        correct: 2,
        explanation: "The statement shows a direct market reaction, supporting Conclusion I. Conclusion II is an opinion/advice, not a logical deduction from the fact."
    },
    {
        question: "Statement: Only hard-working students secure top ranks in the university exams. Jane secured the top rank this year. \nConclusion I: Jane is a hard-working student. \nConclusion II: Students who do not work hard will fail the exams.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusions I and II follow.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "Because top ranks require hard work, and Jane got the top rank, she must be hard-working (I). The statement does not mention failing, only top ranks (II)."
    },
    {
        question: "Statement: During the summer, the electricity board imposes scheduled power cuts in the industrial area to manage grid load. \nConclusion I: The industrial area consumes a significant amount of electricity. \nConclusion II: Residential areas never face power cuts in summer.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusions I and II follow.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "Targeting the industrial area to manage load implies it draws heavy power (I). The statement says nothing about residential areas (II)."
    },
    {
        question: "Statement: If the software code has bugs, the testing team will find them before release. The software was released yesterday. \nConclusion I: The software code currently has no known bugs. \nConclusion II: The testing team did not do their job properly.",
        options: ["Only Conclusion II follows.","Both Conclusions I and II follow.","Only Conclusion I follows.","Neither Conclusion I nor II follows."],
        correct: 2,
        explanation: "The conditional statement guarantees bugs are found before release. Since it was released, it logically follows that it cleared the testing phase without remaining known bugs (I)."
    },
    {
        question: "Statement: People who read books regularly tend to have better vocabularies. Sarah has an excellent vocabulary. \nConclusion I: Sarah reads books regularly. \nConclusion II: Reading books is the only way to improve vocabulary.",
        options: ["Both Conclusions I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 1,
        explanation: "The statement says reading *tends* to improve vocabulary, not that it's the *only* cause. Sarah might have a great vocabulary from other sources. Neither follows."
    },
    {
        question: "Statement: An apple a day keeps the doctor away. \nConclusion I: Apples have health benefits. \nConclusion II: Doctors hate apples.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusions I and II follow.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "The proverb idiomatically means apples are healthy (I). Conclusion II takes the idiom literally and absurdly."
    },
    {
        question: "Statement: Over 80% of urban youth spend more than 4 hours a day on social media, leading to decreased physical activity. \nConclusion I: Social media usage is inversely proportional to physical activity among urban youth. \nConclusion II: Rural youth do not use social media.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusions I and II follow.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "The statement explicitly links high screen time to decreased physical activity (I). It provides no data on rural youth (II)."
    },
    {
        question: "Statement: The new traffic laws have tripled the fines for jumping a red light. \nConclusion I: The government wants to strictly discourage jumping red lights. \nConclusion II: The government is trying to increase its revenue quickly.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusions I and II follow.","Only Conclusion I follows."],
        correct: 3,
        explanation: "Increasing fines is a direct regulatory measure to deter bad behavior (I). Assuming the motive is purely financial revenue (II) is an assumption, not a logical deduction."
    },
    {
        question: "Statement: Organic vegetables are more expensive than non-organic ones because farming them requires more manual labor and yields smaller crops. \nConclusion I: Non-organic vegetables use artificial means to boost crop yield. \nConclusion II: Consumers should stop buying organic vegetables to save money.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusions I and II follow."],
        correct: 0,
        explanation: "The statement only discusses the labor and yield of *organic* farming. It doesn't explicitly state *how* non-organic yields are higher (I), and it certainly doesn't advise consumers on what to buy (II)."
    },
    {
        question: "Statement: All mangoes are golden in color. No golden-colored things are cheap. \nConclusion I: All mangoes are expensive. \nConclusion II: Cheap apples are not golden.",
        options: ["Only Conclusion I follows.","Both Conclusions I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "If mangoes are golden, and golden things are not cheap, then mangoes are not cheap (expensive) (I). If golden things aren't cheap, then anything cheap (like apples) cannot be golden (II)."
    },
    {
        question: "Statement: In a recent survey, 90% of employees stated they would prefer a hybrid work model over full-time office work. \nConclusion I: The traditional full-time office model is losing popularity among workers. \nConclusion II: Companies will be forced to adopt hybrid models.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusions I and II follow.","Only Conclusion II follows."],
        correct: 1,
        explanation: "The high preference for hybrid indicates a shift away from traditional models (I). However, what companies will be 'forced' to do cannot be concluded just from employee preference (II)."
    },
    {
        question: "Statement: To pass the exam, a student must score at least 40 in Math and 50 in Science. John scored 45 in Math and 48 in Science. \nConclusion I: John failed the exam. \nConclusion II: John is weak in Science.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusions I and II follow.","Only Conclusion II follows."],
        correct: 1,
        explanation: "John did not meet the 50-mark threshold for Science, so he failed (I). Scoring a 48 doesn't necessarily mean he is 'weak' in general, just that he didn't meet the cutoff (II)."
    },
    {
        question: "Statement: Exposure to sunlight helps the human body produce Vitamin D. \nConclusion I: People living in regions with very little sunlight are at risk of Vitamin D deficiency. \nConclusion II: Vitamin D cannot be obtained from food sources.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusions I and II follow."],
        correct: 1,
        explanation: "If sunlight produces Vitamin D, lack of sunlight logically increases the risk of deficiency (I). The statement does not exclude other sources like food (II)."
    },
    {
        question: "Statement: A country's GDP grew by 7%, but its unemployment rate also reached a 10-year high. \nConclusion I: Economic growth does not always result in job creation. \nConclusion II: The GDP growth was entirely driven by automation.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusions I and II follow."],
        correct: 1,
        explanation: "The simultaneous rise in GDP and unemployment proves that growth doesn't guarantee jobs (I). The cause of the growth (automation) is not stated and cannot be concluded (II)."
    },
    {
        question: "Statement: 'Any customer with a credit score above 750 is pre-approved for a home loan.' \nConclusion I: Customers with a credit score of 720 will be denied a home loan. \nConclusion II: A good credit score reduces the friction in getting a loan.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusions I and II follow.","Only Conclusion II follows."],
        correct: 3,
        explanation: "The statement doesn't say lower scores are denied, just that they aren't *pre-approved* (I). The ease of pre-approval for high scores supports Conclusion II."
    },
    {
        question: "Statement: Smoking is injurious to health and is a leading cause of lung cancer. \nConclusion I: Non-smokers will never get lung cancer. \nConclusion II: Government should ban the manufacturing of cigarettes.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusions I and II follow.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "Smoking is *a* cause, not the *only* cause, so non-smokers can still get it (I). Conclusion II is an opinion/course of action, not a logical deduction from the statement."
    },
    {
        question: "Statement: Most successful entrepreneurs are voracious readers. \nConclusion I: If you read a lot, you will definitely become a successful entrepreneur. \nConclusion II: Reading helps in developing an entrepreneurial mindset.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusions I and II follow.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "Reading is common among entrepreneurs, implying it aids success (II), but it is not a guaranteed formula for success on its own (I)."
    },
    {
        question: "Statement: Due to the global chip shortage, the price of laptops has increased by 20%. \nConclusion I: The manufacturing cost of laptops has gone up. \nConclusion II: People will stop buying laptops entirely.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusions I and II follow.","Only Conclusion II follows."],
        correct: 0,
        explanation: "A component shortage raises component prices, which raises manufacturing costs, leading to higher retail prices (I). People stopping purchases entirely is an extreme and illogical conclusion (II)."
    },
    {
        question: "Statement: The weather forecast predicted heavy rain, so the cricket match was canceled. \nConclusion I: Cricket cannot be played in heavy rain. \nConclusion II: The weather forecast is always 100% accurate.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusions I and II follow.","Only Conclusion II follows."],
        correct: 1,
        explanation: "Canceling the match due to rain implies rain disrupts the game (I). Taking action based on a forecast does not prove the forecast is always perfect (II)."
    },
    {
        question: "Statement: Many ancient civilizations built structures aligned with the stars. \nConclusion I: Ancient civilizations had a good understanding of astronomy. \nConclusion II: Aliens helped ancient civilizations build these structures.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusions I and II follow.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "Aligning buildings with stars requires astronomical observation and knowledge (I). There is no logical basis for aliens in the statement (II)."
    },
    {
        question: "Statement: Employees who commute by bicycle are generally fitter and take fewer sick days than those who drive. \nConclusion I: Cycling to work improves physical health. \nConclusion II: Companies should ban employees from driving to work.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusions I and II follow."],
        correct: 0,
        explanation: "The correlation between cycling and fewer sick days supports the health benefit (I). Banning cars is an extreme policy suggestion, not a logical deduction (II)."
    },
    {
        question: "Statement: The city's water reservoir is only at 30% capacity following a weak monsoon. \nConclusion I: The city will face a severe water shortage this year. \nConclusion II: The government should artificially induce rain.",
        options: ["Only Conclusion I follows.","Both Conclusions I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows."],
        correct: 0,
        explanation: "Low reservoir capacity inevitably leads to a water crisis (I). Cloud seeding (induced rain) is a possible course of action, not a direct logical conclusion drawn from the fact (II)."
    },
    {
        question: "Statement: Despite heavy marketing, the new soda flavor failed to capture market share and was discontinued. \nConclusion I: Marketing alone cannot guarantee a product's success. \nConclusion II: The new soda flavor tasted terrible.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusions I and II follow.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "The failure occurred *despite* marketing, proving marketing isn't a silver bullet (I). We don't know *why* it failed—it could be price, taste, or competition—so we cannot conclude it tasted terrible (II)."
    }
];
