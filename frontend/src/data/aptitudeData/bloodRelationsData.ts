import { Question } from "../aptitudeQuestions";

export const bloodRelationsQuestions: Question[] = [
    {
        question: "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
        options: ["Brother","Uncle","Cousin","Father"],
        correct: 3,
        explanation: "The 'only son of my mother' is Suresh himself, meaning the boy in the photograph is Suresh's son."
    },
    {
        question: "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?",
        options: ["Nephew","Cannot be determined","Niece","Brother"],
        correct: 1,
        explanation: "While we know A is the uncle of D, the gender of D is not provided, so D could be either a nephew or a niece."
    },
    {
        question: "Introducing a woman, a man said, 'Her mother is the only daughter of my mother-in-law.' How is the man related to the woman?",
        options: ["Father","Husband","Brother","Uncle"],
        correct: 0,
        explanation: "The only daughter of the man's mother-in-law is his wife, so the woman is his wife's daughter, making him her father."
    },
    {
        question: "A is the mother of B and C. If D is the husband of C, what is A to D?",
        options: ["Mother","Sister","Aunt","Mother-in-law"],
        correct: 3,
        explanation: "Since A is the mother of C, and D is married to C, A becomes the mother-in-law of D."
    },
    {
        question: "Pointing to a gentleman, Deepak said, 'His only brother is the father of my daughter's father.' How is the gentleman related to Deepak?",
        options: ["Grandfather","Uncle","Father","Brother-in-law"],
        correct: 1,
        explanation: "Deepak's daughter's father is Deepak himself, so the gentleman's brother is Deepak's father, making the gentleman Deepak's uncle."
    },
    {
        question: "M is the sister of N. R is the niece of M. T is the mother of R. How is N related to T?",
        options: ["Brother","Sister","Husband","Cannot be determined"],
        correct: 2,
        explanation: "Since R is M's niece, R's parent must be N; if T is R's mother, then N must be R's father and T's husband."
    },
    {
        question: "A girl introduced a boy as the son of the daughter of the father of her uncle. How is the boy related to the girl?",
        options: ["Brother","Nephew","Uncle","Son"],
        correct: 0,
        explanation: "The father of her uncle is her grandfather, and his daughter is her mother, so the boy (son of her mother) is her brother."
    },
    {
        question: "P is the brother of Q and R. S is R's mother. T is P's father. Which of the following statements cannot be definitely true?",
        options: ["T is Q's father","S is P's mother","Q is T's son","P is S's son"],
        correct: 2,
        explanation: "We know Q is a sibling of P and R, but Q's gender is unknown, so Q could be T's daughter instead of a son."
    },
    {
        question: "Pointing to a person, a man said to a woman, 'His mother is the only daughter of your father.' How was the woman related to the person?",
        options: ["Aunt","Mother","Wife","Daughter"],
        correct: 1,
        explanation: "The only daughter of the woman's father is the woman herself, so she is the mother of the person."
    },
    {
        question: "Rita told Mani, 'The girl I met yesterday at the beach was the youngest daughter of the brother-in-law of my friend's mother.' How is the girl related to Rita's friend?",
        options: ["Cousin","Niece","Friend","Aunt"],
        correct: 0,
        explanation: "The brother-in-law of the friend's mother is the friend's uncle, so the uncle's daughter is the friend's cousin."
    },
    {
        question: "If X is the brother of the son of Y's son, how is X related to Y?",
        options: ["Son","Brother","Cousin","Grandson"],
        correct: 3,
        explanation: "The son of Y's son is Y's grandson, and the brother of that grandson is also Y's grandson."
    },
    {
        question: "A woman introduces a man as the son of the brother of her mother. How is the man related to the woman?",
        options: ["Nephew","Son","Cousin","Uncle"],
        correct: 2,
        explanation: "The brother of her mother is her uncle, and his son is her first cousin."
    },
    {
        question: "Looking at a portrait of a man, Harsh said, 'His mother is the wife of my father's son. Brothers and sisters I have none.' At whose portrait was Harsh looking?",
        options: ["His son","His cousin","His uncle","His nephew"],
        correct: 0,
        explanation: "Since Harsh has no siblings, 'my father's son' is Harsh himself; thus, the man's mother is Harsh's wife, making the man his son."
    },
    {
        question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
        options: ["Grandmother","Granddaughter","Daughter","Aunt"],
        correct: 1,
        explanation: "Since A is the daughter of C, and D is the father of C, A is the granddaughter of D."
    },
    {
        question: "Q is the son of P. X is the daughter of Q. R is the aunty (father's sister) of X and L is the son of R, then what is L to P?",
        options: ["Grandson","Nephew","Son","Brother"],
        correct: 0,
        explanation: "R is Q's sister and P's daughter; since L is R's son, L is the grandson of P."
    },
    {
        question: "Pointing to a man on the stage, Rashi said, 'He is the brother of the daughter of the wife of my husband.' How is the man on the stage related to Rashi?",
        options: ["Son","Husband","Cousin","Nephew"],
        correct: 0,
        explanation: "The wife of Rashi's husband is Rashi herself; her daughter's brother is her own son."
    },
    {
        question: "If P is the husband of Q and R is the mother of S and Q, what is R to P?",
        options: ["Mother","Sister","Aunt","Mother-in-law"],
        correct: 3,
        explanation: "R is the mother of Q, who is P's wife, making R the mother-in-law of P."
    },
    {
        question: "A family consists of six members A, B, C, D, E and F. B is the son of C but C is not the mother of B. A and C are a married couple. What is C to A?",
        options: ["Husband","Wife","Brother","Father"],
        correct: 0,
        explanation: "If C is B's parent but not the mother, C must be the father, making C the husband of A."
    },
    {
        question: "Pointing to a photograph, a woman says, 'This man's son's sister is my mother-in-law.' How is the woman's husband related to the man in the photograph?",
        options: ["Grandson","Son","Son-in-law","Nephew"],
        correct: 0,
        explanation: "The man's son's sister is his daughter; if his daughter is the woman's mother-in-law, the woman's husband is the daughter's son, which is the man's grandson."
    },
    {
        question: "A and B are brothers. C and D are sisters. A's son is D's brother. How is B related to C?",
        options: ["Father","Brother","Uncle","Grandfather"],
        correct: 2,
        explanation: "Since A's son is D's brother, A is the father of D and C; thus, A's brother B is the uncle of C."
    },
    {
        question: "There are six persons A, B, C, D, E and F. C is the sister of F. B is the brother of E's husband. D is the father of A and grandfather of F. There are two fathers, three brothers and a mother in the group. Who is the mother?",
        options: ["A","B","D","E"],
        correct: 3,
        explanation: "D is the grandfather and A is the father of C and F; E is married to A (E's husband), making E the mother in the family."
    },
    {
        question: "Introducing a man, a woman said, 'He is the only son of my mother's mother.' How is the woman related to the man?",
        options: ["Mother","Aunt","Niece","Sister"],
        correct: 2,
        explanation: "Her mother's mother is her grandmother; the only son of her grandmother is her uncle, making her the niece of the man."
    },
    {
        question: "Pointing out to a lady, a girl said, 'She is the daughter-in-law of the grandmother of my father's only son.' How is the lady related to the girl?",
        options: ["Sister-in-law","Mother","Aunt","Cousin"],
        correct: 1,
        explanation: "Her father's only son is her brother, whose grandmother is her own grandmother; the daughter-in-law of her grandmother is her mother."
    },
    {
        question: "If X is the sister of Y, Z is the mother of Y, W is the father of Z, and V is the mother of W, then how is Z related to X?",
        options: ["Grandmother","Aunt","Mother","Daughter"],
        correct: 2,
        explanation: "Since X and Y are siblings and Z is the mother of Y, Z is also the mother of X."
    },
    {
        question: "Showing the man receiving the prize, Saroj said, 'He is the brother of my uncle's daughter.' Who is the man to Saroj?",
        options: ["Son","Brother-in-law","Nephew","Cousin"],
        correct: 3,
        explanation: "Saroj's uncle's daughter is her cousin; the brother of her cousin is also her cousin."
    },
    {
        question: "P is the mother of K; K is the sister of D; D is the father of J. How is P related to J?",
        options: ["Mother","Grandmother","Aunt","Daughter"],
        correct: 1,
        explanation: "Since D is the father of J, and P is the mother of D's sister K (making P the mother of D), P is the grandmother of J."
    },
    {
        question: "A is the father of C and D is the son of B. E is the brother of A. If C is the sister of D, how is B related to E?",
        options: ["Sister","Niece","Sister-in-law","Wife"],
        correct: 2,
        explanation: "C and D are siblings, meaning A (father) and B (mother) are married, making B the sister-in-law of A's brother, E."
    },
    {
        question: "Pointing to a photograph, a person tells his friend, 'She is the grand-daughter of the elder brother of my father.' How is the girl in the photograph related to this man?",
        options: ["Niece","Sister","Aunt","Sister-in-law"],
        correct: 0,
        explanation: "The elder brother of his father is his uncle, and the grand-daughter of his uncle would logically be his niece."
    },
    {
        question: "A is the uncle of B, who is the daughter of C, and C is the daughter-in-law of P. How is A related to P?",
        options: ["Brother","Son","Father","Son-in-law"],
        correct: 1,
        explanation: "C is married to P's son; if A is the uncle of C's daughter, A must be the brother of C's husband, making A the son of P."
    },
    {
        question: "Pointing to a lady in the photograph, Shaloo said, 'Her son's father is the son-in-law of my mother.' How is Shaloo related to the lady?",
        options: ["Aunt","Mother","Cousin","Sister"],
        correct: 3,
        explanation: "The son's father is the lady's husband; if her husband is the son-in-law of Shaloo's mother, the lady must be Shaloo's sister (or Shaloo herself, but 'Sister' is the standard option)."
    },
    {
        question: "Q is the brother of R; P is the sister of Q; T is the brother of S; S is the daughter of R. Who is the uncle of T?",
        options: ["P","Q","R","S"],
        correct: 1,
        explanation: "S and T are siblings, and R is their parent; since Q is the brother of R, Q is the uncle of T."
    },
    {
        question: "A and B are children of C. If C is the father of A but B is not the son of C, how are B and C related?",
        options: ["Daughter and Father","Niece and Uncle","Sister and Brother","Mother and Son"],
        correct: 0,
        explanation: "If B is a child of C but not a son, B must be a daughter, making the relationship Daughter and Father."
    },
    {
        question: "A man said to a lady, 'Your mother's husband's sister is my aunt.' How is the lady related to the man?",
        options: ["Daughter","Sister","Mother","Aunt"],
        correct: 1,
        explanation: "The lady's mother's husband is her father, and his sister is her aunt; if they share the same aunt, they are siblings."
    },
    {
        question: "If A + B means A is the mother of B; A - B means A is the brother of B; and A x B means A is the sister of B, which shows P is the maternal uncle of Q?",
        options: ["Q - M + P","P - M + Q","P + M - Q","P x M + Q"],
        correct: 1,
        explanation: "In 'P - M + Q', P is the brother of M, and M is the mother of Q, making P the maternal uncle of Q."
    },
    {
        question: "Pointing to a photograph, a lady tells Ram, 'I am the only daughter of this lady and her son is your maternal uncle.' How is the speaker related to Ram's father?",
        options: ["Wife","Sister","Sister-in-law","Mother-in-law"],
        correct: 0,
        explanation: "The lady speaking is the sister of Ram's maternal uncle, which makes her Ram's mother, and therefore the wife of Ram's father."
    },
    {
        question: "Introducing a man, a woman said, 'His wife is the only daughter of my father.' How is the man related to the woman?",
        options: ["Brother","Husband","Father-in-law","Maternal Uncle"],
        correct: 1,
        explanation: "The only daughter of the woman's father is the woman herself, meaning the man is her husband."
    },
    {
        question: "A man points to a photograph and says, 'The lady in the photograph is my nephew's maternal grandmother.' How is the lady related to the man's sister, who has no other sister?",
        options: ["Mother","Mother-in-law","Aunt","Sister-in-law"],
        correct: 0,
        explanation: "The man's nephew's mother is his sister; her maternal grandmother is the sister's mother."
    },
    {
        question: "X introduces Y saying, 'He is the husband of the grand-daughter of the father of my father.' How is Y related to X?",
        options: ["Brother","Son","Brother-in-law","Nephew"],
        correct: 2,
        explanation: "The father of X's father is X's grandfather; the grand-daughter is X's sister, making her husband Y the brother-in-law of X."
    },
    {
        question: "Pointing to a man in a photograph, a woman said, 'His brother's father is the only son of my grandfather.' How is the woman related to the man in the photograph?",
        options: ["Mother","Aunt","Daughter","Sister"],
        correct: 3,
        explanation: "The only son of her grandfather is her father; if her father is also the man's father, they are siblings."
    },
    {
        question: "A is the father of B, C is the daughter of B, D is the brother of B, E is the son of A. What is the relationship between C and E?",
        options: ["Brother and Sister","Cousins","Niece and Uncle","Uncle and Aunt"],
        correct: 2,
        explanation: "E is the son of A, making E the brother of B; since C is the daughter of B, E is the uncle of C."
    },
    {
        question: "If 'P $ Q' means P is the brother of Q; 'P # Q' means P is the mother of Q; 'P * Q' means P is the daughter of Q. In A # B $ C * D, who is the father?",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "A is the mother of B and C; since C is the daughter of D, D must be the father."
    },
    {
        question: "A woman walking with a boy meets another woman and says, 'My maternal uncle and the uncle of his maternal uncle is the same.' How is the woman related to the boy?",
        options: ["Aunt","Mother","Grandmother","Sister"],
        correct: 1,
        explanation: "If the woman's maternal uncle is the uncle of the boy's maternal uncle, the boy's maternal uncle must be the woman's brother, making her the boy's mother."
    },
    {
        question: "Introducing a boy, a girl said, 'He is the son of the daughter of the father of my uncle.' How is the boy related to the girl?",
        options: ["Nephew","Brother","Uncle","Son-in-law"],
        correct: 1,
        explanation: "The father of her uncle is her grandfather, whose daughter is her mother, making the son of that daughter her brother."
    },
    {
        question: "C is the mother of A and B. If D is the husband of B, then what is C to D?",
        options: ["Aunt","Mother-in-law","Sister","Wife"],
        correct: 1,
        explanation: "Since C is the mother of B, and D is married to B, C is the mother-in-law of D."
    },
    {
        question: "Pointing to a boy in the photograph, a girl said, 'He is the son of the only son of my grandfather.' How is the girl related to the boy?",
        options: ["Mother","Sister","Aunt","Cousin"],
        correct: 1,
        explanation: "The only son of her grandfather is her father, and his son is her brother, making her the sister."
    },
    {
        question: "If A is the brother of B, C is the sister of A, D is the brother of E, and E is the daughter of B, then who is the uncle of D?",
        options: ["A","B","C","E"],
        correct: 0,
        explanation: "D and E are children of B; since A is the brother of B, A is the uncle of D."
    },
    {
        question: "Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife.' How is the lady related to the man?",
        options: ["Mother's sister","Sister of father-in-law","Mother-in-law","Maternal Aunt"],
        correct: 1,
        explanation: "The brother of his wife is his brother-in-law; if the lady's brother is the father of his brother-in-law, her brother is his father-in-law, making her the sister of his father-in-law."
    },
    {
        question: "A is the uncle of B, who is the daughter of C, and C is the daughter-in-law of P. How is A related to P?",
        options: ["Son","Brother","Father","Son-in-law"],
        correct: 0,
        explanation: "Since C is the daughter-in-law of P, C's husband is P's son; if A is the uncle of C's daughter, A is the brother of C's husband, making A the son of P."
    },
    {
        question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
        options: ["Mother","Grandmother","Sister","Aunt"],
        correct: 0,
        explanation: "The only daughter of the woman's mother is the woman herself, meaning she is the mother of the man."
    },
    {
        question: "If M is the sister of Z, Z is the wife of P, and P is the son of A, how is Z related to A?",
        options: ["Daughter","Wife","Daughter-in-law","Sister-in-law"],
        correct: 2,
        explanation: "Because Z is married to P, and P is the son of A, Z is the daughter-in-law of A."
    }
];
