import { Question } from "../aptitudeQuestions";

export const syllogismQuestions: Question[] = [
    {
        question: "Statements: 1. All cats are dogs. 2. Some dogs are rats.\nConclusions: I. Some cats are rats. II. No cat is a rat.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow.","Either Conclusion I or II follows."],
        correct: 3,
        explanation: "There is no direct relation given between cats and rats. Since the conclusions form a 'Some/No' complementary pair with the same subjects, it's an Either/Or case."
    },
    {
        question: "Statements: 1. Some A are B. 2. All B are C. 3. No C is D.\nConclusions: I. Some A are not D. II. No B is D.",
        options: ["Only Conclusion I follows.","Both Conclusion I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "Since all B are C, and no C is D, no B can be D (II is true). Also, the part of A that overlaps with B is inside C, which cannot be D, making I true."
    },
    {
        question: "Statements: 1. Only a few papers are books. 2. All books are notes.\nConclusions: I. All papers being notes is a possibility. II. All papers being books is a possibility.",
        options: ["Neither Conclusion I nor II follows.","Either Conclusion I or II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 2,
        explanation: "'Only a few' means some are and some are definitely not. So, all papers can never be books (II is false). However, the entire paper circle can sit inside the larger 'notes' circle without being entirely inside 'books' (I is true)."
    },
    {
        question: "Statements: 1. No blue is red. 2. Some red are green.\nConclusions: I. Some green are not blue. II. Some blue are not green.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 2,
        explanation: "The part of green that overlaps with red can never be blue, so I is definitely true. We have no negative restriction from the blue side towards the rest of the green circle, so II is false."
    },
    {
        question: "Statements: 1. All doors are windows. 2. No window is a house.\nConclusions: I. All doors being houses is a possibility. II. No door is a house.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "Since doors are completely inside windows, and windows cannot touch houses, doors can never touch houses. Therefore, II is definitely true, and the possibility in I is false."
    },
    {
        question: "Statements: 1. Some pens are erasers. 2. Only a few erasers are pencils.\nConclusions: I. Some pens are pencils. II. All erasers can be pencils.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 3,
        explanation: "There is no direct link between pens and pencils (I is false). 'Only a few erasers are pencils' means some erasers are strictly NOT pencils, so all erasers can never be pencils (II is false)."
    },
    {
        question: "Statements: 1. All X are Y. 2. All Y are Z. 3. Some Z are W.\nConclusions: I. Some W are X. II. All X are Z.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Either Conclusion I or II follows."],
        correct: 0,
        explanation: "Since X is inside Y, and Y is inside Z, X is inside Z (II is true). W overlaps with Z, but we don't know if it touches X deep inside (I is false)."
    },
    {
        question: "Statements: 1. Only kings are brave. 2. Some kings are rulers.\nConclusions: I. Some brave are rulers. II. All brave being rulers is a possibility.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows."],
        correct: 2,
        explanation: "'Only kings are brave' means 'All brave are kings' AND 'brave' cannot interact with any other element. Thus, brave cannot be rulers or interact with them at all. Both are false."
    },
    {
        question: "Statements: 1. Some water is cold. 2. No cold is hot.\nConclusions: I. Some water is not hot. II. All water can be hot.",
        options: ["Either Conclusion I or II follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "The portion of water that is cold can never be hot, so 'Some water is not hot' is definitely true. Because of this restriction, all water can never be hot."
    },
    {
        question: "Statements: 1. All laptops are mobiles. 2. Some mobiles are tablets.\nConclusions: I. All tablets being laptops is a possibility. II. Some laptops are tablets.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "There is no definitive overlap given between laptops and tablets, so II is false. However, since there are no negative statements, the tablet circle could possibly be drawn entirely inside the laptop circle (I is true)."
    },
    {
        question: "Statements: 1. Only a few cars are bikes. 2. No bike is a truck.\nConclusions: I. All cars can be trucks. II. Some cars are not trucks.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "The part of cars that are bikes can never be trucks, so 'Some cars are not trucks' is true. Because of this restriction, 'All cars can be trucks' is impossible."
    },
    {
        question: "Statements: 1. Some grapes are apples. 2. Some apples are bananas.\nConclusions: I. Some grapes are bananas. II. No grape is a banana.",
        options: ["Neither Conclusion I nor II follows.","Either Conclusion I or II follows.","Both Conclusion I and II follow.","Only Conclusion I follows."],
        correct: 1,
        explanation: "There is no direct relationship between grapes and bananas. Since the conclusions form a perfect 'Some/No' complementary pair, the answer is Either/Or."
    },
    {
        question: "Statements: 1. All shirts are pants. 2. All pants are trousers. 3. No trouser is a hat.\nConclusions: I. No shirt is a hat. II. No pant is a hat.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 3,
        explanation: "Since both shirts and pants are completely enclosed within the 'trousers' circle, and no trouser can touch a hat, neither shirts nor pants can ever touch a hat. Both are true."
    },
    {
        question: "Statements: 1. Only a few roses are lilies. 2. All lilies are lotuses.\nConclusions: I. All roses can be lotuses. II. Some lotuses are roses.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 2,
        explanation: "Lilies overlap with roses, and since all lilies are lotuses, lotuses must overlap with roses (II is true). While all roses can't be lilies, the entire rose circle can fit inside the larger lotus circle (I is true)."
    },
    {
        question: "Statements: 1. No sun is a star. 2. No star is a planet.\nConclusions: I. No sun is a planet. II. Some suns are planets.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Either Conclusion I or II follows.","Only Conclusion II follows."],
        correct: 2,
        explanation: "Two negative statements provide no definitive relationship between the outer elements (sun and planet). Since it's a 'Some/No' pair, it becomes Either/Or."
    },
    {
        question: "Statements: 1. Some A are B. 2. Only a few B are C.\nConclusions: I. All B can be C. II. All C can be B.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 3,
        explanation: "'Only a few B are C' restricts B from fully going inside C (I is false). However, it does not restrict C from fully sitting inside B (II is true)."
    },
    {
        question: "Statements: 1. All metals are solids. 2. Some solids are liquids.\nConclusions: I. Some metals are liquids. II. All solids are metals.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 2,
        explanation: "Metals are inside solids, and liquids overlap with solids, but we don't know if liquids touch metals inside (I is false). Solids is the larger set, so not all solids are metals (II is false)."
    },
    {
        question: "Statements: 1. Only files are folders. 2. Some files are documents.\nConclusions: I. Some folders are documents. II. No folder is a document.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Either Conclusion I or II follows.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "'Only files are folders' means 'All folders are files' AND folders cannot interact with any other entity. Therefore, no folder can be a document. II is definitely true."
    },
    {
        question: "Statements: 1. Some months are years. 2. All years are decades. 3. No decade is a century.\nConclusions: I. Some months are not centuries. II. No year is a century.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 3,
        explanation: "Years are inside decades, which cannot touch centuries, so II is true. The part of months that are years/decades cannot touch centuries, making I true."
    },
    {
        question: "Statements: 1. Only a few teas are coffees. 2. No coffee is a milk.\nConclusions: I. All teas can be milk. II. Some teas are not milk.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusion I and II follow.","Only Conclusion II follows."],
        correct: 3,
        explanation: "The part of tea that overlaps with coffee can never be milk, so II is true. Because of this overlapping restriction, all teas can never be milk, making I false."
    },
    {
        question: "Statements: 1. All inputs are outputs. 2. All outputs are results.\nConclusions: I. All inputs being results is a possibility. II. All results are inputs.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 1,
        explanation: "Inputs are already definitely results, so it's a certainty, not a 'possibility' (I is false). Results is the largest set, so we cannot conclude all results are inputs (II is false)."
    },
    {
        question: "Statements: 1. Some smart are intelligent. 2. No intelligent is dumb.\nConclusions: I. Some smart are not dumb. II. All dumb can be smart.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "Smart overlapping with intelligent cannot be dumb, so I is true. There is no restriction preventing the entire dumb circle from sitting in the non-intelligent part of the smart circle, so II is true."
    },
    {
        question: "Statements: 1. Only a few paints are colors. 2. Only a few colors are dyes.\nConclusions: I. All paints can be dyes. II. Some colors are not dyes.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 1,
        explanation: "'Only a few colors are dyes' inherently means some colors are NOT dyes, so II is true. There is no direct negative link between paints and dyes, so the entire paint circle can sit inside dyes (I is true)."
    },
    {
        question: "Statements: 1. No hero is a villain. 2. All villains are actors.\nConclusions: I. Some actors are not heroes. II. No actor is a hero.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "The actors who are villains can never be heroes, so I is definitively true. Other actors might be heroes, so II is not definitively true."
    },
    {
        question: "Statements: 1. All trees are forests. 2. Some forests are woods. 3. All woods are jungles.\nConclusions: I. Some trees are woods. II. Some jungles are forests.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows."],
        correct: 0,
        explanation: "Trees are inside forests, but we don't know if they overlap with woods (I is false). Woods overlap with forests, and woods are inside jungles, so jungles must overlap with forests (II is true)."
    },
    {
        question: "Statements: 1. Some squares are circles. 2. Some circles are rectangles.\nConclusions: I. All squares can be rectangles. II. Some squares are not rectangles.",
        options: ["Only Conclusion I follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Either Conclusion I or II follows."],
        correct: 0,
        explanation: "There are no negative statements, so 'All squares can be rectangles' is a valid possibility. 'Some are not' cannot be definitively concluded from positive statements alone."
    },
    {
        question: "Statements: 1. Only a few phones are tablets. 2. All tablets are laptops.\nConclusions: I. Some laptops are phones. II. All phones can be tablets.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "Phones overlap with tablets, which are inside laptops, so laptops must overlap with phones (I is true). 'Only a few' means some phones are strictly NOT tablets, so all phones can never be tablets (II is false)."
    },
    {
        question: "Statements: 1. All red are blue. 2. All blue are yellow. 3. No yellow is green.\nConclusions: I. No red is green. II. Some blue are not green.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "Since red and blue are completely inside yellow, and yellow cannot touch green, neither red nor blue can touch green. Both conclusions are definitively true."
    },
    {
        question: "Statements: 1. Some rivers are oceans. 2. Only oceans are seas.\nConclusions: I. Some rivers are seas. II. No river is a sea.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Either Conclusion I or II follows."],
        correct: 2,
        explanation: "'Only oceans are seas' means 'All seas are oceans' AND seas cannot interact with any other element. Therefore, no river can touch a sea, making II definitively true."
    },
    {
        question: "Statements: 1. Only a few books are pens. 2. Only a few pens are markers.\nConclusions: I. All books can be markers. II. All markers can be books.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 3,
        explanation: "The 'only a few' restriction is between books/pens and pens/markers. There is no direct restriction between books and markers. Therefore, they can fully overlap each other in a possibility scenario."
    },
    {
        question: "Statements: 1. No positive is negative. 2. All negatives are neutral.\nConclusions: I. Some neutrals are not positive. II. All neutrals can be positive.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 2,
        explanation: "The neutrals that are negative can never be positive, making I true. Because of this restricted overlapping part, the entire neutral circle can never be positive, making II false."
    },
    {
        question: "Statements: 1. Some fruits are healthy. 2. All healthy are tasty.\nConclusions: I. All fruits being tasty is a possibility. II. Some tasty are fruits.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 1,
        explanation: "Since fruits overlap with healthy, which is inside tasty, tasty must overlap with fruits (II is true). There's no negative statement, so the entire fruit circle could exist inside the tasty circle (I is true)."
    },
    {
        question: "Statements: 1. Only a few cats are pets. 2. No pet is wild.\nConclusions: I. Some cats are not wild. II. All cats can be wild.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion II follows."],
        correct: 0,
        explanation: "The cats that are pets can never be wild, so I is true. Because this portion of cats can never be wild, the entire cat circle cannot be wild, making II false."
    },
    {
        question: "Statements: 1. All days are nights. 2. Some nights are eves.\nConclusions: I. Some days are eves. II. No day is an eve.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Either Conclusion I or II follows.","Both Conclusion I and II follow."],
        correct: 2,
        explanation: "There is no definitive link between days and eves. The conclusions form a perfect 'Some/No' complementary pair, meaning one of them must be true."
    },
    {
        question: "Statements: 1. Only bats are balls. 2. Some bats are stumps.\nConclusions: I. Some balls are stumps. II. All stumps can be bats.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "'Only bats are balls' means balls cannot interact with stumps (I is false). There is no restriction preventing the entire stumps circle from sitting inside bats (II is true)."
    },
    {
        question: "Statements: 1. Some A are B. 2. Some B are C. 3. Some C are D.\nConclusions: I. Some A are C. II. Some B are D.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 2,
        explanation: "A chain of 'Some' statements provides no definitive connection between non-adjacent elements (A & C, or B & D). Both are false."
    },
    {
        question: "Statements: 1. Only a few codes are passwords. 2. All passwords are pins.\nConclusions: I. All codes can be pins. II. Some pins are definitely codes.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "Codes overlap with passwords, which are inside pins, so pins definitely overlap with codes (II is true). While all codes can't be passwords, they can entirely fit inside the larger 'pins' circle (I is true)."
    },
    {
        question: "Statements: 1. No white is black. 2. All black are grey.\nConclusions: I. Some grey are not white. II. All grey can be white.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "The grey that is black can never be white, so I is true. Because of this restricted part, the entire grey circle can never go inside white, so II is false."
    },
    {
        question: "Statements: 1. All locks are keys. 2. Only a few keys are chains.\nConclusions: I. All locks can be chains. II. All keys can be chains.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "'Only a few keys are chains' means some keys are strictly NOT chains, so II is false. However, the inner 'locks' circle could theoretically overlap completely with chains without violating the rule for the outer 'keys' circle (I is true)."
    },
    {
        question: "Statements: 1. Some plants are trees. 2. No tree is a shrub. 3. All shrubs are herbs.\nConclusions: I. Some plants are not shrubs. II. Some herbs are not trees.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "The plants that are trees can never be shrubs (I is true). The herbs that are shrubs can never be trees (II is true)."
    },
    {
        question: "Statements: 1. Only a few actors are directors. 2. No director is a producer.\nConclusions: I. All actors can be producers. II. Some actors are not producers.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "The actors who are directors can never be producers, making II true. Because of this, all actors can never be producers, making I false."
    },
    {
        question: "Statements: 1. All minutes are hours. 2. No hour is a day. 3. Some days are weeks.\nConclusions: I. No minute is a day. II. Some weeks are not hours.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "Minutes are inside hours, which cannot touch days, so no minute can be a day (I is true). The weeks overlapping with days cannot touch hours (II is true)."
    },
    {
        question: "Statements: 1. Only water is ice. 2. Some water is vapor.\nConclusions: I. Some ice being vapor is a possibility. II. No ice is vapor.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow.","Only Conclusion I follows."],
        correct: 1,
        explanation: "'Only water is ice' means 'All ice is water' AND ice cannot interact with anything else. Therefore, ice cannot be vapor. II is true, and I is impossible."
    },
    {
        question: "Statements: 1. Some laptops are PCs. 2. All PCs are macs. 3. Only a few macs are pads.\nConclusions: I. Some laptops are macs. II. All macs can be pads.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "Since all PCs are macs, the laptops overlapping with PCs must also overlap with macs (I is true). 'Only a few macs are pads' means all macs can never be pads (II is false)."
    },
    {
        question: "Statements: 1. No fan is an AC. 2. Some ACs are coolers.\nConclusions: I. All coolers can be fans. II. Some coolers are not fans.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow.","Only Conclusion I follows."],
        correct: 1,
        explanation: "The coolers that are ACs can never be fans, so II is true. Because of this restricted overlap, all coolers can never be fans, making I false."
    },
    {
        question: "Statements: 1. All letters are words. 2. Only a few words are sentences.\nConclusions: I. All sentences can be words. II. All letters can be sentences.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 2,
        explanation: "'Only a few words are sentences' limits words from going fully into sentences, but sentences can fully go inside words (I is true). Letters can also fully go inside sentences without violating the rule (II is true)."
    },
    {
        question: "Statements: 1. Some red are blue. 2. Some blue are black. 3. No black is white.\nConclusions: I. Some red are not white. II. All blue can be white.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "There is no negative connection between red and white, so I is false. The blue that is black can never be white, so 'All blue can be white' is impossible (II is false)."
    },
    {
        question: "Statements: 1. Only a few books are copies. 2. No copy is a pen.\nConclusions: I. Some books are not pens. II. All books can be pens.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "The books that are copies can never be pens, making I true. Because of this, it is impossible for all books to be pens, making II false."
    },
    {
        question: "Statements: 1. All dogs are animals. 2. Only a few animals are wild. 3. No wild is a bird.\nConclusions: I. All dogs can be wild. II. Some animals are not birds.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 3,
        explanation: "There's no direct restriction preventing the inner 'dogs' circle from being fully inside 'wild' (I is true). The animals that are wild can never be birds, making II true."
    },
    {
        question: "Statements: 1. Only cities are states. 2. Some cities are towns.\nConclusions: I. Some states are towns. II. No state is a town.",
        options: ["Only Conclusion II follows.","Either Conclusion I or II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 0,
        explanation: "'Only cities are states' establishes that 'All states are cities' and states CANNOT interact with any other entity. Therefore, states can never be towns. II is definitively true."
    }
];
