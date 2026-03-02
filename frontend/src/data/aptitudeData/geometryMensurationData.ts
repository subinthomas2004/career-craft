import { Question } from "../aptitudeQuestions";

export const geometryMensurationQuestions: Question[] = [
    {
        question: "The length and breadth of a rectangle are in the ratio 3:2. If its perimeter is 40 cm, what is its area?",
        options: ["96 sq cm","100 sq cm","84 sq cm","120 sq cm"],
        correct: 0,
        explanation: "The semi-perimeter is 20 cm, meaning 3x + 2x = 20 (so x = 4); the sides are 12 cm and 8 cm, giving an area of 12 * 8 = 96 sq cm."
    },
    {
        question: "What is the area of a circle whose circumference is 44 cm? (Use pi = 22/7)",
        options: ["144 sq cm","154 sq cm","164 sq cm","174 sq cm"],
        correct: 1,
        explanation: "From the circumference formula (2 * pi * r = 44), the radius is 7 cm, making the area pi * r^2 = (22/7) * 49 = 154 sq cm."
    },
    {
        question: "If the diagonal of a square is 10√2 cm, what is its perimeter?",
        options: ["20 cm","30 cm","40 cm","50 cm"],
        correct: 2,
        explanation: "The diagonal of a square is side * √2, meaning the side is 10 cm, which makes the perimeter 4 * 10 = 40 cm."
    },
    {
        question: "The base of a triangle is 15 cm and its height is 12 cm. What is the area of the triangle?",
        options: ["180 sq cm","120 sq cm","90 sq cm","60 sq cm"],
        correct: 2,
        explanation: "The area of a triangle is half the product of its base and height: 0.5 * 15 * 12 = 90 sq cm."
    },
    {
        question: "What is the total surface area of a cube whose edge is 6 cm?",
        options: ["144 sq cm","256 sq cm","216 sq cm","128 sq cm"],
        correct: 2,
        explanation: "The total surface area of a cube is 6 * side^2, which equals 6 * 36 = 216 sq cm."
    },
    {
        question: "The diagonals of a rhombus are 16 cm and 12 cm. What is its area?",
        options: ["96 sq cm","192 sq cm","108 sq cm","144 sq cm"],
        correct: 0,
        explanation: "The area of a rhombus is half the product of its diagonals: 0.5 * 16 * 12 = 96 sq cm."
    },
    {
        question: "The volume of a cuboid is 480 cubic cm. If its base area is 60 sq cm, what is its height?",
        options: ["6 cm","8 cm","10 cm","12 cm"],
        correct: 1,
        explanation: "Volume is the product of base area and height, so dividing the volume (480) by the base area (60) yields a height of 8 cm."
    },
    {
        question: "What is the volume of a right circular cylinder with radius 7 cm and height 10 cm? (Use pi = 22/7)",
        options: ["1440 cubic cm","1540 cubic cm","1640 cubic cm","1740 cubic cm"],
        correct: 1,
        explanation: "The volume of a cylinder is pi * r^2 * h, which equals (22/7) * 49 * 10 = 1540 cubic cm."
    },
    {
        question: "If the radius of a circle is doubled, by what factor does its area increase?",
        options: ["2 times","3 times","4 times","8 times"],
        correct: 2,
        explanation: "Because the area formula (pi * r^2) squares the radius, doubling the radius results in a 2^2 = 4 times increase in area."
    },
    {
        question: "The parallel sides of a trapezium are 10 cm and 14 cm, and the distance between them is 8 cm. What is its area?",
        options: ["96 sq cm","106 sq cm","86 sq cm","192 sq cm"],
        correct: 0,
        explanation: "The area is half the sum of parallel sides multiplied by the height: 0.5 * (10 + 14) * 8 = 96 sq cm."
    },
    {
        question: "What is the curved surface area of a hemisphere with a radius of 7 cm? (Use pi = 22/7)",
        options: ["462 sq cm","308 sq cm","154 sq cm","616 sq cm"],
        correct: 1,
        explanation: "The curved surface area of a hemisphere is 2 * pi * r^2, which calculates to 2 * (22/7) * 49 = 308 sq cm."
    },
    {
        question: "A room is 10 m long, 8 m wide, and 5 m high. What is the length of the longest pole that can be placed in it?",
        options: ["13 m","15 m","√189 m","√164 m"],
        correct: 2,
        explanation: "The longest pole matches the body diagonal of the cuboid, calculated as √(l^2 + b^2 + h^2) = √(100 + 64 + 25) = √189 m."
    },
    {
        question: "If the angles of a triangle are in the ratio 2:3:4, what is the measure of the largest angle?",
        options: ["60 degrees","80 degrees","100 degrees","120 degrees"],
        correct: 1,
        explanation: "The sum of the ratio parts is 9, corresponding to 180 degrees, so 1 part is 20 degrees, making the largest angle 4 * 20 = 80 degrees."
    },
    {
        question: "A right-angled triangle has a base of 8 cm and a hypotenuse of 10 cm. What is its area?",
        options: ["24 sq cm","30 sq cm","40 sq cm","48 sq cm"],
        correct: 0,
        explanation: "Using Pythagoras theorem, the height is √(10^2 - 8^2) = 6 cm, making the area 0.5 * 8 * 6 = 24 sq cm."
    },
    {
        question: "The ratio of the radii of two circles is 3:4. What is the ratio of their circumferences?",
        options: ["9:16","4:3","3:4","16:9"],
        correct: 2,
        explanation: "Circumference is directly proportional to the radius, so the ratio remains 3:4."
    },
    {
        question: "What is the volume of a sphere with a radius of 3 cm?",
        options: ["27pi cubic cm","36pi cubic cm","18pi cubic cm","54pi cubic cm"],
        correct: 1,
        explanation: "The volume of a sphere is (4/3) * pi * r^3, which equals (4/3) * pi * 27 = 36pi cubic cm."
    },
    {
        question: "If the perimeter of a rectangle is equal to the perimeter of a square with side 10 cm, and the rectangle's length is 12 cm, what is its breadth?",
        options: ["6 cm","8 cm","10 cm","12 cm"],
        correct: 1,
        explanation: "The perimeter of the square is 40 cm; for the rectangle, 2(12 + b) = 40, which simplifies to 12 + b = 20, making b = 8 cm."
    },
    {
        question: "Find the area of an equilateral triangle with a side length of 6 cm.",
        options: ["9√3 sq cm","18√3 sq cm","12√3 sq cm","36 sq cm"],
        correct: 0,
        explanation: "The area of an equilateral triangle is (√3/4) * side^2, which calculates to (√3/4) * 36 = 9√3 sq cm."
    },
    {
        question: "A cone has a radius of 5 cm and a slant height of 13 cm. What is its volume?",
        options: ["100pi cubic cm","120pi cubic cm","65pi cubic cm","130pi cubic cm"],
        correct: 0,
        explanation: "The true height is found via Pythagoras theorem as √(13^2 - 5^2) = 12 cm, making the volume (1/3) * pi * 25 * 12 = 100pi cubic cm."
    },
    {
        question: "The interior angle of a regular polygon is 108 degrees. How many sides does it have?",
        options: ["5","6","8","10"],
        correct: 0,
        explanation: "The exterior angle is 180 - 108 = 72 degrees; since the sum of exterior angles is 360, the number of sides is 360 / 72 = 5."
    },
    {
        question: "If the side of a square is increased by 20%, by what percentage does its area increase?",
        options: ["20%","40%","44%","100%"],
        correct: 2,
        explanation: "If the side becomes 1.2 times the original, the new area becomes (1.2)^2 = 1.44 times the original, representing a 44% increase."
    },
    {
        question: "A wire can be bent into a square of area 121 sq cm. If the same wire is bent into a circle, what is its radius? (Use pi = 22/7)",
        options: ["7 cm","11 cm","14 cm","21 cm"],
        correct: 0,
        explanation: "The square's side is 11 cm, making the wire's length (perimeter) 44 cm; for the circle, 2 * (22/7) * r = 44, so r = 7 cm."
    },
    {
        question: "What is the area of a sector of a circle with radius 6 cm and an angle of 60 degrees?",
        options: ["6pi sq cm","12pi sq cm","18pi sq cm","36pi sq cm"],
        correct: 0,
        explanation: "The area of a sector is (angle/360) * pi * r^2, which is (60/360) * pi * 36 = 6pi sq cm."
    },
    {
        question: "The sum of two adjacent angles on a straight line is 180 degrees. If one angle is 3x + 10 and the other is 2x - 5, what is the value of x?",
        options: ["25","30","35","40"],
        correct: 2,
        explanation: "Adding them gives 5x + 5 = 180, which simplifies to 5x = 175, making x = 35."
    },
    {
        question: "What is the total surface area of a solid hemisphere of radius 7 cm? (Use pi = 22/7)",
        options: ["462 sq cm","308 sq cm","616 sq cm","154 sq cm"],
        correct: 0,
        explanation: "The total surface area of a solid hemisphere is 3 * pi * r^2, resulting in 3 * (22/7) * 49 = 462 sq cm."
    },
    {
        question: "The length of a rectangle is twice its breadth. If the area is 72 sq cm, what is the perimeter?",
        options: ["30 cm","36 cm","42 cm","48 cm"],
        correct: 1,
        explanation: "Let breadth be x; area is x * 2x = 2x^2 = 72, so x = 6; length is 12, making the perimeter 2(12 + 6) = 36 cm."
    },
    {
        question: "Two circles touch internally. The sum of their areas is 116pi sq cm and the distance between their centers is 6 cm. What is the radius of the larger circle?",
        options: ["8 cm","10 cm","12 cm","14 cm"],
        correct: 1,
        explanation: "Internal touch means R - r = 6, and R^2 + r^2 = 116; solving these equations reveals the radii are 10 cm and 4 cm."
    },
    {
        question: "Find the length of the diagonal of a rectangle whose length is 15 cm and breadth is 8 cm.",
        options: ["17 cm","19 cm","21 cm","23 cm"],
        correct: 0,
        explanation: "The diagonal forms a right triangle with the sides, so according to Pythagoras theorem, diagonal = √(15^2 + 8^2) = √289 = 17 cm."
    },
    {
        question: "A cylindrical tank has a capacity of 6160 cubic meters. If the radius of its base is 14 m, find its depth.",
        options: ["8 m","10 m","12 m","14 m"],
        correct: 1,
        explanation: "Volume = pi * r^2 * h, so 6160 = (22/7) * 196 * h; solving this yields h = 10 m."
    },
    {
        question: "In a triangle, the sides are 5 cm, 12 cm, and 13 cm. What is the length of the altitude drawn to the longest side?",
        options: ["4.6 cm","60/13 cm","5.5 cm","12/5 cm"],
        correct: 1,
        explanation: "Since it is a right triangle (5-12-13), area = 0.5 * 5 * 12 = 30; using the hypotenuse as base, area = 0.5 * 13 * altitude = 30, so altitude = 60/13 cm."
    },
    {
        question: "If three metallic solid cubes of sides 3 cm, 4 cm, and 5 cm are melted to form a single new cube, what is the side of the new cube?",
        options: ["6 cm","7 cm","8 cm","9 cm"],
        correct: 0,
        explanation: "The total volume is 3^3 + 4^3 + 5^3 = 27 + 64 + 125 = 216 cubic cm, which makes the side of the new cube ³√216 = 6 cm."
    },
    {
        question: "What is the area of a regular hexagon with a side length of 4 cm?",
        options: ["24√3 sq cm","16√3 sq cm","32√3 sq cm","12√3 sq cm"],
        correct: 0,
        explanation: "A regular hexagon is comprised of 6 equilateral triangles, so the area is 6 * (√3/4) * 4^2 = 24√3 sq cm."
    },
    {
        question: "The perimeter of a semicircular protractor is 36 cm. What is its diameter? (Use pi = 22/7)",
        options: ["7 cm","14 cm","21 cm","28 cm"],
        correct: 1,
        explanation: "Perimeter of a semicircle is pi*r + 2r = r(pi + 2); so r((22/7) + 2) = r(36/7) = 36, meaning r = 7 cm, making the diameter 14 cm."
    },
    {
        question: "A rectangle is 24 cm long and 10 cm wide. A circle is inscribed passing through all its four vertices. What is the radius of the circle?",
        options: ["13 cm","12 cm","26 cm","5 cm"],
        correct: 0,
        explanation: "The diagonal of the rectangle serves as the diameter of the circumscribed circle; diagonal = √(24^2 + 10^2) = 26 cm, so the radius is 13 cm."
    },
    {
        question: "What is the ratio of the volumes of two cylinders if their radii are in the ratio 2:3 and their heights are in the ratio 5:3?",
        options: ["10:9","20:27","4:9","10:27"],
        correct: 1,
        explanation: "Volume ratio is (r1/r2)^2 * (h1/h2) = (2/3)^2 * (5/3) = (4/9) * (5/3) = 20:27."
    },
    {
        question: "Two complementary angles are in the ratio 4:5. What is the measure of the smaller angle?",
        options: ["30 degrees","40 degrees","50 degrees","60 degrees"],
        correct: 1,
        explanation: "Complementary angles sum to 90 degrees; the 9 parts total 90, so 1 part is 10, making the smaller angle 4 * 10 = 40 degrees."
    },
    {
        question: "If the surface area of a sphere is 616 sq cm, what is its radius? (Use pi = 22/7)",
        options: ["7 cm","14 cm","21 cm","3.5 cm"],
        correct: 0,
        explanation: "Surface area is 4 * pi * r^2, so 4 * (22/7) * r^2 = 616, simplifying to r^2 = 49, meaning r = 7 cm."
    },
    {
        question: "The diagonal of a cube is 6√3 cm. What is its volume?",
        options: ["144 cubic cm","216 cubic cm","512 cubic cm","343 cubic cm"],
        correct: 1,
        explanation: "The body diagonal of a cube is side * √3, so the side is 6 cm, resulting in a volume of 6^3 = 216 cubic cm."
    },
    {
        question: "A solid metallic cone of height 10 cm and radius of base 20 cm is melted to make spherical balls each of 4 cm diameter. How many balls can be made?",
        options: ["100","125","150","200"],
        correct: 1,
        explanation: "Volume of cone = (1/3)*pi*(20)^2*10; Volume of one ball (radius 2) = (4/3)*pi*(2)^3; dividing the cone's volume by the ball's volume yields 125."
    },
    {
        question: "If the length of a chord of a circle is 16 cm and it is at a distance of 6 cm from the center, what is the radius of the circle?",
        options: ["8 cm","10 cm","12 cm","14 cm"],
        correct: 1,
        explanation: "The perpendicular from the center bisects the chord (8 cm), forming a right triangle with the distance (6 cm); the radius is the hypotenuse: √(8^2 + 6^2) = 10 cm."
    },
    {
        question: "A square and an equilateral triangle have the same perimeter. If the diagonal of the square is 6√2 cm, what is the area of the triangle?",
        options: ["9√3 sq cm","16√3 sq cm","12√3 sq cm","24√3 sq cm"],
        correct: 1,
        explanation: "The square's side is 6 cm, making its perimeter 24 cm; the triangle's side is therefore 8 cm, giving an area of (√3/4) * 64 = 16√3 sq cm."
    },
    {
        question: "Find the area of a parallelogram whose base is 14 cm and altitude corresponding to that base is 9 cm.",
        options: ["63 sq cm","126 sq cm","112 sq cm","144 sq cm"],
        correct: 1,
        explanation: "The area of a parallelogram is simply the product of its base and altitude: 14 * 9 = 126 sq cm."
    },
    {
        question: "If the sum of interior angles of a regular polygon is 1080 degrees, what is the number of sides?",
        options: ["6","8","10","12"],
        correct: 1,
        explanation: "The sum of interior angles is (n - 2) * 180 = 1080; dividing by 180 gives n - 2 = 6, meaning n = 8 sides."
    },
    {
        question: "A cylinder and a cone have equal bases and equal heights. What is the ratio of their volumes?",
        options: ["1:3","3:1","1:1","2:1"],
        correct: 1,
        explanation: "The volume of a cylinder is pi * r^2 * h, while a cone is (1/3) * pi * r^2 * h, meaning the cylinder's volume is exactly 3 times that of the cone."
    },
    {
        question: "The perimeter of a rectangular field is 120 m and the difference between its adjacent sides is 10 m. What is its area?",
        options: ["875 sq m","800 sq m","900 sq m","925 sq m"],
        correct: 0,
        explanation: "L + B = 60 and L - B = 10, meaning L = 35 and B = 25; the area is 35 * 25 = 875 sq m."
    },
    {
        question: "What is the maximum length of a pencil that can be kept in a rectangular box of dimensions 8 cm x 6 cm x 2 cm?",
        options: ["10 cm","2√26 cm","12 cm","√108 cm"],
        correct: 1,
        explanation: "The maximum length is the body diagonal: √(8^2 + 6^2 + 2^2) = √(64 + 36 + 4) = √104 = 2√26 cm."
    },
    {
        question: "A bicycle wheel makes 5000 revolutions in moving 11 km. What is the diameter of the wheel?",
        options: ["70 cm","60 cm","80 cm","90 cm"],
        correct: 0,
        explanation: "Total distance is 1,100,000 cm; one revolution is 1,100,000 / 5000 = 220 cm (circumference); solving pi * d = 220 gives d = 70 cm."
    },
    {
        question: "If two corresponding angles of two triangles are equal, and the included sides are equal, the triangles are congruent by which criteria?",
        options: ["SSS","SAS","ASA","RHS"],
        correct: 2,
        explanation: "When two angles and the included side of one triangle equal the corresponding parts of another, it defines the Angle-Side-Angle (ASA) congruence criterion."
    },
    {
        question: "A right circular cone is cut parallel to its base to form a smaller cone at the top. The shape of the remaining bottom piece is called what?",
        options: ["Prism","Pyramid","Frustum","Sector"],
        correct: 2,
        explanation: "The portion of a cone or pyramid that remains after its upper part has been cut off by a plane parallel to its base is mathematically called a frustum."
    },
    {
        question: "What is the area of a circle inscribed inside a square of side 14 cm? (Use pi = 22/7)",
        options: ["196 sq cm","154 sq cm","308 sq cm","616 sq cm"],
        correct: 1,
        explanation: "The diameter of the inscribed circle equals the side of the square (14 cm), so the radius is 7 cm, yielding an area of pi * 7^2 = 154 sq cm."
    }
];
