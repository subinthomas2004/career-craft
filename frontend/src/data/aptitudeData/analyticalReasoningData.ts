import { Question } from "../aptitudeQuestions";

export const analyticalReasoningQuestions: Question[] = [
    {
        question: "A student has to obtain 33% of the total marks to pass. He got 125 marks and failed by 40 marks. The maximum marks are:",
        options: ["300","500","800","1000"],
        correct: 1,
        explanation: "The passing marks are 125 + 40 = 165; if 33% equals 165, then 100% equals (165/33) * 100 = 500."
    },
    {
        question: "A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price of the cycle?",
        options: ["Rs. 1090","Rs. 1160","Rs. 1190","Rs. 1202"],
        correct: 2,
        explanation: "Selling Price = 85% of Cost Price = 0.85 * 1400 = Rs. 1190."
    },
    {
        question: "What is the least number which when divided by 5, 6, 7 and 8 leaves a remainder 3, but when divided by 9 leaves no remainder?",
        options: ["1683","1523","1677","1692"],
        correct: 0,
        explanation: "The LCM of 5, 6, 7, 8 is 840; checking multiples (840k + 3), we find that 840(2) + 3 = 1683 is exactly divisible by 9."
    },
    {
        question: "The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?",
        options: ["0","1","10","19"],
        correct: 3,
        explanation: "As long as the sum is zero, 19 numbers can be positive provided the 20th number is equal to the negative sum of all of them."
    },
    {
        question: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both the pipes are used together, then how long will it take to fill the tank?",
        options: ["12 min","15 min","25 min","50 min"],
        correct: 0,
        explanation: "Combined rate = 1/20 + 1/30 = 5/60 = 1/12; therefore, the tank fills in 12 minutes."
    },
    {
        question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
        options: ["Rs. 650","Rs. 690","Rs. 698","Rs. 700"],
        correct: 2,
        explanation: "Interest for 1 year = 854 - 815 = 39; interest for 3 years = 117; Principal = 815 - 117 = Rs. 698."
    },
    {
        question: "A shopkeeper sells two wrist watches for Rs. 990 each. On one he gains 10% and on the other he loses 10%. What is his net gain or loss percent?",
        options: ["No gain or loss","1% gain","1% loss","1.1% loss"],
        correct: 2,
        explanation: "In such cases, there is always a loss of (x/10)^2 percent, which is (10/10)^2 = 1% loss."
    },
    {
        question: "The ratio between the present ages of P and Q is 6:7. If Q is 4 years older than P, what will be the ratio of the ages of P and Q after 4 years?",
        options: ["3:4","7:8","8:9","9:10"],
        correct: 1,
        explanation: "If ages are 6x and 7x, then 7x - 6x = 4, so x = 4; current ages are 24 and 28, and in 4 years they will be 28 and 32 (ratio 7:8)."
    },
    {
        question: "Find the compound interest on Rs. 10,000 for 2 years at 4% per annum, interest being payable half-yearly.",
        options: ["Rs. 824.32","Rs. 816","Rs. 800","Rs. 400"],
        correct: 0,
        explanation: "Rate becomes 2% per half-year for 4 periods; Amount = 10000 * (1.02)^4 = 10824.32; CI = Rs. 824.32."
    },
    {
        question: "A person crosses a 600 m long street in 5 minutes. What is his speed in km/hr?",
        options: ["3.6","7.2","8.4","10"],
        correct: 1,
        explanation: "Speed = 600m / 300s = 2 m/s; to convert to km/hr, multiply by 18/5: 2 * 3.6 = 7.2 km/hr."
    },
    {
        question: "A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?",
        options: ["65 sec","89 sec","100 sec","150 sec"],
        correct: 1,
        explanation: "Speed = 240/24 = 10 m/s; Total distance for platform = 240 + 650 = 890 m; Time = 890/10 = 89 seconds."
    },
    {
        question: "If 15% of 40 is greater than 25% of a number by 2, then the number is:",
        options: ["12","16","24","32"],
        correct: 1,
        explanation: "15% of 40 = 6; 6 - 2 = 4; if 25% (1/4) of a number is 4, the number is 16."
    },
    {
        question: "Three numbers are in the ratio 1:2:3 and their HCF is 12. The numbers are:",
        options: ["12, 24, 36","11, 22, 33","12, 24, 48","5, 10, 15"],
        correct: 0,
        explanation: "The numbers are 1x, 2x, and 3x; since they are in simplest ratio form, their HCF is x, so the numbers are 12, 24, and 36."
    },
    {
        question: "A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.",
        options: ["2 hours","3 hours","4 hours","5 hours"],
        correct: 2,
        explanation: "Downstream speed = 13 + 4 = 17 km/hr; Time = 68 / 17 = 4 hours."
    },
    {
        question: "Find the probability of getting a sum of 7 from a single throw of two dice.",
        options: ["1/6","1/12","1/9","5/36"],
        correct: 0,
        explanation: "Favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6; Total outcomes = 36; Probability = 6/36 = 1/6."
    },
    {
        question: "In how many ways can the letters of the word 'LEADER' be arranged?",
        options: ["72","","360","720"],
        correct: 2,
        explanation: "The word has 6 letters with 'E' repeated twice; arrangements = 6! / 2! = 720 / 2 = 360."
    },
    {
        question: "The population of a town increased from 1,75,000 to 2,62,500 in a decade. The average percent increase of population per year is:",
        options: ["4.375%","5%","6%","50%"],
        correct: 1,
        explanation: "Total increase = 87,500; Percentage increase = (87500 / 175000) * 100 = 50%; per year = 50% / 10 = 5%."
    },
    {
        question: "How many seconds will a 500 meter long train take to cross a man walking with a speed of 3 km/hr in the direction of the moving train if the speed of the train is 63 km/hr?",
        options: ["25","30","40","45"],
        correct: 1,
        explanation: "Relative speed = 63 - 3 = 60 km/hr = 60 * 5/18 = 50/3 m/s; Time = 500 / (50/3) = 30 seconds."
    },
    {
        question: "A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?",
        options: ["12 days","15 days","16 days","18 days"],
        correct: 1,
        explanation: "A's 2-day work = 2/20; 3rd day work (A+B+C) = 1/20 + 1/30 + 1/60 = 6/60 = 1/10; 3-day work = 1/10 + 1/10 = 1/5; 5 * 3 = 15 days."
    },
    {
        question: "What is the unit digit in (7^95 - 3^58)?",
        options: ["0","4","6","7"],
        correct: 1,
        explanation: "Unit digit 7^95 (cycle 4) = 7^3 = 3; unit digit 3^58 (cycle 4) = 3^2 = 9; 13 - 9 = 4."
    },
    {
        question: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
        options: ["3","4","5","6"],
        correct: 2,
        explanation: "CP of 1 toffee = 1/6; to gain 20%, SP = 120% of 1/6 = 1/5; so 5 for a rupee."
    },
    {
        question: "If log 27 = 1.431, then the value of log 9 is:",
        options: ["0.934","0.945","0.954","0.958"],
        correct: 2,
        explanation: "log 27 = 3 log 3 = 1.431, so log 3 = 0.477; log 9 = 2 log 3 = 2 * 0.477 = 0.954."
    },
    {
        question: "The difference between simple interest and compound interest on Rs. 1200 for one year at 10% per annum reckoned half-yearly is:",
        options: ["Rs. 2.50","Rs. 3","Rs. 3.75","Rs. 4"],
        correct: 1,
        explanation: "SI = 120; CI = 1200[(1.05)^2 - 1] = 123; difference = Rs. 3."
    },
    {
        question: "A, B and C enter into a partnership. A invests 3 times as much as B and B invests two-third of what C invests. The ratio of their capitals is:",
        options: ["3:9:2","6:10:15","5:3:2","6:2:3"],
        correct: 3,
        explanation: "Let C = 3, then B = 2, then A = 3 * 2 = 6; Ratio A:B:C = 6:2:3."
    },
    {
        question: "The value of (0.625 * 0.0729 * 28.9) / (0.0017 * 0.025 * 8.1) is:",
        options: ["0.3825","3.825","38.25","3825"],
        correct: 3,
        explanation: "Calculating the decimals and canceling common factors results in 3825."
    },
    {
        question: "If x:y = 5:2, then (8x + 9y) : (8x + 2y) is:",
        options: ["22:29","26:19","29:22","61:44"],
        correct: 2,
        explanation: "Substitute x=5, y=2: (40 + 18) / (40 + 4) = 58/44 = 29/22."
    },
    {
        question: "The LCM of two numbers is 48. The numbers are in the ratio 2 : 3. The sum of the numbers is:",
        options: ["28","32","40","64"],
        correct: 2,
        explanation: "LCM(2x, 3x) = 6x = 48, so x = 8; numbers are 16 and 24, sum = 40."
    },
    {
        question: "A man buys an article for Rs. 27.50 and sells it for Rs. 28.60. Find his gain percent.",
        options: ["1%","2%","3%","4%"],
        correct: 3,
        explanation: "Gain = 1.10; Gain % = (1.10 / 27.50) * 100 = 4%."
    },
    {
        question: "A sum was put at simple interest at a certain rate for 3 years. Had it been put at 2% higher rate, it would have fetched Rs. 360 more. The sum is:",
        options: ["Rs. 4000","Rs. 5000","Rs. 6000","Rs. 9000"],
        correct: 2,
        explanation: "Extra interest = P * (2%) * 3 = 6% of P = 360; P = 360 / 0.06 = Rs. 6000."
    },
    {
        question: "Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new ratio is 12:23. The smaller number is:",
        options: ["27","33","49","55"],
        correct: 1,
        explanation: "(3x-9)/(5x-9) = 12/23 gives 69x - 207 = 60x - 108; 9x = 99, x = 11; smaller number = 33."
    },
    {
        question: "How many times do the hands of a clock coincide in a day?",
        options: ["20","21","22","24"],
        correct: 2,
        explanation: "The hands coincide 11 times every 12 hours, so 22 times in 24 hours."
    },
    {
        question: "A tank is filled in 5 hours by three pipes A, B and C. Pipe C is twice as fast as B and B is twice as fast as A. How much time will pipe A alone take to fill the tank?",
        options: ["20 hours","25 hours","35 hours","Cannot be determined"],
        correct: 2,
        explanation: "If A's rate is x, then B is 2x and C is 4x; total rate 7x = 1/5; x = 1/35; A takes 35 hours."
    },
    {
        question: "The side of a square is increased by 25%. Then its area is increased by:",
        options: ["25%","40.5%","55%","56.25%"],
        correct: 3,
        explanation: "Area increase = (1.25)^2 = 1.5625; increase = 56.25%."
    },
    {
        question: "Find the average of first 40 natural numbers.",
        options: ["20.25","20.5","21","21.5"],
        correct: 1,
        explanation: "Average of first n natural numbers is (n+1)/2 = 41/2 = 20.5."
    },
    {
        question: "What is the unit digit in 658 * 539 * 476 * 312?",
        options: ["2","4","6","8"],
        correct: 1,
        explanation: "Unit digits: 8 * 9 * 6 * 2 = 72 * 12; unit digit 2 * 2 = 4."
    },
    {
        question: "If log (x/y) = log x - log y, what is the value of log 1?",
        options: ["0","1","e","infinity"],
        correct: 0,
        explanation: "log 1 is always 0 in any base because any non-zero number to the power 0 is 1."
    },
    {
        question: "A sum of money doubles itself in 7 years at simple interest. In how many years will it become fourfold?",
        options: ["14","21","28","35"],
        correct: 1,
        explanation: "To double, it earns 100% P interest in 7 years. To become fourfold, it needs 300% P interest, which takes 3 * 7 = 21 years."
    },
    {
        question: "How many 3-digit numbers are divisible by 6 in all?",
        options: ["149","150","151","166"],
        correct: 1,
        explanation: "First 3-digit number is 102, last is 996; n = (996 - 102)/6 + 1 = 150."
    },
    {
        question: "If 1.125 * 10^k = 0.001125, then the value of k is:",
        options: ["-4","-3","-2","-1"],
        correct: 1,
        explanation: "The decimal point moves 3 places to the left, so k = -3."
    },
    {
        question: "The ratio between the length and the breadth of a rectangular park is 3:2. If a man cycling along the boundary of the park at the speed of 12 km/hr completes one round in 8 minutes, then the area of the park is:",
        options: ["1,53,600 sq. m","1,53,60,000 sq. m","30,720 sq. m","3,07,200 sq. m"],
        correct: 0,
        explanation: "Perimeter = distance = 12 * 8/60 = 1.6 km = 1600 m; 2(3x+2x) = 1600, x = 160; Area = 480 * 320 = 1,53,600 sq. m."
    },
    {
        question: "The compound interest on a certain sum for 2 years at 10% per annum is Rs. 525. The simple interest on the same sum for double the time at half the rate per cent per annum is:",
        options: ["Rs. 400","Rs. 500","Rs. 600","Rs. 800"],
        correct: 1,
        explanation: "P[(1.1)^2 - 1] = 525 gives P = 2500; SI for 4 years at 5% = 2500 * 4 * 0.05 = Rs. 500."
    },
    {
        question: "If a quarter-kg of potato costs 60 paise, how many paise will 200 gm cost?",
        options: ["48 paise","54 paise","56 paise","72 paise"],
        correct: 0,
        explanation: "250 gm costs 60 paise; so 1 gm costs 60/250 = 0.24 paise; 200 gm costs 200 * 0.24 = 48 paise."
    },
    {
        question: "Which of the following numbers is divisible by 24?",
        options: ["35,718","63,810","5,37,804","3,12,576"],
        correct: 3,
        explanation: "Divisible by 24 means divisible by both 3 and 8; 3,12,576 sum = 24 (div by 3) and last 3 digits 576 (div by 8)."
    },
    {
        question: "Find the odd man out: 3, 5, 11, 14, 17, 21",
        options: ["21","17","14","3"],
        correct: 2,
        explanation: "All are prime numbers except 14 and 21; however, 14 is even, making it the odd one out in many reasoning contexts."
    },
    {
        question: "Two ships are sailing in the sea on the two sides of a lighthouse. The angle of elevation of the top of the lighthouse is observed from the ships are 30° and 45° respectively. If the lighthouse is 100 m high, the distance between the two ships is:",
        options: ["173 m","200 m","273 m","300 m"],
        correct: 2,
        explanation: "Distance = 100 cot 30° + 100 cot 45° = 100√3 + 100 = 100(1.732 + 1) = 273.2 m."
    },
    {
        question: "The ratio between the perimeter and the breadth of a rectangle is 5 : 1. If the area of the rectangle is 216 sq. cm, what is the length of the rectangle?",
        options: ["16 cm","18 cm","24 cm","Data inadequate"],
        correct: 1,
        explanation: "2(L+B)/B = 5/1 gives 2L = 3B; B = 2/3 L; L * 2/3 L = 216; L^2 = 324; L = 18 cm."
    },
    {
        question: "A bag contains 2 red, 3 green and 2 blue balls. Two balls are drawn at random. What is the probability that none of the balls drawn is blue?",
        options: ["10/21","11/21","2/7","5/7"],
        correct: 0,
        explanation: "Total balls = 7; favorable (red+green) = 5; P = 5C2 / 7C2 = 10 / 21."
    },
    {
        question: "If selling price is doubled, the profit triples. Find the profit percent.",
        options: ["66.66%","100%","105.33%","120%"],
        correct: 1,
        explanation: "Profit = SP - CP; 3(SP - CP) = 2SP - CP gives SP = 2CP; Profit = CP, so 100%."
    },
    {
        question: "A tank can be filled by pipe A in 20 min and by pipe B in 30 min. There is an outlet pipe C which can empty it in 40 min. If all three are opened, the tank will be full in:",
        options: ["15 min","17.14 min","19.2 min","25 min"],
        correct: 1,
        explanation: "Combined rate = 1/20 + 1/30 - 1/40 = (6+4-3)/120 = 7/120; time = 120/7 = 17.14 min."
    },
    {
        question: "What is the probability of a leap year having 53 Sundays?",
        options: ["1/7","2/7","3/7","1/366"],
        correct: 1,
        explanation: "A leap year has 52 weeks and 2 days. For 53 Sundays, one of those 2 days must be Sunday. Sample space: {Mon-Tue, Tue-Wed, Wed-Thu, Thu-Fri, Fri-Sat, Sat-Sun, Sun-Mon}. Favorable = 2."
    }
];
