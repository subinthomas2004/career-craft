import { Question } from "../aptitudeQuestions";

export const nonVerbalReasoningQuestions: Question[] = [
    {
        question: "Choose the figure which is different from the rest: (A) Square with 1 diagonal, (B) Rectangle with 1 diagonal, (C) Triangle with 1 median, (D) Circle with 1 radius.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "In options A, B, and C, the line divides the figure into two equal parts, whereas a radius does not divide a circle into two parts."
    },
    {
        question: "If a square rotates 45 degrees clockwise in each step, what is its position in the 5th step if it started at 0 degrees?",
        options: ["90 degrees","135 degrees","180 degrees","225 degrees"],
        correct: 2,
        explanation: "Starting at 0, the steps are 45, 90, 135, and finally 180 degrees at the 5th position (4 turns)."
    },
    {
        question: "Identify the figure that completes the pattern: A circle contains a dot that moves 90 degrees clockwise in each frame. If it starts at Top, where is it in the 4th frame?",
        options: ["Top","Right","Bottom","Left"],
        correct: 3,
        explanation: "The positions are: 1-Top, 2-Right, 3-Bottom, 4-Left."
    },
    {
        question: "Which shape does not belong? (A) Hexagon, (B) Pentagon, (C) Cube, (D) Septagon.",
        options: ["A","B","C","D"],
        correct: 2,
        explanation: "A, B, and D are 2D polygons, while a Cube is a 3D solid figure."
    },
    {
        question: "Select a figure from the options which will continue the series: A line increases its number of segments by one in each step (1, 2, 3...). What is the 6th figure?",
        options: ["4 segments","5 segments","6 segments","7 segments"],
        correct: 2,
        explanation: "The series follows a simple arithmetic progression where the number of segments equals the step number."
    },
    {
        question: "In a mirror image, if a clock shows 3:00, what time does the reflection show?",
        options: ["3:00","6:00","9:00","12:00"],
        correct: 2,
        explanation: "In a vertical mirror, the left and right sides are swapped, so 3 o'clock becomes 9 o'clock."
    },
    {
        question: "In a series, a triangle points Up, then Right, then Down. What is the next direction?",
        options: ["Up","Left","Right","Diagonal"],
        correct: 1,
        explanation: "The triangle is rotating 90 degrees clockwise in each step; after Down comes Left."
    },
    {
        question: "Which of the following is the Water Image of the word 'MOM'?",
        options: ["MOM","WOW","NON","W OW"],
        correct: 1,
        explanation: "A water image is a horizontal reflection; 'M' flipped vertically becomes 'W', and 'O' remains 'O'."
    },
    {
        question: "Find the odd one out: (A) Parallel lines, (B) Perpendicular lines, (C) Intersecting lines, (D) A single point.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "A, B, and C describe relationships between two lines, while D is just a single point."
    },
    {
        question: "A square is divided into 4 parts. If 1 part is shaded, then 2, then 3, what is the next step in the series?",
        options: ["0 shaded","All 4 shaded","1 shaded","2 shaded"],
        correct: 1,
        explanation: "The number of shaded parts is increasing by one in each step of the sequence."
    },
    {
        question: "Identify the missing part: Circle is to Sphere as Square is to...?",
        options: ["Rectangle","Triangle","Cube","Area"],
        correct: 2,
        explanation: "The relationship is 2D shape to its corresponding 3D version."
    },
    {
        question: "Select the figure that completes the analogy: Triangle : 3 sides :: Hexagon : ?",
        options: ["4 sides","5 sides","6 sides","8 sides"],
        correct: 2,
        explanation: "The analogy relates a polygon to the number of its sides."
    },
    {
        question: "Choose the alternative which is closely resembles the mirror image of 'BRISK'?",
        options: ["KSIRB (reversed letters)","K S I R B (mirrored letters)","BRISK","BK SIR"],
        correct: 1,
        explanation: "A mirror image reverses the order of letters and the orientation of each individual letter."
    },
    {
        question: "Which of the following figures can be formed by folding the given net of a cube? (Assume standard dice numbering).",
        options: ["1 opposite 6","1 opposite 2","2 opposite 3","4 opposite 5"],
        correct: 0,
        explanation: "In a standard cube net, alternate faces are opposite each other when folded."
    },
    {
        question: "A pattern has 1 dot, then 3 dots in a triangle, then 6 dots. How many dots are in the next pattern?",
        options: ["8","9","10","12"],
        correct: 2,
        explanation: "The series follows triangular numbers ($n(n+1)/2$), so the next number after 6 is 10."
    },
    {
        question: "If a figure moves 1 step clockwise in a 3x3 grid starting from top-left, where is it after 5 steps?",
        options: ["Center","Bottom-Right","Bottom-Left","Middle-Left"],
        correct: 2,
        explanation: "Moving along the perimeter of the 3x3 grid, 5 steps from top-left lands on the bottom-left corner."
    },
    {
        question: "Choose the odd one out: (A) Circle, (B) Ellipse, (C) Sphere, (D) Oval.",
        options: ["A","B","C","D"],
        correct: 2,
        explanation: "Circle, Ellipse, and Oval are 2D curves, while a Sphere is a 3D object."
    },
    {
        question: "A shape has 4 sides and all angles are 90 degrees, but adjacent sides are not equal. What is it?",
        options: ["Square","Rhombus","Rectangle","Parallelogram"],
        correct: 2,
        explanation: "A rectangle has 90-degree angles but unlike a square, its adjacent sides are unequal."
    },
    {
        question: "How many triangles are there in a square with both diagonals drawn?",
        options: ["4","6","8","10"],
        correct: 2,
        explanation: "There are 4 small triangles and 4 larger triangles formed by combining two small ones, totaling 8."
    },
    {
        question: "A line in a circle rotates 30 degrees anticlockwise. If it is at 12 o'clock, how many steps until it reaches 9 o'clock?",
        options: ["1 step","3 steps","6 steps","9 steps"],
        correct: 1,
        explanation: "The gap between 12 and 9 anticlockwise is 90 degrees; $90 / 30 = 3$ steps."
    },
    {
        question: "Which figure is the odd one out? (A) Arrow pointing Up, (B) Arrow pointing Down, (C) Arrow pointing Left, (D) A straight line without a head.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "A, B, and C are directed vectors (arrows), while D is a simple line segment without direction."
    },
    {
        question: "Complete the series: Square, Pentagon, Hexagon, ... ?",
        options: ["Triangle","Rectangle","Heptagon","Octagon"],
        correct: 2,
        explanation: "The series increases the number of sides by one (4, 5, 6), so the next is a 7-sided Heptagon."
    },
    {
        question: "If a paper is folded in half and a hole is punched, how many holes appear when unfolded?",
        options: ["1","2","3","4"],
        correct: 1,
        explanation: "Each layer of paper receives the punch, so folding it once creates two layers and thus two holes."
    },
    {
        question: "Which shape is formed by the intersection of two circles of the same radius passing through each other's centers?",
        options: ["Vesica Piscis","Oval","Square","Triangle"],
        correct: 0,
        explanation: "The lens-like shape formed by the intersection of two equal circles through their centers is called a Vesica Piscis."
    },
    {
        question: "What is the mirror image of '12:30'?",
        options: ["12:30","11:30","06:30","05:30"],
        correct: 1,
        explanation: "Subtracting 12:30 from 23:60 (mirror time rule) gives 11:30."
    },
    {
        question: "A cube has 6 faces. How many vertices does it have?",
        options: ["6","8","10","12"],
        correct: 1,
        explanation: "A cube consists of 6 faces, 12 edges, and 8 vertices (corners)."
    },
    {
        question: "If 'Up' is reflected in water, it becomes...?",
        options: ["Down","Up","Left","Right"],
        correct: 0,
        explanation: "Water reflection acts as a vertical flip, so 'Up' points 'Down'."
    },
    {
        question: "Find the odd one out: (A) T, (B) H, (C) E, (D) N.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "Letters T, H, and E have at least one axis of symmetry, whereas N does not have reflectional symmetry."
    },
    {
        question: "A circle is inscribed in a square. If the side of the square is 10, what is the radius of the circle?",
        options: ["5","10","20","2.5"],
        correct: 0,
        explanation: "The diameter of an inscribed circle is equal to the side of the square, so the radius is half that (5)."
    },
    {
        question: "Select the figure that completes the series: Dot inside circle, Dot on circle, Dot outside circle, ...?",
        options: ["Two dots inside","No circle","Dot inside circle","Dot far away"],
        correct: 2,
        explanation: "The pattern typically cycles through positions; after being outside, it resets to the interior."
    },
    {
        question: "Which of these letters looks the same in a mirror? (A) P, (B) Q, (C) R, (D) O.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "The letter 'O' has vertical symmetry, making its mirror image identical to the original."
    },
    {
        question: "A dice is thrown. What is the sum of the dots on opposite faces?",
        options: ["5","6","7","8"],
        correct: 2,
        explanation: "On a standard die, the sum of dots on any two opposite faces is always 7."
    },
    {
        question: "Identify the missing figure: Point : Line :: Line : ?",
        options: ["Circle","Square","Plane","Angle"],
        correct: 2,
        explanation: "A line is a 1D extension of a point; a plane is a 2D extension of a line."
    },
    {
        question: "Choose the odd one out: (A) Semicircle, (B) Quadrant, (C) Segment, (D) Cylinder.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "A, B, and C are parts of a circle (2D), while a Cylinder is a 3D object."
    },
    {
        question: "If a square is folded twice diagonally and a cut is made at the corner, what shape appears in the center when unfolded?",
        options: ["Square","Circle","Diamond","Triangle"],
        correct: 2,
        explanation: "A corner cut on a diagonally folded square unfolds into a central diamond or smaller square."
    },
    {
        question: "How many squares are in a 3x3 grid?",
        options: ["9","10","13","14"],
        correct: 3,
        explanation: "The total is $3^2 + 2^2 + 1^2 = 9 + 4 + 1 = 14$ squares."
    },
    {
        question: "A clock is placed such that 12 points North-East. In which direction does 3 point?",
        options: ["South-East","South-West","North-West","East"],
        correct: 0,
        explanation: "3 is 90 degrees clockwise from 12; 90 degrees clockwise from North-East is South-East."
    },
    {
        question: "What is the water image of the number '8'?",
        options: ["3","0","8","9"],
        correct: 2,
        explanation: "The number 8 is vertically symmetrical, so its water image is identical to itself."
    },
    {
        question: "Find the odd one: (A) Prism, (B) Pyramid, (C) Cone, (D) Triangle.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "Triangle is a 2D shape, while the others are 3D geometric solids."
    },
    {
        question: "A shape moves from the corner to the center. What is this transformation called?",
        options: ["Rotation","Reflection","Translation","Dilation"],
        correct: 2,
        explanation: "Translation refers to sliding a figure from one position to another without turning or flipping it."
    },
    {
        question: "In a 4-step series, a black square moves from top-left to top-right, then bottom-right. Where is it in step 4?",
        options: ["Top-Left","Bottom-Left","Center","Middle-Right"],
        correct: 1,
        explanation: "The square is moving clockwise around the four corners: TL -> TR -> BR -> BL."
    },
    {
        question: "Which of these figures has the most lines of symmetry? (A) Square, (B) Circle, (C) Equilateral Triangle, (D) Rectangle.",
        options: ["A","B","C","D"],
        correct: 1,
        explanation: "A circle has an infinite number of lines of symmetry, whereas a square only has four."
    },
    {
        question: "If a triangle is reflected across its base, what composite shape is formed?",
        options: ["Square","Rhombus","Kite","Hexagon"],
        correct: 1,
        explanation: "Reflecting an equilateral or isosceles triangle across its base creates a rhombus or a kite."
    },
    {
        question: "Which shape cannot tile a floor without gaps? (A) Square, (B) Regular Hexagon, (C) Pentagon, (D) Triangle.",
        options: ["A","B","C","D"],
        correct: 2,
        explanation: "Regular pentagons cannot tessellate a 2D plane without leaving gaps or overlapping."
    },
    {
        question: "A cube is painted red on all sides and cut into 27 small cubes. How many small cubes have 3 sides painted?",
        options: ["4","8","12","1"],
        correct: 1,
        explanation: "The cubes with 3 sides painted are always the corner cubes, and every cube has 8 corners."
    },
    {
        question: "What is the mirror image of the time 09:15?",
        options: ["03:45","02:45","03:15","09:45"],
        correct: 1,
        explanation: "Mirror time = 11:60 - 09:15 = 02:45."
    },
    {
        question: "Which letter is the odd one out based on symmetry? (A) A, (B) M, (C) W, (D) S.",
        options: ["A","B","C","D"],
        correct: 3,
        explanation: "A, M, and W have vertical reflectional symmetry, while S only has rotational symmetry."
    },
    {
        question: "How many edges does a triangular pyramid have?",
        options: ["4","5","6","8"],
        correct: 2,
        explanation: "A triangular pyramid (tetrahedron) has 3 base edges and 3 slant edges, totaling 6."
    },
    {
        question: "In a series, a circle grows larger, then a square grows larger. What is next?",
        options: ["A triangle grows larger","The circle shrinks","A dot appears","The square shrinks"],
        correct: 0,
        explanation: "The pattern cycles through shapes (3-sided, 4-sided) following the growth rule."
    },
    {
        question: "If a transparent sheet with a pattern is folded along a dotted line, the pattern on both sides will...?",
        options: ["Disappear","Overlap","Separate","Rotate"],
        correct: 1,
        explanation: "Folding a transparent sheet causes the patterns on the two halves to superimpose or overlap."
    }
];
