import { Question } from "../aptitudeQuestions";

export const clocksCalendarsQuestions: Question[] = [
    {
        question: "What is the angle between the hour hand and the minute hand of a clock at 3:30?",
        options: ["105°","90°","75°","60°"],
        correct: 2,
        explanation: "Using the formula |30H - 5.5M|, we get |30(3) - 5.5(30)| = |90 - 165| = 75°."
    },
    {
        question: "If today is Monday, what day of the week will it be after 61 days?",
        options: ["Saturday","Sunday","Tuesday","Wednesday"],
        correct: 0,
        explanation: "Dividing 61 by 7 gives a remainder of 5 odd days, and 5 days after Monday is Saturday."
    },
    {
        question: "At what time between 4 o'clock and 5 o'clock will the hands of a clock be together?",
        options: ["21 9/11 minutes past 4","22 minutes past 4","20 5/11 minutes past 4","23 2/11 minutes past 4"],
        correct: 0,
        explanation: "The minute hand must gain 20 minute spaces over the hour hand, which takes 20 × (12/11) = 240/11 = 21 9/11 minutes."
    },
    {
        question: "The calendar for the year 2005 is the same as for which year?",
        options: ["2010","2011","2012","2013"],
        correct: 1,
        explanation: "The year 2005 is 1 year after a leap year (2004), so its calendar repeats after 6 years (2005 + 6 = 2011)."
    },
    {
        question: "What is the angle between the hands of a clock at 8:20?",
        options: ["120°","140°","130°","150°"],
        correct: 2,
        explanation: "Using the formula |30(8) - 5.5(20)| = |240 - 110| = 130°."
    },
    {
        question: "How many times are the hands of a clock at right angles in a day?",
        options: ["48","44","24","22"],
        correct: 1,
        explanation: "The hands are at right angles 22 times in 12 hours, so in 24 hours, they are at right angles 44 times."
    },
    {
        question: "If January 1, 2007, was a Monday, what day of the week lies on January 1, 2008?",
        options: ["Monday","Wednesday","Sunday","Tuesday"],
        correct: 3,
        explanation: "The year 2007 is an ordinary year with 1 odd day, so the next year starts one day later on a Tuesday."
    },
    {
        question: "Looking into a mirror, a clock shows 9:30 as the time. What is the actual time?",
        options: ["3:30","2:30","4:30","2:45"],
        correct: 1,
        explanation: "To find the real time from a mirror image, subtract the given time from 11:60, which gives 11:60 - 9:30 = 2:30."
    },
    {
        question: "How many odd days are there in 100 years?",
        options: ["3","5","7","1"],
        correct: 1,
        explanation: "100 years contain 76 ordinary years and 24 leap years, resulting in (76×1) + (24×2) = 124 odd days, which is 5 odd days when divided by 7."
    },
    {
        question: "At what time between 9 and 10 o'clock will the hands of a watch be together?",
        options: ["45 minutes past 9","50 minutes past 9","49 1/11 minutes past 9","48 2/11 minutes past 9"],
        correct: 2,
        explanation: "The minute hand must gain 45 spaces, which takes 45 × (12/11) = 540/11 = 49 1/11 minutes."
    },
    {
        question: "Which of the following is not a leap year?",
        options: ["1200","2000","700","800"],
        correct: 2,
        explanation: "For century years to be leap years, they must be divisible by 400, and 700 is not divisible by 400."
    },
    {
        question: "What is the angle between the hands of a clock at 10:25?",
        options: ["162.5°","150°","180°","175.5°"],
        correct: 0,
        explanation: "Using |30(10) - 5.5(25)| = |300 - 137.5| = 162.5°."
    },
    {
        question: "If it was Sunday on January 1, 2006, what was the day of the week on January 1, 2010?",
        options: ["Friday","Thursday","Saturday","Wednesday"],
        correct: 0,
        explanation: "From 2006 to 2010 there are 4 years, including one leap year (2008), adding up to 5 odd days (Sunday + 5 = Friday)."
    },
    {
        question: "How many times do the hands of a clock coincide in a day?",
        options: ["24","20","22","12"],
        correct: 2,
        explanation: "The hands coincide 11 times in every 12 hours (missing the 12:00 mark once), totaling 22 times in 24 hours."
    },
    {
        question: "The calendar for the year 2007 will be the same for the year:",
        options: ["2014","2018","2016","2017"],
        correct: 1,
        explanation: "2007 is 3 years after a leap year, so the calendar repeats after 11 years (2007 + 11 = 2018)."
    },
    {
        question: "Find the angle between the hour hand and the minute hand of a clock when the time is 4:10.",
        options: ["60°","65°","70°","55°"],
        correct: 1,
        explanation: "Using |30(4) - 5.5(10)| = |120 - 55| = 65°."
    },
    {
        question: "What was the day of the week on August 15, 1947?",
        options: ["Friday","Thursday","Wednesday","Saturday"],
        correct: 0,
        explanation: "Calculating odd days up to 1946 (1 odd day) plus odd days from Jan to Aug 15 in 1947 (4 odd days) totals 5 odd days, which corresponds to Friday."
    },
    {
        question: "A clock is set right at 5 AM. The clock loses 16 minutes in 24 hours. What will be the true time when the clock indicates 10 PM on the 4th day?",
        options: ["11 PM","9 PM","10 PM","12 Midnight"],
        correct: 0,
        explanation: "The faulty clock shows 89 hours when it should show 90 hours, meaning when the faulty clock reaches 10 PM, the true time is exactly 11 PM."
    },
    {
        question: "How many days are there in x weeks and x days?",
        options: ["7x^2","8x","14x","7"],
        correct: 1,
        explanation: "There are 7 days in a week, so x weeks is 7x days. Adding x days gives 7x + x = 8x days."
    },
    {
        question: "Looking into a mirror, a clock shows 12:15. What is the actual time?",
        options: ["11:45","1:15","12:45","11:15"],
        correct: 0,
        explanation: "For times between 11:00 and 1:00, subtract from 23:60. 23:60 - 12:15 = 11:45."
    },
    {
        question: "What is the angle between the hands of a clock at 2:30?",
        options: ["120°","115°","105°","95°"],
        correct: 2,
        explanation: "Using |30(2) - 5.5(30)| = |60 - 165| = 105°."
    },
    {
        question: "How many odd days are there in a leap year?",
        options: ["0","1","2","3"],
        correct: 2,
        explanation: "A leap year has 366 days. Dividing 366 by 7 gives 52 weeks and a remainder of 2 odd days."
    },
    {
        question: "At what time between 7 and 8 o'clock will the hands of a clock be in a straight line but not together?",
        options: ["5 5/11 minutes past 7","5 minutes past 7","6 3/11 minutes past 7","4 2/11 minutes past 7"],
        correct: 0,
        explanation: "The hands must be 30 minute spaces apart. The minute hand must gain 5 spaces, which takes 5 × (12/11) = 60/11 = 5 5/11 minutes."
    },
    {
        question: "The last day of a century cannot be:",
        options: ["Wednesday","Tuesday","Friday","Monday"],
        correct: 1,
        explanation: "100 years have 5 odd days (Friday), 200 have 3 (Wednesday), 300 have 1 (Monday), and 400 have 0 (Sunday); Tuesday, Thursday, and Saturday are impossible."
    },
    {
        question: "What is the reflex angle between the hands of a clock at 10:25?",
        options: ["197.5°","180°","195°","192.5°"],
        correct: 0,
        explanation: "The internal angle is |300 - 137.5| = 162.5°. The reflex angle is 360° - 162.5° = 197.5°."
    },
    {
        question: "On what dates of April 2001 did Wednesday fall?",
        options: ["2nd, 9th, 16th, 23rd","3rd, 10th, 17th, 24th","4th, 11th, 18th, 25th","1st, 8th, 15th, 22nd"],
        correct: 2,
        explanation: "April 1, 2001, was a Sunday. Therefore, the first Wednesday was on April 4, followed by 11th, 18th, and 25th."
    },
    {
        question: "How many times in a day are the hands of a clock pointing opposite to each other?",
        options: ["22","24","44","48"],
        correct: 0,
        explanation: "The hands point in opposite directions 11 times in every 12 hours (missing the 6:00 mark once), making it 22 times in a day."
    },
    {
        question: "The calendar for the year 2024 will be the same for the year:",
        options: ["2035","2052","2044","2040"],
        correct: 1,
        explanation: "2024 is a leap year. A leap year calendar always repeats after exactly 28 years (2024 + 28 = 2052)."
    },
    {
        question: "Find the angle between the hour hand and the minute hand of a clock at 5:15.",
        options: ["67.5°","70°","65°","72.5°"],
        correct: 0,
        explanation: "Using |30(5) - 5.5(15)| = |150 - 82.5| = 67.5°."
    },
    {
        question: "Which of the following years had 366 days?",
        options: ["1900","2100","2012","2014"],
        correct: 2,
        explanation: "A leap year has 366 days. 2012 is divisible by 4, making it a leap year, whereas 1900 and 2100 are not divisible by 400."
    },
    {
        question: "A clock gains 5 minutes every hour. If it is set right at 8 AM, what time will it show at 8 PM on the same day?",
        options: ["9:00 PM","8:30 PM","8:45 PM","9:30 PM"],
        correct: 0,
        explanation: "From 8 AM to 8 PM is 12 hours. It gains 5 minutes per hour, so it gains 12 × 5 = 60 minutes (1 hour). It will show 9 PM."
    },
    {
        question: "Today is Tuesday. After 62 days it will be:",
        options: ["Sunday","Monday","Wednesday","Thursday"],
        correct: 1,
        explanation: "Dividing 62 by 7 leaves a remainder of 6 odd days. 6 days after Tuesday is Monday."
    },
    {
        question: "At what time between 2 and 3 o'clock will the hands of a clock point in opposite directions?",
        options: ["43 7/11 minutes past 2","42 5/11 minutes past 2","41 3/11 minutes past 2","40 1/11 minutes past 2"],
        correct: 0,
        explanation: "The minute hand must gain 40 spaces to be opposite. 40 × (12/11) = 480/11 = 43 7/11 minutes."
    },
    {
        question: "The calendar for the year 2003 will serve for the year:",
        options: ["2009","2014","2010","2012"],
        correct: 1,
        explanation: "2003 is 3 years after a leap year (2000), so the calendar repeats after 11 years (2003 + 11 = 2014)."
    },
    {
        question: "What is the angle between the hands of a clock at 1:10?",
        options: ["30°","35°","25°","20°"],
        correct: 2,
        explanation: "Using |30(1) - 5.5(10)| = |30 - 55| = 25°."
    },
    {
        question: "If the 3rd of a month falls on a Friday, what day will be on the 21st of that month?",
        options: ["Tuesday","Thursday","Monday","Wednesday"],
        correct: 0,
        explanation: "The difference in days is 21 - 3 = 18 days. 18 / 7 leaves 4 odd days. Friday + 4 days is Tuesday."
    },
    {
        question: "How many degrees does the minute hand of a clock sweep in 20 minutes?",
        options: ["120°","100°","90°","150°"],
        correct: 0,
        explanation: "The minute hand moves 6° per minute. In 20 minutes, it moves 20 × 6 = 120°."
    },
    {
        question: "If November 1 falls on a Monday, what day of the week will be November 25?",
        options: ["Wednesday","Friday","Thursday","Saturday"],
        correct: 2,
        explanation: "The difference is 24 days. 24 / 7 gives 3 odd days. Monday + 3 days is Thursday."
    },
    {
        question: "At what time between 5 and 6 o'clock are the hands of a clock 3 minutes apart?",
        options: ["24 minutes past 5","26 minutes past 5","25 minutes past 5","27 minutes past 5"],
        correct: 0,
        explanation: "At 5 o'clock, they are 25 spaces apart. To be 3 spaces apart, the minute hand must gain 22 spaces. 22 × (12/11) = 24 minutes past 5."
    },
    {
        question: "What day of the week was May 28, 2006?",
        options: ["Monday","Sunday","Saturday","Tuesday"],
        correct: 1,
        explanation: "Calculating total odd days up to 2005 (5 days) plus odd days to May 28 (2 odd days) gives 7 odd days, which means 0, representing Sunday."
    },
    {
        question: "What is the angle between the hands of a clock at 7:20?",
        options: ["90°","100°","110°","80°"],
        correct: 1,
        explanation: "Using |30(7) - 5.5(20)| = |210 - 110| = 100°."
    },
    {
        question: "If a year consists of 365 days, what is the maximum number of Sundays it can have?",
        options: ["53","52","54","51"],
        correct: 0,
        explanation: "365 days is 52 full weeks and 1 odd day. If the year starts on a Sunday, that single odd day at the end makes 53 Sundays."
    },
    {
        question: "An accurate clock shows 8 o'clock in the morning. Through how many degrees will the hour hand rotate when the clock shows 2 o'clock in the afternoon?",
        options: ["150°","180°","144°","168°"],
        correct: 1,
        explanation: "From 8 AM to 2 PM is 6 hours. The hour hand moves 30° per hour, so 6 × 30° = 180°."
    },
    {
        question: "Which of the following years has the same calendar as 1990?",
        options: ["1997","2001","1996","2000"],
        correct: 1,
        explanation: "1990 is 2 years after a leap year (1988), so its calendar repeats after 11 years (1990 + 11 = 2001)."
    },
    {
        question: "Looking into a mirror, a clock shows 3:40 as the time. What is the actual time?",
        options: ["8:20","9:20","8:40","7:20"],
        correct: 0,
        explanation: "Subtract the mirror time from 11:60 to get the actual time: 11:60 - 3:40 = 8:20."
    },
    {
        question: "If February 1, 1996, was a Wednesday, what day was March 3, 1996?",
        options: ["Friday","Saturday","Thursday","Sunday"],
        correct: 1,
        explanation: "1996 is a leap year, so Feb has 29 days. 28 days left in Feb + 3 in March = 31 days. 31 / 7 leaves 3 odd days. Wednesday + 3 is Saturday."
    },
    {
        question: "At what time between 8 and 9 o'clock will the hands of a clock be at right angles?",
        options: ["27 3/11 minutes past 8","26 4/11 minutes past 8","25 1/11 minutes past 8","28 5/11 minutes past 8"],
        correct: 0,
        explanation: "The minute hand must gain 25 spaces to be 15 minutes behind the hour hand. 25 × (12/11) = 300/11 = 27 3/11 minutes."
    },
    {
        question: "What is the day of the week on June 5, 2023?",
        options: ["Monday","Tuesday","Sunday","Wednesday"],
        correct: 0,
        explanation: "Using odd day calculations for 2022 (1 odd day) plus months up to June 5 gives 1 odd day total, which corresponds to Monday."
    },
    {
        question: "Find the reflex angle between the hands of a clock at 9:15.",
        options: ["172.5°","187.5°","195°","165.5°"],
        correct: 1,
        explanation: "Using the formula |30(9) - 5.5(15)| = |270 - 82.5| = 187.5°. Since this is already greater than 180°, it is the reflex angle."
    },
    {
        question: "A clock strikes once at 1 o'clock, twice at 2 o'clock, etc. How many times will it strike in a 24-hour period?",
        options: ["156","144","78","168"],
        correct: 0,
        explanation: "Strikes in 12 hours = 1 + 2 + ... + 12 = 12(13)/2 = 78. In 24 hours, it strikes 78 × 2 = 156 times."
    }
];
