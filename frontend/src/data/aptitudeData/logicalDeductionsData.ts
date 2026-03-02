import { Question } from "../aptitudeQuestions";

export const logicalDeductionsQuestions: Question[] = [
    {
        question: "Statements: 1. No women teacher can play. 2. Some women teachers are athletes.\nConclusions: I. Male athletes can play. II. Some athletes can play.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 3,
        explanation: "The statements give no information about 'male athletes' (I is false). The athletes who are women teachers definitely cannot play, but we have no definite information about the remaining athletes playing (II is false)."
    },
    {
        question: "Statements: 1. All books are journals. 2. Some journals are diaries.\nConclusions: I. Some books are diaries. II. No book is a diary.",
        options: ["Neither Conclusion I nor II follows.","Either Conclusion I or II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "There is no direct connection between books and diaries, so individually they are false, but they form a complementary 'Some/No' pair, meaning one must be true."
    },
    {
        question: "Statements: 1. No cat is a dog. 2. All dogs are birds.\nConclusions: I. Some birds are not cats. II. No bird is a cat.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion II follows."],
        correct: 0,
        explanation: "The birds that are dogs can never be cats, making I definitely true. However, there might be other birds outside the 'dog' circle that could be cats, so II is not definitely true."
    },
    {
        question: "Statements: 1. Some apples are oranges. 2. All oranges are grapes.\nConclusions: I. Some apples are grapes. II. All grapes are apples.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "Since all oranges are inside grapes, the apples that overlap with oranges must also overlap with grapes (I is true). Grapes is a larger set, so not all grapes are apples (II is false)."
    },
    {
        question: "Statements: 1. All trees are plants. 2. All plants are green.\nConclusions: I. All trees are green. II. Some green things are trees.",
        options: ["Only Conclusion I follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion II follows."],
        correct: 1,
        explanation: "Trees are a subset of plants, which are a subset of green things, making I true. Consequently, the green circle contains trees, making II true."
    },
    {
        question: "Statements: 1. Some cars are buses. 2. No bus is a truck.\nConclusions: I. Some cars are not trucks. II. No car is a truck.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Either Conclusion I or II follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "The part of cars overlapping with buses cannot be trucks, so I is true. We don't know about the rest of the cars, so II is false."
    },
    {
        question: "Statements: 1. All metals are solids. 2. Some solids are heavy.\nConclusions: I. All heavy things are metals. II. Some metals are heavy.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 0,
        explanation: "The 'heavy' circle overlaps with 'solids', but we have no definitive proof it touches the 'metals' circle inside 'solids'."
    },
    {
        question: "Statements: 1. No rain is thunder. 2. No thunder is lightning.\nConclusions: I. No rain is lightning. II. Some rain is lightning.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Either Conclusion I or II follows.","Both Conclusion I and II follow."],
        correct: 2,
        explanation: "There is no direct relationship established between rain and lightning. Since they are a 'Some/No' pair, either one or the other must be true."
    },
    {
        question: "Statements: 1. Some pens are pencils. 2. Some pencils are erasers.\nConclusions: I. Some pens are erasers. II. All erasers are pens.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "Both statements use 'Some', which does not establish a chain relationship between the first subject (pens) and the third (erasers)."
    },
    {
        question: "Statements: 1. All rivers are oceans. 2. No ocean is a sea.\nConclusions: I. No river is a sea. II. Some rivers are seas.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "Since all rivers are inside oceans, and oceans have a strict negative boundary with seas, rivers can never touch seas."
    },
    {
        question: "Statements: 1. Some managers are leaders. 2. All leaders are visionaries.\nConclusions: I. Some managers are visionaries. II. All visionaries are managers.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 2,
        explanation: "The managers who are leaders must also be visionaries, making I true. Not all visionaries have to be managers (II is false)."
    },
    {
        question: "Statements: 1. All gold is silver. 2. All silver is bronze.\nConclusions: I. Some bronze is gold. II. All bronze is gold.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion II follows."],
        correct: 0,
        explanation: "Gold is a subset of silver, which is a subset of bronze. Therefore, the bronze circle contains the gold circle (I is true), but bronze is larger, so II is false."
    },
    {
        question: "Statements: 1. No square is a circle. 2. Some circles are triangles.\nConclusions: I. Some triangles are not squares. II. All triangles are circles.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "The triangles that overlap with circles can never be squares, making I definitively true. II is false because the statement only says 'Some' circles are triangles."
    },
    {
        question: "Statements: 1. Some windows are doors. 2. Some doors are walls.\nConclusions: I. Some walls are windows. II. No wall is a window.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Either Conclusion I or II follows."],
        correct: 3,
        explanation: "There is no definitive link between walls and windows. Since the conclusions form a 'Some/No' complementary pair, the answer is Either/Or."
    },
    {
        question: "Statements: 1. All doctors are honest. 2. Some honest people are rich.\nConclusions: I. Some doctors are rich. II. All rich people are honest.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 0,
        explanation: "Doctors are inside the 'honest' circle, and 'rich' overlaps with 'honest', but 'rich' does not necessarily overlap with the 'doctors' subset inside 'honest'."
    },
    {
        question: "Statements: 1. No fruit is a vegetable. 2. No vegetable is a dairy.\nConclusions: I. All fruits are dairy. II. No fruit is dairy.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Either Conclusion I or II follows."],
        correct: 2,
        explanation: "Two negative statements do not establish a relationship between the two outer terms (fruit and dairy). Either, both, or neither could overlap."
    },
    {
        question: "Statements: 1. Some files are folders. 2. All folders are documents.\nConclusions: I. Some files are documents. II. All documents are folders.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "The files overlapping with folders are included in the 'documents' circle, making I true. Documents is a broader set than folders, making II false."
    },
    {
        question: "Statements: 1. All engineers are smart. 2. No smart person is lazy.\nConclusions: I. No engineer is lazy. II. All lazy people are smart.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "Since all engineers are completely inside the 'smart' circle, and the 'smart' circle cannot touch the 'lazy' circle, no engineer can be lazy."
    },
    {
        question: "Statements: 1. Some red is blue. 2. Some blue is green. 3. Some green is yellow.\nConclusions: I. Some red is green. II. Some blue is yellow.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 2,
        explanation: "A chain of 'Some' statements establishes no definitive links between non-adjacent elements (red and green, blue and yellow)."
    },
    {
        question: "Statements: 1. All cups are plates. 2. All plates are spoons.\nConclusions: I. All cups are spoons. II. Some spoons are not cups.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "Cups is a subset of plates, which is a subset of spoons (I is true). However, we cannot definitively say 'some spoons are not cups' because the circles *could* all be identical in size."
    },
    {
        question: "Statements: 1. No sun is a star. 2. All stars are planets.\nConclusions: I. Some planets are not suns. II. No planet is a sun.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 2,
        explanation: "The planets that are stars can never be suns, making I definitively true. However, there might be other planets that are suns, so II is not definitively true."
    },
    {
        question: "Statements: 1. Some boys are students. 2. All students are tall.\nConclusions: I. Some boys are tall. II. All boys are tall.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "The boys that overlap with students must be included in the 'tall' circle. We cannot generalize this to 'All boys', so II is false."
    },
    {
        question: "Statements: 1. All leaves are roots. 2. No root is a branch.\nConclusions: I. No leaf is a branch. II. Some roots are leaves.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows."],
        correct: 2,
        explanation: "Leaves are inside roots, and roots cannot touch branches, so leaves cannot touch branches (I is true). Since all leaves are roots, it naturally implies some roots are leaves (II is true)."
    },
    {
        question: "Statements: 1. Some hats are caps. 2. Some caps are helmets.\nConclusions: I. All helmets are hats. II. No helmet is a hat.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Either Conclusion I or II follows."],
        correct: 2,
        explanation: "There is no definitive connection between helmets and hats. Since the pair is 'All/No', it does not form a valid Either/Or complementary pair (which requires Some/No or All/Some not)."
    },
    {
        question: "Statements: 1. All cars are vehicles. 2. All bikes are vehicles.\nConclusions: I. Some cars are bikes. II. No car is a bike.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Either Conclusion I or II follows.","Only Conclusion I follows."],
        correct: 2,
        explanation: "Both cars and bikes are inside the 'vehicles' circle, but their relationship to each other is unknown. Since it's a 'Some/No' pair with identical subjects, it's Either/Or."
    },
    {
        question: "Statements: 1. No A is B. 2. Some B are C.\nConclusions: I. Some C are not A. II. All C are A.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "The portion of C that overlaps with B can never be A, making Conclusion I definitively true."
    },
    {
        question: "Statements: 1. All squares are rectangles. 2. All rectangles are polygons.\nConclusions: I. All polygons are squares. II. Some polygons are squares.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 1,
        explanation: "Squares are deep inside polygons. Therefore, the part of polygons covering squares validates 'Some polygons are squares', but 'All' is invalid from the outer to inner set."
    },
    {
        question: "Statements: 1. Some movies are dramas. 2. No drama is a comedy.\nConclusions: I. Some movies are not comedies. II. No movie is a comedy.",
        options: ["Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows."],
        correct: 3,
        explanation: "The movies that are dramas cannot be comedies, so I is true. Other movies might be comedies, so II is not definitively true."
    },
    {
        question: "Statements: 1. All shirts are pants. 2. Some pants are shoes.\nConclusions: I. Some shoes are shirts. II. No shoe is a shirt.",
        options: ["Either Conclusion I or II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "Shoes overlap with pants, but we don't know if they touch the shirts inside the pants circle. Because 'Some/No' forms a complementary pair, it is Either/Or."
    },
    {
        question: "Statements: 1. No dog is a cat. 2. No cat is a mouse.\nConclusions: I. No dog is a mouse. II. Some dogs are mice.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Either Conclusion I or II follows.","Only Conclusion I follows."],
        correct: 2,
        explanation: "Two negative statements provide no link between the outer terms (dog and mouse). The 'Some/No' pair makes the answer Either/Or."
    },
    {
        question: "Statements: 1. All pins are needles. 2. All threads are needles.\nConclusions: I. Some pins are threads. II. All pins are threads.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Only Conclusion I follows.","Neither Conclusion I nor II follows."],
        correct: 3,
        explanation: "Both pins and threads are inside needles, but there is no information dictating that they must touch or overlap each other."
    },
    {
        question: "Statements: 1. Some apples are bananas. 2. All bananas are cherries. 3. No cherry is a date.\nConclusions: I. Some apples are not dates. II. Some bananas are not dates.",
        options: ["Both Conclusion I and II follow.","Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows."],
        correct: 0,
        explanation: "Bananas are cherries, and cherries cannot be dates, so no banana is a date (making II true). The apples that are bananas also cannot be dates (making I true)."
    },
    {
        question: "Statements: 1. All papers are woods. 2. Some woods are forests.\nConclusions: I. Some papers are forests. II. All woods are papers.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 0,
        explanation: "Forests overlap with woods, but we don't know if they touch papers. Woods is the larger set, so we cannot conclude 'All woods are papers'."
    },
    {
        question: "Statements: 1. Some keys are locks. 2. All locks are doors.\nConclusions: I. Some doors are keys. II. All keys are doors.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows."],
        correct: 3,
        explanation: "Since all locks are doors, the keys that overlap with locks must also be doors, making I true. Not all keys are guaranteed to be locks, so II is false."
    },
    {
        question: "Statements: 1. No ocean is a lake. 2. All lakes are ponds.\nConclusions: I. Some ponds are not oceans. II. No pond is an ocean.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "The ponds that are lakes can never be oceans, so I is definitively true. Other ponds outside the 'lake' circle might be oceans, so II is not definitively true."
    },
    {
        question: "Statements: 1. All phones are chargers. 2. All cables are chargers.\nConclusions: I. No phone is a cable. II. Some phones are cables.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Either Conclusion I or II follows.","Both Conclusion I and II follow."],
        correct: 2,
        explanation: "Both sets are inside chargers, with no defined relation to each other. The conclusions form a perfect 'Some/No' complementary pair, meaning one must be true."
    },
    {
        question: "Statements: 1. Some tigers are lions. 2. No lion is a bear.\nConclusions: I. Some tigers are not bears. II. Some bears are not tigers.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "The tigers that are lions cannot be bears, so I is true. We have no definitive information restricting all bears from being tigers, so II is false."
    },
    {
        question: "Statements: 1. All desks are chairs. 2. Some chairs are tables. 3. All tables are beds.\nConclusions: I. Some beds are chairs. II. Some desks are beds.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "Because tables are beds, the overlap between chairs and tables guarantees some chairs are beds (I is true). Desks and tables have no proven overlap (II is false)."
    },
    {
        question: "Statements: 1. No fan is an AC. 2. No AC is a cooler.\nConclusions: I. Some fans are coolers. II. All coolers are fans.",
        options: ["Only Conclusion II follows.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "Two negative premises yield no definitive positive connection between the first (fan) and third (cooler) entities."
    },
    {
        question: "Statements: 1. Some artists are painters. 2. All painters are sculptors.\nConclusions: I. All sculptors are artists. II. Some artists are sculptors.",
        options: ["Both Conclusion I and II follow.","Only Conclusion II follows.","Only Conclusion I follows.","Neither Conclusion I nor II follows."],
        correct: 1,
        explanation: "The artists who are painters must be sculptors, making II true. However, 'sculptors' is the largest encompassing set, so we cannot claim all of them are artists."
    },
    {
        question: "Statements: 1. All squares are cubes. 2. No cube is a sphere.\nConclusions: I. No square is a sphere. II. No sphere is a square.",
        options: ["Only Conclusion I follows.","Neither Conclusion I nor II follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 3,
        explanation: "Squares are entirely inside cubes, and the cube boundary cannot be crossed by a sphere. Therefore, squares and spheres can never intersect in either direction."
    },
    {
        question: "Statements: 1. Some cars are fast. 2. All fast things are dangerous.\nConclusions: I. Some cars are dangerous. II. All cars are dangerous.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Neither Conclusion I nor II follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "The cars that overlap with 'fast' are enveloped by 'dangerous', making I true. We don't know if the non-fast cars are dangerous, so II is false."
    },
    {
        question: "Statements: 1. No pen is a marker. 2. Some markers are crayons.\nConclusions: I. Some crayons are not pens. II. All crayons are pens.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows.","Both Conclusion I and II follow."],
        correct: 1,
        explanation: "The crayons overlapping with markers can never be pens because no marker is a pen, making I definitively true."
    },
    {
        question: "Statements: 1. All stars are galaxies. 2. All galaxies are universes.\nConclusions: I. Some universes are stars. II. All stars are universes.",
        options: ["Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 2,
        explanation: "Stars are the innermost set and universes the outermost. Therefore, all stars are in the universe set (II is true), which intrinsically means the universe set contains some stars (I is true)."
    },
    {
        question: "Statements: 1. Some trains are metros. 2. No metro is a bus. 3. All buses are taxis.\nConclusions: I. Some trains are not buses. II. Some taxis are not metros.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 0,
        explanation: "Trains that are metros cannot be buses (I is true). Taxis that are buses cannot be metros (II is true)."
    },
    {
        question: "Statements: 1. All X are Y. 2. All Y are Z.\nConclusions: I. Some Z are not X. II. All Z are X.",
        options: ["Both Conclusion I and II follow.","Neither Conclusion I nor II follows.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 1,
        explanation: "While X is inside Z, we cannot definitively conclude 'some Z are not X' because the circles X, Y, and Z could all be perfectly identical. 'All Z are X' is also not definitive."
    },
    {
        question: "Statements: 1. Some laptops are bags. 2. Some bags are shoes.\nConclusions: I. No laptop is a shoe. II. Some laptops are shoes.",
        options: ["Only Conclusion I follows.","Only Conclusion II follows.","Neither Conclusion I nor II follows.","Either Conclusion I or II follows."],
        correct: 3,
        explanation: "A chain of 'some' yields no definitive link between the outer elements. However, since they form a 'Some/No' complementary pair, the answer is Either/Or."
    },
    {
        question: "Statements: 1. No circle is a triangle. 2. No triangle is a rectangle.\nConclusions: I. Some rectangles are circles. II. No rectangle is a circle.",
        options: ["Either Conclusion I or II follows.","Only Conclusion I follows.","Both Conclusion I and II follow.","Neither Conclusion I nor II follows."],
        correct: 0,
        explanation: "Two negative boundaries do not restrict the outer objects (circles and rectangles) from touching. The 'Some/No' pair makes this Either/Or."
    },
    {
        question: "Statements: 1. All cats are pets. 2. Some pets are wild.\nConclusions: I. Some cats are wild. II. All wild things are pets.",
        options: ["Neither Conclusion I nor II follows.","Both Conclusion I and II follow.","Only Conclusion I follows.","Only Conclusion II follows."],
        correct: 0,
        explanation: "Wild overlaps with pets, but we don't know if it reaches the 'cats' subset inside. Wild is also not completely inside pets, so neither conclusion follows definitively."
    },
    {
        question: "Statements: 1. Some waters are liquids. 2. All liquids are fluids. 3. No fluid is a gas.\nConclusions: I. Some waters are not gases. II. No liquid is a gas.",
        options: ["Neither Conclusion I nor II follows.","Only Conclusion II follows.","Only Conclusion I follows.","Both Conclusion I and II follow."],
        correct: 3,
        explanation: "All liquids are fluids, and no fluid is a gas, so no liquid can be a gas (II is true). The waters that are liquids cannot be gases either (I is true)."
    }
];
