import { Question } from "../aptitudeQuestions";

export const algebraEquationsQuestions: Question[] = [
    {
        question: "If 3x - 5 = 2x + 7, what is the value of x?",
        options: ["10","12","14","15"],
        correct: 1,
        explanation: "Subtracting 2x from both sides and adding 5 isolates the variable to yield x = 12."
    },
    {
        question: "The sum of two numbers is 45 and their difference is 11. What is the larger number?",
        options: ["28","34","22","17"],
        correct: 0,
        explanation: "Setting up x + y = 45 and x - y = 11, adding the two equations gives 2x = 56, meaning x = 28."
    },
    {
        question: "Solve for x: 5(x - 3) = 2(x + 6)",
        options: ["7","8","9","10"],
        correct: 2,
        explanation: "Expanding both sides gives 5x - 15 = 2x + 12, which simplifies to 3x = 27, resulting in x = 9."
    },
    {
        question: "A father is 3 times as old as his son. After 10 years, he will be twice as old as his son. What is the father's present age?",
        options: ["30","40","45","50"],
        correct: 0,
        explanation: "Using 3x + 10 = 2(x + 10), we find the son's age x = 10, making the father currently 30 years old."
    },
    {
        question: "The denominator of a fraction is 3 more than its numerator. If 2 is added to both, the fraction becomes 1/2. What was the original fraction?",
        options: ["1/4","2/5","3/6","4/7"],
        correct: 0,
        explanation: "Solving (n + 2) / (n + 5) = 1/2 gives 2n + 4 = n + 5, meaning the numerator is 1, making the fraction 1/4."
    },
    {
        question: "Solve the system of equations: 2x + 3y = 12 and 3x - y = 7. What is the value of x?",
        options: ["2","3","4","5"],
        correct: 1,
        explanation: "Multiplying the second equation by 3 gives 9x - 3y = 21; adding this to the first yields 11x = 33, so x = 3."
    },
    {
        question: "A two-digit number is 4 times the sum of its digits. If 18 is added to the number, its digits reverse. What is the number?",
        options: ["12","24","36","48"],
        correct: 1,
        explanation: "Testing the options, 24 is 4 times (2+4), and adding 18 to 24 gives 42, which is the exact reverse."
    },
    {
        question: "Half of a number added to its third part gives 25. What is the number?",
        options: ["20","25","30","35"],
        correct: 2,
        explanation: "The equation is x/2 + x/3 = 25, which translates to 5x/6 = 25, solving exactly to x = 30."
    },
    {
        question: "If 4/x + 3/y = 5 and 2/x - 1/y = 0, what is the value of x + y?",
        options: ["2","3","4","5"],
        correct: 1,
        explanation: "The second equation means 2/x = 1/y, so substituting this into the first gives 10/x = 5 (x=2, y=1), making the sum 3."
    },
    {
        question: "The cost of 3 pens and 5 pencils is Rs. 34. The cost of 5 pens and 3 pencils is Rs. 46. What is the cost of 1 pen?",
        options: ["Rs. 6","Rs. 7","Rs. 8","Rs. 9"],
        correct: 2,
        explanation: "Adding both equations gives 8p + 8c = 80 (p+c=10), and subtracting gives -2p + 2c = -12 (p-c=6); combining these yields p = 8."
    },
    {
        question: "What are the roots of the quadratic equation x^2 - 5x + 6 = 0?",
        options: ["2 and -3","-2 and 3","2 and 3","-2 and -3"],
        correct: 2,
        explanation: "Factoring the quadratic equation gives (x - 2)(x - 3) = 0, which means the roots are positive 2 and 3."
    },
    {
        question: "If alpha and beta are the roots of 2x^2 - 7x + 3 = 0, what is the value of alpha + beta?",
        options: ["7/2","-7/2","3/2","-3/2"],
        correct: 0,
        explanation: "For any quadratic equation ax^2 + bx + c = 0, the sum of the roots is -b/a, which evaluates to -(-7)/2 = 7/2."
    },
    {
        question: "For what positive value of k does the equation x^2 - kx + 9 = 0 have equal roots?",
        options: ["3","6","9","12"],
        correct: 1,
        explanation: "Equal roots occur when the discriminant (b^2 - 4ac) is zero, so k^2 - 36 = 0, making the positive value k = 6."
    },
    {
        question: "If one root of x^2 - 8x + k = 0 is 3, what is the value of k?",
        options: ["15","12","24","18"],
        correct: 0,
        explanation: "Substituting x = 3 into the equation yields 9 - 24 + k = 0, which simplifies to -15 + k = 0, meaning k = 15."
    },
    {
        question: "Which quadratic equation has the roots 4 and -5?",
        options: ["x^2 - x - 20 = 0","x^2 + x - 20 = 0","x^2 - x + 20 = 0","x^2 + x + 20 = 0"],
        correct: 1,
        explanation: "Using (x - root1)(x - root2) = 0, expanding (x - 4)(x + 5) = 0 results in x^2 + x - 20 = 0."
    },
    {
        question: "The sum of the squares of two consecutive positive integers is 61. What is the sum of the two integers?",
        options: ["9","11","13","15"],
        correct: 1,
        explanation: "Solving x^2 + (x+1)^2 = 61 leads to x^2 + x - 30 = 0, yielding the positive integer 5, so the numbers are 5 and 6, summing to 11."
    },
    {
        question: "What is the absolute difference between the roots of the equation x^2 - 7x + 10 = 0?",
        options: ["2","3","4","5"],
        correct: 1,
        explanation: "Factoring gives (x - 5)(x - 2) = 0, so the roots are 5 and 2, making their absolute difference exactly 3."
    },
    {
        question: "What is the maximum value of the quadratic expression -x^2 + 4x - 1?",
        options: ["1","2","3","4"],
        correct: 2,
        explanation: "The maximum occurs at the vertex x = -b/(2a) = -4/-2 = 2; substituting x = 2 back into the expression yields 3."
    },
    {
        question: "What is the product of the roots of 3x^2 - 5x - 12 = 0?",
        options: ["-4","4","5/3","-5/3"],
        correct: 0,
        explanation: "The product of the roots for ax^2 + bx + c = 0 is c/a, which is -12 / 3 = -4."
    },
    {
        question: "Solve for x: sqrt(3x + 1) = x - 1",
        options: ["0","3","5","0 and 5"],
        correct: 2,
        explanation: "Squaring both sides yields 3x + 1 = x^2 - 2x + 1, simplifying to x^2 - 5x = 0; testing roots 0 and 5 shows only x = 5 satisfies the original equation."
    },
    {
        question: "If x + 1/x = 4, what is the value of x^2 + 1/x^2?",
        options: ["12","14","16","18"],
        correct: 1,
        explanation: "Squaring both sides gives x^2 + 2 + 1/x^2 = 16, and subtracting 2 leaves x^2 + 1/x^2 = 14."
    },
    {
        question: "If a + b = 7 and ab = 12, what is the value of a^3 + b^3?",
        options: ["91","133","217","343"],
        correct: 0,
        explanation: "Using the identity (a+b)^3 - 3ab(a+b), we calculate 7^3 - 3(12)(7) = 343 - 252 = 91."
    },
    {
        question: "Simplify the expression: (x^2 - 9) / (x - 3)",
        options: ["x - 3","x + 3","x^2 + 3","x"],
        correct: 1,
        explanation: "Using the difference of squares, x^2 - 9 factors into (x - 3)(x + 3), and canceling the (x - 3) leaves x + 3."
    },
    {
        question: "If x - 1/x = 3, what is the value of x^3 - 1/x^3?",
        options: ["18","27","36","45"],
        correct: 2,
        explanation: "Cubing the given equation uses the identity p^3 + 3p; calculating 3^3 + 3(3) yields 27 + 9 = 36."
    },
    {
        question: "What is the value of a^2 + b^2 + c^2 if a+b+c=9 and ab+bc+ca=26?",
        options: ["29","35","45","55"],
        correct: 0,
        explanation: "Using the identity (a+b+c)^2 = a^2+b^2+c^2 + 2(ab+bc+ca), we find 81 = a^2+b^2+c^2 + 52, leaving 29."
    },
    {
        question: "If a + b + c = 0, what is the value of a^3 + b^3 + c^3?",
        options: ["0","abc","3abc","a^2 + b^2 + c^2"],
        correct: 2,
        explanation: "A standard algebraic identity states that whenever the sum of three variables is zero, the sum of their cubes equals 3 times their product."
    },
    {
        question: "What is the expanded form of (2x - 3y)^2?",
        options: ["4x^2 - 9y^2","4x^2 + 9y^2","4x^2 - 12xy + 9y^2","4x^2 - 6xy + 9y^2"],
        correct: 2,
        explanation: "Applying the (a - b)^2 identity expands to (2x)^2 - 2(2x)(3y) + (3y)^2, which is 4x^2 - 12xy + 9y^2."
    },
    {
        question: "Factorize the quadratic expression x^2 - 7x + 12.",
        options: ["(x - 2)(x - 6)","(x - 3)(x - 4)","(x + 3)(x + 4)","(x - 1)(x - 12)"],
        correct: 1,
        explanation: "We need two numbers that multiply to positive 12 and add to negative 7, which are -3 and -4."
    },
    {
        question: "If x = 2 + sqrt(3), what is the value of x + 1/x?",
        options: ["2","4","2*sqrt(3)","4*sqrt(3)"],
        correct: 1,
        explanation: "Rationalizing 1/(2 + sqrt(3)) yields 2 - sqrt(3), so adding x and 1/x gives (2 + sqrt(3)) + (2 - sqrt(3)) = 4."
    },
    {
        question: "What constant must be added to x^2 + 6x to make it a perfect square trinomial?",
        options: ["3","6","9","36"],
        correct: 2,
        explanation: "To complete the square, take half of the coefficient of x (which is 3) and square it to get 9."
    },
    {
        question: "What is the remainder when the polynomial x^3 - 2x^2 + 5x - 7 is divided by (x - 2)?",
        options: ["1","3","5","7"],
        correct: 1,
        explanation: "Using the Remainder Theorem, substituting x = 2 into the polynomial gives 8 - 8 + 10 - 7 = 3."
    },
    {
        question: "If (x - 1) is a factor of x^3 + kx^2 - 4x + 3, what is the value of k?",
        options: ["0","1","-1","2"],
        correct: 0,
        explanation: "Because it is a factor, substituting x = 1 must equal zero: 1 + k - 4 + 3 = 0, which simplifies to k = 0."
    },
    {
        question: "What is the degree of the polynomial 4x^5 - 3x^2 + 7?",
        options: ["2","3","4","5"],
        correct: 3,
        explanation: "The degree of a single-variable polynomial is simply the highest exponent of its variable, which is 5."
    },
    {
        question: "Which of the following is the correct factorization of x^3 - 8?",
        options: ["(x - 2)^3","(x - 2)(x^2 - 2x + 4)","(x - 2)(x^2 + 2x + 4)","(x + 2)(x^2 - 2x + 4)"],
        correct: 2,
        explanation: "Applying the difference of cubes identity a^3 - b^3 yields (a - b)(a^2 + ab + b^2), matching option C."
    },
    {
        question: "What are all the real roots of the equation x^3 - x = 0?",
        options: ["0 and 1","-1 and 1","0, -1, and 1","Only 1"],
        correct: 2,
        explanation: "Factoring out x gives x(x^2 - 1) = 0, and expanding further to x(x - 1)(x + 1) = 0 reveals roots at 0, 1, and -1."
    },
    {
        question: "What is the Least Common Multiple (LCM) of the algebraic terms 2x^2*y and 3x*y^2?",
        options: ["6x^2*y^2","6xy","xy","5x^2*y^2"],
        correct: 0,
        explanation: "The LCM takes the highest power of every variable and the LCM of the coefficients, resulting in 6x^2*y^2."
    },
    {
        question: "What is the Highest Common Factor (HCF/GCD) of 12a^3*b^2 and 18a^2*b^3?",
        options: ["3a^2*b^2","6a^2*b^2","36a^3*b^3","6a^3*b^3"],
        correct: 1,
        explanation: "The HCF takes the greatest common divisor of the numbers (6) and the lowest power of shared variables (a^2 and b^2)."
    },
    {
        question: "What is the value of the polynomial p(x) = x^2 - 5x + 6 evaluated at x = 4?",
        options: ["0","2","6","10"],
        correct: 1,
        explanation: "Substituting 4 into the polynomial gives 16 - 20 + 6, which evaluates exactly to 2."
    },
    {
        question: "If you divide (x^2 - 5x + 6) by (x - 2), what is the quotient?",
        options: ["x - 2","x + 2","x - 3","x + 3"],
        correct: 2,
        explanation: "Factoring the numerator yields (x - 2)(x - 3); dividing by (x - 2) cancels out that term, leaving x - 3."
    },
    {
        question: "If alpha, beta, and gamma are the roots of x^3 - 6x^2 + 11x - 6 = 0, what is the product of the roots?",
        options: ["-6","6","11","-11"],
        correct: 1,
        explanation: "By Vieta's formulas, the product of the roots for a cubic polynomial ax^3 + bx^2 + cx + d = 0 is -d/a, which is -(-6)/1 = 6."
    },
    {
        question: "Solve the linear inequality: 3x - 5 > 10",
        options: ["x > 5","x < 5","x > 15","x < 15"],
        correct: 0,
        explanation: "Adding 5 to both sides gives 3x > 15, and dividing by positive 3 preserves the inequality sign, yielding x > 5."
    },
    {
        question: "Solve the inequality: -2x < 8",
        options: ["x < -4","x > -4","x < 4","x > 4"],
        correct: 1,
        explanation: "Dividing an inequality by a negative number flips the inequality symbol, transforming -2x < 8 into x > -4."
    },
    {
        question: "Find the solutions for the absolute value equation: |x - 3| = 5",
        options: ["x = 8","x = -2","x = 8 and x = -2","x = 5 and x = -5"],
        correct: 2,
        explanation: "The inner expression can be positive or negative, setting up x - 3 = 5 (x=8) and x - 3 = -5 (x=-2)."
    },
    {
        question: "What is the range of values for x that satisfies x^2 - 4 < 0?",
        options: ["x < 2","x > -2","-2 < x < 2","x < -2 or x > 2"],
        correct: 2,
        explanation: "Factoring to (x - 2)(x + 2) < 0 shows the parabola dips below zero between its roots, satisfying -2 < x < 2."
    },
    {
        question: "Solve the exponential equation for x: 2^x = 32",
        options: ["4","5","6","16"],
        correct: 1,
        explanation: "Since 32 is equal to 2 multiplied by itself 5 times (2^5), matching the bases proves x = 5."
    },
    {
        question: "Find the value of x if 3^(x+1) = 81",
        options: ["2","3","4","5"],
        correct: 1,
        explanation: "Because 81 equals 3^4, we can set the exponents equal: x + 1 = 4, meaning x = 3."
    },
    {
        question: "Solve the logarithmic equation for x: log base 2 of x = 3",
        options: ["6","8","9","12"],
        correct: 1,
        explanation: "Converting the logarithmic form to exponential form gives 2^3 = x, which calculates to 8."
    },
    {
        question: "A fraction becomes 4/5 when 1 is added to both parts, and 1/2 when 5 is subtracted from both. What is the fraction?",
        options: ["5/7","7/9","3/5","9/11"],
        correct: 1,
        explanation: "Testing the options, only 7/9 becomes 8/10 (4/5) when adding 1, and 2/4 (1/2) when subtracting 5."
    },
    {
        question: "The sum of three consecutive even integers is 48. What is the smallest of these integers?",
        options: ["12","14","16","18"],
        correct: 1,
        explanation: "Setting x + (x+2) + (x+4) = 48 yields 3x + 6 = 48, meaning 3x = 42, which makes the smallest integer x = 14."
    },
    {
        question: "If 4 tables and 3 chairs cost 3200, and 3 tables and 4 chairs cost 3100, what is the cost of 1 table?",
        options: ["400","500","600","700"],
        correct: 1,
        explanation: "Adding equations gives 7t + 7c = 6300 (t+c=900) and subtracting gives t - c = 100; adding these new equations isolates 2t = 1000, so t = 500."
    }
];
