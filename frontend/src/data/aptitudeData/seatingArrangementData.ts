import { Question } from "../aptitudeQuestions";

export const seatingArrangementQuestions: Question[] = [
    {
        question: "Six friends A, B, C, D, E, and F sit around a circular table facing the center. A is opposite to D. B is to the immediate right of A. C is between B and D. E is to the immediate right of D. F is between E and A. Who sits to the immediate left of F?",
        options: ["B","A","E","D"],
        correct: 1,
        explanation: "The clockwise order from A is F, E, D, C, B; facing the center, the immediate left of F is A."
    },
    {
        question: "Six friends A, B, C, D, E, and F sit around a circular table facing the center. A is opposite to D. B is to the immediate right of A. C is between B and D. E is to the immediate right of D. F is between E and A. Who sits second to the right of C?",
        options: ["F","A","E","B"],
        correct: 2,
        explanation: "The anticlockwise (right) order from C is D, E, F, A, B; the second person to the right of C is E."
    },
    {
        question: "Six friends A, B, C, D, E, and F sit around a circular table facing the center. A is opposite to D. B is to the immediate right of A. C is between B and D. E is to the immediate right of D. F is between E and A. Who sits exactly between A and C?",
        options: ["E","B","D","F"],
        correct: 1,
        explanation: "Based on the arrangement, B is seated to the immediate right of A and immediate left of C, placing B between them."
    },
    {
        question: "Six friends A, B, C, D, E, and F sit around a circular table facing the center. A is opposite to D. B is to the immediate right of A. C is between B and D. E is to the immediate right of D. F is between E and A. Who is sitting opposite to B?",
        options: ["C","A","F","E"],
        correct: 3,
        explanation: "In a 6-person circle, people separated by two others are opposite; E is directly across the table from B."
    },
    {
        question: "Six friends A, B, C, D, E, and F sit around a circular table facing the center. A is opposite to D. B is to the immediate right of A. C is between B and D. E is to the immediate right of D. F is between E and A. What is D's position with respect to F?",
        options: ["Third to the left","Second to the right","Immediate right","Second to the left"],
        correct: 1,
        explanation: "Facing the center, moving anticlockwise (right) from F passes E and then D, making D second to the right."
    },
    {
        question: "Five students M, N, O, P, and Q sit in a row facing North. M is at the extreme left end. P is second to the right of N. O is exactly between M and N. Q is at the extreme right end. Who sits exactly in the middle of the row?",
        options: ["M","O","P","N"],
        correct: 3,
        explanation: "The linear arrangement from left to right is M, O, N, P, Q, making N the exact middle."
    },
    {
        question: "Five students M, N, O, P, and Q sit in a row facing North. M is at the extreme left end. P is second to the right of N. O is exactly between M and N. Q is at the extreme right end. Who sits to the immediate right of P?",
        options: ["Q","N","O","M"],
        correct: 0,
        explanation: "With the order being M, O, N, P, Q, the person to the immediate right of P is Q."
    },
    {
        question: "Five students M, N, O, P, and Q sit in a row facing North. M is at the extreme left end. P is second to the right of N. O is exactly between M and N. Q is at the extreme right end. Who sits between O and P?",
        options: ["Q","N","M","No one"],
        correct: 1,
        explanation: "The arrangement M, O, N, P, Q clearly places N directly between O and P."
    },
    {
        question: "Five students M, N, O, P, and Q sit in a row facing North. M is at the extreme left end. P is second to the right of N. O is exactly between M and N. Q is at the extreme right end. What is the position of O from the right end?",
        options: ["Second","Third","Fourth","Fifth"],
        correct: 2,
        explanation: "Counting from the right (Q, P, N, O, M), O is the fourth person."
    },
    {
        question: "Five students M, N, O, P, and Q sit in a row facing North. M is at the extreme left end. P is second to the right of N. O is exactly between M and N. Q is at the extreme right end. Who sits second to the left of Q?",
        options: ["O","N","P","M"],
        correct: 1,
        explanation: "Moving two spots to the left from Q in the arrangement (M, O, N, P, Q) lands on N."
    },
    {
        question: "Six people H, I, J, K, L, and M sit in a straight line facing North. H is at the extreme left. I is to the immediate right of H. J is between I and K. L is to the immediate left of M. M is at the extreme right. Who is third to the right of I?",
        options: ["L","M","K","J"],
        correct: 0,
        explanation: "The left-to-right order is H, I, J, K, L, M, so the third person to the right of I is L."
    },
    {
        question: "Six people H, I, J, K, L, and M sit in a straight line facing North. H is at the extreme left. I is to the immediate right of H. J is between I and K. L is to the immediate left of M. M is at the extreme right. Who sits between K and M?",
        options: ["J","I","L","H"],
        correct: 2,
        explanation: "The arrangement is H, I, J, K, L, M, which places L directly between K and M."
    },
    {
        question: "Six people H, I, J, K, L, and M sit in a straight line facing North. H is at the extreme left. I is to the immediate right of H. J is between I and K. L is to the immediate left of M. M is at the extreme right. Who is to the immediate left of J?",
        options: ["H","I","K","L"],
        correct: 1,
        explanation: "In the left-to-right order H, I, J, K, L, M, the person immediately to the left of J is I."
    },
    {
        question: "Six people H, I, J, K, L, and M sit in a straight line facing North. H is at the extreme left. I is to the immediate right of H. J is between I and K. L is to the immediate left of M. M is at the extreme right. What is the position of K from the left end?",
        options: ["Second","Third","Fourth","Fifth"],
        correct: 2,
        explanation: "Counting from the left end (H, I, J, K...), K occupies the fourth position."
    },
    {
        question: "Six people H, I, J, K, L, and M sit in a straight line facing North. H is at the extreme left. I is to the immediate right of H. J is between I and K. L is to the immediate left of M. M is at the extreme right. If H and M swap places, who is to the immediate right of M?",
        options: ["K","J","L","I"],
        correct: 3,
        explanation: "If M moves to H's position at the extreme left, the person to his immediate right remains I."
    },
    {
        question: "Eight people S1 to S8 sit around a circular table facing the center. S1 is opposite S5. S2 is to the immediate right of S1. S3 is between S2 and S4. S8 is to the immediate left of S1. S6 is opposite S2. S7 is between S6 and S8. Who is opposite to S3?",
        options: ["S6","S7","S8","S4"],
        correct: 1,
        explanation: "The anticlockwise order from S1 is S2, S3, S4, S5, S6, S7, S8; S3 and S7 are separated by three people, making them opposite."
    },
    {
        question: "Eight people S1 to S8 sit around a circular table facing the center. S1 is opposite S5. S2 is to the immediate right of S1. S3 is between S2 and S4. S8 is to the immediate left of S1. S6 is opposite S2. S7 is between S6 and S8. Who is third to the right of S5?",
        options: ["S1","S8","S7","S6"],
        correct: 1,
        explanation: "Facing the center, anticlockwise from S5 is S6, S7, S8; the third person to the right is S8."
    },
    {
        question: "Eight people S1 to S8 sit around a circular table facing the center. S1 is opposite S5. S2 is to the immediate right of S1. S3 is between S2 and S4. S8 is to the immediate left of S1. S6 is opposite S2. S7 is between S6 and S8. Who sits exactly between S4 and S6?",
        options: ["S3","S7","S5","S1"],
        correct: 2,
        explanation: "Based on the arrangement, S5 sits directly between S4 and S6."
    },
    {
        question: "Eight people S1 to S8 sit around a circular table facing the center. S1 is opposite S5. S2 is to the immediate right of S1. S3 is between S2 and S4. S8 is to the immediate left of S1. S6 is opposite S2. S7 is between S6 and S8. What is S2's position with respect to S4?",
        options: ["Third to the right","Immediate left","Second to the right","Second to the left"],
        correct: 3,
        explanation: "Moving clockwise (left) from S4 passes S3 and lands on S2, making S2 second to the left."
    },
    {
        question: "Eight people S1 to S8 sit around a circular table facing the center. S1 is opposite S5. S2 is to the immediate right of S1. S3 is between S2 and S4. S8 is to the immediate left of S1. S6 is opposite S2. S7 is between S6 and S8. Who is to the immediate left of S7?",
        options: ["S6","S8","S1","S5"],
        correct: 1,
        explanation: "The clockwise order from S7 is S8, S1... so facing the center, S8 is to the immediate left of S7."
    },
    {
        question: "Six people sit in two parallel rows. P, Q, and R sit in Row 1 facing South. X, Y, and Z sit in Row 2 facing North. Q is to the immediate right of P. P faces Y. X faces Q. Z faces R. Who faces R?",
        options: ["Y","Z","X","Q"],
        correct: 1,
        explanation: "The prompt explicitly states that Z faces R in the parallel arrangement."
    },
    {
        question: "Six people sit in two parallel rows. P, Q, and R sit in Row 1 facing South. X, Y, and Z sit in Row 2 facing North. Q is to the immediate right of P. P faces Y. X faces Q. Z faces R. Who is to the immediate left of Y?",
        options: ["X","Z","R","P"],
        correct: 0,
        explanation: "Row 2 faces North and aligns as X, Y, Z from left to right; therefore, X is to the immediate left of Y."
    },
    {
        question: "Six people sit in two parallel rows. P, Q, and R sit in Row 1 facing South. X, Y, and Z sit in Row 2 facing North. Q is to the immediate right of P. P faces Y. X faces Q. Z faces R. Who is diagonally opposite to X?",
        options: ["Q","P","Z","R"],
        correct: 3,
        explanation: "X is at the left end of the North-facing row, and R is at the left end of the South-facing row, placing them diagonally opposite."
    },
    {
        question: "Six people sit in two parallel rows. P, Q, and R sit in Row 1 facing South. X, Y, and Z sit in Row 2 facing North. Q is to the immediate right of P. P faces Y. X faces Q. Z faces R. Who sits to the immediate left of P?",
        options: ["Q","X","R","Z"],
        correct: 2,
        explanation: "Row 1 faces South, so their left is the observer's right; the order is Q, P, R, making R the immediate left of P."
    },
    {
        question: "Six people sit in two parallel rows. P, Q, and R sit in Row 1 facing South. X, Y, and Z sit in Row 2 facing North. Q is to the immediate right of P. P faces Y. X faces Q. Z faces R. If Q and Z swap places, who will face Z?",
        options: ["X","P","R","Y"],
        correct: 0,
        explanation: "Q originally faces X. If Z takes Q's position, then Z will be facing X."
    },
    {
        question: "Five friends A, B, C, D, and E sit around a circular table facing the center. A is to the immediate right of B. C is to the immediate left of B. D is between A and E. Who is second to the right of B?",
        options: ["E","D","C","A"],
        correct: 1,
        explanation: "The anticlockwise (right) order is B, A, D, E, C; the second person to the right of B is D."
    },
    {
        question: "Five friends A, B, C, D, and E sit around a circular table facing the center. A is to the immediate right of B. C is to the immediate left of B. D is between A and E. Who sits to the immediate left of E?",
        options: ["C","D","B","A"],
        correct: 0,
        explanation: "The clockwise (left) order from E is C, B, A, D; the person to the immediate left of E is C."
    },
    {
        question: "Five friends A, B, C, D, and E sit around a circular table facing the center. A is to the immediate right of B. C is to the immediate left of B. D is between A and E. Who is second to the left of A?",
        options: ["D","E","B","C"],
        correct: 3,
        explanation: "Moving clockwise (left) from A passes B and lands on C, making C second to the left."
    },
    {
        question: "Five friends A, B, C, D, and E sit around a circular table facing the center. A is to the immediate right of B. C is to the immediate left of B. D is between A and E. Who is to the immediate right of D?",
        options: ["C","B","A","E"],
        correct: 3,
        explanation: "Moving anticlockwise (right) from D, the next person in the circle is E."
    },
    {
        question: "Five friends A, B, C, D, and E sit around a circular table facing the center. A is to the immediate right of B. C is to the immediate left of B. D is between A and E. What is B's position with respect to E?",
        options: ["Immediate left","Second to the right","Second to the left","Third to the right"],
        correct: 2,
        explanation: "Facing the center, moving clockwise (left) from E passes C and lands on B, making B second to the left."
    },
    {
        question: "Four people W, X, Y, and Z sit at the corners of a square table facing the center. W is opposite Y. X is to the immediate right of W. Z is to the immediate left of W. Who is sitting opposite X?",
        options: ["W","Y","Z","Cannot be determined"],
        correct: 2,
        explanation: "In a 4-person square, the person not adjacent to X is opposite; since W and Y are opposite, X and Z must be opposite."
    },
    {
        question: "Four people W, X, Y, and Z sit at the corners of a square table facing the center. W is opposite Y. X is to the immediate right of W. Z is to the immediate left of W. Who is to the immediate right of Y?",
        options: ["Z","X","W","None of these"],
        correct: 0,
        explanation: "The anticlockwise (right) sequence is W, X, Y, Z; the person immediately anticlockwise from Y is Z."
    },
    {
        question: "Four people W, X, Y, and Z sit at the corners of a square table facing the center. W is opposite Y. X is to the immediate right of W. Z is to the immediate left of W. Who is to the immediate left of X?",
        options: ["Z","Y","W","No one"],
        correct: 2,
        explanation: "The clockwise (left) sequence from X leads directly back to W."
    },
    {
        question: "Four people W, X, Y, and Z sit at the corners of a square table facing the center. W is opposite Y. X is to the immediate right of W. Z is to the immediate left of W. What is Z's position with respect to Y?",
        options: ["Immediate left","Immediate right","Opposite","Second to the left"],
        correct: 1,
        explanation: "In the arrangement W, X, Y, Z (anticlockwise), Z follows Y, meaning Z is to the immediate right of Y."
    },
    {
        question: "Four people W, X, Y, and Z sit at the corners of a square table facing the center. W is opposite Y. X is to the immediate right of W. Z is to the immediate left of W. If W and Y swap seats, who is to the immediate right of W?",
        options: ["X","Y","Z","No one"],
        correct: 2,
        explanation: "W moves to Y's old seat. The person to the immediate right (anticlockwise) of Y's old seat is Z."
    },
    {
        question: "Seven people T, U, V, W, X, Y, and Z sit in a straight line facing North. W is exactly in the middle. T is at the extreme left. Z is at the extreme right. U is between T and V. V is to the immediate left of W. X is to the immediate right of W. Y is between X and Z. Who is third to the right of U?",
        options: ["W","X","Y","Z"],
        correct: 1,
        explanation: "The left-to-right order is T, U, V, W, X, Y, Z; the third person to the right of U is X."
    },
    {
        question: "Seven people T, U, V, W, X, Y, and Z sit in a straight line facing North. W is exactly in the middle. T is at the extreme left. Z is at the extreme right. U is between T and V. V is to the immediate left of W. X is to the immediate right of W. Y is between X and Z. Who sits between W and Y?",
        options: ["V","Z","U","X"],
        correct: 3,
        explanation: "In the sequence T, U, V, W, X, Y, Z, the person located between W and Y is X."
    },
    {
        question: "Seven people T, U, V, W, X, Y, and Z sit in a straight line facing North. W is exactly in the middle. T is at the extreme left. Z is at the extreme right. U is between T and V. V is to the immediate left of W. X is to the immediate right of W. Y is between X and Z. What is V's position from the right end?",
        options: ["Fourth","Fifth","Third","Sixth"],
        correct: 1,
        explanation: "Counting from the right (Z, Y, X, W, V...), V is the fifth person."
    },
    {
        question: "Seven people T, U, V, W, X, Y, and Z sit in a straight line facing North. W is exactly in the middle. T is at the extreme left. Z is at the extreme right. U is between T and V. V is to the immediate left of W. X is to the immediate right of W. Y is between X and Z. Who is to the immediate left of Z?",
        options: ["X","Y","W","V"],
        correct: 1,
        explanation: "The person sitting right before Z in the left-to-right line is Y."
    },
    {
        question: "Seven people T, U, V, W, X, Y, and Z sit in a straight line facing North. W is exactly in the middle. T is at the extreme left. Z is at the extreme right. U is between T and V. V is to the immediate left of W. X is to the immediate right of W. Y is between X and Z. How many people sit between T and X?",
        options: ["2","3","5","4"],
        correct: 3,
        explanation: "Between T and X are the people U, V, and W, which totals 3 people. Wait, let me recount. T, U, V, W, X. Between T and X are U, V, W. That is 3 people."
    },
    {
        question: "Seven people T, U, V, W, X, Y, and Z sit in a straight line facing North. W is exactly in the middle. T is at the extreme left. Z is at the extreme right. U is between T and V. V is to the immediate left of W. X is to the immediate right of W. Y is between X and Z. How many people sit between T and X?",
        options: ["2","4","3","5"],
        correct: 2,
        explanation: "In the arrangement T, U, V, W, X, Y, Z, the three people sitting between T and X are U, V, and W."
    },
    {
        question: "Six people L, M, N, O, P, and Q sit around a circular table facing OUTSIDE. L is opposite to O. M is to the immediate right of L. N is between M and O. P is to the immediate left of L. Q is between P and O. Who is to the immediate right of O?",
        options: ["N","P","Q","M"],
        correct: 2,
        explanation: "Facing outside, 'right' means anticlockwise. The anticlockwise order is L, M, N, O, Q, P. The next person anticlockwise from O is Q."
    },
    {
        question: "Six people L, M, N, O, P, and Q sit around a circular table facing OUTSIDE. L is opposite to O. M is to the immediate right of L. N is between M and O. P is to the immediate left of L. Q is between P and O. Who is second to the left of N?",
        options: ["M","L","P","Q"],
        correct: 1,
        explanation: "Facing outside, 'left' means clockwise. Moving clockwise from N passes M and lands on L."
    },
    {
        question: "Six people L, M, N, O, P, and Q sit around a circular table facing OUTSIDE. L is opposite to O. M is to the immediate right of L. N is between M and O. P is to the immediate left of L. Q is between P and O. Who sits exactly between P and O?",
        options: ["M","L","N","Q"],
        correct: 3,
        explanation: "Based on the arrangement conditions, Q is explicitly seated between P and O."
    },
    {
        question: "Six people L, M, N, O, P, and Q sit around a circular table facing OUTSIDE. L is opposite to O. M is to the immediate right of L. N is between M and O. P is to the immediate left of L. Q is between P and O. Who is sitting opposite to M?",
        options: ["N","Q","P","L"],
        correct: 1,
        explanation: "In a 6-person circle, opposites are separated by two people. M and Q are separated by N and O on one side, making them opposite."
    },
    {
        question: "Six people L, M, N, O, P, and Q sit around a circular table facing OUTSIDE. L is opposite to O. M is to the immediate right of L. N is between M and O. P is to the immediate left of L. Q is between P and O. What is N's position with respect to L?",
        options: ["Second to the right","Second to the left","Third to the right","Immediate right"],
        correct: 0,
        explanation: "Facing outside, 'right' is anticlockwise. Moving anticlockwise from L passes M and lands on N, making it second to the right."
    },
    {
        question: "Five people A, B, C, D, and E sit in a straight line facing North. A is not at any end. B is to the immediate right of C. D is to the immediate left of C. E is second to the right of B. Who is at the extreme left end?",
        options: ["C","A","E","D"],
        correct: 3,
        explanation: "The logical sequence to fit all rules without putting A at an end is D, C, B, A, E. D is on the far left."
    },
    {
        question: "Five people A, B, C, D, and E sit in a straight line facing North. A is not at any end. B is to the immediate right of C. D is to the immediate left of C. E is second to the right of B. Who is exactly in the middle of the row?",
        options: ["C","D","B","A"],
        correct: 2,
        explanation: "The order from left to right is D, C, B, A, E, making B the exact center."
    },
    {
        question: "Five people A, B, C, D, and E sit in a straight line facing North. A is not at any end. B is to the immediate right of C. D is to the immediate left of C. E is second to the right of B. Who is second to the left of A?",
        options: ["C","B","D","E"],
        correct: 0,
        explanation: "Moving two spots left from A in the arrangement (D, C, B, A, E) lands on C."
    },
    {
        question: "Five people A, B, C, D, and E sit in a straight line facing North. A is not at any end. B is to the immediate right of C. D is to the immediate left of C. E is second to the right of B. Who sits between B and E?",
        options: ["D","A","C","No one"],
        correct: 1,
        explanation: "In the left-to-right order D, C, B, A, E, the person sitting between B and E is A."
    },
    {
        question: "Five people A, B, C, D, and E sit in a straight line facing North. A is not at any end. B is to the immediate right of C. D is to the immediate left of C. E is second to the right of B. What is D's position with respect to B?",
        options: ["Immediate left","Third to the left","Second to the right","Second to the left"],
        correct: 3,
        explanation: "Since the sequence is D, C, B, A, E, moving left from B passes C and lands on D, making it second to the left."
    }
];
