import { Question } from "../aptitudeQuestions";

export const dataInterpretationQuestions: Question[] = [
    {
        question: "Data Set 1: A factory produces three items X, Y, and Z in the ratio 3:4:5. The total production is 1200 units. What is the total number of units of item X produced?",
        options: ["300 units","400 units","200 units","500 units"],
        correct: 0,
        explanation: "Item X represents 3 parts out of a total of 12 parts (3+4+5), so its production is (3/12) * 1200 = 300 units."
    },
    {
        question: "Data Set 1: A factory produces three items X, Y, and Z in the ratio 3:4:5. The total production is 1200 units. What is the difference between the production of item Z and item Y?",
        options: ["50 units","150 units","100 units","200 units"],
        correct: 2,
        explanation: "The difference in ratio parts between Z (5) and Y (4) is 1 part, and since 1 part equals 100 units (1200/12), the difference is 100 units."
    },
    {
        question: "Data Set 1: A factory produces three items X, Y, and Z in the ratio 3:4:5. The total production is 1200 units. What is the ratio of item X to item Z?",
        options: ["3:4","3:5","4:5","5:3"],
        correct: 1,
        explanation: "Directly from the given composite ratio of 3:4:5 for X:Y:Z, the isolated ratio for X to Z is simply 3:5."
    },
    {
        question: "Data Set 1: A factory produces three items X, Y, and Z in the ratio 3:4:5. The total production is 1200 units. If 10% of item Y produced are defective, how many units of item Y are non-defective?",
        options: ["40 units","400 units","320 units","360 units"],
        correct: 3,
        explanation: "Total Y produced is 400 units (4 parts); 10% defective leaves 90% non-defective, which is 0.90 * 400 = 360 units."
    },
    {
        question: "Data Set 1: A factory produces three items X, Y, and Z in the ratio 3:4:5. The total production is 1200 units. What is the average production of the three items?",
        options: ["600 units","300 units","400 units","500 units"],
        correct: 2,
        explanation: "The average is simply the total sum of all units divided by the number of categories, which is 1200 / 3 = 400 units."
    },
    {
        question: "Data Set 2: A family's monthly income is Rs. 50,000. They spend 30% on Rent, 20% on Food, 10% on Bills, and save the rest. How much amount is saved monthly?",
        options: ["Rs. 15,000","Rs. 20,000","Rs. 25,000","Rs. 10,000"],
        correct: 1,
        explanation: "Total expenses are 60% (30+20+10), meaning savings account for 40% of the income, which is 0.40 * 50,000 = Rs. 20,000."
    },
    {
        question: "Data Set 2: A family's monthly income is Rs. 50,000. They spend 30% on Rent, 20% on Food, 10% on Bills, and save the rest. What is the exact amount spent on Food?",
        options: ["Rs. 10,000","Rs. 15,000","Rs. 5,000","Rs. 12,000"],
        correct: 0,
        explanation: "The food expenditure is given as 20% of the total income, yielding 0.20 * 50,000 = Rs. 10,000."
    },
    {
        question: "Data Set 2: A family's monthly income is Rs. 50,000. They spend 30% on Rent, 20% on Food, 10% on Bills, and save the rest. What is the difference between the amount spent on Rent and Bills?",
        options: ["Rs. 5,000","Rs. 15,000","Rs. 10,000","Rs. 8,000"],
        correct: 2,
        explanation: "Rent is 30% and Bills are 10%, creating a percentage difference of 20%, which translates to Rs. 10,000."
    },
    {
        question: "Data Set 2: A family's monthly income is Rs. 50,000. They spend 30% on Rent, 20% on Food, 10% on Bills, and save the rest. What is the ratio of the expenditure on Rent to Savings?",
        options: ["3:2","3:4","4:3","1:2"],
        correct: 1,
        explanation: "Rent represents 30% of the income and Savings represents 40%, simplifying to a ratio of 3:4."
    },
    {
        question: "Data Set 2: A family's monthly income is Rs. 50,000. They spend 30% on Rent, 20% on Food, 10% on Bills, and save the rest. If next month the Rent increases by 10% (from its current amount), what is the new Rent?",
        options: ["Rs. 16,000","Rs. 16,500","Rs. 15,500","Rs. 17,000"],
        correct: 1,
        explanation: "Current rent is Rs. 15,000 (30%); a 10% increase on this amount is Rs. 1,500, making the new rent Rs. 16,500."
    },
    {
        question: "Data Set 3: Exam scores out of 100 for two students. Alice: Math 80, Science 70, English 90. Bob: Math 60, Science 90, English 60. What is Alice's total score?",
        options: ["230","220","240","250"],
        correct: 2,
        explanation: "Alice's total score is the direct sum of her individual subjects: 80 + 70 + 90 = 240."
    },
    {
        question: "Data Set 3: Exam scores out of 100 for two students. Alice: Math 80, Science 70, English 90. Bob: Math 60, Science 90, English 60. What is Bob's average score?",
        options: ["70","65","75","80"],
        correct: 0,
        explanation: "Bob's total score is 210 (60 + 90 + 60), which divided by 3 subjects yields an average of 70."
    },
    {
        question: "Data Set 3: Exam scores out of 100 for two students. Alice: Math 80, Science 70, English 90. Bob: Math 60, Science 90, English 60. Who scored higher in Science and by how many marks?",
        options: ["Alice by 20","Bob by 10","Alice by 10","Bob by 20"],
        correct: 3,
        explanation: "Bob scored 90 in Science and Alice scored 70, meaning Bob scored higher by a margin of 20 marks."
    },
    {
        question: "Data Set 3: Exam scores out of 100 for two students. Alice: Math 80, Science 70, English 90. Bob: Math 60, Science 90, English 60. What is the ratio of Alice's Math score to Bob's English score?",
        options: ["3:4","4:3","5:3","3:5"],
        correct: 1,
        explanation: "Alice's Math score is 80 and Bob's English score is 60, which simplifies by dividing by 20 to get 4:3."
    },
    {
        question: "Data Set 3: Exam scores out of 100 for two students. Alice: Math 80, Science 70, English 90. Bob: Math 60, Science 90, English 60. What is Alice's overall percentage out of the maximum 300 marks?",
        options: ["75%","85%","80%","90%"],
        correct: 2,
        explanation: "Alice's total of 240 marks out of a possible 300 maximum marks translates to exactly 80%."
    },
    {
        question: "Data Set 4: Company Revenue (in millions) for 2019=10, 2020=15, 2021=20. Expenses for 2019=8, 2020=10, 2021=12. (Profit = Revenue - Expenses). What was the profit in 2020?",
        options: ["2 million","5 million","8 million","10 million"],
        correct: 1,
        explanation: "Subtracting the 2020 expenses (10m) from the 2020 revenue (15m) yields a pure profit of 5 million."
    },
    {
        question: "Data Set 4: Company Revenue (in millions) for 2019=10, 2020=15, 2021=20. Expenses for 2019=8, 2020=10, 2021=12. What was the total revenue accumulated over the 3 years?",
        options: ["40 million","35 million","50 million","45 million"],
        correct: 3,
        explanation: "Adding the annual revenue figures together (10 + 15 + 20) results in a total of 45 million."
    },
    {
        question: "Data Set 4: Company Revenue (in millions) for 2019=10, 2020=15, 2021=20. Expenses for 2019=8, 2020=10, 2021=12. What is the percentage increase in expenses from 2019 to 2020?",
        options: ["20%","30%","25%","15%"],
        correct: 2,
        explanation: "Expenses rose from 8 to 10, an increase of 2; the percentage increase is (2/8) * 100 = 25%."
    },
    {
        question: "Data Set 4: Company Revenue (in millions) for 2019=10, 2020=15, 2021=20. Expenses for 2019=8, 2020=10, 2021=12. What is the average annual profit over the 3 years?",
        options: ["4 million","5 million","6 million","3 million"],
        correct: 1,
        explanation: "The annual profits are 2m, 5m, and 8m, which sum to 15m; dividing by 3 years gives an average of 5 million."
    },
    {
        question: "Data Set 4: Company Revenue (in millions) for 2019=10, 2020=15, 2021=20. Expenses for 2019=8, 2020=10, 2021=12. What is the ratio of revenue to expenses in the year 2021?",
        options: ["5:3","4:3","3:2","5:4"],
        correct: 0,
        explanation: "In 2021, revenue was 20 and expenses were 12, simplifying the ratio 20:12 by dividing by 4 to get 5:3."
    },
    {
        question: "Data Set 5: A pie chart shows the distribution of 7200 total votes. Candidate A got 150°, Candidate B got 120°, and Candidate C got 90°. How many total votes did Candidate A receive?",
        options: ["2500 votes","3500 votes","3000 votes","4000 votes"],
        correct: 2,
        explanation: "Candidate A holds 150 out of 360 degrees, making their share (150/360) * 7200 = 3000 votes."
    },
    {
        question: "Data Set 5: A pie chart shows the distribution of 7200 total votes. Candidate A got 150°, Candidate B got 120°, and Candidate C got 90°. What is the absolute difference in votes between Candidate A and Candidate C?",
        options: ["1000 votes","1200 votes","1500 votes","800 votes"],
        correct: 1,
        explanation: "The degree difference is 150° - 90° = 60°, which translates to (60/360) * 7200 = 1200 votes."
    },
    {
        question: "Data Set 5: A pie chart shows the distribution of 7200 total votes. Candidate A got 150°, Candidate B got 120°, and Candidate C got 90°. What percentage of the total votes did Candidate B secure?",
        options: ["25%","30%","40%","33.33%"],
        correct: 3,
        explanation: "Candidate B has 120 degrees out of the full 360-degree circle, which is exactly one-third or 33.33%."
    },
    {
        question: "Data Set 5: A pie chart shows the distribution of 7200 total votes. Candidate A got 150°, Candidate B got 120°, and Candidate C got 90°. What is the ratio of Candidate B's votes to Candidate C's votes?",
        options: ["4:3","3:2","5:4","5:3"],
        correct: 0,
        explanation: "The ratio of votes is identical to the ratio of their pie chart degrees, simplifying 120:90 directly to 4:3."
    },
    {
        question: "Data Set 5: A pie chart shows the distribution of 7200 total votes. Candidate A got 150°, Candidate B got 120°, and Candidate C got 90°. How many total votes did Candidates A and B secure combined?",
        options: ["5000 votes","5400 votes","6000 votes","4800 votes"],
        correct: 1,
        explanation: "Together they hold 270 degrees (150+120), meaning they secured (270/360) * 7200 = 5400 votes."
    },
    {
        question: "Data Set 6: In a college of 500 students, 150 chose Physics, 200 chose Chemistry, and 150 chose Biology. In Biology, the ratio of boys to girls is 1:2. What percentage of the college chose Chemistry?",
        options: ["40%","45%","35%","50%"],
        correct: 0,
        explanation: "With 200 Chemistry students out of a total population of 500, the percentage is (200/500) * 100 = 40%."
    },
    {
        question: "Data Set 6: In a college of 500 students, 150 chose Physics, 200 chose Chemistry, and 150 chose Biology. In Biology, the ratio of boys to girls is 1:2. How many girls are studying Biology?",
        options: ["50","100","75","120"],
        correct: 1,
        explanation: "Girls represent 2 parts out of 3 in the Biology class, meaning (2/3) * 150 = 100 girls."
    },
    {
        question: "Data Set 6: In a college of 500 students, 150 chose Physics, 200 chose Chemistry, and 150 chose Biology. What is the ratio of Physics students to Biology students?",
        options: ["3:4","1:2","1:1","4:3"],
        correct: 2,
        explanation: "Since both Physics and Biology have exactly 150 students enrolled, their ratio simplifies perfectly to 1:1."
    },
    {
        question: "Data Set 6: In a college of 500 students, 150 chose Physics, 200 chose Chemistry, and 150 chose Biology. What is the absolute difference in enrollment between Chemistry and Physics?",
        options: ["50","100","75","25"],
        correct: 0,
        explanation: "Subtracting the 150 Physics students from the 200 Chemistry students leaves a clear difference of 50."
    },
    {
        question: "Data Set 6: In a college of 500 students, 150 chose Physics, 200 chose Chemistry, and 150 chose Biology. If 10% of the Chemistry students are absent on a given day, how many are present?",
        options: ["160","190","180","170"],
        correct: 2,
        explanation: "10% of 200 is 20 students; subtracting the 20 absentees leaves 180 Chemistry students present."
    },
    {
        question: "Data Set 7: Store X sales: Jan=120, Feb=140, Mar=160. Store Y sales: Jan=100, Feb=150, Mar=200. What is the total combined sales for Store X across the three months?",
        options: ["400","420","450","380"],
        correct: 1,
        explanation: "Adding Store X's figures for January, February, and March (120 + 140 + 160) totals exactly 420."
    },
    {
        question: "Data Set 7: Store X sales: Jan=120, Feb=140, Mar=160. Store Y sales: Jan=100, Feb=150, Mar=200. What is the difference in March sales between Store Y and Store X?",
        options: ["20","40","60","50"],
        correct: 1,
        explanation: "In March, Store Y sold 200 and Store X sold 160, resulting in a difference of 40 units."
    },
    {
        question: "Data Set 7: Store X sales: Jan=120, Feb=140, Mar=160. Store Y sales: Jan=100, Feb=150, Mar=200. What is the average monthly sales figure for Store Y?",
        options: ["120","140","160","150"],
        correct: 3,
        explanation: "Store Y's total sales are 450 (100 + 150 + 200); dividing by 3 months gives a neat average of 150."
    },
    {
        question: "Data Set 7: Store X sales: Jan=120, Feb=140, Mar=160. Store Y sales: Jan=100, Feb=150, Mar=200. What is the ratio of Store X's January sales to Store Y's January sales?",
        options: ["5:6","6:5","7:5","4:3"],
        correct: 1,
        explanation: "The raw ratio is 120:100, which simplifies by dividing both sides by 20 to get 6:5."
    },
    {
        question: "Data Set 7: Store X sales: Jan=120, Feb=140, Mar=160. Store Y sales: Jan=100, Feb=150, Mar=200. What is the percentage increase in Store Y's sales from February to March?",
        options: ["25%","30%","50%","33.33%"],
        correct: 3,
        explanation: "Store Y's sales rose by 50 units (200 - 150); over the original 150 base, this is 50/150 = 33.33%."
    },
    {
        question: "Data Set 8: A basket has 120 fruits. 40% are Apples, 35% are Oranges, and the remaining 25% are Bananas. What is the total number of Apples?",
        options: ["40","45","48","50"],
        correct: 2,
        explanation: "Apples make up 40% of the basket, and 0.40 * 120 yields exactly 48 Apples."
    },
    {
        question: "Data Set 8: A basket has 120 fruits. 40% are Apples, 35% are Oranges, and the remaining 25% are Bananas. How many Bananas are in the basket?",
        options: ["25","30","35","20"],
        correct: 1,
        explanation: "Bananas account for the final 25% (or one-quarter) of the 120 fruits, which calculates to 30 Bananas."
    },
    {
        question: "Data Set 8: A basket has 120 fruits. 40% are Apples, 35% are Oranges, and the remaining 25% are Bananas. What is the numerical difference between the quantity of Oranges and Bananas?",
        options: ["10","15","8","12"],
        correct: 3,
        explanation: "The percentage difference is 10% (35% - 25%), and 10% of the 120 total fruits is 12."
    },
    {
        question: "Data Set 8: A basket has 120 fruits. 40% are Apples, 35% are Oranges, and the remaining 25% are Bananas. What is the ratio of Apples to Oranges?",
        options: ["8:7","7:8","4:3","5:4"],
        correct: 0,
        explanation: "The ratio of their quantities is the same as the ratio of their percentages, and 40:35 simplifies to 8:7."
    },
    {
        question: "Data Set 8: A basket has 120 fruits. 40% are Apples, 35% are Oranges, and the remaining 25% are Bananas. If 8 Apples are eaten, how many Apples remain in the basket?",
        options: ["32","38","40","42"],
        correct: 2,
        explanation: "Since there were initially 48 Apples (40% of 120), eating 8 leaves exactly 40 remaining."
    },
    {
        question: "Data Set 9: A village population is 5000. 60% are adults. 50% of these adults are male. 20% of the village children go to school. What is the total number of adults?",
        options: ["2500","3500","3000","4000"],
        correct: 2,
        explanation: "Adults comprise 60% of the entire 5000-person population, which is 0.60 * 5000 = 3000 adults."
    },
    {
        question: "Data Set 9: A village population is 5000. 60% are adults. 50% of these adults are male. 20% of the village children go to school. How many adult females live in the village?",
        options: ["1000","1500","2000","1200"],
        correct: 1,
        explanation: "Out of the 3000 adults, 50% are male, meaning the other 50% are female, which equals 1500."
    },
    {
        question: "Data Set 9: A village population is 5000. 60% are adults. 50% of these adults are male. 20% of the village children go to school. How many total children live in the village?",
        options: ["2000","1500","1000","2500"],
        correct: 0,
        explanation: "Because adults make up 60%, the remaining 40% of the 5000 population are children, totaling 2000."
    },
    {
        question: "Data Set 9: A village population is 5000. 60% are adults. 50% of these adults are male. 20% of the village children go to school. How many children actually go to school?",
        options: ["200","600","400","500"],
        correct: 2,
        explanation: "Only 20% of the 2000 children attend school, which equates to 0.20 * 2000 = 400 children."
    },
    {
        question: "Data Set 9: A village population is 5000. 60% are adults. 50% of these adults are male. 20% of the village children go to school. What is the ratio of Adult Males to the total number of Children?",
        options: ["4:3","3:4","1:2","3:5"],
        correct: 1,
        explanation: "There are 1500 Adult Males and 2000 Children, giving a raw ratio of 1500:2000 that simplifies to 3:4."
    },
    {
        question: "Data Set 10: A factory's car production: Sedans=400, SUVs=300, Hatchbacks=500. Additionally, 10% of all Sedans produced are painted red. What is the total number of cars produced?",
        options: ["1000","1500","1200","1100"],
        correct: 2,
        explanation: "Adding the production figures of all three vehicle types (400 + 300 + 500) results in a total of 1200 cars."
    },
    {
        question: "Data Set 10: A factory's car production: Sedans=400, SUVs=300, Hatchbacks=500. What percentage of the total car production is made up of SUVs?",
        options: ["20%","25%","30%","33.33%"],
        correct: 1,
        explanation: "SUVs account for 300 out of the 1200 total vehicles, which simplifies to 1/4 or exactly 25%."
    },
    {
        question: "Data Set 10: A factory's car production: Sedans=400, SUVs=300, Hatchbacks=500. What is the ratio of Hatchbacks to Sedans produced?",
        options: ["5:3","4:5","5:4","3:5"],
        correct: 2,
        explanation: "Comparing the 500 Hatchbacks to the 400 Sedans directly gives a simplified ratio of 5:4."
    },
    {
        question: "Data Set 10: A factory's car production: Sedans=400, SUVs=300, Hatchbacks=500. Additionally, 10% of all Sedans produced are painted red. How many red Sedans were produced?",
        options: ["20","30","50","40"],
        correct: 3,
        explanation: "With 400 Sedans produced in total, 10% of that figure equates to exactly 40 red Sedans."
    },
    {
        question: "Data Set 10: A factory's car production: Sedans=400, SUVs=300, Hatchbacks=500. What is the numerical difference in production between Hatchbacks and SUVs?",
        options: ["100","200","150","250"],
        correct: 1,
        explanation: "Subtracting the 300 SUVs from the 500 Hatchbacks yields a clear production difference of 200 cars."
    }
];
