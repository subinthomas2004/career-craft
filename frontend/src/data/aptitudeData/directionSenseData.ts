import { Question } from "../aptitudeQuestions";

export const directionSenseQuestions: Question[] = [
    {
        question: "Amit walks 15 m towards the East, turns right and walks 20 m, then turns right again and walks 15 m. How far is he from his starting point?",
        options: ["10 m","20 m","30 m","35 m"],
        correct: 1,
        explanation: "His path forms a rectangle, making his final distance from the start equal to the 20 m he walked directly South."
    },
    {
        question: "A girl is facing North. She turns 135 degrees in the anti-clockwise direction and then 45 degrees in the clockwise direction. Which direction is she facing now?",
        options: ["North","South","West","East"],
        correct: 2,
        explanation: "The net turn is 90 degrees anti-clockwise from North, which lands her directly facing West."
    },
    {
        question: "Starting from a point, Raju walks 12 m North, turns right and walks 10 m, turns right again and walks 12 m, then turns left and walks 5 m. How far and in which direction is he from the starting point?",
        options: ["10 m East","5 m West","15 m North","15 m East"],
        correct: 3,
        explanation: "He walks 12 m North and then 12 m South back to the same horizontal line, finishing exactly 10 m + 5 m = 15 m to the East."
    },
    {
        question: "One evening before sunset, Rekha and Hema were talking to each other face to face. If Hema's shadow was exactly to the right of Hema, which direction was Rekha facing?",
        options: ["South","North","East","West"],
        correct: 0,
        explanation: "In the evening, the sun is in the West, so shadows fall East; if East is to Hema's right, Hema faces North, meaning Rekha (facing her) is looking South."
    },
    {
        question: "P is 10 m to the West of Q. R is 12 m to the South of P. S is 10 m to the East of R. What is the direction of S with respect to Q?",
        options: ["North-West","South-West","South","North-East"],
        correct: 2,
        explanation: "S is 10 m East of R, perfectly aligning S directly below Q on the vertical axis, making S exactly South of Q."
    },
    {
        question: "A man walks 5 km towards South and then turns to the right. After walking 3 km, he turns to the left and walks 5 km. Now in which direction is he from the starting place?",
        options: ["South-East","South-West","North-West","North"],
        correct: 1,
        explanation: "He travels a total of 10 km South and 3 km West, placing his final position to the South-West of his starting point."
    },
    {
        question: "Rasik walks 20 m North, turns right and walks 30 m, turns right again and walks 35 m, turns left and walks 15 m, and finally turns left and walks 15 m. In which direction and how many meters is he from the starting position?",
        options: ["45 m East","30 m West","20 m North","45 m North"],
        correct: 0,
        explanation: "His vertical movements cancel out to exactly his starting latitude, leaving him horizontally 30 m + 15 m = 45 m to the East."
    },
    {
        question: "A rat runs 20 m towards East and turns right, runs 10 m and turns right, runs 9 m and turns left, runs 5 m and turns left, runs 12 m and finally turns left and runs 6 m. Which direction is the rat facing now?",
        options: ["South","East","West","North"],
        correct: 3,
        explanation: "Tracking the sequential 90-degree turns (East -> South -> West -> South -> East -> North) shows the rat's final facing direction is North."
    },
    {
        question: "K is 40 m South-West of L. If M is 40 m South-East of L, then M is in which direction of K?",
        options: ["West","East","North","South"],
        correct: 1,
        explanation: "Both K and M are on the same horizontal plane south of L, with M positioned directly to the right (East) of K."
    },
    {
        question: "Town D is 10 km East of F. Town B is 5 km North of D. Town H is 5 km South of D. Towards which direction is town H from town F?",
        options: ["South-East","North-West","North-East","South"],
        correct: 0,
        explanation: "Since D is East of F and H is South of D, plotting the points places H diagonally to the South-East of F."
    },
    {
        question: "A person starts walking North and after some distance turns 45 degrees in a clockwise direction. Which direction is he walking now?",
        options: ["North","West","North-East","South-West"],
        correct: 2,
        explanation: "A simple 45-degree right-hand turn from true North points the person directly towards the North-East."
    },
    {
        question: "Ram walks 10 m South from his house, turns left and walks 25 m, turns left again and walks 40 m, then turns right and walks 5 m to reach his school. In which direction is the school from his house?",
        options: ["North-West","South-East","South-West","North-East"],
        correct: 3,
        explanation: "He ends up 30 m North (40m - 10m) and 30 m East (25m + 5m) of his house, which is the North-East quadrant."
    },
    {
        question: "A pole casts a shadow of 10 m towards the East in the morning. If a person walks 10 m towards the South from the pole, in which direction is the tip of the shadow from the person?",
        options: ["South-West","North-East","North-West","South-East"],
        correct: 1,
        explanation: "The shadow tip is 10 m East of the pole, and the person is 10 m South of the pole, so looking from the person to the tip requires looking North-East."
    },
    {
        question: "I am facing South. I turn right and walk 20 m, turn right again and walk 10 m, turn left and walk 10 m, turn right and walk 20 m, and finally turn right again and walk 60 m. In which direction am I from the starting point?",
        options: ["North-East","North-West","South-East","South-West"],
        correct: 0,
        explanation: "Plotting the path results in a final coordinate that is physically located North and East relative to the starting origin."
    },
    {
        question: "A boy rode his bicycle Northwards, turned left and rode 1 km, and again turned left and rode 2 km to find himself exactly 1 km West of his starting point. How far did he ride Northwards initially?",
        options: ["1 km","3 km","2 km","4 km"],
        correct: 2,
        explanation: "Because he ends up on the exact same horizontal starting line after riding 2 km South, his initial Northward journey must have also been 2 km."
    },
    {
        question: "Village Q is to the North of village P. Village R is in the East of Village Q. Village S is to the left (West) of village P. In which direction is village S with respect to village R?",
        options: ["North-West","North-East","South-East","South-West"],
        correct: 3,
        explanation: "R is North-East of P, and S is West of P, placing S far to the bottom-left, or South-West, when looking from R."
    },
    {
        question: "One morning Uday and Vishal were talking face to face at a crossing. If Vishal's shadow was exactly to the left of Uday, which direction was Uday facing?",
        options: ["South","North","East","West"],
        correct: 1,
        explanation: "Morning shadows fall West; if West is to Uday's left, Uday must be looking North."
    },
    {
        question: "Y is in the East of X which is in the North of Z. If P is in the South of Z, then in which direction is P relative to Y?",
        options: ["North-East","South-East","South-West","North-West"],
        correct: 2,
        explanation: "Y is above and to the right of Z, and P is below Z, making P physically located to the bottom-left, or South-West, of Y."
    },
    {
        question: "If South-East becomes North, and North-East becomes West and so on, what will West become?",
        options: ["South-East","North-West","North-East","South-West"],
        correct: 0,
        explanation: "The entire compass is rotated 135 degrees anti-clockwise, meaning the original West position now points to South-East."
    },
    {
        question: "A man is facing North-West. He turns 90 degrees clockwise, then 180 degrees anticlockwise, and then another 90 degrees anticlockwise. Which direction is he facing now?",
        options: ["North-East","North-West","South-West","South-East"],
        correct: 3,
        explanation: "His total rotation is 180 degrees anticlockwise (90 CW - 180 ACW - 90 ACW = -180), turning him completely around to face South-East."
    },
    {
        question: "A child goes 90 m East, turns right and goes 20 m, turns right again and goes 30 m, and finally goes 100 m North to meet his father. What is the shortest distance from the start to the meeting point?",
        options: ["60 m","80 m","100 m","120 m"],
        correct: 2,
        explanation: "Using the Pythagorean theorem on his net displacement of 60 m East and 80 m North yields a straight-line distance of 100 m."
    },
    {
        question: "X started to walk straight towards South. After walking 5 m he turned to the left and walked 3 m. After this he turned to the right and walked 5 m. Which direction is X facing now?",
        options: ["North","East","South","West"],
        correct: 2,
        explanation: "He started facing South, turned East (left), and then turned South (right) again, so his final facing direction remains South."
    },
    {
        question: "Hemant walks 30 m North, turns right and walks 40 m, turns right again and walks 50 m, turns left and walks 20 m, and finally turns left and walks 20 m. How far is he from his original position?",
        options: ["60 m","50 m","40 m","30 m"],
        correct: 0,
        explanation: "His North/South movements completely cancel out (30 - 50 + 20 = 0), leaving only his Eastward movements of 40 m + 20 m = 60 m."
    },
    {
        question: "A tourist drives 10 km East, turns right and drives 3 km, turns right and drives 3 km, turns left and drives 2 km, and finally turns right and travels 7 km. How far is he from his starting point and in which direction?",
        options: ["5 km North","10 km South","7 km East","5 km South"],
        correct: 3,
        explanation: "His horizontal movements cancel out (10E - 3W - 7W = 0), leaving only his vertical movements of 3 km South + 2 km South = 5 km South."
    },
    {
        question: "A girl is facing East. She turns 100 degrees in the clockwise direction and then 145 degrees in the anticlockwise direction. Which direction is she facing now?",
        options: ["North-West","North-East","South-West","South-East"],
        correct: 1,
        explanation: "The net rotation is 45 degrees anticlockwise from East, which places her facing perfectly North-East."
    },
    {
        question: "Two buses start from opposite ends of a 150 km road. Bus A runs 25 km, turns right for 15 km, turns left for 25 km, and returns to the main road. Bus B runs only 35 km along the road. What is the distance between them?",
        options: ["35 km","55 km","65 km","85 km"],
        correct: 2,
        explanation: "Bus A has advanced 50 km linearly and Bus B 35 km, so they have covered 85 km of the 150 km gap, leaving exactly 65 km between them."
    },
    {
        question: "P walks 15 km towards South, turns left and walks 20 km, and turns left again and walks 15 km. In which direction is he now from his starting position?",
        options: ["East","West","North","South"],
        correct: 0,
        explanation: "The two 15 km vertical walks cancel each other out, leaving him exactly 20 km to the East of his starting origin."
    },
    {
        question: "Lokesh went 15 km to the North, turned west and covered 10 km, turned south and covered 5 km, and finally turned east and covered 10 km. In which direction is he from his house?",
        options: ["South","North","East","West"],
        correct: 1,
        explanation: "His West and East movements of 10 km cancel out, and 15 km North minus 5 km South leaves him 10 km strictly North of his house."
    },
    {
        question: "If A is to the south of B and C is to the east of B, in what direction is A with respect to C?",
        options: ["North-East","North-West","South-West","South-East"],
        correct: 2,
        explanation: "B acts as an origin where C is on the right (East) and A is at the bottom (South), meaning looking from C back to A is looking down and left, or South-West."
    },
    {
        question: "An ant moves 8 cm towards East and then 6 cm towards North. What is the shortest distance between its starting point and current position?",
        options: ["10 cm","12 cm","14 cm","16 cm"],
        correct: 0,
        explanation: "This forms a classic 3-4-5 right-angled triangle scaled by two, making the hypotenuse exactly 10 cm."
    },
    {
        question: "A river flows West to East, turns left to go in a semi-circle round a hillock, and then turns left at right angles. In what direction is the river finally flowing?",
        options: ["North","South","West","East"],
        correct: 1,
        explanation: "Moving East, completing a left semi-circle points the river West, and a final 90-degree left turn directs the river South."
    },
    {
        question: "A drone flies 50 m North, turns East and flies 80 m, then turns South and flies 50 m. How far and in which direction is the drone from its starting point?",
        options: ["50 m East","80 m East","80 m West","50 m North"],
        correct: 1,
        explanation: "The 50 m North and South flights negate each other, leaving the drone resting exactly 80 m directly East of the launch site."
    },
    {
        question: "Pointing to a landmark, a guide says, 'Go 5 km South, then 3 km East, then 5 km North.' Where does this path lead relative to the starting point?",
        options: ["5 km North","3 km West","3 km East","5 km South"],
        correct: 2,
        explanation: "The vertical directions cancel out entirely, creating a geometric rectangle that ends exactly 3 km to the East."
    },
    {
        question: "During a game, player A is 40 m South-West of player B. Player C is 40 m South-East of player B. In which direction is C with respect to A?",
        options: ["East","West","North","South"],
        correct: 0,
        explanation: "Because both players are precisely 40 m South of B on the vertical axis, C is purely on a horizontal line to the right (East) of A."
    },
    {
        question: "At 6:15, the minute hand points towards East. In which direction will the hour hand point at 9:00?",
        options: ["North","South","East","West"],
        correct: 3,
        explanation: "At 6:15, the minute hand is on the 3 (East), meaning the clock face is oriented normally; thus, at 9:00, the hour hand pointing at the 9 will naturally face West."
    },
    {
        question: "A delivery bot travels 12 blocks North, 5 blocks East, and then 12 blocks South. How far is it from the starting point?",
        options: ["12 blocks","5 blocks","7 blocks","17 blocks"],
        correct: 1,
        explanation: "The North and South travel perfectly cancel out to zero, leaving the robot's net displacement at just 5 blocks East."
    },
    {
        question: "A ship navigates 20 nautical miles West, turns right and travels 15 nautical miles, then turns right again and travels 20 nautical miles. Which direction is the ship facing now?",
        options: ["North","South","East","West"],
        correct: 2,
        explanation: "Starting West, two consecutive 90-degree right turns flip the heading exactly 180 degrees, pointing the ship East."
    },
    {
        question: "A hiker goes 4 km East, turns North and walks 3 km. What is the straight-line distance to the starting point?",
        options: ["5 km","7 km","1 km","6 km"],
        correct: 0,
        explanation: "The path creates a standard 3-4-5 right-angled triangle, making the hypotenuse (straight-line distance) precisely 5 km."
    },
    {
        question: "If South-West becomes East, what will North-West become?",
        options: ["North","East","West","South"],
        correct: 3,
        explanation: "South-West rotating to East is a 135-degree anti-clockwise shift, so shifting North-West by 135 degrees anti-clockwise results in South."
    },
    {
        question: "A person walks 10 m towards the South, turns to the left and walks 15 m, then turns to the right and walks 10 m. In which direction is he from the starting point?",
        options: ["North-East","South-East","South-West","North-West"],
        correct: 1,
        explanation: "He travels a net distance of 20 m South and 15 m East, placing his final coordinates in the South-East quadrant."
    },
    {
        question: "Facing North, John turns 45 degrees clockwise, then 135 degrees counter-clockwise, then 90 degrees clockwise. Which direction is he facing now?",
        options: ["South","East","North","West"],
        correct: 2,
        explanation: "The total rotation mathematically equals zero (+45 - 135 + 90 = 0), returning him exactly to his original Northern heading."
    },
    {
        question: "A car drives 40 miles West, then turns South and drives 30 miles. What is the shortest distance back to the starting point?",
        options: ["50 miles","70 miles","10 miles","30 miles"],
        correct: 0,
        explanation: "Applying the Pythagorean theorem reveals the shortest diagonal path back is exactly 50 miles."
    },
    {
        question: "If a compass is damaged so that North points to West, where will South-East point?",
        options: ["North-West","South-West","South","North-East"],
        correct: 3,
        explanation: "North becoming West implies a 90-degree anti-clockwise rotation of the dial, meaning South-East will rotate 90 degrees to point North-East."
    },
    {
        question: "Starting from her office, Meera walks 20 m South, turns right and walks 15 m, turns left and walks 15 m, then turns left and walks 15 m. How far is she from her office?",
        options: ["20 m","35 m","15 m","50 m"],
        correct: 1,
        explanation: "The horizontal left and right 15 m walks cancel each other out, leaving her directly South by 20 m + 15 m = 35 m."
    },
    {
        question: "One evening, Ravi and Sumit were talking facing each other. If Sumit's shadow fell exactly to his left, which direction was Ravi facing?",
        options: ["North","East","South","West"],
        correct: 2,
        explanation: "In the evening, shadows point East; if East is to Sumit's left, Sumit faces North, which means Ravi faces South to look at him."
    },
    {
        question: "A dog runs 5 m East, then turns right and runs 12 m. What is the shortest distance from the starting point?",
        options: ["13 m","17 m","7 m","12 m"],
        correct: 0,
        explanation: "This follows a Pythagorean triple, making the straight-line distance exactly 13 m."
    },
    {
        question: "A bird flies 10 km North, 5 km East, 10 km South, and 5 km West. Where is it relative to its starting point?",
        options: ["5 km North","10 km South","5 km East","At the starting point"],
        correct: 3,
        explanation: "Every directional movement is perfectly mirrored and canceled by an equal movement in the exact opposite direction."
    },
    {
        question: "Point X is 5 m West of Point Y. Point Z is 5 m North of Point Y. What is the direction of X from Z?",
        options: ["South-East","South-West","North-East","North-West"],
        correct: 1,
        explanation: "Since Z is above Y and X is to the left of Y, looking from the top point (Z) down to the left point (X) is looking South-West."
    },
    {
        question: "A marathon runner goes 15 km South, then 20 km East, then 15 km North. How far and in which direction is he from the starting point?",
        options: ["15 km North","20 km West","20 km East","15 km South"],
        correct: 2,
        explanation: "The runner completes three sides of a rectangle, bringing him exactly back to his starting horizontal line, resting 20 km to the East."
    },
    {
        question: "An airplane takes off and flies 100 km North, turns East and flies 150 km, then turns South and flies 100 km. How far is the airplane from the runway?",
        options: ["100 km","150 km","200 km","250 km"],
        correct: 1,
        explanation: "The North and South flight segments are completely negated, leaving the plane's net displacement exactly equal to its 150 km Eastward leg."
    }
];
