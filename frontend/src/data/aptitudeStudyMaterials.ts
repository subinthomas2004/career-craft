
export interface StudySection {
    id: string;
    title: string;
    introduction: string;
    formulas: { label: string; equation: string; description?: string }[];
    tips: string[];
    examples: { question: string; solution: string; explanation: string }[];
}

export const studyMaterials: Record<string, StudySection> = {
    "quantitative_aptitude": {
        id: "quantitative_aptitude",
        title: "Quantitative Aptitude",
        introduction: "Quantitative aptitude tests your ability to use numbers and mathematical concepts to solve problems. This section covers general arithmetic, algebra, and geometry concepts.",
        formulas: [
            { label: "Percentage", equation: "(Part / Whole) × 100", description: "Increase % = (Increase / Original) × 100" },
            { label: "Profit & Loss", equation: "Profit = SP - CP", description: "Profit % = (Profit / CP) × 100" },
            { label: "Simple Interest", equation: "SI = (P × R × T) / 100", description: "Amount = P + SI" },
            { label: "Compound Interest", equation: "A = P(1 + R/100)^T", description: "CI = Amount - Principal" },
            { label: "Ratio", equation: "a:b = c:d → ad = bc", description: "Product of extremes = Product of means" },
            { label: "Average", equation: "Sum / Count", description: "Sum of values / Number of values" },
            { label: "Time & Work", equation: "1/Total = 1/A + 1/B", description: "Combined work rate" },
            { label: "Time, Speed, Distance", equation: "D = S × T", description: "Speed = Distance / Time" },
            { label: "LCM & HCF", equation: "HCF × LCM = Product", description: "Product of two numbers" }
        ],
        tips: [
            "Convert percentages to fractions for faster calculation.",
            "Use ratio method instead of long equations.",
            "Memorize squares (1–30) and cubes (1–20).",
            "In time & work, assume total work = LCM of days.",
            "For speed problems, keep units consistent.",
            "Use approximation when options are far apart."
        ],
        examples: [
            {
                question: "A can complete a work in 12 days, B in 18 days. In how many days can they finish the work together?",
                solution: "7.2 days",
                explanation: "A's 1 day work = 1/12. B's 1 day work = 1/18. Total = 1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 days."
            },
            {
                question: "A shopkeeper buys an item for ₹800 and sells it at 15% profit. Find the selling price.",
                solution: "₹920",
                explanation: "Profit = 15% of 800 = 120. SP = 800 + 120 = 920."
            },
            {
                question: "A train 150 m long crosses a pole in 10 seconds. Find its speed.",
                solution: "54 km/h",
                explanation: "Speed = 150/10 = 15 m/s. Convert to km/h: 15 × 18/5 = 54 km/h."
            }
        ]
    },
    "time_speed_distance": {
        id: "time_speed_distance",
        title: "Time, Speed & Distance",
        introduction: "Time, Speed & Distance problems test your ability to calculate the relationship between these three variables, often involving trains, boats, and streams.",
        formulas: [
            { label: "Basic Formula", equation: "Speed = Distance / Time", description: "D = S × T, T = D / S" },
            { label: "Average Speed", equation: "Total Distance / Total Time", description: "Not the arithmetic mean of speeds." },
            { label: "Relative Speed (Opposite)", equation: "S1 + S2", description: "Add speeds when moving in opposite directions." },
            { label: "Relative Speed (Same)", equation: "S1 - S2", description: "Subtract speeds when moving in same direction." },
            { label: "Train (Pole)", equation: "T = L_train / S", description: "Time to cross a pole or person." },
            { label: "Train (Platform)", equation: "T = (L_train + L_plat) / S", description: "Time to cross a platform or bridge." },
            { label: "Boats", equation: "Down = B+S, Up = B-S", description: "Downstream (with flow), Upstream (against flow)." }
        ],
        tips: [
            "Always convert units before solving (km/h <-> m/s).",
            "For average speed, use total distance divided by total time.",
            "Draw a simple diagram for relative speed problems.",
            "In train problems, don't forget to add the train's length.",
            "Upstream speed is always less than downstream speed."
        ],
        examples: [
            {
                question: "A car travels 180 km in 3 hours. Find its speed.",
                solution: "60 km/h",
                explanation: "Speed = Distance / Time = 180 / 3 = 60 km/h."
            },
            {
                question: "Two trains move in opposite directions at 50 km/h and 70 km/h. Find relative speed.",
                solution: "120 km/h",
                explanation: "Opposite direction -> Add speeds. 50 + 70 = 120 km/h."
            },
            {
                question: "A train 120 m long crosses a platform 180 m long in 15 seconds. Find speed.",
                solution: "72 km/h",
                explanation: "Total Dist = 120+180=300m. Speed = 300/15 = 20 m/s. 20 * 18/5 = 72 km/h."
            }
        ]
    },
    "profit_loss_discount": {
        id: "profit_loss_discount",
        title: "Profit, Loss & Discount",
        introduction: "Profit, Loss & Discount problems deal with financial transactions involving Cost Price (CP), Selling Price (SP), and Marked Price (MP).",
        formulas: [
            { label: "Profit & Loss", equation: "P = SP-CP, L = CP-SP", description: "Profit/Loss is always calculated on CP." },
            { label: "Profit/Loss %", equation: "(Value / CP) × 100", description: "Percentage of profit or loss relative to cost." },
            { label: "Selling Price", equation: "SP = CP × (1 ± R/100)", description: "Use + for Profit, - for Loss." },
            { label: "Discount", equation: "D = MP - SP", description: "Discount is calculated on Marked Price (MP)." },
            { label: "Discount %", equation: "(Discount / MP) × 100", description: "Percentage reduction on MP." },
            { label: "Successive Discount", equation: "a + b - (ab/100)", description: "Net effective discount for two successive discounts." },
            { label: "Markup", equation: "SP = CP(1+P%) = MP(1-D%)", description: "Relationship between CP, MP, Profit, and Discount." }
        ],
        tips: [
            "Always identify CP, SP, MP before solving.",
            "Successive discounts are NOT added directly.",
            "Profit is always calculated on CP, Discount on MP.",
            "Use assumed values (like CP = 100) for percentage problems.",
            "Watch for hidden profit after discount."
        ],
        examples: [
            {
                question: "A shopkeeper buys an item for ₹800 and sells it for ₹920. Find the profit percentage.",
                solution: "15%",
                explanation: "Profit = 920 - 800 = 120. Profit % = (120 / 800) * 100 = 15%."
            },
            {
                question: "A shirt has successive discounts of 20% and 10%. Find the total discount.",
                solution: "28%",
                explanation: "Net discount = 20 + 10 - (20*10)/100 = 30 - 2 = 28%."
            },
            {
                question: "A shopkeeper marks an item 40% above cost price and gives a discount of 10%. Find profit %.",
                solution: "26%",
                explanation: "Assume CP=100. MP=140. SP = 140 * 0.9 = 126. Profit = 26%."
            }
        ]
    },
    "simple_compound_interest": {
        id: "simple_compound_interest",
        title: "Simple & Compound Interest",
        introduction: "Simple Interest (SI) is calculated only on the principal amount, while Compound Interest (CI) is calculated on the principal plus accumulated interest.",
        formulas: [
            { label: "Simple Interest", equation: "SI = (P × R × T) / 100", description: "P=Principal, R=Rate%, T=Time." },
            { label: "Amount (SI)", equation: "A = P + SI", description: "Final value after simple interest." },
            { label: "Compound Interest", equation: "A = P(1 + R/100)^T", description: "Amount after T years compounded annually." },
            { label: "CI Formula", equation: "CI = Amount - Principal", description: "Interest earned on interest." },
            { label: "Half-Yearly CI", equation: "Rate = R/2, Time = 2T", description: "Compounding every 6 months." },
            { label: "Quarterly CI", equation: "Rate = R/4, Time = 4T", description: "Compounding every 3 months." },
            { label: "Diff (2 yrs)", equation: "D = P(R/100)^2", description: "Difference between CI and SI for 2 years." }
        ],
        tips: [
            "Use SI for short-term loans (simple calculation).",
            "CI grows faster — used in banks & investments.",
            "Convert rate/time correctly for half-yearly or quarterly.",
            "Use formula directly for 2–3 years; avoid long multiplication.",
            "Assume P = 100 to simplify percentage problems."
        ],
        examples: [
            {
                question: "Find the simple interest on ₹5000 at 8% per annum for 3 years.",
                solution: "₹1200",
                explanation: "SI = (5000 * 8 * 3) / 100 = 1200."
            },
            {
                question: "Find the compound interest on ₹2000 at 10% per annum for 2 years.",
                solution: "₹420",
                explanation: "Amount = 2000 * (1.1)^2 = 2000 * 1.21 = 2420. CI = 2420 - 2000 = 420."
            },
            {
                question: "Find the difference between CI and SI on ₹10,000 at 10% for 2 years.",
                solution: "₹100",
                explanation: "Diff = P * (R/100)^2 = 10000 * (0.1)^2 = 10000 * 0.01 = 100."
            }
        ]
    },
    "logical_reasoning": {
        id: "logical_reasoning",
        title: "Logical Reasoning (General)",
        introduction: "Logical reasoning tests your ability to analyze relationships, patterns, and sequences.",
        formulas: [
            { label: "Number Series", equation: "+ / - / x / ÷ / Squares / Cubes", description: "Check difference, ratio, or alternating patterns." },
            { label: "Alphabet Series", equation: "A=1 ... Z=26", description: "Check +n, -n, reverse, skipping letters." },
            { label: "Analogy", equation: "A : B :: C : ?", description: "Find relationship → apply same logic." },
            { label: "Classification", equation: "Odd One Out", description: "Group by common property, find item that doesn't belong." },
            { label: "Coding-Decoding", equation: "Shift / Reverse / Number", description: "Letter shift (+2, -1), Reverse order, Letter-number coding." },
            { label: "Blood Relations", equation: "Generations & Gender", description: "Use family tree diagram." },
            { label: "Direction Sense", equation: "Right=CW, Left=ACW", description: "N-S, E-W opposite directions." },
            { label: "Seating Arrangement", equation: "Linear/Circular", description: "Fix one position to avoid rotation confusion." },
            { label: "Syllogism", equation: "Venn Diagrams", description: "No new terms allowed. Check definite vs possible." }
        ],
        tips: [
            "Always look for patterns before calculating.",
            "Convert letters to numbers for faster solving.",
            "Draw diagrams for blood relations & directions.",
            "Fix one person in circular seating problems.",
            "If conclusion adds new information → reject.",
            "Use elimination when multiple options look similar."
        ],
        examples: [
            {
                question: "3, 9, 27, 81, ___",
                solution: "243",
                explanation: "Pattern: ×3. Next = 81 × 3 = 243."
            },
            {
                question: "If MANGO → NZOHQ, then APPLE → ?",
                solution: "BQQMF",
                explanation: "Pattern: +1 letter shift. A→B, P→Q, P→Q, L→M, E→F."
            },
            {
                question: "Ravi walks 10 m north, then turns right and walks 5 m, then turns right and walks 10 m. How far is he from the starting point?",
                solution: "5 meters",
                explanation: "Start → 10 m North → Right (5 m East) → Right (10 m South). Final position is 5 m East from start."
            }
        ]
    },

    "analytical_reasoning": {
        id: "analytical_reasoning",
        title: "Analytical Reasoning",
        introduction: "Analytical reasoning tests your ability to analyze information and apply logic to solve problems. This section covers cause & effect, statements, assumptions, and logical deductions.",
        formulas: [
            { label: "Cause & Effect", equation: "Cause → Reason, Effect → Result", description: "Valid if removing cause removes effect." },
            { label: "Statement & Conclusion", equation: "Conclusion must be fully supported", description: "No new information allowed. If uncertain → invalid." },
            { label: "Statement & Assumption", equation: "Assumption = hidden belief", description: "Test: If false → statement fails." },
            { label: "Course of Action", equation: "Practical + Relevant + Solves problem", description: "Reject extreme or unrealistic solutions." },
            { label: "Assertion & Reason", equation: "Check Truth -> Check Explanation", description: "1. Check if both are true. 2. Check if reason explains assertion." },
            { label: "Decision Making", equation: "Eliminate options violating conditions", description: "Follow rules strictly." },
            { label: "Ranking & Order", equation: "Compare step-by-step", description: "Create table or diagram to visualize order." }
        ],
        tips: [
            "Read carefully — avoid adding assumptions.",
            "Reject extreme solutions (e.g., “ban everything”).",
            "If conclusion introduces new info → wrong.",
            "Use elimination to narrow choices.",
            "In ranking problems, convert clues into a table.",
            "Focus on logic, not personal opinion."
        ],
        examples: [
            {
                question: "Statement: All engineers are logical thinkers. Some logical thinkers are teachers. Conclusions: 1. Some teachers are engineers. 2. Some logical thinkers are engineers.",
                solution: "Only Conclusion 2 follows",
                explanation: "From statement: Engineers ⊂ Logical thinkers. Some logical thinkers are teachers. Conclusion 1 is invalid (no direct link). Conclusion 2 is valid (engineers are logical thinkers)."
            },
            {
                question: "Five friends — A, B, C, D, E — are ranked by height. Clues: A is taller than B. C is shorter than D. B is taller than E. D is tallest. Who is tallest and shortest?",
                solution: "D lies tallest, C is shortest",
                explanation: "Step-by-step: D is tallest. A > B > E. C < D. Possible order: D > A > B > E > C. So D is tallest, C is shortest."
            }
        ]
    },
    "arithmetic_ability": {
        id: "arithmetic_ability",
        title: "Arithmetic Ability",
        introduction: "Arithmetic ability tests your numerical skills including percentages, profit & loss, interest, and ratios.",
        formulas: [
            { label: "Percentages", equation: "New Value = Original × (1 ± %/100)", description: "Percentage = (Part / Whole) × 100" },
            { label: "Profit & Loss", equation: "Profit = SP - CP", description: "Discount = MP - SP" },
            { label: "Simple Interest", equation: "SI = (P × R × T) / 100", description: "Amount = P + SI" },
            { label: "Compound Interest", equation: "A = P(1 + R/100)^T", description: "CI = Amount - P" },
            { label: "Ratio & Proportion", equation: "a:b = c:d → ad = bc", description: "Diff = Total / Sum of ratio terms" },
            { label: "Average", equation: "Sum / Count", description: "New Avg = (Old Sum + New Value) / New Count" },
            { label: "Time & Work", equation: "Work = Rate × Time", description: "Combined: 1/x + 1/y" },
            { label: "Time, Speed, Distance", equation: "D = S × T", description: "Avg Speed = Total Dist / Total Time" },
            { label: "Mixture & Alligation", equation: "(Cheaper×Diff + Dearer×Diff) / Total", description: "Weighted average method." },
            { label: "LCM & HCF", equation: "HCF × LCM = Product", description: "Product of two numbers" }
        ],
        tips: [
            "Convert percentages to fractions (25% = 1/4).",
            "In time & work, assume total work = LCM of days.",
            "Use ratio method to avoid long calculations.",
            "Memorize squares (1–30) for speed.",
            "Use approximation when options are far apart.",
            "Keep units consistent in speed problems."
        ],
        examples: [
            {
                question: "A shopkeeper mixes rice costing ₹40/kg with rice costing ₹60/kg to get a mixture worth ₹50/kg. Find the ratio.",
                solution: "1 : 1",
                explanation: "Cheaper = 40, Dearer = 60, Mean = 50. Ratio = (60-50) : (50-40) = 10 : 10 = 1 : 1."
            },
            {
                question: "A can complete work in 10 days, B in 15 days. How long will they take together?",
                solution: "6 days",
                explanation: "A = 1/10, B = 1/15. LCM = 30. A = 3 units, B = 2 units. Total = 5 units/day. Time = 30/5 = 6 days."
            },
            {
                question: "A number is increased by 20% and then decreased by 20%. What is the net change?",
                solution: "4% decrease",
                explanation: "Assume 100. +20% -> 120. -20% of 120 is 24. 120 - 24 = 96. Net change = 4% decrease."
            }
        ]
    },
    "algebra_equations": {
        id: "algebra_equations",
        title: "Algebra & Equations",
        introduction: "Algebra deals with variables and equations. Master these identities and solving techniques.",
        formulas: [
            { label: "Algebraic Identities", equation: "(a+b)² = a² + 2ab + b²", description: "Also: (a-b)², a²-b², (a+b)³" },
            { label: "Linear Eq (1 Var)", equation: "ax + b = c → x = (c-b)/a", description: "Isolate x." },
            { label: "Linear Eq (2 Var)", equation: "Substitution / Elimination", description: "Solve system of equations." },
            { label: "Quadratic Equations", equation: "x = [-b ± √(b² - 4ac)] / 2a", description: "Discriminant D = b² - 4ac." },
            { label: "Roots", equation: "Sum = -b/a, Product = c/a", description: "For ax² + bx + c = 0." }
        ],
        tips: [
            "Memorize algebraic identities for quick expansion.",
            "Always simplify expressions before solving.",
            "Use elimination method for two equations.",
            "Check discriminant before solving quadratic.",
            "Substitute values to verify answers.",
            "Factorization is faster than formula in many cases."
        ],
        examples: [
            {
                question: "Solve: 2x + 3 = 11",
                solution: "x = 4",
                explanation: "2x = 11 - 3 = 8. x = 4."
            },
            {
                question: "Solve system: x + y = 10, x - y = 2",
                solution: "x = 6, y = 4",
                explanation: "Add equations: 2x = 12 -> x = 6. Substitute x in first eq: 6 + y = 10 -> y = 4."
            },
            {
                question: "Solve quadratic: x² - 5x + 6 = 0",
                solution: "x = 2, 3",
                explanation: "Factorize: (x - 2)(x - 3) = 0. Roots are x = 2 and x = 3."
            }
        ]
    },
    "geometry_mensuration": {
        id: "geometry_mensuration",
        title: "Geometry & Mensuration",
        introduction: "Geometry deals with shapes, sizes, and properties of figures. Mensuration deals with calculation of length, area, and volume.",
        formulas: [
            { label: "Triangle", equation: "Area = 1/2 × base × height", description: "Heron's: √[s(s-a)(s-b)(s-c)]" },
            { label: "Pythagoras", equation: "a² + b² = c²", description: "For right-angled triangles." },
            { label: "Circle", equation: "Area = πr², Circumference = 2πr", description: "Diameter = 2r" },
            { label: "Rectangle", equation: "Area = l×b, Perimeter = 2(l+b)", description: "Diagonal = √(l² + b²)" },
            { label: "Square", equation: "Area = a², Perimeter = 4a", description: "Diagonal = a√2" },
            { label: "Cylinder", equation: "Vol = πr²h, CSA = 2πrh", description: "TSA = 2πr(h+r)" },
            { label: "Cone", equation: "Vol = 1/3πr²h, CSA = πrl", description: "Slant height l = √(r² + h²)" },
            { label: "Sphere", equation: "Vol = 4/3πr³, SA = 4πr²", description: "Surface Area" },
            { label: "Cuboid", equation: "Vol = lbh, TSA = 2(lb+bh+hl)", description: "Diagonal = √(l² + b² + h²)" }
        ],
        tips: [
            "Memorize common π values: 22/7 or 3.14.",
            "Convert units before solving (cm → m).",
            "Draw diagrams to avoid mistakes.",
            "Use Pythagoras for diagonals and heights.",
            "Check whether question asks area, perimeter, or volume.",
            "Approximate when options are far apart."
        ],
        examples: [
            {
                question: "Find the area of a triangle with base = 10 cm and height = 8 cm.",
                solution: "40 cm²",
                explanation: "Area = 1/2 × 10 × 8 = 40 cm²."
            },
            {
                question: "Find the area of a circle with radius 7 cm. (Use π = 22/7)",
                solution: "154 cm²",
                explanation: "Area = (22/7) × 7² = (22/7) × 49 = 154 cm²."
            },
            {
                question: "Find the volume of a cylinder with radius 3 cm and height 14 cm.",
                solution: "396 cm³",
                explanation: "Volume = (22/7) × 3² × 14 = (22/7) × 9 × 14 = 396 cm³."
            }
        ]
    },
    "data_interpretation": {
        id: "data_interpretation",
        title: "Data Interpretation",
        introduction: "Data Interpretation involves analyzing data presented in charts, graphs, and tables to answer questions.",
        formulas: [
            { label: "Percentage Calculation", equation: "(Value / Total) × 100", description: "Used in pie charts, bar graphs." },
            { label: "Ratio", equation: "Value1 : Value2", description: "Simplify to lowest terms." },
            { label: "Average", equation: "Total / Count", description: "Total of values / Number of values." },
            { label: "Growth Rate", equation: "[(New - Old) / Old] × 100", description: "Percentage increase or decrease." },
            { label: "Pie Chart Angle", equation: "(Value / Total) × 360°", description: "Calculate sector angle." }
        ],
        tips: [
            "Read the title and units carefully.",
            "Identify what the question asks before calculating.",
            "Use approximation to save time.",
            "Compare values visually before computing.",
            "Convert percentages to fractions for speed.",
            "Double-check totals in pie charts."
        ],
        examples: [
            {
                question: "In a pie chart, a sector represents 90°. What percentage of the total does it represent?",
                solution: "25%",
                explanation: "(90 / 360) × 100 = 25%."
            },
            {
                question: "Sales: 2021=400, 2023=650. Find percentage increase.",
                solution: "62.5%",
                explanation: "Increase = 650 - 400 = 250. Growth % = (250 / 400) × 100 = 62.5%."
            },
            {
                question: "Marks: 70, 85, 90, 60, 95. Find average.",
                solution: "80",
                explanation: "Total = 400. Average = 400 / 5 = 80."
            }
        ]
    },
    "data_sufficiency": {
        id: "data_sufficiency",
        title: "Data Sufficiency",
        introduction: "Data sufficiency questions test whether the given statements provide enough information to answer the question. You do not need to solve fully.",
        formulas: [
            { label: "Standard Pattern", equation: "A, B, C, D, E", description: "A: I alone, B: II alone, C: Both, D: Either, E: Neither." },
            { label: "Sufficiency Logic", equation: "Unique Ans = Sufficient", description: "Multiple possible answers = Insufficient." },
            { label: "Key Rule", equation: "Check independently", description: "Check I alone, then II alone, then combine if needed." }
        ],
        tips: [
            "Do not calculate fully — check if answer can be uniquely determined.",
            "Test statements independently before combining.",
            "If a statement gives multiple possible values → insufficient.",
            "Avoid adding outside knowledge or assumptions.",
            "Watch for hidden constraints in the question.",
            "Practice elimination using answer pattern."
        ],
        examples: [
            {
                question: "What is Ravi's age? I. Ravi is 5 years older than Aman. II. Aman is 20 years old.",
                solution: "C (Both sufficient)",
                explanation: "I alone: No (Aman's age unknown). II alone: No (Ravi's age unknown). Combined: Ravi = 20 + 5 = 25. Sufficient."
            },
            {
                question: "Find area of rectangle. I. Length = 10 cm. II. Breadth = 5 cm.",
                solution: "C (Both sufficient)",
                explanation: "Area = L * B. Need both L and B. Combined sufficient."
            },
            {
                question: "Find x. I. 2x + 3 = 11. II. x - 2 = 2.",
                solution: "D (Either sufficient)",
                explanation: "I alone: 2x=8, x=4. Sufficient. II alone: x=4. Sufficient. Either is sufficient."
            }
        ]
    },
    "verbal_reasoning": {
        id: "verbal_reasoning",
        title: "Verbal Reasoning",
        introduction: "Verbal reasoning tests your understanding of concepts framed in words. It aims to evaluate ability to think constructively.",
        formulas: [
            { label: "Analogy", equation: "A : B :: C : ?", description: "Relationship: synonym, antonym, function, part-whole." },
            { label: "Classification", equation: "Odd One Out", description: "Group by category, meaning, or usage." },
            { label: "Synonyms & Antonyms", equation: "Similar / Opposite", description: "Context is Key." },
            { label: "Sentence Completion", equation: "Context Clues", description: "Use grammar + logical flow." },
            { label: "Logical Order", equation: "Sequence", description: "General -> Specific or Process -> Result." },
            { label: "Statement & Inference", equation: "Logic Check", description: "Inference must be logically derived." }
        ],
        tips: [
            "Read the sentence carefully for context clues.",
            "Eliminate options that break grammar rules.",
            "Watch for tone (positive/negative) in sentence completion.",
            "In analogies, identify relationship before checking options.",
            "Avoid assumptions in inference questions.",
            "Expand vocabulary daily as it speeds up solving."
        ],
        examples: [
            {
                question: "Doctor : Hospital :: Teacher : ?",
                solution: "School",
                explanation: "Doctor works in hospital. Teacher works in School."
            },
            {
                question: "The manager was ______ with the employee's performance. (Options: delighted, careless, noisy, weak)",
                solution: "delighted",
                explanation: "Context implies a reaction to performance. 'delighted' fits a positive evaluation."
            },
            {
                question: "Statement: All students passed. Inference 1: No student failed. Inference 2: Some students failed.",
                solution: "Only 1 follows",
                explanation: "If all passed, then none failed. Inference 1 is logically equivalent."
            }
        ]
    },
    "non_verbal_reasoning": {
        id: "non_verbal_reasoning",
        title: "Non-Verbal Reasoning",
        introduction: "Non-verbal reasoning involves the ability to understand and analyze visual information and solve problems using visual reasoning.",
        formulas: [
            { label: "Series", equation: "Rotation / Reflection / Size", description: "Identify pattern in shapes (90° turns, flip, etc)." },
            { label: "Analogy", equation: "A : B :: C : ?", description: "Apply A->B transformation to C." },
            { label: "Classification", equation: "Odd Figure Out", description: "Group by common property: shape, sides, shading." },
            { label: "Mirror Image", equation: "Left <-> Right", description: "Vertical mirror swaps left and right." },
            { label: "Water Image", equation: "Top <-> Bottom", description: "Horizontal reflection." },
            { label: "Paper Folding", equation: "Symmetry Lines", description: "Cuts reflect across folds." },
            { label: "Cube & Dice", equation: "Opposite Faces", description: "Opposite faces can't be adjacent." }
        ],
        tips: [
            "Observe changes step by step (rotation, shading, count).",
            "Use elimination if pattern is unclear.",
            "For mirror images, imagine flipping the figure.",
            "In cube problems, note opposite faces.",
            "Count elements (dots, lines, sides) to detect patterns.",
            "Practice visualization to improve speed."
        ],
        examples: [
            {
                question: "Figure Series: A square rotates 90° clockwise in each step. What is the next figure after 4 steps?",
                solution: "Original orientation",
                explanation: "4 rotations of 90° = 360°, which returns to the original position."
            },
            {
                question: "Mirror Image: Mirror on right of 'F'.",
                solution: "Reversed F",
                explanation: "Mirror swaps left and right. The letter appears backward."
            },
            {
                question: "Cube: 1 opposite 6, 2 opposite 5. What is opposite 3?",
                solution: "4",
                explanation: "Pairs are 1-6, 2-5. Remaining pair is 3-4."
            }
        ]
    },
    "blood_relations": {
        id: "blood_relations",
        title: "Blood Relations",
        introduction: "Blood relation questions test your ability to understand family relationships and hierarchy.",
        formulas: [
            { label: "Generations", equation: "Grandparents > Parents > Self > Children", description: "Visualize the hierarchy." },
            { label: "Gender Symbols", equation: "Male (+), Female (-)", description: "Use symbols for clarity." },
            { label: "Couples", equation: "Double line (=)", description: "Represent marriage." },
            { label: "Siblings", equation: "Single line (-)", description: "Represent brothers/sisters." }
        ],
        tips: [
            "Always draw a family tree for complex questions.",
            "Identify gender first — many mistakes happen here.",
            "Track generation levels to avoid confusion.",
            "Break long statements into smaller parts.",
            "Watch for indirect relations (e.g., uncle via marriage).",
            "Use symbols (♂, ♀ or +, -) for clarity."
        ],
        examples: [
            {
                question: "Ravi is the brother of Sita. Sita is the mother of Anu. How is Ravi related to Anu?",
                solution: "Uncle",
                explanation: "Ravi is Sita's brother. Sita is Anu's mother. Mother's brother = Uncle."
            },
            {
                question: "A is father of B. B is sister of C. C is son of D. How is D related to A?",
                solution: "Wife",
                explanation: "A is father. D is parent of C (who is B's brother). So D must be mother. D is A's wife."
            },
            {
                question: "Pointing to a photo, a man says 'She is the daughter of my grandfather's only son.' Who is she?",
                solution: "Sister",
                explanation: "Grandfather's only son = Father. Daughter of father = Sister."
            }
        ]
    },
    "direction_sense": {
        id: "direction_sense",
        title: "Direction Sense Test",
        introduction: "Direction sense questions test your ability to track movement and direction.",
        formulas: [
            { label: "Directions", equation: "N, E, S, W", description: "Clockwise: North -> East -> South -> West." },
            { label: "Right Turn", equation: "Clockwise 90°", description: "Facing N -> Right is E." },
            { label: "Left Turn", equation: "Anti-Clockwise 90°", description: "Facing N -> Left is W." },
            { label: "Pythagoras", equation: "Distance = √(x² + y²)", description: "For diagonal distance." }
        ],
        tips: [
            "Draw arrows for each movement step.",
            "Track final direction after every turn.",
            "Combine opposite movements (e.g., 10N - 4S = 6N).",
            "Use coordinates method for long problems.",
            "If path forms a rectangle, check diagonal distance.",
            "Avoid mental solving — visualizing prevents errors."
        ],
        examples: [
            {
                question: "A person walks 8 m north, then 5 m east. Where is he from the starting point?",
                solution: "√89 m (≈ 9.43 m)",
                explanation: "Distance = √(8² + 5²) = √(64 + 25) = √89."
            },
            {
                question: "Ravi walks 10 m south, turns right and walks 6 m, then turns right and walks 10 m. How far is he from start?",
                solution: "6 meters",
                explanation: "10S, then Right (West) 6m, then Right (North) 10m. N and S cancel. Net = 6m West."
            },
            {
                question: "A man walks 5 m east, then 12 m north, then 5 m west. Dist from start?",
                solution: "12 meters",
                explanation: "5E and 5W cancel. Remaining is 12m North."
            }
        ]
    },
    "coding_decoding": {
        id: "coding_decoding",
        title: "Coding-Decoding",
        introduction: "Coding-Decoding tests your ability to decipher patterns and rules used to encrypt words or numbers.",
        formulas: [
            { label: "Letter Shift", equation: "+1 / -1 / +n", description: "Standard shift based on position." },
            { label: "Position Coding", equation: "A=1 ... Z=26", description: "Use numerical position of letters." },
            { label: "Reverse Coding", equation: "A <-> Z", description: "Alphabet reversed (A=26...)" },
            { label: "Alternate Letter", equation: "Every 2nd letter", description: "Pattern based on alternate positions." },
            { label: "Number Coding", equation: "Sum of positions", description: "BAT = 2+1+20 = 23" }
        ],
        tips: [
            "First check letter positions (A=1…Z=26).",
            "Look for simple shifts (+1, +2, −1).",
            "Check if the word is reversed.",
            "Compare first and last letters for patterns.",
            "If numbers appear, try sum of positions.",
            "Use elimination when multiple patterns seem possible."
        ],
        examples: [
            {
                question: "If TRAIN → USBJO, then PLANE → ?",
                solution: "QMBOF",
                explanation: "Pattern: +1 shift. P->Q, L->M, A->B, N->O, E->F."
            },
            {
                question: "If CAT = 3-1-20, then DOG = ?",
                solution: "4-15-7",
                explanation: "Position coding: D=4, O=15, G=7."
            },
            {
                question: "If FOOD → GPPE, then MILK → ?",
                solution: "NJML",
                explanation: "Pattern: +1 shift for each letter."
            }
        ]
    },
    "syllogism": {
        id: "syllogism",
        title: "Syllogism",
        introduction: "Syllogism tests logical deduction from given statements to reach valid conclusions.",
        formulas: [
            { label: "All A are B", equation: "A ⊂ B", description: "A is a subset of B. Some B are A." },
            { label: "No A is B", equation: "Disjoint", description: "No overlap between A and B." },
            { label: "Some A are B", equation: "Intersection", description: "Partial overlap. No definite conclusion about all." },
            { label: "Key Rules", equation: "Positive/Negative", description: "If statements are positive, conclusion must be positive." }
        ],
        tips: [
            "Draw Venn diagrams for clarity.",
            "Watch for words: ALL, SOME, NO.",
            "“Some” means at least one — not all.",
            "If conclusion introduces new term → invalid.",
            "Reverse conclusions are usually “possible”, not definite.",
            "Avoid assumptions beyond given statements."
        ],
        examples: [
            {
                question: "Statements: All cats are animals. All animals are living beings. Concl: 1. All cats are living beings. 2. Some living beings are cats.",
                solution: "Both follow",
                explanation: "Cats ⊂ Animals ⊂ Living Beings. So All Cats are Living. Examples exist, so Some Living are Cats."
            },
            {
                question: "Statements: No apples are bananas. Some bananas are fruits. Concl: 1. Some fruits are apples. 2. Some bananas are not apples.",
                solution: "Only 2 follows",
                explanation: "No overlap apple-banana. Fruits overlap banana. So some fruits (the bananas) are not apples. Concl 1 uncertain."
            },
            {
                question: "Statements: Some students are athletes. All athletes are disciplined. Concl: 1. Some students are disciplined. 2. All students are disciplined.",
                solution: "Only 1 follows",
                explanation: "Intersection of Student-Athlete is inside Disciplined. So some students are disciplined. All is not guaranteed."
            }
        ]
    },
    "seating_arrangement": {
        id: "seating_arrangement",
        title: "Seating Arrangement",
        introduction: "Seating Arrangement questions test your ability to arrange people or objects based on a set of given conditions.",
        formulas: [
            { label: "Linear", equation: "Left <-> Right", description: "Straight line arrangement. Ends have 1 neighbor." },
            { label: "Circular", equation: "Clockwise/Anti-clock", description: "Facing center: Left=CW, Right=ACW." },
            { label: "Opposite", equation: "n/2 positions away", description: "Directly across in circular arrangement." },
            { label: "Rectangular", equation: "Sides & Corners", description: "Arrangement around a table." },
            { label: "Facing", equation: "Center vs Outside", description: "Directions reverse if facing outside." }
        ],
        tips: [
            "Fix one person first in circular arrangements.",
            "Write initials instead of full names to save time.",
            "Note facing direction before placing neighbors.",
            "Use elimination for remaining seats.",
            "Draw diagrams — mental solving causes errors.",
            "Solve direct clues before indirect ones."
        ],
        examples: [
            {
                question: "Linear: A left of B, C right of B, D at extreme left. 5 people.",
                solution: "D A B C E",
                explanation: "D is first. A is left of B. C is right of B. Order: D-A-B-C-E."
            },
            {
                question: "Circular: 4 friends. A opposite B. C right of A. Facing center.",
                solution: "C is right of A",
                explanation: "Fix A. Right is anti-clockwise. C is next to A. B is opposite A."
            },
            {
                question: "Circular: 6 people. A opposite D. E immediate left of D. B between A and C.",
                solution: "A-B-C-D-E-F",
                explanation: "Fix D. A is opposite. E is left of D. B is between A and C."
            }
        ]
    },
    "logical_puzzles": {
        id: "logical_puzzles",
        title: "Logical Puzzles",
        introduction: "Logical puzzles test your ability to analyze relationships and constraints to deduce the correct arrangement or solution.",
        formulas: [
            { label: "Types", equation: "Seating / Scheduling / Matching", description: "Different logic for different puzzle types." },
            { label: "Elements", equation: "People + Place + Object", description: "Identify all variables." },
            { label: "Tabular Method", equation: "Grid System", description: "Use rows and columns to track possibilities (✔/✘)." },
            { label: "Logic Clues", equation: "Immediate / Between / Not", description: "Define relative positions." }
        ],
        tips: [
            "Use tables to avoid confusion.",
            "Solve direct clues first.",
            "Mark eliminated options clearly.",
            "Watch for hidden constraints.",
            "If stuck, re-read clues — key info is often missed.",
            "Practice visualization for faster solving."
        ],
        examples: [
            {
                question: "Matching: A, B, C have Dog, Cat, Fish. A!=Dog, B=Cat. Who has what?",
                solution: "A-Fish, B-Cat, C-Dog",
                explanation: "B has Cat. A cannot have Dog, so A has Fish. Remaining C has Dog."
            },
            {
                question: "Scheduling: Mon, Tue, Wed. Project!=Mon, Client=Wed. When is Project?",
                solution: "Tuesday",
                explanation: "Client is Wed. Project not Mon, so Project is Tue. Remaining (Team) is Mon."
            },
            {
                question: "Floor: 1-5. A above B. C=5. B=2. Where is A?",
                solution: "3 or 4",
                explanation: "C is 5. B is 2. A is above B (so 3 or 4). A cannot be 5 (occupied by C)."
            }
        ]
    },
    "number_series": {
        id: "number_series",
        title: "Number Series",
        introduction: "Number Series questions test your ability to match the pattern in a sequence of numbers.",
        formulas: [
            { label: "Arithmetic Series", equation: "+ / -", description: "Constant difference between terms." },
            { label: "Geometric Series", equation: "× / ÷", description: "Constant ratio betwen terms." },
            { label: "Square/Cube", equation: "x² / x³", description: "Terms based on squares or cubes." },
            { label: "Alternating", equation: "Mixed", description: "Two patterns alternating." },
            { label: "Difference", equation: "Diff of Diff", description: "Check differences between terms." }
        ],
        tips: [
            "First check differences between terms.",
            "If no pattern, check ratios.",
            "Look for squares, cubes, or primes.",
            "Check alternating positions (odd/even).",
            "Use elimination when options are given.",
            "Don't overthink — most patterns are simple."
        ],
        examples: [
            {
                question: "5, 9, 15, 23, 33, ___",
                solution: "45",
                explanation: "Differences are +4, +6, +8, +10. Next difference is +12. 33+12=45."
            },
            {
                question: "2, 6, 4, 12, 6, 18, ___",
                solution: "16",
                explanation: "Alternating pattern: ×3, -2. 6x3=18, 18-2=16."
            },
            {
                question: "3, 6, 11, 18, 27, ___",
                solution: "38",
                explanation: "Differences: +3, +5, +7, +9. Next is +11. 27+11=38."
            }
        ]
    },
    "letter_series": {
        id: "letter_series",
        title: "Letter Series",
        introduction: "Letter Series tests your ability to identify patterns in sequences of letters.",
        formulas: [
            { label: "Positions", equation: "A=1, B=2... Z=26", description: "Use positions to detect patterns." },
            { label: "Forward", equation: "+1, +2, +3...", description: "Letters move forward by fixed steps." },
            { label: "Backward", equation: "-1, -2, -3...", description: "Letters move backward." },
            { label: "Skip", equation: "Skip n letters", description: "Letters skip one or more positions." },
            { label: "Alternating", equation: "Mixed Series", description: "Two different sequences alternate." }
        ],
        tips: [
            "Convert letters to numbers for quick analysis.",
            "Check forward and backward movement.",
            "Look for alternating patterns.",
            "Observe vowel–consonant patterns.",
            "Use elimination when options are close.",
            "Write alphabet line for reference if needed."
        ],
        examples: [
            {
                question: "A, C, F, J, O, ___",
                solution: "U",
                explanation: "Differences are +2, +3, +4, +5. Next is +6. O(15) + 6 = 21 (U)."
            },
            {
                question: "A, Z, B, Y, C, X, ___",
                solution: "D",
                explanation: "Forward: A, B, C -> D. Backward: Z, Y, X. Next in forward series is D."
            },
            {
                question: "Z, W, S, N, H, ___",
                solution: "A",
                explanation: "Differences: -3, -4, -5, -6. Next is -7. H(8) - 7 = 1 (A)."
            }
        ]
    },
    "time_work_wages": {
        id: "time_work_wages",
        title: "Time, Work & Wages",
        introduction: "Time & Work problems deal with the efficiency of individuals or groups and the time taken to complete a task. Wages are distributed based on work done.",
        formulas: [
            { label: "Basic Rule", equation: "Work = Rate × Time", description: "Rate = 1 / Time (if Work = 1 unit)." },
            { label: "Combined Rate", equation: "1/A + 1/B", description: "Add individual rates to find combined rate." },
            { label: "Time Taken", equation: "1 / (Combined Rate)", description: "Inverse of total rate." },
            { label: "Wages", equation: "Wages ∝ Work Done", description: "Ratio of wages = Ratio of work efficiency." },
            { label: "Men-Days", equation: "M1 × D1 = M2 × D2", description: "Man-days required for constant work." },
            { label: "Efficiency", equation: "Eff ∝ 1/Time", description: "More efficient = Less time." }
        ],
        tips: [
            "Assume total work = LCM of given days for easy calculation.",
            "More workers → less time (inverse relation).",
            "Efficiency and time are inversely proportional.",
            "For wages, compare work done, not time alone.",
            "Break problems into unit work (1/day method).",
            "Use ratios instead of long fractions."
        ],
        examples: [
            {
                question: "A can complete a work in 12 days, B in 18 days. How long will they take together?",
                solution: "7.2 days",
                explanation: "LCM(12, 18) = 36. A=3 units/day, B=2 units/day. Total=5. Time = 36/5 = 7.2 days."
            },
            {
                question: "10 men can complete a work in 15 days. How many men are required to complete it in 5 days?",
                solution: "30 men",
                explanation: "M1D1 = M2D2. 10*15 = M*5. 150 = 5M. M = 30."
            },
            {
                question: "A (10 days) and B (15 days) work together and earn ₹1500. Wages of A?",
                solution: "₹900",
                explanation: "Efficiency Ratio A:B = 1/10 : 1/15 = 3:2. A's share = (3/5)*1500 = 900."
            }
        ]
    },
    "permutation_combination": {
        id: "permutation_combination",
        title: "Permutation, Combination & Probability",
        introduction: "Permutation deals with arrangement (order matters), Combination deals with selection (order doesn't matter), and Probability measures the likelihood of events.",
        formulas: [
            { label: "Permutation", equation: "nPr = n! / (n - r)!", description: "Arrangement of r items from n. Order matters." },
            { label: "Combination", equation: "nCr = n! / [r!(n - r)!]", description: "Selection of r items from n. Order doesn't matter." },
            { label: "Factorial", equation: "n! = n × (n-1) × ... × 1", description: "0! = 1." },
            { label: "Probability", equation: "P(E) = Favorable / Total", description: "0 ≤ P ≤ 1. P(not E) = 1 - P(E)." },
            { label: "Circular Permutation", equation: "(n - 1)!", description: "Arrangement in a circle." },
            { label: "Identical Objects", equation: "n! / (p! q! r!)", description: "Arrangement with repeating items." }
        ],
        tips: [
            "Use Permutation when order matters (Arrangement).",
            "Use Combination when order doesn't matter (Selection).",
            "Simplify factorials before multiplying (e.g., 6!/4! = 6×5).",
            "For probability, count total outcomes carefully.",
            "Use complement rule P(A') = 1 - P(A) for 'at least one' problems.",
            "AND means multiply, OR means add in probability."
        ],
        examples: [
            {
                question: "In how many ways can 4 students be arranged in a row?",
                solution: "24 ways",
                explanation: "4! = 4 × 3 × 2 × 1 = 24."
            },
            {
                question: "From 6 players, how many teams of 2 can be formed?",
                solution: "15 teams",
                explanation: "6C2 = 6! / (2!4!) = (6×5)/(2×1) = 15."
            },
            {
                question: "A card is drawn from a deck of 52. Probability of getting a heart?",
                solution: "1/4",
                explanation: "Hearts = 13. Total = 52. P(Heart) = 13/52 = 1/4."
            }
        ]
    },
    "ratio_proportion": {
        id: "ratio_proportion",
        title: "Ratio, Proportion & Partnership",
        introduction: "Ratio compares two quantities, Proportion equates two ratios, and Partnership deals with profit sharing based on investment and time.",
        formulas: [
            { label: "Ratio", equation: "a : b = a/b", description: "Comparison of two quantities." },
            { label: "Proportion", equation: "a : b = c : d ⇒ ad = bc", description: "Product of extremes = Product of means." },
            { label: "Partnership Rule", equation: "Profit ∝ Investment × Time", description: "Profit depends on capital and duration." },
            { label: "Profit Ratio", equation: "P1 : P2 = (I1×T1) : (I2×T2)", description: "Ratio of profit sharing." },
            { label: "Third Proportion", equation: "c = b²/a", description: "If a:b = b:c." }
        ],
        tips: [
            "Convert ratios into fractions for calculations.",
            "Use cross multiplication to solve proportions quickly.",
            "In partnership, always multiply investment by time.",
            "Simplify ratios before dividing amounts.",
            "Check units (months/years) in partnership problems."
        ],
        examples: [
            {
                question: "Divide ₹900 in the ratio 2 : 3.",
                solution: "₹360 and ₹540",
                explanation: "Total parts = 5. First = (2/5)*900 = 360. Second = (3/5)*900 = 540."
            },
            {
                question: "If 4 : 5 = x : 15, find x.",
                solution: "12",
                explanation: "4/5 = x/15. x = (4*15)/5 = 12."
            },
            {
                question: "A invests ₹10,000 for 12 months, B invests ₹15,000 for 8 months. Find profit ratio.",
                solution: "1 : 1",
                explanation: "A = 10000*12 = 120000. B = 15000*8 = 120000. Ratio = 1:1."
            }
        ]
    },
    "average_mixture": {
        id: "average_mixture",
        title: "Average & Mixture",
        introduction: "Average deals with the central value of a dataset, while Mixture & Alligation deals with mixing two or more ingredients/prices.",
        formulas: [
            { label: "Average", equation: "Sum / Count", description: "Basic formula for mean value." },
            { label: "Total Value", equation: "Average × Count", description: "Finding sum from average." },
            { label: "New Average", equation: "(Old Total + Value) / New Count", description: "When a new item is added." },
            { label: "Mean Price", equation: "Total Cost / Total Qty", description: "Average price of a mixture." },
            { label: "Alligation Rule", equation: "(Dearer - Mean) : (Mean - Cheaper)", description: "Ratio of quantities to mix." },
            { label: "Replacement", equation: "Rem = Initial × (1 - x/Total)^n", description: "Substance remaining after n replacements." }
        ],
        tips: [
            "Use Total = Avg × Count for faster solving.",
            "In mixture problems, use alligation for ratios.",
            "Convert units before mixing quantities.",
            "Check if question asks for Price, Ratio, or Quantity.",
            "In replacement, focus on the remaining fraction.",
            "Assume total quantity = 100 for percentage problems."
        ],
        examples: [
            {
                question: "Average of 5 numbers is 20. Add new number -> Avg becomes 22. Find new number.",
                solution: "32",
                explanation: "Old Total = 100. New Total = 6*22 = 132. New Number = 132-100 = 32."
            },
            {
                question: "Mix rice ₹40/kg and ₹60/kg to get ₹50/kg. Find ratio.",
                solution: "1 : 1",
                explanation: "Ratio = (60-50) : (50-40) = 10:10 = 1:1."
            },
            {
                question: "100L milk. 20L replaced with water twice. Remaining milk?",
                solution: "64 liters",
                explanation: "Fraction left = 1 - 20/100 = 4/5. After 2 times: 100 * (4/5)^2 = 64."
            }
        ]
    },
    "clocks_calendar": {
        id: "clocks_calendar",
        title: "Clocks & Calendar",
        introduction: "Clocks involve angles and time, while Calendars involve odd days and leap years to determine the day of the week.",
        formulas: [
            { label: "Angle Formula", equation: "|30H - 5.5M|", description: "Angle between hour and minute hands. H=Hour, M=Minute." },
            { label: "Coincide (0°)", equation: "Every 65 5/11 min", description: "Hands meet ~12 times in 12 hours." },
            { label: "Right Angle (90°)", equation: "22 times in 12 hrs", description: "Hands are perpendicular." },
            { label: "Opposite (180°)", equation: "11 times in 12 hrs", description: "Hands form a straight line." },
            { label: "Odd Days", equation: "Total Days % 7", description: "Remainder gives the day shift." },
            { label: "Leap Year", equation: "Divisible by 4 (or 400)", description: "Century years must be divisible by 400." }
        ],
        tips: [
            "Use |30H - 5.5M| for quick angle calculation.",
            "Relative speed of hands = 5.5° per minute.",
            "Odd days: 1 ordinary year = 1 odd day, Leap year = 2 odd days.",
            "Memorize days in months (Jan=31, Feb=28/29...).",
            "Day repetition occurs after 0 odd days (multiple of 7)."
        ],
        examples: [
            {
                question: "Find the angle between clock hands at 3:20.",
                solution: "20°",
                explanation: "Angle = |30*3 - 5.5*20| = |90 - 110| = 20°."
            },
            {
                question: "If today is Monday, what day will it be after 100 days?",
                solution: "Wednesday",
                explanation: "100 % 7 = 2 odd days. Monday + 2 = Wednesday."
            },
            {
                question: "How many leap years from 2001 to 2020?",
                solution: "5",
                explanation: "2004, 2008, 2012, 2016, 2020. Total = 5."
            }
        ]
    },
    "logical_deduction": {
        id: "logical_deduction",
        title: "Logical Deduction",
        introduction: "Logical deduction involves drawing valid conclusions from given statements using structured reasoning without assumptions.",
        formulas: [
            { label: "Statement & Conclusion", equation: "Must follow logically", description: "No extra info allowed." },
            { label: "Statement & Assumption", equation: "Assumption = Hidden belief", description: "If assumption is false, statement fails." },
            { label: "Cause & Effect", equation: "Cause -> Reason, Effect -> Result", description: "Valid if cause directly leads to effect." },
            { label: "Assertion & Reason", equation: "Fact + Explanation", description: "Check if reason correctly explains assertion." },
            { label: "Course of Action", equation: "Solve + Practical + Relevant", description: "Reject extreme or unrelated actions." },
            { label: "Arguments", equation: "Strong vs Weak", description: "Strong is logical/relevant. Weak is emotional/extreme." }
        ],
        tips: [
            "Focus only on given information; avoid personal opinions.",
            "Reject extreme or unrealistic conclusions.",
            "Identify keywords: all, some, none, must, should.",
            "Use elimination to remove weak arguments.",
            "Practice distinguishing fact vs opinion."
        ],
        examples: [
            {
                question: "Statement: All employees must wear ID cards. Conclusion: 1. Some employees wear ID cards. 2. No employee wears ID cards.",
                solution: "Only 1 follows",
                explanation: "If all wear cards, then 'some' (a subset) also wear cards. 'None' is false."
            },
            {
                question: "Argue: Should plastic bags be banned? 1. Yes, they cause pollution. 2. No, they are available in many colors.",
                solution: "Only 1 is strong",
                explanation: "Arg 1 is relevant and logical (pollution). Arg 2 is irrelevant (colors)."
            },
            {
                question: "Problem: Road accidents are increasing. Action: 1. Improve enforcement. 2. Ban all vehicles.",
                solution: "Only 1 follows",
                explanation: "Action 1 is practical. Action 2 is extreme and impractical."
            }
        ]
    },
    "statement_assumption": {
        id: "statement_assumption",
        title: "Statement, Assumption & Conclusion",
        introduction: "These questions test your ability to identify hidden assumptions and draw valid conclusions from a given statement.",
        formulas: [
            { label: "Statement", equation: "Given Fact", description: "Accept as true, no questioning." },
            { label: "Assumption", equation: "Hidden Support", description: "Unstated belief required for statement to be true." },
            { label: "Conclusion", equation: "Logical Outcome", description: "Must follow directly from statement." },
            { label: "Negation Test", equation: "Negate Assumption -> Statement Fails", description: "Method to validate assumptions." },
            { label: "Validity", equation: "Direct Link", description: "Conclusion cannot add new info." }
        ],
        tips: [
            "Accept the statement as absolute truth.",
            "Use the negation test for assumptions.",
            "If a conclusion adds new info or is extreme -> reject.",
            "Look for logical necessity, not just possibility.",
            "Reason must explain 'why', assumption explains 'how/basis'."
        ],
        examples: [
            {
                question: "Statement: Flexible hours improve productivity. Assumptions: 1. Flexible hours can improve productivity. 2. Employees dislike fixed schedules.",
                solution: "Only 1 is valid",
                explanation: "Assumption 1 is necessary for the statement to hold. Assumption 2 is not directly related."
            },
            {
                question: "Statement: All online courses require internet. Conclusions: 1. No internet = No course. 2. Internet needed for some courses.",
                solution: "Both follow",
                explanation: "1 is logically equivalent (contrapositive). 2 is a subset implication."
            },
            {
                question: "Statement: Tax increased on tobacco to reduce smoking. Assumptions: 1. Higher price reduces consumption. 2. People stop immediately.",
                solution: "Only 1 is valid",
                explanation: "1 is the basis of the action. 2 is an extreme/unrealistic assumption."
            }
        ]
    },
    "cause_effect": {
        id: "cause_effect",
        title: "Cause & Effect Reasoning",
        introduction: "Cause & Effect reasoning involves identifying the relationship between two events, distinguishing which is the cause (reason) and which is the effect (result).",
        formulas: [
            { label: "Cause", equation: "Reason", description: "The event that makes something happen." },
            { label: "Effect", equation: "Result", description: "The outcome of the cause." },
            { label: "Sequence", equation: "Cause -> Effect", description: "Cause always precedes effect." },
            { label: "Direct Link", equation: "Dependency", description: "Effect must depend logically on the cause." },
            { label: "Validation", equation: "If No Cause -> No Effect", description: "Removing cause should remove effect." }
        ],
        tips: [
            "Check the chronological sequence: Cause comes first.",
            "Ensure a logical link, not just coincidence.",
            "Watch out for reverse logic traps (Effect before Cause).",
            "Eliminate unrelated options first.",
            "Use real-world reasoning to validate the connection."
        ],
        examples: [
            {
                question: "Statement: Many fish died in the lake. Possible Causes: 1. Industrial waste released. 2. A festival celebrated nearby.",
                solution: "Cause 1",
                explanation: "Industrial waste has a direct impact on water quality/life. A festival nearby is not a direct cause."
            },
            {
                question: "1. Heavy rainfall for 3 days. 2. Several roads flooded.",
                solution: "1 is Cause, 2 is Effect",
                explanation: "Rainfall leads to flooding. Chronologically, rain happens first."
            },
            {
                question: "1. Students scored low marks. 2. The exam was very difficult.",
                solution: "2 is Cause, 1 is Effect",
                explanation: "Difficulty of exam leads to low marks. 2 causes 1."
            }
        ]
    },
    "decision_making": {
        id: "decision_making",
        title: "Decision Making",
        introduction: "Decision making evaluates your ability to choose the best possible action based on given conditions, rules, constraints, and ethics.",
        formulas: [
            { label: "Rule-Based", equation: "Follow Conditions", description: "Adhere to all specified rules." },
            { label: "Ethical", equation: "Fairness + Integrity", description: "Choose the morally correct option." },
            { label: "Situational", equation: "Practical Solution", description: "Solve the problem effectively." },
            { label: "Feasibility", equation: "Realistic Action", description: "Avoid extreme or impossible solutions." },
            { label: "Constraints", equation: "Within Limits", description: "Respect time, budget, and resources." }
        ],
        tips: [
            "Carefully read all rules and conditions.",
            "Eliminate options that violate constraints.",
            "Avoid extreme solutions (e.g., banning everything).",
            "Choose practical, balanced, and ethical actions.",
            "Do not make assumptions beyond the provided text."
        ],
        examples: [
            {
                question: "Problem: Employee forgets ID card. Rule: ID mandatory. Options: 1. Allow entry. 2. Verify and issue temporary pass.",
                solution: "Option 2",
                explanation: "Option 1 violates the rule. Option 2 follows the rule while solving the problem practically."
            },
            {
                question: "Problem: Increasing traffic. Options: 1. Improve public transport. 2. Ban all private vehicles.",
                solution: "Option 1",
                explanation: "Option 1 is a practical and effective long-term solution. Option 2 is extreme and unrealistic."
            },
            {
                question: "Problem: Colleague sharing confidential data. Options: 1. Ignore. 2. Report to management.",
                solution: "Option 2",
                explanation: "Option 1 is unethical compliance. Option 2 is the correct ethical course of action."
            }
        ]
    }
};

// Fallback for topics not explicitly defined in studyMaterials
const getFallbackMaterial = (id: string, name: string): StudySection => ({
    id: id,
    title: name,
    introduction: `Master the key concepts and techniques for ${name} to ace your aptitude tests.`,
    formulas: [
        { label: "Key Concept", equation: "Fundamental Principles", description: `Understand the core logic behind ${name}.` },
        { label: "Approach", equation: "Step-by-Step Analysis", description: "Break down the problem into smaller components." }
    ],
    tips: [
        "Read the question twice to understand exactly what is asked.",
        "Eliminate obviously wrong options first.",
        "Practice regularly to improve speed and accuracy in this topic."
    ],
    examples: [] // Will rely on dynamic questions if empty
});

export const getStudyMaterial = (topicId: string, topicName: string): StudySection => {
    return studyMaterials[topicId] || getFallbackMaterial(topicId, topicName);
};
