import { Question } from "../aptitudeQuestions";

export const verbalReasoningQuestions: Question[] = [
    {
        question: "Statements: All cars are cats. All fans are cats. Conclusion: I. All cars are fans. II. Some fans are cars.",
        options: ["Only I follows","Only II follows","Neither I nor II follows","Both I and II follow"],
        correct: 2,
        explanation: "Since cars and fans are subsets of cats but have no direct relation to each other, neither conclusion can be logically guaranteed."
    },
    {
        question: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that language?",
        options: ["CPNCBX","CPNCBZ","CQOCBZ","DPNCBZ"],
        correct: 1,
        explanation: "Each letter in the word is shifted exactly one step forward in the alphabet (M->N, A->B, etc.), so BOMBAY becomes CPNCBZ."
    },
    {
        question: "Choose the word that is a necessary part of the underlined word: **Harvest**",
        options: ["Autumn","Crop","Tractor","Stockpile"],
        correct: 1,
        explanation: "A harvest cannot exist without a crop to gather, whereas autumn, tractors, and stockpiles are associated but not strictly necessary."
    },
    {
        question: "Arrange the words in a logical sequence: 1. Police 2. Punishment 3. Crime 4. Judge 5. Judgement",
        options: ["3, 1, 4, 5, 2","3, 1, 2, 4, 5","1, 2, 4, 3, 5","5, 4, 3, 2, 1"],
        correct: 0,
        explanation: "The logical order is a Crime occurring, Police investigating, the Judge presiding, delivering a Judgement, and finally administering Punishment."
    },
    {
        question: "Statement: 'You are hereby appointed as a programmer with a probation period of one year.' Assumption: I. The performance of a programmer is not known at the time of appointment. II. An individual is likely to prove his worth during probation.",
        options: ["Only I is implicit","Only II is implicit","Either I or II is implicit","Both I and II are implicit"],
        correct: 3,
        explanation: "Probation periods exist specifically because initial performance is unknown and the trial period gives the employee a chance to prove their capabilities."
    },
    {
        question: "Complete the analogy: Odometer is to mileage as compass is to...",
        options: ["Speed","Direction","Needle","Hiking"],
        correct: 1,
        explanation: "An odometer is an instrument used to measure mileage, just as a compass is an instrument used to determine direction."
    },
    {
        question: "If WATER is written as YCVGT, then what is written as HKTG?",
        options: ["FIRE","IRFE","FREE","FEAR"],
        correct: 0,
        explanation: "The code shifts each letter forward by two places (+2), so moving backward by two places (-2) from HKTG reveals the word FIRE."
    },
    {
        question: "Find the odd word out: Tulip, Rose, Daisy, Bud.",
        options: ["Tulip","Rose","Bud","Daisy"],
        correct: 2,
        explanation: "Tulip, Rose, and Daisy are specific types of flowers, whereas a bud is an early stage of any flower's development."
    },
    {
        question: "Statement: All mangoes are golden in color. No golden-colored things are cheap. Conclusion: I. All mangoes are cheap. II. Golden-colored mangoes are not cheap.",
        options: ["Only I follows","Only II follows","Neither I nor II follows","Both I and II follow"],
        correct: 1,
        explanation: "Since all mangoes are golden and no golden things are cheap, it logically follows that no mangoes (including golden ones) can be cheap."
    },
    {
        question: "Arrange logically: 1. Probation 2. Interview 3. Selection 4. Appointment 5. Advertisement",
        options: ["5, 2, 3, 4, 1","5, 3, 2, 4, 1","5, 4, 2, 3, 1","5, 2, 4, 3, 1"],
        correct: 0,
        explanation: "A job starts with an Advertisement, followed by an Interview, Selection, the formal Appointment, and finally the Probation period."
    },
    {
        question: "If 'white' is called 'blue', 'blue' is called 'red', and 'red' is called 'yellow', what is the color of human blood?",
        options: ["Red","Blue","Yellow","White"],
        correct: 2,
        explanation: "Human blood is red, and according to the given coding rule, 'red' is called 'yellow'."
    },
    {
        question: "Choose the word that is a necessary part of the underlined word: **Desert**",
        options: ["Cactus","Arid","Oasis","Camels"],
        correct: 1,
        explanation: "A desert is defined by its arid (dry) climate, while cacti, oases, and camels may or may not be present."
    },
    {
        question: "Statements: Some actors are singers. All singers are dancers. Conclusion: I. Some actors are dancers. II. No singer is an actor.",
        options: ["Only I follows","Only II follows","Either I or II follows","Neither I nor II follows"],
        correct: 0,
        explanation: "Since some actors are singers and all singers are dancers, the overlap guarantees that some actors must also be dancers."
    },
    {
        question: "Complete the analogy: Marathon is to race as hibernation is to...",
        options: ["Winter","Bear","Sleep","Dream"],
        correct: 2,
        explanation: "A marathon is a long, extended type of race, just as hibernation is a long, extended type of sleep."
    },
    {
        question: "If PALE is coded as 2134, EARTH is coded as 41590, how is PEARL coded in that language?",
        options: ["25413","24153","25430","24150"],
        correct: 1,
        explanation: "By matching letters to numbers directly from the examples (P=2, E=4, A=1, R=5, L=3), PEARL becomes 24153."
    },
    {
        question: "Find the odd one out: Circle, Arc, Radius, Diagonal.",
        options: ["Circle","Diagonal","Radius","Arc"],
        correct: 1,
        explanation: "A circle, arc, and radius are all terms exclusively related to circular geometry, while a diagonal relates to polygons."
    },
    {
        question: "Arrange logically: 1. Yarn 2. Plant 3. Saree 4. Cotton 5. Cloth",
        options: ["2, 4, 1, 5, 3","2, 4, 5, 1, 3","2, 5, 1, 4, 3","2, 4, 3, 5, 1"],
        correct: 0,
        explanation: "A Plant yields Cotton, which is spun into Yarn, woven into Cloth, and finally tailored into a Saree."
    },
    {
        question: "Statement: 'A warning in a train compartment says: Stopping the train by pulling the chain without a valid reason will invite a fine.' Assumption: I. People might pull the chain without a valid reason. II. Some passengers may want to stop the train.",
        options: ["Only I is implicit","Only II is implicit","Neither I nor II is implicit","Both I and II are implicit"],
        correct: 3,
        explanation: "The warning exists specifically because authorities assume people desire to stop the train and might do so frivolously without the threat of a fine."
    },
    {
        question: "Statements: All papers are pens. All pens are erasers. Conclusion: I. Some erasers are papers. II. All erasers are pens.",
        options: ["Only I follows","Only II follows","Both I and II follow","Neither I nor II follows"],
        correct: 0,
        explanation: "Since papers are nested inside pens, and pens inside erasers, some erasers must be papers, but not all erasers are pens."
    },
    {
        question: "Complete the analogy: Cup is to coffee as bowl is to...",
        options: ["Dish","Soup","Spoon","Food"],
        correct: 1,
        explanation: "A cup is a vessel primarily used to hold a liquid beverage like coffee, just as a bowl is used to hold a liquid meal like soup."
    },
    {
        question: "If in a code language, COULD is written as BNTKC and MARGIN is written as LZQFHM, how will MOULDING be written?",
        options: ["CHMFINTK","LNKTCHMF","LNTKCHMF","NITKHCMF"],
        correct: 2,
        explanation: "Each letter is shifted one position backward in the alphabet (-1), so MOULDING becomes LNTKCHMF."
    },
    {
        question: "Choose the word that is a necessary part of the underlined word: **Language**",
        options: ["Tongue","Slang","Words","Writing"],
        correct: 2,
        explanation: "A language fundamentally requires words (or signs/symbols acting as words) to function, whereas writing, slang, and a physical tongue are not strictly mandatory."
    },
    {
        question: "Arrange logically: 1. Key 2. Door 3. Lock 4. Room 5. Switch on",
        options: ["1, 3, 2, 4, 5","1, 2, 3, 5, 4","4, 2, 1, 5, 3","1, 2, 4, 3, 5"],
        correct: 0,
        explanation: "You take the Key to open the Lock, which opens the Door to enter the Room, where you finally Switch on the light."
    },
    {
        question: "Statement: 'If you want to study accounting, join Institute Y.' Assumption: I. Institute Y provides good accounting education. II. The listener wants to study accounting.",
        options: ["Only I is implicit","Only II is implicit","Both I and II are implicit","Neither I nor II is implicit"],
        correct: 0,
        explanation: "The speaker advises joining Institute Y under the assumption it is good, but the 'if' condition means they don't assume the listener definitely wants to study it."
    },
    {
        question: "Find the odd word out: Ginger, Onion, Beetroot, Coriander.",
        options: ["Ginger","Onion","Coriander","Beetroot"],
        correct: 2,
        explanation: "Ginger, onion, and beetroot are all modified roots or stems that grow underground, whereas coriander grows above ground."
    },
    {
        question: "Complete the analogy: Window is to pane as book is to...",
        options: ["Novel","Glass","Cover","Page"],
        correct: 3,
        explanation: "A window is made up of individual panes of glass, just as a book is made up of individual pages."
    },
    {
        question: "Statements: No door is dog. All the dogs are cats. Conclusion: I. No door is cat. II. No cat is door. III. Some cats are dogs.",
        options: ["Only I and II follow","Only III follows","Only II and III follow","All follow"],
        correct: 1,
        explanation: "Because all dogs are cats, some cats must be dogs; however, cats that aren't dogs could potentially be doors, so I and II do not logically follow."
    },
    {
        question: "If ROAST is coded as PQYUR in a certain language, how will SLOPPY be coded in that language?",
        options: ["QNMRNA","QNNRNA","QNMRNW","MNNQNA"],
        correct: 2,
        explanation: "The pattern alternates subtracting and adding 2 to the alphabetical positions (-2, +2, -2, +2, -2), which turns SLOPPY into QNMRNW."
    },
    {
        question: "Arrange logically: 1. Poverty 2. Population 3. Death 4. Unemployment 5. Disease",
        options: ["2, 4, 1, 5, 3","1, 2, 3, 4, 5","2, 3, 4, 5, 1","2, 4, 5, 1, 3"],
        correct: 0,
        explanation: "Overpopulation leads to Unemployment, which causes Poverty, resulting in Disease, and ultimately ending in Death."
    },
    {
        question: "Choose the word that is a necessary part of the underlined word: **Guitar**",
        options: ["Band","Teacher","Strings","Plectrum"],
        correct: 2,
        explanation: "A guitar is fundamentally a stringed instrument and cannot exist or function without strings, whereas a band, teacher, or plectrum are optional."
    },
    {
        question: "Statement: 'Buy pure and natural honey of company X.' - An advertisement. Assumption: I. Artificial honey can be prepared. II. People do not mind paying more for pure and natural honey.",
        options: ["Only I is implicit","Only II is implicit","Both I and II are implicit","Neither I nor II is implicit"],
        correct: 0,
        explanation: "The emphasis on 'pure and natural' implies the existence of impure or artificial alternatives in the market, but the statement says nothing about price."
    },
    {
        question: "Find the odd word out: Fear, Anger, Joy, Hunger.",
        options: ["Fear","Hunger","Anger","Joy"],
        correct: 1,
        explanation: "Fear, anger, and joy are psychological emotions, whereas hunger is a primary physiological need."
    },
    {
        question: "Complete the analogy: Elated is to despondent as enlightened is to...",
        options: ["Ignorant","Aware","Tolerant","Miserable"],
        correct: 0,
        explanation: "Elated and despondent are antonyms, just as enlightened (knowledgeable) and ignorant are antonyms."
    },
    {
        question: "Statements: Some desks are caps. No cap is red. Conclusion: I. Some caps are desks. II. No desk is red.",
        options: ["Only I follows","Only II follows","Both I and II follow","Neither I nor II follows"],
        correct: 0,
        explanation: "Because 'some desks are caps', the reverse 'some caps are desks' is always true; however, a desk could still be red if it isn't the specific part overlapping with a cap."
    },
    {
        question: "If SYSTEM is coded as SYSMET and NEARER as AENRER, then FRACTION will be coded as...",
        options: ["CRAFNOIT","CARFNOIT","NOITCARF","FRACNOIT"],
        correct: 1,
        explanation: "The word is split in half and both halves are reversed independently; reversing FRAC and TION gives CARFNOIT."
    },
    {
        question: "Arrange logically: 1. Frog 2. Eagle 3. Grasshopper 4. Snake 5. Grass",
        options: ["5, 3, 1, 4, 2","5, 3, 4, 1, 2","1, 3, 5, 2, 4","3, 4, 2, 5, 1"],
        correct: 0,
        explanation: "This represents a food chain where Grass is eaten by a Grasshopper, which is eaten by a Frog, then a Snake, and finally an Eagle."
    },
    {
        question: "Choose the word that is a necessary part of the underlined word: **Shoe**",
        options: ["Sole","Leather","Laces","Walking"],
        correct: 0,
        explanation: "Every shoe must have a sole to protect the bottom of the foot, whereas laces, leather, and walking are common but not required."
    },
    {
        question: "Find the odd word out: Lake, River, Sea, Pool.",
        options: ["Pool","Lake","River","Sea"],
        correct: 0,
        explanation: "A lake, river, and sea are natural bodies of water, whereas a pool is generally artificial and man-made."
    },
    {
        question: "Statement: 'Provide mid-day meals to school children to increase attendance.' Assumption: I. Mid-day meals will attract children to school. II. Those who attend school are currently deprived of good food.",
        options: ["Only I is implicit","Only II is implicit","Both I and II are implicit","Neither I nor II is implicit"],
        correct: 0,
        explanation: "The policy assumes that the incentive of food will successfully draw students to attend, but it does not necessarily assume all current students are starving."
    },
    {
        question: "Complete the analogy: Sponge is to porous as rubber is to...",
        options: ["Massive","Elastic","Solid","Inflexible"],
        correct: 1,
        explanation: "Being porous is the defining physical property of a sponge, just as being elastic is the defining physical property of rubber."
    },
    {
        question: "Statements: All bags are cakes. All lamps are cakes. Conclusion: I. Some lamps are bags. II. No lamp is bag.",
        options: ["Only I follows","Only II follows","Either I or II follows","Neither I nor II follows"],
        correct: 2,
        explanation: "Since both are subsets of cakes with no defined relationship, they either overlap (I is true) or they do not (II is true), making it an 'either/or' scenario."
    },
    {
        question: "If RED is coded as 6720, then how would GREEN be coded?",
        options: ["9207716","1677209","16717209","1677199"],
        correct: 1,
        explanation: "Each letter's alphabetical numerical value is increased by 2 (R=18+2=20, E=5+2=7, D=4+2=6) and written in reverse order; applying this to GREEN yields 1677209."
    },
    {
        question: "Arrange logically: 1. Gold 2. Iron 3. Sand 4. Platinum 5. Diamond",
        options: ["2, 4, 3, 5, 1","3, 2, 1, 5, 4","4, 5, 1, 3, 2","5, 4, 3, 2, 1"],
        correct: 1,
        explanation: "Arranging the materials from cheapest to most expensive logically yields Sand, Iron, Gold, Diamond, and then Platinum."
    },
    {
        question: "Choose the word that is a necessary part of the underlined word: **Pain**",
        options: ["Cut","Burn","Hurt","Nuisance"],
        correct: 2,
        explanation: "Pain by definition requires a sensation of being hurt, whereas cuts and burns are specific causes, and nuisance is an annoyance rather than physical agony."
    },
    {
        question: "Find the odd word out: Triangle, Circle, Sphere, Square.",
        options: ["Square","Circle","Triangle","Sphere"],
        correct: 3,
        explanation: "A triangle, circle, and square are all two-dimensional plane figures, whereas a sphere is a three-dimensional solid object."
    },
    {
        question: "Statement: 'Please drop this letter in the letterbox.' - An officer tells his assistant. Assumption: I. The assistant knows the address of the letterbox. II. The letter contains important information.",
        options: ["Only I is implicit","Only II is implicit","Neither I nor II is implicit","Both I and II are implicit"],
        correct: 0,
        explanation: "The officer assumes the assistant knows where to find a letterbox to execute the command, but the command does not imply the letter's contents are important."
    },
    {
        question: "Complete the analogy: Artist is to brush as scribe is to...",
        options: ["Paper","Pen","Book","Ink"],
        correct: 1,
        explanation: "A brush is the primary physical tool used by an artist to create work, just as a pen is the primary tool used by a scribe."
    },
    {
        question: "Statements: No man is a monkey. John is a man. Conclusion: I. John is not a monkey. II. John may or may not be a monkey.",
        options: ["Only I follows","Only II follows","Neither I nor II follows","Both I and II follow"],
        correct: 0,
        explanation: "Since no men are monkeys, and John is definitively categorized as a man, it is an absolute certainty that John is not a monkey."
    },
    {
        question: "If in a certain code, LUTE is written as MUTE and FATE is written as GATE, then how will BLUE be written?",
        options: ["CLUE","GLUE","FLUE","SLUE"],
        correct: 0,
        explanation: "The code simply changes the first letter of the word to the next letter in the alphabet (+1), so BLUE changes to CLUE."
    },
    {
        question: "Arrange logically: 1. Protect 2. Pressure 3. Relief 4. Rain 5. Flood",
        options: ["2, 4, 3, 1, 5","2, 4, 5, 1, 3","2, 5, 4, 1, 3","3, 2, 4, 5, 1"],
        correct: 1,
        explanation: "A low atmospheric Pressure causes Rain, heavy rain causes a Flood, people take measures to Protect themselves, and finally receive Relief."
    }
];
