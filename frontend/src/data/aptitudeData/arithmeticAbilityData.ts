import { Question } from "../aptitudeQuestions";

export const arithmeticAbilityQuestions: Question[] = [
    {
        question: "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
        options: ["70 kg","85 kg","75 kg","80 kg"],
        correct: 1,
        explanation: "Total increase in weight is 8 * 2.5 = 20 kg; therefore, the new person weighs 65 + 20 = 85 kg."
    },
    {
        question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. What is the principal sum?",
        options: ["Rs. 650","Rs. 690","Rs. 698","Rs. 700"],
        correct: 2,
        explanation: "Interest for 1 year is 854 - 815 = 39; interest for 3 years is 117, so the principal is 815 - 117 = 698."
    },
    {
        question: "What is the least number which when divided by 12, 15, 20 and 54 leaves in each case a remainder of 8?",
        options: ["540","548","532","500"],
        correct: 1,
        explanation: "The LCM of 12, 15, 20, and 54 is 540; adding the remainder of 8 gives the required number 548."
    },
    {
        question: "If 20% of a = b, then b% of 20 is the same as:",
        options: ["4% of a","5% of a","20% of a","None of these"],
        correct: 0,
        explanation: "b% of 20 = (20/100) * b; substituting b = (20/100) * a gives (20/100) * (20/100) * a = 4% of a."
    },
    {
        question: "A and B can do a piece of work in 12 days, B and C in 15 days, and C and A in 20 days. In how many days can A, B, and C together finish the work?",
        options: ["8 days","10 days","12 days","15 days"],
        correct: 1,
        explanation: "2(A+B+C)'s work = 1/12 + 1/15 + 1/20 = 12/60 = 1/5; so (A+B+C)'s 1-day work is 1/10, meaning they take 10 days."
    },
    {
        question: "A train 140 m long is running at 60 km/hr. In how much time will it pass a platform 260 m long?",
        options: ["20 sec","24 sec","28 sec","30 sec"],
        correct: 1,
        explanation: "Total distance = 400 m; Speed = 60 * (5/18) = 50/3 m/s; Time = 400 / (50/3) = 24 seconds."
    },
    {
        question: "A shopkeeper expects a gain of 22.5% on his cost price. If in a week, his sale was of Rs. 392, what was his profit?",
        options: ["Rs. 70","Rs. 72","Rs. 88.20","Rs. 96"],
        correct: 1,
        explanation: "Cost Price = (100/122.5) * 392 = 320; Profit = Sale - CP = 392 - 320 = 72."
    },
    {
        question: "The ratio between the present ages of P and Q is 6:7. If Q is 4 years older than P, what will be the ratio of the ages of P and Q after 4 years?",
        options: ["3:4","7:8","8:9","None of these"],
        correct: 1,
        explanation: "If ages are 6x and 7x, 7x - 6x = 4 (x=4); current ages are 24 and 28; after 4 years, ages are 28 and 32, which is a ratio of 7:8."
    },
    {
        question: "A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price of the cycle?",
        options: ["Rs. 1090","Rs. 1160","Rs. 1190","Rs. 1202"],
        correct: 2,
        explanation: "Selling Price = 85% of 1400 = (85/100) * 1400 = 85 * 14 = 1190."
    },
    {
        question: "A sum of money doubles itself at compound interest in 15 years. It will become eight times in:",
        options: ["30 years","45 years","48 years","60 years"],
        correct: 1,
        explanation: "8 times is 2 cubed ($2^3$); since it doubles every 15 years, it takes 15 * 3 = 45 years to reach 8 times."
    },
    {
        question: "If x:y = 5:2, then (8x + 9y) : (8x + 2y) is:",
        options: ["22:29","29:22","61:44","7:10"],
        correct: 1,
        explanation: "Substitute x=5 and y=2 into the expression: (40 + 18) / (40 + 4) = 58 / 44 = 29 / 22."
    },
    {
        question: "What is the value of (256)^0.16 * (256)^0.09?",
        options: ["4","16","64","256.25"],
        correct: 0,
        explanation: "Powers are added: 0.16 + 0.09 = 0.25 (which is 1/4); $256^{1/4} = 4$."
    },
    {
        question: "Find the odd man out: 3, 5, 11, 14, 17, 21",
        options: ["21","17","14","3"],
        correct: 2,
        explanation: "All other numbers in the set are prime numbers, whereas 14 is a composite number."
    },
    {
        question: "If the length of a rectangle is increased by 20% and the breadth is decreased by 20%, the area of the rectangle:",
        options: ["Decreases by 4%","Increases by 4%","Does not change","None of these"],
        correct: 0,
        explanation: "Using the formula x + y + (xy/100): 20 - 20 - (400/100) = -4, which means a 4% decrease."
    },
    {
        question: "A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.",
        options: ["2 hours","3 hours","4 hours","5 hours"],
        correct: 2,
        explanation: "Downstream speed = 13 + 4 = 17 km/hr; Time = Distance / Speed = 68 / 17 = 4 hours."
    },
    {
        question: "The HCF of two numbers is 11 and their LCM is 693. If one of the numbers is 77, find the other.",
        options: ["99","101","105","110"],
        correct: 0,
        explanation: "Product of two numbers = HCF * LCM; so 77 * x = 11 * 693; x = (11 * 693) / 77 = 99."
    },
    {
        question: "A tank is filled in 5 hours by three pipes A, B and C. The pipe C is twice as fast as B and B is twice as fast as A. How much time will pipe A alone take to fill the tank?",
        options: ["20 hours","25 hours","35 hours","Cannot be determined"],
        correct: 2,
        explanation: "If A's rate is x, B's is 2x, and C's is 4x; total rate is 7x = 1/5; so x = 1/35, meaning A takes 35 hours."
    },
    {
        question: "Evaluate 0.003 * 0.02?",
        options: ["0.06","0.006","0.0006","0.00006"],
        correct: 3,
        explanation: "3 * 2 = 6; since there are 3 decimal places in the first and 2 in the second, the result must have 5 decimal places: 0.00006."
    },
    {
        question: "A person crosses a 600 m long street in 5 minutes. What is his speed in km/hr?",
        options: ["3.6 km/hr","7.2 km/hr","8.4 km/hr","10 km/hr"],
        correct: 1,
        explanation: "Speed = 600 m / 300 sec = 2 m/s; converting to km/hr gives 2 * (18/5) = 7.2 km/hr."
    },
    {
        question: "What is the compound interest on Rs. 2500 for 2 years at 4% per annum?",
        options: ["Rs. 104","Rs. 200","Rs. 204","Rs. 210"],
        correct: 2,
        explanation: "Amount = 2500 * (1.04 * 1.04) = 2704; CI = 2704 - 2500 = 204."
    },
    {
        question: "Find the average of first 40 natural numbers?",
        options: ["20","20.5","21","21.5"],
        correct: 1,
        explanation: "The average of first n natural numbers is (n+1)/2, which for 40 is 41/2 = 20.5."
    },
    {
        question: "A clock strikes once at 1 o'clock, twice at 2 o'clock, and so on. How many times will it strike in 24 hours?",
        options: ["78","156","200","300"],
        correct: 1,
        explanation: "Strikes in 12 hours = sum of 1 to 12 = 78; so in 24 hours, it strikes 78 * 2 = 156 times."
    },
    {
        question: "If 15 men can reap a field in 35 days, in how many days will 21 men reap the same field?",
        options: ["25 days","20 days","30 days","22 days"],
        correct: 0,
        explanation: "Using M1D1 = M2D2: 15 * 35 = 21 * x; x = (15 * 35) / 21 = 25 days."
    },
    {
        question: "A number is increased by 10% and then decreased by 10%. The net change is:",
        options: ["0%","1% increase","1% decrease","2% decrease"],
        correct: 2,
        explanation: "100 + 10% = 110; 110 - 10% = 99; total change is 1% decrease."
    },
    {
        question: "A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:",
        options: ["588 apples","600 apples","672 apples","700 apples"],
        correct: 3,
        explanation: "60% of original = 420; so (60/100) * x = 420, meaning x = 700 apples."
    },
    {
        question: "Which of the following is a prime number?",
        options: ["33","81","93","97"],
        correct: 3,
        explanation: "33 (3*11), 81 (9*9), and 93 (3*31) are composite; 97 has no factors other than 1 and itself."
    },
    {
        question: "Find the largest number of four digits exactly divisible by 12, 15, 18 and 27?",
        options: ["9600","9720","9930","9960"],
        correct: 1,
        explanation: "LCM of 12, 15, 18, 27 is 540; dividing 9999 by 540 leaves a remainder of 279; 9999 - 279 = 9720."
    },
    {
        question: "In how many years will a sum of Rs. 800 at 10% per annum compounded semi-annually become Rs. 926.10?",
        options: ["1.5 years","2 years","2.5 years","3 years"],
        correct: 0,
        explanation: "Semi-annual rate is 5%; 800 * (1.05)^n = 926.10 gives n=3 half-years, which is 1.5 years."
    },
    {
        question: "Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new ratio is 12:23. The smaller number is:",
        options: ["27","33","49","55"],
        correct: 1,
        explanation: "Solving (3x - 9) / (5x - 9) = 12 / 23 gives 69x - 207 = 60x - 108; 9x = 99, x = 11; smaller number is 33."
    },
    {
        question: "What percentage of numbers from 1 to 70 have 1 or 9 in the unit's digit?",
        options: ["1%","14%","20%","21%"],
        correct: 2,
        explanation: "There are 14 such numbers (1, 9, 11, 19, ..., 61, 69); (14/70) * 100 = 20%."
    },
    {
        question: "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:",
        options: ["1/4","1/10","7/15","8/15"],
        correct: 3,
        explanation: "Combined 1-day work = 1/15 + 1/20 = 7/60; in 4 days, they finish 28/60 = 7/15; remaining work is 8/15."
    },
    {
        question: "The speed of a boat in still water is 15 km/hr and the rate of current is 3 km/hr. The distance traveled downstream in 12 minutes is:",
        options: ["1.2 km","1.8 km","2.4 km","3.6 km"],
        correct: 3,
        explanation: "Downstream speed = 18 km/hr; in 12 minutes (1/5 hr), distance = 18 * (1/5) = 3.6 km."
    },
    {
        question: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
        options: ["3","4","5","6"],
        correct: 2,
        explanation: "CP of 1 toffee = 1/6; to gain 20%, SP must be (1/6) * 1.2 = 0.2; so 5 toffees for a rupee."
    },
    {
        question: "The difference between simple interest and compound interest on Rs. 1200 for one year at 10% per annum reckoned half-yearly is:",
        options: ["Rs. 2.50","Rs. 3","Rs. 3.75","Rs. 4"],
        correct: 1,
        explanation: "SI = 120; CI half-yearly = 1200 * (1.05 * 1.05) - 1200 = 123; difference is Rs. 3."
    },
    {
        question: "Find the value of sqrt(1.5625)?",
        options: ["1.05","1.25","1.45","1.55"],
        correct: 1,
        explanation: "The square root of 15625 is 125, so for 1.5625, it is 1.25."
    },
    {
        question: "If 7 spiders make 7 webs in 7 days, then 1 spider will make 1 web in how many days?",
        options: ["1 day","7/2 days","7 days","49 days"],
        correct: 2,
        explanation: "Using M1D1/W1 = M2D2/W2: (7 * 7) / 7 = (1 * x) / 1; so x = 7 days."
    },
    {
        question: "A man's speed with the current is 15 km/hr and the speed of the current is 2.5 km/hr. The man's speed against the current is:",
        options: ["8.5 km/hr","9 km/hr","10 km/hr","12.5 km/hr"],
        correct: 2,
        explanation: "Still water speed = 15 - 2.5 = 12.5 km/hr; upstream speed = 12.5 - 2.5 = 10 km/hr."
    },
    {
        question: "What is the smallest number by which 3600 must be divided to make it a perfect cube?",
        options: ["450","50","300","400"],
        correct: 0,
        explanation: "Prime factorization of 3600 is $2^4 * 3^2 * 5^2$; to make it a perfect cube ($2^3$), we divide by $2 * 3^2 * 5^2 = 450$."
    },
    {
        question: "A container contains 40 liters of milk. From this container, 4 liters of milk was taken out and replaced by water. This process was repeated further two times. How much milk is now contained in the container?",
        options: ["26.34 liters","27.36 liters","28 liters","29.16 liters"],
        correct: 3,
        explanation: "Remaining milk = 40 * (1 - 4/40)^3 = 40 * (0.9)^3 = 40 * 0.729 = 29.16 liters."
    },
    {
        question: "In a mixture of 60 liters, the ratio of milk and water is 2:1. If this ratio is to be 1:2, then the quantity of water to be further added is:",
        options: ["20 liters","30 liters","40 liters","60 liters"],
        correct: 3,
        explanation: "Initial milk = 40, water = 20; to make ratio 1:2, water must be 80; so 60 liters of water must be added."
    },
    {
        question: "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?",
        options: ["4 years","8 years","10 years","None of these"],
        correct: 0,
        explanation: "Let ages be x, x+3, x+6, x+9, x+12; sum is 5x + 30 = 50; 5x = 20, so x = 4 years."
    },
    {
        question: "If 1.125 * 10^k = 0.001125, then the value of k is:",
        options: ["-4","-3","-2","-1"],
        correct: 1,
        explanation: "The decimal point is moved 3 places to the left, which corresponds to $10^{-3}$."
    },
    {
        question: "Find the average of first 20 multiples of 7?",
        options: ["70","73.5","75","80.5"],
        correct: 1,
        explanation: "Average = 7 * (average of 1 to 20) = 7 * 10.5 = 73.5."
    },
    {
        question: "In a competitive exam, 70% of the candidates passed in English and 80% passed in Mathematics. 10% failed in both subjects. If 144 candidates passed in both, the total number of candidates was:",
        options: ["125","200","240","375"],
        correct: 2,
        explanation: "Let total be 100; English passed = 70, Math = 80, failed both = 10; using Venn diagram, passed both = 60%; 60% of x = 144, so x = 240."
    },
    {
        question: "A sum of money is to be distributed among A, B, C, D in the proportion of 5 : 2 : 4 : 3. If C gets Rs. 1000 more than D, what is B's share?",
        options: ["Rs. 500","Rs. 1500","Rs. 2000","None of these"],
        correct: 2,
        explanation: "Difference between C and D is 1 part = 1000; B's share is 2 parts = Rs. 2000."
    },
    {
        question: "What is the fourth proportional to 4, 9, 12?",
        options: ["18","27","36","48"],
        correct: 1,
        explanation: "Using a/b = c/d: 4/9 = 12/x; 4x = 108, so x = 27."
    },
    {
        question: "Six bells commence tolling together and toll at intervals of 2, 4, 6, 8, 10 and 12 seconds respectively. In 30 minutes, how many times do they toll together?",
        options: ["4","10","15","16"],
        correct: 3,
        explanation: "LCM of 2, 4, 6, 8, 10, 12 is 120 seconds (2 mins); in 30 mins, they toll 30/2 = 15 times, plus the initial start = 16 times."
    },
    {
        question: "A sum of money at simple interest trebles itself in 15 years. The annual rate of interest is:",
        options: ["10%","13.33%","15%","20%"],
        correct: 1,
        explanation: "Interest = 200% of P over 15 years; Rate = 200 / 15 = 13.33%."
    },
    {
        question: "How many seconds will a 500 m long train take to cross a man walking with a speed of 3 km/hr in the direction of the moving train if the speed of the train is 63 km/hr?",
        options: ["25 sec","30 sec","40 sec","45 sec"],
        correct: 1,
        explanation: "Relative speed = 63 - 3 = 60 km/hr = 60 * (5/18) = 50/3 m/s; Time = 500 / (50/3) = 30 seconds."
    },
    {
        question: "Find the simple interest on Rs. 7300 from 1st Jan 2026 to 14th March 2026 at 10% per annum?",
        options: ["Rs. 146","Rs. 140","Rs. 150","Rs. 160"],
        correct: 0,
        explanation: "Total days = 31 (Jan) + 28 (Feb) + 14 (Mar) = 73 days; SI = (7300 * 10 * 73) / (100 * 365) = Rs. 146."
    }
];
