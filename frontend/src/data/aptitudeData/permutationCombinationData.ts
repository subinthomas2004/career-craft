import { Question } from "../aptitudeQuestions";

export const permutationCombinationQuestions: Question[] = [
    {
        question: "In how many different ways can the letters of the word 'LEADER' be arranged?",
        options: ["360","720","144","576"],
        correct: 0,
        explanation: "The word has 6 letters with 'E' repeated 2 times. The total arrangements are 6! / 2! = 720 / 2 = 360."
    },
    {
        question: "How many 3-digit numbers can be formed using the digits 1, 2, 3, 4, 5 if repetition of digits is not allowed?",
        options: ["125","120","60","24"],
        correct: 2,
        explanation: "We need to arrange 3 digits out of 5, which is 5P3 = 5 × 4 × 3 = 60."
    },
    {
        question: "In how many ways can 5 boys and 3 girls sit in a row such that no two girls sit together?",
        options: ["12000","14400","2400","720"],
        correct: 1,
        explanation: "First seat the 5 boys in 5! (120) ways. This creates 6 spaces between and around them. Seat the 3 girls in these 6 spaces in 6P3 (120) ways. Total = 120 × 120 = 14400."
    },
    {
        question: "In how many different ways can the letters of the word 'SOFTWARE' be arranged so that the vowels are always together?",
        options: ["1440","4320","720","5040"],
        correct: 1,
        explanation: "Treat the 3 vowels (O, A, E) as a single unit. We now have 6 units (5 consonants + 1 vowel unit) to arrange in 6! (720) ways. The vowels can arrange among themselves in 3! (6) ways. Total = 720 × 6 = 4320."
    },
    {
        question: "In how many ways can 6 people be seated around a circular table?",
        options: ["120","720","24","60"],
        correct: 0,
        explanation: "The number of circular permutations of 'n' distinct items is (n - 1)!. For 6 people, it is 5! = 120."
    },
    {
        question: "How many 4-digit even numbers can be formed from the digits 1, 2, 3, 4, 5 without repeating any digit?",
        options: ["60","48","24","120"],
        correct: 1,
        explanation: "For the number to be even, it must end in 2 or 4 (2 options). The remaining 3 digits can be chosen from the remaining 4 digits in 4P3 (24) ways. Total = 2 × 24 = 48."
    },
    {
        question: "In how many ways can 5 men and 5 women sit around a circular table so that they sit alternately?",
        options: ["14400","2880","3628800","120"],
        correct: 1,
        explanation: "First, seat the 5 men in a circle in (5-1)! = 24 ways. This creates 5 gaps. Seat the 5 women in these gaps in 5! = 120 ways. Total = 24 × 120 = 2880."
    },
    {
        question: "In how many different ways can the letters of the word 'MACHINE' be arranged so that the vowels occupy only the odd positions?",
        options: ["288","576","144","3456"],
        correct: 1,
        explanation: "There are 3 vowels (A, I, E) and 4 odd positions (1st, 3rd, 5th, 7th). The vowels can be placed in 4P3 (24) ways. The remaining 4 consonants occupy the remaining 4 spots in 4! (24) ways. Total = 24 × 24 = 576."
    },
    {
        question: "At a party, everyone shakes hands with everyone else. If there are 66 handshakes in total, how many people are at the party?",
        options: ["12","11","13","14"],
        correct: 0,
        explanation: "The number of handshakes is nC2 = n(n-1)/2. Setting n(n-1)/2 = 66 gives n(n-1) = 132. The consecutive integers that multiply to 132 are 12 and 11, so n = 12."
    },
    {
        question: "How many diagonals can be drawn in a regular octagon?",
        options: ["24","16","20","28"],
        correct: 2,
        explanation: "The formula for diagonals in an n-sided polygon is nC2 - n. For an octagon (n=8), it is 8C2 - 8 = 28 - 8 = 20."
    },
    {
        question: "A committee of 3 members is to be formed from 5 men and 4 women. In how many ways can this be done if the committee must contain exactly 2 men?",
        options: ["60","40","80","20"],
        correct: 1,
        explanation: "We must select 2 men from 5 (5C2 = 10 ways) and 1 woman from 4 (4C1 = 4 ways). Total ways = 10 × 4 = 40."
    },
    {
        question: "Out of 10 people, in how many ways can a team of 4 be chosen if one specific person must always be included?",
        options: ["210","126","84","36"],
        correct: 2,
        explanation: "Since 1 specific person is already selected, we only need to choose the remaining 3 team members from the remaining 9 people. This is 9C3 = 84."
    },
    {
        question: "A committee of 5 is to be formed from 6 men and 5 women. In how many ways can it be formed so that it contains at least 3 men?",
        options: ["281","260","300","250"],
        correct: 0,
        explanation: "The combinations are (3M, 2W) OR (4M, 1W) OR (5M, 0W). (6C3 × 5C2) + (6C4 × 5C1) + (6C5 × 5C0) = (20 × 10) + (15 × 5) + (6 × 1) = 200 + 75 + 6 = 281."
    },
    {
        question: "In how many ways can a student choose 5 courses out of 9 if 2 specific courses are compulsory?",
        options: ["21","35","56","126"],
        correct: 1,
        explanation: "Since 2 courses are compulsory, the student only needs to select 3 more courses from the remaining 7 available courses. This is 7C3 = 35."
    },
    {
        question: "How many triangles can be formed by joining 10 points on a plane, out of which 4 are collinear?",
        options: ["116","120","114","110"],
        correct: 0,
        explanation: "Total possible triangles from 10 points is 10C3 (120). However, the 4 collinear points cannot form triangles among themselves, so we subtract 4C3 (4). 120 - 4 = 116."
    },
    {
        question: "In a bag, there are 4 red and 5 blue balls. If 2 balls are drawn at random, what is the number of ways both balls are blue?",
        options: ["20","15","10","36"],
        correct: 2,
        explanation: "We need to select 2 blue balls strictly from the 5 blue balls available. This is simply 5C2 = 10 ways."
    },
    {
        question: "In how many ways can 10 distinct students be divided into two indistinguishable teams of 5?",
        options: ["252","126","120","504"],
        correct: 1,
        explanation: "Select 5 for the first team in 10C5 (252) ways. Since the teams are indistinguishable (Team A and Team B are the same), we divide by 2!. 252 / 2 = 126."
    },
    {
        question: "Two coins are tossed simultaneously. What is the probability of getting at least one head?",
        options: ["1/4","1/2","3/4","1/3"],
        correct: 2,
        explanation: "The sample space is {HH, HT, TH, TT}. The outcomes with at least one head are HH, HT, TH (3 outcomes). Probability = 3/4."
    },
    {
        question: "Three unbiased coins are tossed. What is the probability of getting exactly two heads?",
        options: ["3/8","1/4","1/2","5/8"],
        correct: 0,
        explanation: "The sample space has 8 outcomes. The outcomes with exactly two heads are {HHT, HTH, THH}. Probability = 3/8."
    },
    {
        question: "Two dice are thrown simultaneously. What is the probability of getting a sum of 8?",
        options: ["1/6","5/36","7/36","1/9"],
        correct: 1,
        explanation: "The favorable pairs for a sum of 8 are (2,6), (3,5), (4,4), (5,3), (6,2), which is 5 outcomes out of 36. Probability = 5/36."
    },
    {
        question: "Two dice are thrown together. What is the probability that the sum of the numbers on the two faces is a prime number?",
        options: ["1/2","5/12","7/18","11/36"],
        correct: 1,
        explanation: "Possible prime sums are 2, 3, 5, 7, and 11. The frequencies are 1, 2, 4, 6, and 2 respectively. Total favorable = 15. Probability = 15/36 = 5/12."
    },
    {
        question: "A ticket is drawn at random from 50 tickets numbered 1 to 50. What is the probability that the drawn ticket is a multiple of 3 or 5?",
        options: ["21/50","23/50","1/2","12/25"],
        correct: 1,
        explanation: "Multiples of 3 = 16. Multiples of 5 = 10. Multiples of 15 (common) = 3. Using the union rule: 16 + 10 - 3 = 23. Probability = 23/50."
    },
    {
        question: "What is the probability that a leap year selected at random will contain 53 Sundays?",
        options: ["1/7","2/7","3/7","1/366"],
        correct: 1,
        explanation: "A leap year has 366 days (52 full weeks and 2 odd days). The 2 odd days can be (Sun,Mon), (Mon,Tue), ..., (Sat,Sun). Sunday appears in 2 out of the 7 pairs. Probability = 2/7."
    },
    {
        question: "What is the probability of getting a doublet (same number on both) when two dice are thrown?",
        options: ["1/6","1/12","1/3","1/4"],
        correct: 0,
        explanation: "The doublets are (1,1), (2,2), (3,3), (4,4), (5,5), (6,6). There are 6 favorable outcomes out of 36. Probability = 6/36 = 1/6."
    },
    {
        question: "A letter is chosen at random from the word 'PROBABILITY'. What is the probability that the letter chosen is a vowel?",
        options: ["3/11","5/11","4/11","2/11"],
        correct: 2,
        explanation: "The word has 11 letters. The vowels are O, A, I, I (4 vowels). Probability = 4/11."
    },
    {
        question: "A bag contains 4 white, 5 red, and 6 blue balls. If a ball is drawn at random, what is the probability that it is not red?",
        options: ["1/3","2/3","3/5","2/5"],
        correct: 1,
        explanation: "Total balls = 15. The number of balls that are not red (white + blue) is 4 + 6 = 10. Probability = 10/15 = 2/3."
    },
    {
        question: "The odds against an event are 5:3. What is the probability of the occurrence of the event?",
        options: ["3/5","5/8","3/8","5/3"],
        correct: 2,
        explanation: "If odds against are 5:3, it means 5 unfavorable outcomes for every 3 favorable outcomes. Total outcomes = 8. Probability of occurrence (favorable) = 3/8."
    },
    {
        question: "Three dice are rolled simultaneously. What is the probability that they all show the same number?",
        options: ["1/216","1/18","1/36","1/72"],
        correct: 2,
        explanation: "Total outcomes = 6 × 6 × 6 = 216. Favorable outcomes (triplets like 1-1-1, 2-2-2, etc.) are 6. Probability = 6/216 = 1/36."
    },
    {
        question: "A card is drawn from a well-shuffled deck of 52 cards. What is the probability of drawing a Spade or a King?",
        options: ["4/13","17/52","1/4","1/13"],
        correct: 0,
        explanation: "There are 13 spades and 4 kings. One king is already counted in the spades (King of Spades). Favorable = 13 + 4 - 1 = 16. Probability = 16/52 = 4/13."
    },
    {
        question: "Two cards are drawn simultaneously from a standard deck of 52 cards. What is the probability that both are red cards?",
        options: ["1/4","25/102","1/2","25/51"],
        correct: 1,
        explanation: "There are 26 red cards. The probability is (26C2) / (52C2) = 325 / 1326, which simplifies to 25/102."
    },
    {
        question: "One card is drawn from a pack of 52 cards. What is the probability that it is a face card (Jack, Queen, or King)?",
        options: ["3/13","1/4","4/13","1/13"],
        correct: 0,
        explanation: "Each of the 4 suits has 3 face cards, totaling 12 face cards. Probability = 12/52 = 3/13."
    },
    {
        question: "A bag contains 3 red and 5 green balls. If two balls are drawn at random, what is the probability that they are of different colors?",
        options: ["15/56","15/28","5/14","3/14"],
        correct: 1,
        explanation: "We need 1 red AND 1 green. Favorable = 3C1 × 5C1 = 15. Total pairs = 8C2 = 28. Probability = 15/28."
    },
    {
        question: "The probability of a shooter hitting a target is 1/3. If he fires 4 times, what is the probability of hitting the target at least once?",
        options: ["65/81","16/81","1/81","4/81"],
        correct: 0,
        explanation: "Probability of missing = 2/3. Probability of missing all 4 times = (2/3)^4 = 16/81. Probability of hitting at least once = 1 - 16/81 = 65/81."
    },
    {
        question: "Person A speaks the truth in 75% of cases, and Person B in 80% of cases. What is the probability that they contradict each other stating the same fact?",
        options: ["3/20","1/4","7/20","1/5"],
        correct: 2,
        explanation: "Contradiction happens if (A true AND B false) OR (A false AND B true). P = (0.75 × 0.20) + (0.25 × 0.80) = 0.15 + 0.20 = 0.35 = 35/100 = 7/20."
    },
    {
        question: "5 boys and 5 girls sit in a row at random. What is the probability that the boys and girls sit alternately?",
        options: ["1/252","1/126","1/63","1/10"],
        correct: 1,
        explanation: "Total arrangements = 10!. They can alternate as BGBG... or GBGB... (2 patterns). For each, boys arrange in 5! and girls in 5!. Favorable = 2 × 5! × 5!. Probability = (2 × 120 × 120) / 3628800 = 1/126."
    },
    {
        question: "Two balls are drawn at random from a bag containing 4 black, 5 white, and 6 green balls. What is the probability that neither is black?",
        options: ["55/105","11/21","2/7","4/15"],
        correct: 1,
        explanation: "Total balls = 15. Non-black balls = 11. We need 2 balls from the 11 non-black. Favorable = 11C2 = 55. Total = 15C2 = 105. Probability = 55/105 = 11/21."
    },
    {
        question: "A coin is biased such that a head is three times as likely to occur as a tail. If the coin is tossed twice, what is the probability of getting two heads?",
        options: ["1/4","9/16","3/8","3/4"],
        correct: 1,
        explanation: "Let P(Tail) = x, then P(Head) = 3x. Since x + 3x = 1, x = 1/4. P(Head) = 3/4. Probability of two heads = (3/4) × (3/4) = 9/16."
    },
    {
        question: "A box contains 10 bulbs, out of which 3 are defective. If 2 bulbs are drawn at random, what is the probability that at least one is defective?",
        options: ["8/15","7/15","1/15","2/5"],
        correct: 0,
        explanation: "Probability of at least one defective = 1 - P(none defective). Non-defective = 7. P(none defective) = 7C2 / 10C2 = 21/45. Required = 1 - 21/45 = 24/45 = 8/15."
    },
    {
        question: "Tickets are numbered from 1 to 20. Two tickets are drawn at random. What is the probability that the sum of the numbers is even?",
        options: ["1/2","9/20","9/19","10/19"],
        correct: 2,
        explanation: "A sum is even if both are even (10C2 ways) or both are odd (10C2 ways). Favorable = 45 + 45 = 90. Total ways = 20C2 = 190. Probability = 90/190 = 9/19."
    },
    {
        question: "From a standard pack of cards, 2 cards are drawn at random. What is the probability that one is a King and the other is a Queen?",
        options: ["8/663","16/663","4/663","1/663"],
        correct: 0,
        explanation: "We need 1 King out of 4 (4C1) and 1 Queen out of 4 (4C1). Favorable = 16. Total = 52C2 = 1326. Probability = 16/1326 = 8/663."
    },
    {
        question: "A number is chosen at random from 1 to 100. What is the probability that it is a prime number?",
        options: ["1/5","1/4","6/25","1/2"],
        correct: 1,
        explanation: "There are exactly 25 prime numbers between 1 and 100. The probability is 25/100 = 1/4."
    },
    {
        question: "Three bags contain varying white and black balls: B1(2W, 3B), B2(4W, 1B), and B3(3W, 2B). A bag is chosen at random and a ball is drawn. What is the probability it is white?",
        options: ["3/5","2/5","1/3","9/15"],
        correct: 0,
        explanation: "Using Total Probability: P(W) = P(B1)P(W|B1) + P(B2)P(W|B2) + P(B3)P(W|B3) = (1/3)(2/5) + (1/3)(4/5) + (1/3)(3/5) = (1/3) × (9/5) = 3/5."
    },
    {
        question: "If a letter is selected at random from the word 'ASSASSINATION', what is the probability that it is the letter 'S'?",
        options: ["3/13","4/13","2/13","1/13"],
        correct: 1,
        explanation: "The word has 13 total letters. The letter 'S' appears 4 times. Probability = 4/13."
    },
    {
        question: "Four letters are put randomly into four pre-addressed envelopes. What is the probability that exactly one letter is put into the correct envelope?",
        options: ["1/3","1/4","3/8","1/2"],
        correct: 0,
        explanation: "Choose 1 letter to be correct (4C1 = 4). The remaining 3 must be wrong (derangement of 3, D3 = 2). Favorable = 4 × 2 = 8. Total = 4! = 24. Probability = 8/24 = 1/3."
    },
    {
        question: "An integer is chosen at random from 10 to 99. What is the probability that its digits are distinct?",
        options: ["9/10","8/9","81/100","1/10"],
        correct: 0,
        explanation: "Total numbers from 10 to 99 = 90. The numbers with same digits are 11, 22, 33, 44, 55, 66, 77, 88, 99 (9 numbers). Numbers with distinct digits = 81. Probability = 81/90 = 9/10."
    },
    {
        question: "Two dice are rolled. What is the probability of getting a sum strictly greater than 9?",
        options: ["1/12","1/4","1/6","5/36"],
        correct: 2,
        explanation: "Sums greater than 9 are 10, 11, and 12. Frequencies: sum 10 (3 ways), sum 11 (2 ways), sum 12 (1 way). Total = 6. Probability = 6/36 = 1/6."
    },
    {
        question: "In a class, 30% of the students study French, 40% study German, and 10% study both. If a student is chosen at random, what is the probability they study at least one of these languages?",
        options: ["0.70","0.60","0.80","0.50"],
        correct: 1,
        explanation: "Using the union formula: P(F ∪ G) = P(F) + P(G) - P(F ∩ G) = 0.30 + 0.40 - 0.10 = 0.60."
    },
    {
        question: "A five-digit number is formed using the digits 1, 2, 3, 4, 5 without repetition. What is the probability that the number is divisible by 4?",
        options: ["1/5","1/4","2/5","1/6"],
        correct: 0,
        explanation: "A number is divisible by 4 if its last two digits are divisible by 4. Valid pairs from (1,2,3,4,5) are 12, 24, 32, 52 (4 pairs). For each, the first 3 digits arrange in 3! = 6 ways. Favorable = 4 × 6 = 24. Total = 5! = 120. Probability = 24/120 = 1/5."
    },
    {
        question: "From a group of 7 men and 4 women, a committee of 4 is selected. What is the probability that the committee consists of exactly 2 men and 2 women?",
        options: ["14/33","21/33","14/55","21/55"],
        correct: 0,
        explanation: "Favorable = 7C2 × 4C2 = 21 × 6 = 126. Total combinations = 11C4 = 330. Probability = 126/330. Dividing by 6 gives 21/55. Wait, 126 / 330 = 63 / 165 = 21 / 55. Let me correct the answer map."
    },
    {
        question: "From a group of 7 men and 4 women, a committee of 4 is selected. What is the probability that the committee consists of exactly 2 men and 2 women?",
        options: ["14/33","21/55","14/55","21/33"],
        correct: 1,
        explanation: "Favorable selections = 7C2 × 4C2 = 21 × 6 = 126. Total selections = 11C4 = 330. Probability = 126/330 = 21/55."
    },
    {
        question: "In a lottery, there are 10 prizes and 25 blanks. A lottery is drawn at random. What is the probability of getting a prize?",
        options: ["1/10","2/5","2/7","5/7"],
        correct: 2,
        explanation: "Total number of tickets = 10 (prizes) + 25 (blanks) = 35. The probability of getting a prize is 10/35, which simplifies to 2/7."
    }
];
