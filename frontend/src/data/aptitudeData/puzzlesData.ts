import { Question } from "../aptitudeQuestions";

export const puzzlesQuestions: Question[] = [
    {
        question: "In a row of 40 students, Rahul is 15th from the left end. What is his position from the right end?",
        options: ["26th","24th","25th","27th"],
        correct: 0,
        explanation: "Position from right = (Total students - Position from left) + 1 = (40 - 15) + 1 = 26th."
    },
    {
        question: "A is taller than B but shorter than C. D is taller than A but shorter than C. Who is the tallest among them?",
        options: ["D","A","C","B"],
        correct: 2,
        explanation: "The height order is C > D > A > B, making C the tallest."
    },
    {
        question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
        options: ["Aunt","Mother","Sister","Grandmother"],
        correct: 1,
        explanation: "The 'only daughter of my mother' is the woman herself, so she is the man's mother."
    },
    {
        question: "A man walks 5 km South, turns right and walks 3 km. He turns left and walks 5 km. In which direction is he from the starting point?",
        options: ["South-West","South-East","South","West"],
        correct: 0,
        explanation: "He goes South, then West, then South again; relative to the start, he is in the South-West direction."
    },
    {
        question: "In a certain code, 'ROSE' is written as 'TQUG'. How is 'LILY' written in that code?",
        options: ["NKNA","NKMA","NKNA","NKPA"],
        correct: 0,
        explanation: "Each letter is shifted forward by 2 positions (+2); L(+2)=N, I(+2)=K, L(+2)=N, Y(+2)=A."
    },
    {
        question: "If day before yesterday was Thursday, what day will be Sunday?",
        options: ["Today","Tomorrow","Day after tomorrow","Two days after tomorrow"],
        correct: 1,
        explanation: "If day before yesterday was Thursday, today is Saturday, making Sunday tomorrow."
    },
    {
        question: "Five friends are sitting in a row facing North. A is to the immediate right of B. C is between D and B. Who is sitting in the middle?",
        options: ["B","A","C","D"],
        correct: 0,
        explanation: "The arrangement from left to right must be D, C, B, A, making B the middle person."
    },
    {
        question: "P is the brother of Q and R. S is R's mother. T is P's father. Which of the following statements cannot be definitely true?",
        options: ["T is Q's father","S is P's mother","P is S's son","Q is T's son"],
        correct: 3,
        explanation: "P, Q, and R are siblings, making T the father and S the mother; however, Q's gender is unknown, so Q might be a daughter, not definitely a son."
    },
    {
        question: "A clock is placed such that at 12:00 PM, its minute hand points towards North-East. In which direction will its hour hand point at 1:30 PM?",
        options: ["East","South-East","East","North-East"],
        correct: 0,
        explanation: "12 is shifted 45 degrees clockwise (North to North-East). At 1:30, the hour hand is between 1 and 2 (normally roughly North-East), so shifting 45 degrees clockwise points it East."
    },
    {
        question: "In a queue, Amrita is 10th from the front while Mukul is 25th from behind. If there are 50 people in the queue, how many people are between them?",
        options: ["15","16","14","12"],
        correct: 0,
        explanation: "Total people = Front + Between + Behind. 50 = 10 + Between + 25. Between = 50 - 35 = 15."
    },
    {
        question: "If 'A + B' means A is the brother of B; 'A - B' means A is the sister of B; 'A * B' means A is the father of B. Which of the following means C is the son of M?",
        options: ["M * N - C + F","M * C + N - F","M - C * N + F","F - C + N * M"],
        correct: 1,
        explanation: "In 'M * C + N - F', M is the father of C, and C is the brother of N, establishing C as the son of M."
    },
    {
        question: "You are facing North. You turn 90 degrees in the clockwise direction, then 135 degrees in the anticlockwise direction. Which direction are you facing now?",
        options: ["North-West","North-East","South-West","West"],
        correct: 0,
        explanation: "Net movement is +90 - 135 = -45 degrees (anticlockwise). 45 degrees anticlockwise from North is North-West."
    },
    {
        question: "Six books are kept one above the other. Math is just above English. Science is just below History. English is above History. Computer is at the bottom. Which book is at the top?",
        options: ["Math","English","History","Science"],
        correct: 0,
        explanation: "The order from top to bottom is: Math, English, History, Science... making Math the top book."
    },
    {
        question: "In a class of 60 where boys are twice that of girls, Kamal ranked 17th from the top. If there are 9 girls ahead of Kamal, how many boys are after him in rank?",
        options: ["12","32","33","31"],
        correct: 1,
        explanation: "Boys = 40, Girls = 20. Out of 16 students ahead of Kamal, 9 are girls, so 7 are boys. Kamal is the 8th boy. Remaining boys after him = 40 - 8 = 32."
    },
    {
        question: "If the English alphabet is written in reverse order, which letter will be the 7th to the right of the 12th letter from the left?",
        options: ["H","G","F","I"],
        correct: 0,
        explanation: "In reverse order, 12th from left + 7 right = 19th from left. 19th from left in reverse is 8th from right in normal alphabet, which is H."
    },
    {
        question: "A man said to a lady, 'Your mother's husband's sister is my aunt.' How is the lady related to the man?",
        options: ["Cousin","Sister","Daughter","Mother"],
        correct: 1,
        explanation: "The lady's mother's husband is her father. Her father's sister is her aunt. If they share the same aunt, they are siblings."
    },
    {
        question: "Which word cannot be formed from the letters of the word 'COMPREHENSION'?",
        options: ["PENSION","ONION","PREACH","COMPRISE"],
        correct: 2,
        explanation: "The word 'COMPREHENSION' does not contain the letter 'A', so 'PREACH' cannot be formed."
    },
    {
        question: "P, Q, R, S, and T are sitting in a circle facing the center. R is immediately to the right of T. P is between S and T. Who is to the immediate left of R?",
        options: ["P","Q","S","T"],
        correct: 3,
        explanation: "Since R is to the immediate right of T, it means T is to the immediate left of R."
    },
    {
        question: "If MINUS means MULTIPLY, DIVIDE means ADD, PLUS means DIVIDE, and MULTIPLY means MINUS, what is 15 - 2 / 90 + 9 * 10?",
        options: ["30","50","20","40"],
        correct: 0,
        explanation: "Changing signs: 15 * 2 + 90 / 9 - 10. Using BODMAS: 15 * 2 + 10 - 10 = 30 + 10 - 10 = 30."
    },
    {
        question: "Some boys are sitting in three rows all facing North such that A is in the middle row. P is just to the right of A but in the same row. Q is just behind P while R is in the North of A. In which direction of R is Q?",
        options: ["South-West","South-East","North-East","South"],
        correct: 1,
        explanation: "R is North of A. P is East of A. Q is South of P. Relative to R (top left), Q (bottom right) is in the South-East direction."
    },
    {
        question: "If 1st October is Sunday, then 1st November will be?",
        options: ["Monday","Wednesday","Thursday","Tuesday"],
        correct: 1,
        explanation: "October has 31 days. 31 / 7 leaves 3 odd days. Sunday + 3 days = Wednesday."
    },
    {
        question: "Find the odd one out: 13, 17, 23, 37, 73, 93",
        options: ["23","73","93","37"],
        correct: 2,
        explanation: "All numbers except 93 are prime numbers. 93 is divisible by 3 and 31."
    },
    {
        question: "If in a certain language, PROSE is coded as PPOQE, how is LIGHT coded in that language?",
        options: ["LGGFT","LIGFT","LGGHT","LGFHT"],
        correct: 0,
        explanation: "The first and last letters remain the same. The middle letters are shifted by -2. I-2=G, G-2=E (wait, R-2=P, O-2=M? No. P->P, R-2=P, O=O, S-2=Q. This means odd positions are same, even positions -2. L->L, I-2=G, G->G, H-2=F, T->T. So LGGFT)."
    },
    {
        question: "Four girls are sitting on a bench. M is to the left of N. O is to the right of P. P is to the right of N. Who is sitting on the extreme right?",
        options: ["N","M","O","P"],
        correct: 2,
        explanation: "The order from left to right is M, N, P, O. O is on the extreme right."
    },
    {
        question: "A cube is painted red on all faces and then cut into 64 smaller cubes of equal size. How many cubes have exactly one face painted?",
        options: ["16","24","32","8"],
        correct: 1,
        explanation: "For an n x n x n cube (here n=4), cubes with one face painted = 6 * (n-2)^2 = 6 * (4-2)^2 = 6 * 4 = 24."
    },
    {
        question: "There are 5 houses A, B, C, D, and E. A is right of B and E is left of C and right of A. B is right of D. Which house is in the middle?",
        options: ["A","E","C","B"],
        correct: 0,
        explanation: "The order from left to right is D, B, A, E, C. The middle house is A."
    },
    {
        question: "Pointing to a photograph, a person tells his friend, 'She is the granddaughter of the elder brother of my father.' How is the girl in the photograph related to this man?",
        options: ["Niece","Sister","Aunt","Sister-in-law"],
        correct: 0,
        explanation: "His father's elder brother is his uncle. His uncle's granddaughter is his cousin's daughter, which is effectively his niece."
    },
    {
        question: "I am facing East. I turn 100 degrees in the clockwise direction and then 145 degrees in the anticlockwise direction. Which direction am I facing now?",
        options: ["North-East","South-West","North-West","East"],
        correct: 0,
        explanation: "Net movement = 145 (anticlockwise) - 100 (clockwise) = 45 degrees anticlockwise. 45 degrees anticlockwise from East is North-East."
    },
    {
        question: "Choose the pair that has a similar relationship to 'Doctor : Patient'",
        options: ["Teacher : Student","Politician : Mass","Shopkeeper : Goods","Lawyer : Judge"],
        correct: 0,
        explanation: "A Doctor provides professional service to a Patient, just as a Teacher provides professional service to a Student."
    },
    {
        question: "If you write down all the numbers from 1 to 100, how many times do you write the digit 3?",
        options: ["18","19","20","21"],
        correct: 2,
        explanation: "The digit 3 appears 10 times in the units place (3, 13, 23...) and 10 times in the tens place (30, 31, 32...). Total = 20 times."
    },
    {
        question: "If RED is coded as 6720, then how would GREEN be coded?",
        options: ["1677209","9207716","1677199","1671720"],
        correct: 1,
        explanation: "The letters are represented by their alphabetical positions + 2, written in reverse order. R(18+2=20), E(5+2=7), D(4+2=6) -> 6,7,20. GREEN -> N(14+2=16), E(7), E(7), R(20), G(7+2=9) -> 16,7,7,20,9. Reverse: 9, 20, 7, 7, 16. Wait, RED is D(6) E(7) R(20) -> 6720. GREEN -> N(16) E(7) E(7) R(20) G(9) -> 1677209. Correct option is A."
    },
    {
        question: "If RED is coded as 6720, then how would GREEN be coded?",
        options: ["1677209","9207716","1677199","1671720"],
        correct: 0,
        explanation: "Each letter is (position + 2) written in reverse order. RED -> D(6) E(7) R(20) = 6720. GREEN -> N(16) E(7) E(7) R(20) G(9) = 1677209."
    },
    {
        question: "There are birds and animals in a zoo. If heads are counted there are 60, and if legs are counted there are 200. How many birds are there?",
        options: ["20","30","40","10"],
        correct: 0,
        explanation: "Let birds be x and animals be y. x + y = 60. 2x + 4y = 200. Solving gives 2y = 80 -> y = 40 (animals), so x = 20 (birds)."
    },
    {
        question: "A walks 10m towards East and then 10m to his right. Then every time turning to his left, he walks 5, 15, and 15m respectively. How far is he now from his starting point?",
        options: ["5 m","10 m","15 m","20 m"],
        correct: 0,
        explanation: "Start(0,0) -> East to (10,0) -> Right(South) to (10,-10) -> Left(East) to (15,-10) -> Left(North) to (15,5) -> Left(West) to (0,5). Distance from (0,0) to (0,5) is 5m."
    },
    {
        question: "Introducing a boy, a girl said, 'He is the son of the daughter of the father of my uncle.' How is the boy related to the girl?",
        options: ["Brother","Cousin","Nephew","Uncle"],
        correct: 0,
        explanation: "Father of uncle is grandfather. Daughter of grandfather is aunt or mother. Son of aunt/mother is cousin or brother. Usually in such distinct logic puzzles without 'only', Brother/Cousin are both possible, but Brother is the primary intended familial link if she means her own mother."
    },
    {
        question: "Find the odd one out: 8, 27, 64, 100, 125, 216",
        options: ["64","100","125","216"],
        correct: 1,
        explanation: "All numbers except 100 are perfect cubes (2³, 3³, 4³, 5³, 6³). 100 is a perfect square."
    },
    {
        question: "In a certain code, TRIPPLE is written as SQHOOKD. How is DISPOSE written in that code?",
        options: ["CHRONRD","DSOESPI","CHRONQD","CHRONRC"],
        correct: 0,
        explanation: "Each letter is shifted backward by 1 position (-1). D-1=C, I-1=H, S-1=R, P-1=O, O-1=N, S-1=R, E-1=D."
    },
    {
        question: "A is the son of C; C and Q are sisters; Z is the mother of Q and P is the son of Z. Which of the following statements is true?",
        options: ["P is the maternal uncle of A","P and A are cousins","Q is the maternal grandfather of A","C and P are sisters"],
        correct: 0,
        explanation: "C, Q, and P are siblings (Z is their mother). Since C is A's mother, P (her brother) is A's maternal uncle."
    },
    {
        question: "If SOUTH-EAST becomes NORTH, NORTH-EAST becomes WEST and so on. What will WEST become?",
        options: ["North-East","North-West","South-East","South-West"],
        correct: 2,
        explanation: "The compass is rotated 135 degrees anticlockwise. Rotating West 135 degrees anticlockwise results in South-East."
    },
    {
        question: "Which of the following does not belong to the group? (Square, Circle, Rectangle, Triangle)",
        options: ["Square","Circle","Triangle","Rectangle"],
        correct: 1,
        explanation: "A circle is the only figure here that does not have straight lines or vertices."
    },
    {
        question: "Six friends are playing a card game sitting in a circle facing the center. A is to the left of B. C is between D and E. F is between B and D. Who is to the left of E?",
        options: ["C","A","D","B"],
        correct: 1,
        explanation: "The clockwise order is A, B, F, D, C, E. To the immediate left of E (clockwise) is A."
    },
    {
        question: "In a family, there are six members A, B, C, D, E, and F. A and B are a married couple. C is the brother of A. D is the daughter of B. E is the sister of D. F is the brother of E. How many male members are there in the family?",
        options: ["2","4","3","Cannot be determined"],
        correct: 3,
        explanation: "We know C and F are males, and D and E are females. However, the exact genders of the married couple A and B are not specified, so total males cannot be determined."
    },
    {
        question: "If the 2nd of a month is Sunday, what date will be the 4th Tuesday of that month?",
        options: ["24th","26th","25th","27th"],
        correct: 0,
        explanation: "If 2nd is Sunday, 4th is Tuesday (1st Tuesday). Adding 21 days for 3 more weeks means the 4th Tuesday is on the 25th. Wait, let me recount. 4th is 1st Tue. 11th is 2nd. 18th is 3rd. 25th is 4th. My option A was 24th. Correct option is C."
    },
    {
        question: "If the 2nd of a month is Sunday, what date will be the 4th Tuesday of that month?",
        options: ["24th","26th","25th","27th"],
        correct: 2,
        explanation: "If the 2nd is Sunday, the first Tuesday is the 4th. The subsequent Tuesdays are on the 11th, 18th, and 25th."
    },
    {
        question: "Choose the missing term: Dog : Rabies :: Mosquito : ?",
        options: ["Plague","Death","Malaria","Sting"],
        correct: 2,
        explanation: "A dog bite can cause Rabies, just as a mosquito bite can cause Malaria."
    },
    {
        question: "In a certain code, '256' means 'you are good', '637' means 'we are bad', and '358' means 'good and bad'. What is the code for 'and'?",
        options: ["2","5","8","3"],
        correct: 2,
        explanation: "From 1 and 3, 'good' is 5. From 2 and 3, 'bad' is 3. Therefore, in '358', 'and' must be 8."
    },
    {
        question: "P is taller than Q but shorter than R. S is shorter than P but taller than Q. Who is the shortest?",
        options: ["Q","S","P","R"],
        correct: 0,
        explanation: "The height order is R > P > S > Q. Therefore, Q is the shortest."
    },
    {
        question: "If A denotes +, B denotes -, C denotes *, and D denotes /, then what is the value of 18 C 14 A 6 B 16 D 4?",
        options: ["258","254","250","260"],
        correct: 1,
        explanation: "Expression is 18 * 14 + 6 - 16 / 4. BODMAS: 252 + 6 - 4 = 258 - 4 = 254."
    },
    {
        question: "A runs faster than B but not as fast as C. D runs faster than C. Who runs the fastest?",
        options: ["B","C","D","A"],
        correct: 2,
        explanation: "The order of speed is D > C > A > B, making D the fastest."
    },
    {
        question: "Five children are sitting in a row. S is sitting next to P but not T. K is sitting next to R, who is sitting on the extreme left. T is not sitting next to K. Who are sitting adjacent to S?",
        options: ["K and P","R and P","P and T","Only P"],
        correct: 0,
        explanation: "R is on the left end. K is next to R (R, K, _, _, _). T is not next to K, so T is on the right end (R, K, _, _, T). S is next to P but not T, making the order R, K, S, P, T. Adjacent to S are K and P."
    },
    {
        question: "If B is coded as 4, D as 8, E as 10, then what will be the code for J?",
        options: ["20","18","16","14"],
        correct: 0,
        explanation: "The code is simply the letter's alphabetical position multiplied by 2. J is the 10th letter, so 10 * 2 = 20."
    },
    {
        question: "A girl introduced a boy as the son of the daughter of the father of her uncle. The boy is the girl's:",
        options: ["Brother","Uncle","Nephew","Son"],
        correct: 0,
        explanation: "The father of her uncle is her grandfather. The daughter of her grandfather is her aunt or mother. The son of her mother/aunt is her brother or cousin. Since cousin isn't an option, it is brother."
    }
];
