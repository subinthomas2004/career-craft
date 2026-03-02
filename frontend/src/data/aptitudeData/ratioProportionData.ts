import { Question } from "../aptitudeQuestions";

export const ratioProportionQuestions: Question[] = [
    {
        question: "If A : B = 3 : 4 and B : C = 8 : 9, then what is A : C?",
        options: ["1:2","2:3","3:4","1:3"],
        correct: 1,
        explanation: "Multiplying the ratios (A/B) * (B/C) gives (3/4) * (8/9) = 24/36, which simplifies to 2/3."
    },
    {
        question: "A sum of Rs. 312 was divided among 100 boys and girls such that each boy gets Rs. 3.60 and each girl gets Rs. 2.40. The number of girls is:",
        options: ["30","40","60","70"],
        correct: 1,
        explanation: "Let girls be x and boys be (100-x); solving 2.40x + 3.60(100-x) = 312 gives 360 - 1.2x = 312, meaning 1.2x = 48, so x = 40."
    },
    {
        question: "The fourth proportional to 5, 8, 15 is:",
        options: ["18","24","20","21"],
        correct: 1,
        explanation: "Using the rule a:b = c:d, we set 5/8 = 15/x, which simplifies to 5x = 120, making x = 24."
    },
    {
        question: "A, B and C started a business by investing Rs. 120000, Rs. 135000 and Rs. 150000 respectively. Find B's share out of an annual profit of Rs. 56700.",
        options: ["Rs. 16800","Rs. 18900","Rs. 21000","Rs. 19500"],
        correct: 1,
        explanation: "The ratio of their investments is 120:135:150, which simplifies to 8:9:10; B's share is (9/27) * 56700 = Rs. 18900."
    },
    {
        question: "If 0.75 : x :: 5 : 8, then x is equal to:",
        options: ["1.12","1.2","1.25","1.3"],
        correct: 1,
        explanation: "Using the product of extremes equals product of means, 5 * x = 0.75 * 8, which means 5x = 6, so x = 1.2."
    },
    {
        question: "Salaries of Ravi and Sumit are in the ratio 2:3. If the salary of each is increased by Rs. 4000, the new ratio becomes 40:57. What is Sumit's present salary?",
        options: ["Rs. 17000","Rs. 25500","Rs. 34000","Rs. 38000"],
        correct: 3,
        explanation: "Solving (2x + 4000)/(3x + 4000) = 40/57 yields 114x + 228000 = 120x + 160000, giving 6x = 68000, so Sumit's salary 3x = Rs. 38000."
    },
    {
        question: "Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:",
        options: ["27","33","36","49"],
        correct: 1,
        explanation: "Setting up (3x - 9)/(5x - 9) = 12/23 gives 69x - 207 = 60x - 108, so 9x = 99, x = 11, making the smaller number 33."
    },
    {
        question: "A and B entered into partnership with capitals in the ratio 4:5. After 3 months, A withdrew 1/4 of his capital and B withdrew 1/5 of his capital. The gain at the end of 10 months was Rs. 760. A's share is:",
        options: ["Rs. 330","Rs. 360","Rs. 380","Rs. 430"],
        correct: 0,
        explanation: "A's ratio = (4*3) + (3*7) = 33; B's ratio = (5*3) + (4*7) = 43; total parts = 76, so A's share is (33/76) * 760 = 330."
    },
    {
        question: "Find the mean proportional between 0.08 and 0.18.",
        options: ["0.12","0.14","0.16","0.18"],
        correct: 0,
        explanation: "The mean proportional is the square root of their product: sqrt(0.08 * 0.18) = sqrt(0.0144) = 0.12."
    },
    {
        question: "In a bag, there are coins of 25 p, 10 p and 5 p in the ratio of 1:2:3. If there is Rs. 30 in all, how many 5 p coins are there?",
        options: ["50","100","150","200"],
        correct: 2,
        explanation: "Value ratio is (1*25) : (2*10) : (3*5) = 25:20:15 = 5:4:3; 5p total value is (3/12)*30 = Rs. 7.50, which is 150 coins."
    },
    {
        question: "A, B, C rent a pasture. A puts 10 oxen for 7 months, B puts 12 oxen for 5 months and C puts 15 oxen for 3 months. If the rent of the pasture is Rs. 175, how much must C pay?",
        options: ["Rs. 45","Rs. 50","Rs. 55","Rs. 60"],
        correct: 0,
        explanation: "The rent ratio is (10*7) : (12*5) : (15*3) = 70:60:45 = 14:12:9; C's share is (9/35) * 175 = Rs. 45."
    },
    {
        question: "The ratio of boys and girls in a college is 5:3. If 50 boys leave the college and 50 girls join the college, the ratio becomes 9:7. The number of boys in the college originally was:",
        options: ["300","400","500","600"],
        correct: 2,
        explanation: "Solving (5x - 50)/(3x + 50) = 9/7 gives 35x - 350 = 27x + 450, meaning 8x = 800, so x = 100, making original boys 500."
    },
    {
        question: "A sum of Rs. 427 is to be divided among A, B and C such that 3 times A's share, 4 times B's share and 7 times C's share are all equal. What is C's share?",
        options: ["Rs. 84","Rs. 140","Rs. 196","Rs. 240"],
        correct: 0,
        explanation: "3A = 4B = 7C = k, so A:B:C = 1/3 : 1/4 : 1/7 = 28:21:12; C's share is (12/61) * 427 = 84."
    },
    {
        question: "X and Y invest Rs. 21000 and Rs. 17500 respectively in a business. At the end of the year, they make a profit of Rs. 26400. What is the share of X?",
        options: ["Rs. 12000","Rs. 14400","Rs. 16000","Rs. 18000"],
        correct: 1,
        explanation: "The ratio of investments is 21000 : 17500 = 6:5; X's profit share is (6/11) * 26400 = Rs. 14400."
    },
    {
        question: "If x : y = 3 : 4, find (4x + 5y) : (5x - 2y).",
        options: ["32:7","7:32","11:5","5:11"],
        correct: 0,
        explanation: "Substituting x=3 and y=4 gives (12 + 20) : (15 - 8) = 32 : 7."
    },
    {
        question: "Two equal glasses of same type are respectively 1/3 and 1/4 full of milk. They are then filled up with water and the contents are mixed in a pot. What is the ratio of milk and water in the pot?",
        options: ["7:17","17:7","9:15","11:13"],
        correct: 0,
        explanation: "Total milk is 1/3 + 1/4 = 7/12; Total volume is 2, so water is 2 - 7/12 = 17/12; The ratio of milk to water is 7:17."
    },
    {
        question: "A, B and C enter into a partnership with investments in the ratio 5:6:8. At the end of the business term, they receive profits in the ratio 5:3:12. Find the ratio of time for which they contributed their capitals.",
        options: ["2:1:3","1:2:3","2:3:1","1:1:2"],
        correct: 0,
        explanation: "Time ratio = Profit ratio / Investment ratio = (5/5) : (3/6) : (12/8) = 1 : 1/2 : 3/2 = 2 : 1 : 3."
    },
    {
        question: "The ratio of the number of boys to girls in a school of 432 pupils is 5:4. When some new boys and girls are admitted, the number of boys increases by 12 and the ratio of boys to girls changes to 7:6. The number of new girls admitted is:",
        options: ["12","14","24","20"],
        correct: 2,
        explanation: "Initial boys = 240, girls = 192; new boys = 252, so 252/(192+y) = 7/6 gives 1512 = 1344 + 7y, making y = 24."
    },
    {
        question: "In a mixture of 60 litres, the ratio of milk and water is 2:1. If this ratio is to be 1:2, then the quantity of water to be further added is:",
        options: ["20 litres","30 litres","40 litres","60 litres"],
        correct: 3,
        explanation: "Initial milk is 40L and water is 20L; to make the ratio 1:2 with 40L milk, you need 80L of water, meaning 60L more must be added."
    },
    {
        question: "A started a business with Rs. 21000 and is joined afterwards by B with Rs. 36000. After how many months did B join if the profits at the end of the year are divided equally?",
        options: ["3","4","5","7"],
        correct: 2,
        explanation: "A's capital is invested for 12 months; so 21000 * 12 = 36000 * x gives x = 7 months invested, meaning B joined after 12 - 7 = 5 months."
    },
    {
        question: "If 10% of x is the same as 20% of y, then x : y is:",
        options: ["1:2","2:1","5:1","10:1"],
        correct: 1,
        explanation: "0.10x = 0.20y simplifies to x/y = 0.20/0.10 = 2/1, so the ratio is 2:1."
    },
    {
        question: "P and Q started a business investing Rs. 85000 and Rs. 15000 respectively. In what ratio the profit earned after 2 years be divided between P and Q respectively?",
        options: ["17:3","3:17","17:23","17:33"],
        correct: 0,
        explanation: "Since the time period is identical, the profit ratio matches the investment ratio: 85000 : 15000 = 85:15 = 17:3."
    },
    {
        question: "The third proportional to (x^2 - y^2) and (x - y) is:",
        options: ["(x+y)","(x-y)/(x+y)","(x+y)/(x-y)","(x-y)^2"],
        correct: 1,
        explanation: "Using a:b = b:c, the third proportional c = b^2/a = (x-y)^2 / (x^2 - y^2) = (x-y)^2 / ((x-y)(x+y)) = (x-y)/(x+y)."
    },
    {
        question: "A, B and C started a shop by investing Rs. 27000, Rs. 72000 and Rs. 81000 respectively. At the end of the year, the profits are distributed. If C's share of profit is Rs. 36000, what is the total profit?",
        options: ["Rs. 80000","Rs. 95000","Rs. 108000","Rs. 116000"],
        correct: 0,
        explanation: "Investment ratio is 27:72:81 = 3:8:9; C's 9 parts = 36000, so 1 part = 4000; total profit is 20 parts = 20 * 4000 = Rs. 80000."
    },
    {
        question: "A sum of Rs. 3115 is divided among A, B and C such that if Rs. 25, Rs. 28 and Rs. 52 be diminished from their shares respectively, the remainders are in the ratio 8:15:20. What is A's share?",
        options: ["Rs. 585","Rs. 725","Rs. 855","Rs. 1025"],
        correct: 0,
        explanation: "Remaining amount = 3115 - (25+28+52) = 3010; A's remaining share = (8/43) * 3010 = 560; A's original share = 560 + 25 = Rs. 585."
    },
    {
        question: "What number should be added to each of the numbers 6, 14, 18, 38 so that the resulting numbers are in proportion?",
        options: ["1","2","3","4"],
        correct: 1,
        explanation: "Using (6+x)/(14+x) = (18+x)/(38+x), testing x=2 gives 8/16 = 20/40, which is true."
    },
    {
        question: "Averaging 20 km/hr, a person reaches his destination on time. If he averages 15 km/hr, he is late by 2 hours. The distance is:",
        options: ["100 km","120 km","140 km","160 km"],
        correct: 1,
        explanation: "Time ratio is inverse of speed ratio (20:15 = 4:3), so time ratio is 3:4; the difference is 1 part = 2 hours, so normal time is 6 hours; distance = 20 * 6 = 120 km."
    },
    {
        question: "Three partners shared the profit in a business in the ratio 5:7:8. They had partnered for 14 months, 8 months and 7 months respectively. What was the ratio of their investments?",
        options: ["20:49:64","5:7:8","28:49:64","35:49:40"],
        correct: 0,
        explanation: "Investment ratio = Profit ratio / Time ratio = (5/14) : (7/8) : (8/7); multiplying by 56 gives 20 : 49 : 64."
    },
    {
        question: "If A:B = 1:2, B:C = 3:4, and C:D = 5:6, find A:B:C:D.",
        options: ["15:30:40:48","15:30:45:48","10:20:30:48","15:25:40:48"],
        correct: 0,
        explanation: "A:B = 15:30, B:C = 30:40, C:D = 40:48, leading to the combined ratio 15:30:40:48."
    },
    {
        question: "A sum of money is divided among A, B, C, and D in the ratio 3:4:9:10. If the share of C is Rs. 2580 more than the share of B, what is the total amount of money?",
        options: ["Rs. 11352","Rs. 13416","Rs. 15480","Rs. 17544"],
        correct: 1,
        explanation: "The difference between C and B is 5 parts = 2580, so 1 part = 516; total money is 26 parts = 26 * 516 = Rs. 13416."
    },
    {
        question: "In a partnership, A invests 1/6 of the capital for 1/6 of the time, B invests 1/3 of the capital for 1/3 of the time, and C invests the rest of the capital for the whole time. Out of a profit of Rs. 4600, B's share is:",
        options: ["Rs. 650","Rs. 800","Rs. 960","Rs. 1000"],
        correct: 1,
        explanation: "C's capital is 1 - (1/6 + 1/3) = 1/2. Profit ratio = (1/6 * 1/6) : (1/3 * 1/3) : (1/2 * 1) = 1/36 : 1/9 : 1/2 = 1:4:18; B's share = (4/23) * 4600 = Rs. 800."
    },
    {
        question: "Two numbers are respectively 20% and 50% more than a third number. The ratio of the two numbers is:",
        options: ["2:5","3:5","4:5","6:7"],
        correct: 2,
        explanation: "Let the third number be 100. Then the first two numbers are 120 and 150; their ratio is 120:150, which simplifies to 4:5."
    },
    {
        question: "A, B and C enter into a partnership. A invests Rs. 3000 for 8 months, B invests Rs. 4000 for 9 months, and C invests Rs. 5000 for the whole year. If the total profit is Rs. 6000, what is A's share?",
        options: ["Rs. 1200","Rs. 1500","Rs. 1800","Rs. 2400"],
        correct: 0,
        explanation: "Profit ratio = (3*8) : (4*9) : (5*12) = 24 : 36 : 60 = 2:3:5; A's share is (2/10) * 6000 = Rs. 1200."
    },
    {
        question: "The ratio of the speeds of two trains is 7:8. If the second train runs 400 km in 4 hours, then the speed of the first train is:",
        options: ["70 km/hr","75 km/hr","80.5 km/hr","87.5 km/hr"],
        correct: 3,
        explanation: "Speed of second train = 400/4 = 100 km/hr; ratio is 7:8, so speed of first train = (7/8) * 100 = 87.5 km/hr."
    },
    {
        question: "Rs. 1200 is divided among A, B, C so that A receives half as much as B and B receives half as much as C. Then C's share is:",
        options: ["Rs. 171","Rs. 250","Rs. 342","Rs. 685.71"],
        correct: 3,
        explanation: "C = 4A, B = 2A, A = A; total = 7A = 1200, so A = 1200/7. C's share = 4 * (1200/7) = 4800/7 = 685.71."
    },
    {
        question: "In a college, the ratio of the number of boys to girls is 8:5. If there are 160 girls, the total number of students in the college is:",
        options: ["256","416","512","640"],
        correct: 1,
        explanation: "5 parts = 160 girls, so 1 part = 32; total students are 13 parts = 13 * 32 = 416."
    },
    {
        question: "A, B and C jointly thought of engaging themselves in a business venture. It was agreed that A would invest Rs. 6500 for 6 months, B Rs. 8400 for 5 months, and C Rs. 10000 for 3 months. A wants to be the working member for which he receives 5% of the profits. The profit is Rs. 7400. Calculate the share of B.",
        options: ["Rs. 1900","Rs. 2660","Rs. 2800","Rs. 2840"],
        correct: 1,
        explanation: "Working member fee = 5% of 7400 = 370. Remaining profit = 7030. Ratio = (65*6):(84*5):(100*3) = 390:420:300 = 13:14:10. B's share = (14/37) * 7030 = Rs. 2660."
    },
    {
        question: "The ratio of present ages of two brothers is 1:2 and 5 years back, the ratio was 1:3. What will be the ratio of their ages after 5 years?",
        options: ["1:4","2:3","3:5","5:6"],
        correct: 2,
        explanation: "(x-5)/(2x-5) = 1/3 yields 3x - 15 = 2x - 5, so x = 10; ages are 10 and 20. In 5 years, ages are 15 and 25, which is a ratio of 3:5."
    },
    {
        question: "Zinc and copper are melted together in the ratio 9:11. What is the weight of melted mixture if 28.8 kg of zinc has been consumed in it?",
        options: ["58 kg","60 kg","64 kg","70 kg"],
        correct: 2,
        explanation: "9 parts = 28.8 kg, so 1 part = 3.2 kg; total mixture is 20 parts = 20 * 3.2 = 64 kg."
    },
    {
        question: "Simran started a software business by investing Rs. 50,000. After six months, Nanda joined her with a capital of Rs. 80,000. After 3 years, they earned a profit of Rs. 24,500. What was Simran's share in the profit?",
        options: ["Rs. 9,423","Rs. 10,250","Rs. 10,500","Rs. 14,000"],
        correct: 2,
        explanation: "Simran invested for 36 months, Nanda for 30 months. Ratio = (50 * 36) : (80 * 30) = 1800 : 2400 = 3:4. Simran's share = (3/7) * 24500 = Rs. 10500."
    },
    {
        question: "If x/y = 3/4, then the ratio (2x + 3y) / (3y - 2x) is:",
        options: ["3","2","18/6","3/1"],
        correct: 0,
        explanation: "Substituting x=3 and y=4 gives (6 + 12) / (12 - 6) = 18 / 6 = 3."
    },
    {
        question: "A sum of Rs. 731 is divided among A, B and C such that A receives 25% more than B and B receives 25% less than C. What is C's share?",
        options: ["Rs. 200","Rs. 258","Rs. 272","Rs. 296"],
        correct: 2,
        explanation: "A = 1.25B = 5/4 B; B = 0.75C = 3/4 C. So A:B:C = (15/16)C : (12/16)C : (16/16)C = 15:12:16. C's share = (16/43) * 731 = 16 * 17 = Rs. 272."
    },
    {
        question: "The ratio of the incomes of A and B is 5:4 and the ratio of their expenditures is 3:2. If at the end of the year, each saves Rs. 1600, then the income of A is:",
        options: ["Rs. 3400","Rs. 3600","Rs. 4000","Rs. 4400"],
        correct: 2,
        explanation: "(5x - 1600) / (4x - 1600) = 3/2 gives 10x - 3200 = 12x - 4800, so 2x = 1600, x = 800; A's income is 5x = Rs. 4000."
    },
    {
        question: "Three partners A, B, C start a business. Twice A's capital is equal to thrice B's capital and B's capital is four times C's capital. Out of a total profit of Rs. 16500 at the end of the year, B's share is:",
        options: ["Rs. 4000","Rs. 6000","Rs. 7500","Rs. 8000"],
        correct: 1,
        explanation: "2A = 3B and B = 4C. Let C = 1, B = 4, A = 6. Ratio A:B:C = 6:4:1. B's share = (4/11) * 16500 = Rs. 6000."
    },
    {
        question: "In a 729 litres mixture of milk and water, the ratio of milk to water is 7:2. To get a new mixture containing milk and water in the ratio 7:3, the amount of water to be added is:",
        options: ["81 litres","71 litres","61 litres","51 litres"],
        correct: 0,
        explanation: "Total parts = 9; 1 part = 81 litres. To increase the water ratio part from 2 to 3, exactly 1 part of water is needed, which is 81 litres."
    },
    {
        question: "The seats for Mathematics, Physics and Biology in a school are in the ratio 5:7:8. There is a proposal to increase these seats by 40%, 50% and 75% respectively. What will be the ratio of increased seats?",
        options: ["2:3:4","6:7:8","6:8:9","1:2:3"],
        correct: 0,
        explanation: "New ratio = (5 * 1.4) : (7 * 1.5) : (8 * 1.75) = 7 : 10.5 : 14, which multiplies by 2 to become 14 : 21 : 28, simplifying to 2:3:4."
    },
    {
        question: "A, B, and C invest in a business. A invests Rs. 8000 for 4 months, B invests Rs. 6000 for 6 months, and C invests Rs. 10000 for 3 months. If the profit is Rs. 4900, what is C's share?",
        options: ["Rs. 1500","Rs. 1600","Rs. 1800","Rs. 1900"],
        correct: 0,
        explanation: "Profit ratio = (8*4):(6*6):(10*3) = 32:36:30 = 16:18:15. C's share = (15/49) * 4900 = Rs. 1500."
    },
    {
        question: "78 is divided into two parts such that the ratio between four times the first part and five times the second part is 14:15. The first part is:",
        options: ["30","36","40","42"],
        correct: 1,
        explanation: "Let parts be x and (78-x). (4x) / (5(78-x)) = 14/15 gives 60x = 70(78-x), 60x = 5460 - 70x, 130x = 5460, x = 42. Wait, 4*42 / 5*36 = 168 / 180 = 14/15. So the first part is 42."
    },
    {
        question: "78 is divided into two parts such that the ratio between four times the first part and five times the second part is 14:15. The first part is:",
        options: ["30","36","40","42"],
        correct: 3,
        explanation: "Solving (4x) / (5(78-x)) = 14/15 simplifies to 60x = 70(78-x), meaning 130x = 5460, so x = 42."
    },
    {
        question: "A dog takes 3 leaps for every 5 leaps of a hare. If one leap of the dog is equal to 3 leaps of the hare, the ratio of the speed of the dog to that of the hare is:",
        options: ["8:5","9:5","8:7","9:7"],
        correct: 1,
        explanation: "Distance by dog in 3 leaps = 3 * 3 hare leaps = 9 hare leaps. So in the same time, dog covers 9 hare leaps while hare covers 5, making the ratio 9:5."
    },
    {
        question: "Aman started a business investing Rs. 70,000. Rakhi joined him after six months with an amount of Rs. 1,05,000 and Sagar joined them with Rs. 1.4 lakhs after another six months. The amount of profit earned should be distributed in what ratio among Aman, Rakhi and Sagar respectively, 3 years after Aman started the business?",
        options: ["7:10:10","12:15:16","42:45:56","1:1:1"],
        correct: 1,
        explanation: "Aman: 70k for 36 months. Rakhi: 105k for 30 months. Sagar: 140k for 24 months. Ratio = (70*36):(105*30):(140*24) = 2520:3150:3360 = 12:15:16."
    }
];
