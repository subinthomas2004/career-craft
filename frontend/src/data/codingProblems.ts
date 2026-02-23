export interface TestCase {
    input: string;
    expected: string;
}

export interface Example {
    input: string;
    output: string;
    explanation?: string;
}

export interface StarterCode {
    javascript: string;
    python: string;
    java?: string;
    cpp?: string;
    c?: string;
    csharp?: string;
    typescript?: string;
    sql?: string;
}

export const ALL_LANGUAGES = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "c", label: "C" },
    { id: "csharp", label: "C#" },
    { id: "typescript", label: "TypeScript" },
    { id: "sql", label: "SQL" },
] as const;

export type LanguageId = (typeof ALL_LANGUAGES)[number]["id"];

export function getStarterCode(problem: CodingProblem, language: LanguageId): string {
    const explicit = problem.starterCode[language as keyof StarterCode];
    if (explicit) return explicit;
    return `// Write your ${language} solution here`;
}

export interface CodingProblem {
    id: number;
    title: string;
    slug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    tags: string[];
    description: string;
    constraints: string[];
    examples: Example[];
    testCases: TestCase[];
    starterCode: StarterCode;
    hints: string[];
    acceptance: number;
    supportedLanguages?: LanguageId[];
}

export const codingProblems: CodingProblem[] = [
    {
        id: 1,
        title: "Weighted Word Mapping",
        slug: "weighted-word-mapping",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Weighted Word Mapping. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(weighted_word_mapping([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction weighted_word_mapping() {\n  // Your code here\n  \n}`,
            python: `def weighted_word_mapping():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 56,
        supportedLanguages: ["javascript"]
    },
    {
        id: 2,
        title: "Count Dominant Indices",
        slug: "count-dominant-indices",
        difficulty: "Easy",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Count Dominant Indices. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_dominant_indices([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_dominant_indices() {\n  // Your code here\n  \n}`,
            python: `def count_dominant_indices():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 67,
        supportedLanguages: ["javascript"]
    },
    {
        id: 3,
        title: "Toggle Light Bulbs",
        slug: "toggle-light-bulbs",
        difficulty: "Easy",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Toggle Light Bulbs. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(toggle_light_bulbs([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction toggle_light_bulbs() {\n  // Your code here\n  \n}`,
            python: `def toggle_light_bulbs():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 61,
        supportedLanguages: ["javascript"]
    },
    {
        id: 4,
        title: "Reverse Letters Then Special Characters in a String",
        slug: "reverse-letters-then-special-characters-in-a-string",
        difficulty: "Easy",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Reverse Letters Then Special Characters in a String. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(reverse_letters_then_special_characters_in_a_string([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction reverse_letters_then_special_characters_in_a_string() {\n  // Your code here\n  \n}`,
            python: `def reverse_letters_then_special_characters_in_a_string():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 77,
        supportedLanguages: ["javascript"]
    },
    {
        id: 5,
        title: "Count Monobit Integers",
        slug: "count-monobit-integers",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Count Monobit Integers. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_monobit_integers([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_monobit_integers() {\n  // Your code here\n  \n}`,
            python: `def count_monobit_integers():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 78,
        supportedLanguages: ["javascript"]
    },
    {
        id: 6,
        title: "Count Residue Prefixes",
        slug: "count-residue-prefixes",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Count Residue Prefixes. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_residue_prefixes([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_residue_prefixes() {\n  // Your code here\n  \n}`,
            python: `def count_residue_prefixes():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 52,
        supportedLanguages: ["javascript"]
    },
    {
        id: 7,
        title: "Largest Even Number",
        slug: "largest-even-number",
        difficulty: "Easy",
        category: "Stacks",
        tags: ["Stacks"],
        description: "Implement the solution for Largest Even Number. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(largest_even_number([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction largest_even_number() {\n  // Your code here\n  \n}`,
            python: `def largest_even_number():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 73,
        supportedLanguages: ["javascript"]
    },
    {
        id: 8,
        title: "Vowel-Consonant Score",
        slug: "vowel-consonant-score",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Vowel-Consonant Score. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(vowel_consonant_score([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction vowel_consonant_score() {\n  // Your code here\n  \n}`,
            python: `def vowel_consonant_score():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 30,
        supportedLanguages: ["javascript"]
    },
    {
        id: 9,
        title: "Reverse String Prefix",
        slug: "reverse-string-prefix",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Reverse String Prefix. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(reverse_string_prefix([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction reverse_string_prefix() {\n  // Your code here\n  \n}`,
            python: `def reverse_string_prefix():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 78,
        supportedLanguages: ["javascript"]
    },
    {
        id: 10,
        title: "Mirror Distance of an Integer",
        slug: "mirror-distance-of-an-integer",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Mirror Distance of an Integer. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(mirror_distance_of_an_integer([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction mirror_distance_of_an_integer() {\n  // Your code here\n  \n}`,
            python: `def mirror_distance_of_an_integer():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 67,
        supportedLanguages: ["javascript"]
    },
    {
        id: 11,
        title: "Absolute Difference Between Maximum and Minimum K Elements",
        slug: "absolute-difference-between-maximum-and-minimum-k-elements",
        difficulty: "Easy",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Absolute Difference Between Maximum and Minimum K Elements. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(absolute_difference_between_maximum_and_minimum_k_elements([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction absolute_difference_between_maximum_and_minimum_k_elements() {\n  // Your code here\n  \n}`,
            python: `def absolute_difference_between_maximum_and_minimum_k_elements():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 67,
        supportedLanguages: ["javascript"]
    },
    {
        id: 12,
        title: "Sort Integers by Binary Reflection",
        slug: "sort-integers-by-binary-reflection",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Sort Integers by Binary Reflection. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(sort_integers_by_binary_reflection([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction sort_integers_by_binary_reflection() {\n  // Your code here\n  \n}`,
            python: `def sort_integers_by_binary_reflection():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 76,
        supportedLanguages: ["javascript"]
    },
    {
        id: 13,
        title: "Concatenate Non-Zero Digits and Multiply by Sum I",
        slug: "concatenate-non-zero-digits-and-multiply-by-sum-i",
        difficulty: "Easy",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Concatenate Non-Zero Digits and Multiply by Sum I. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(concatenate_non_zero_digits_and_multiply_by_sum_i([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction concatenate_non_zero_digits_and_multiply_by_sum_i() {\n  // Your code here\n  \n}`,
            python: `def concatenate_non_zero_digits_and_multiply_by_sum_i():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 36,
        supportedLanguages: ["javascript"]
    },
    {
        id: 14,
        title: "Minimum Number of Flips to Reverse Binary String",
        slug: "minimum-number-of-flips-to-reverse-binary-string",
        difficulty: "Easy",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Minimum Number of Flips to Reverse Binary String. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_number_of_flips_to_reverse_binary_string([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_number_of_flips_to_reverse_binary_string() {\n  // Your code here\n  \n}`,
            python: `def minimum_number_of_flips_to_reverse_binary_string():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 79,
        supportedLanguages: ["javascript"]
    },
    {
        id: 15,
        title: "Minimum Moves to Equal Array Elements III",
        slug: "minimum-moves-to-equal-array-elements-iii",
        difficulty: "Easy",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Minimum Moves to Equal Array Elements III. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_moves_to_equal_array_elements_iii([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_moves_to_equal_array_elements_iii() {\n  // Your code here\n  \n}`,
            python: `def minimum_moves_to_equal_array_elements_iii():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 68,
        supportedLanguages: ["javascript"]
    },
    {
        id: 16,
        title: "Minimum Distance Between Three Equal Elements I",
        slug: "minimum-distance-between-three-equal-elements-i",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Minimum Distance Between Three Equal Elements I. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_distance_between_three_equal_elements_i([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_distance_between_three_equal_elements_i() {\n  // Your code here\n  \n}`,
            python: `def minimum_distance_between_three_equal_elements_i():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 79,
        supportedLanguages: ["javascript"]
    },
    {
        id: 17,
        title: "Maximize Expression of Three Elements",
        slug: "maximize-expression-of-three-elements",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Maximize Expression of Three Elements. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximize_expression_of_three_elements([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximize_expression_of_three_elements() {\n  // Your code here\n  \n}`,
            python: `def maximize_expression_of_three_elements():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 57,
        supportedLanguages: ["javascript"]
    },
    {
        id: 18,
        title: "Find Missing Elements",
        slug: "find-missing-elements",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Find Missing Elements. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(find_missing_elements([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction find_missing_elements() {\n  // Your code here\n  \n}`,
            python: `def find_missing_elements():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 79,
        supportedLanguages: ["javascript"]
    },
    {
        id: 19,
        title: "Smallest Missing Multiple of K",
        slug: "smallest-missing-multiple-of-k",
        difficulty: "Easy",
        category: "Stacks",
        tags: ["Stacks"],
        description: "Implement the solution for Smallest Missing Multiple of K. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(smallest_missing_multiple_of_k([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction smallest_missing_multiple_of_k() {\n  // Your code here\n  \n}`,
            python: `def smallest_missing_multiple_of_k():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 40,
        supportedLanguages: ["javascript"]
    },
    {
        id: 20,
        title: "Sum of Elements With Frequency Divisible by K",
        slug: "sum-of-elements-with-frequency-divisible-by-k",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Sum of Elements With Frequency Divisible by K. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(sum_of_elements_with_frequency_divisible_by_k([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction sum_of_elements_with_frequency_divisible_by_k() {\n  // Your code here\n  \n}`,
            python: `def sum_of_elements_with_frequency_divisible_by_k():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 80,
        supportedLanguages: ["javascript"]
    },
    {
        id: 21,
        title: "Compute Alternating Sum",
        slug: "compute-alternating-sum",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Compute Alternating Sum. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(compute_alternating_sum([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction compute_alternating_sum() {\n  // Your code here\n  \n}`,
            python: `def compute_alternating_sum():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 76,
        supportedLanguages: ["javascript"]
    },
    {
        id: 22,
        title: "Majority Frequency Characters",
        slug: "majority-frequency-characters",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Majority Frequency Characters. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(majority_frequency_characters([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction majority_frequency_characters() {\n  // Your code here\n  \n}`,
            python: `def majority_frequency_characters():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 76,
        supportedLanguages: ["javascript"]
    },
    {
        id: 23,
        title: "Equal Score Substrings",
        slug: "equal-score-substrings",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Equal Score Substrings. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(equal_score_substrings([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction equal_score_substrings() {\n  // Your code here\n  \n}`,
            python: `def equal_score_substrings():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 63,
        supportedLanguages: ["javascript"]
    },
    {
        id: 24,
        title: "Remove Zeros in Decimal Representation",
        slug: "remove-zeros-in-decimal-representation",
        difficulty: "Easy",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Remove Zeros in Decimal Representation. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(remove_zeros_in_decimal_representation([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction remove_zeros_in_decimal_representation() {\n  // Your code here\n  \n}`,
            python: `def remove_zeros_in_decimal_representation():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 67,
        supportedLanguages: ["javascript"]
    },
    {
        id: 25,
        title: "Compute Decimal Representation",
        slug: "compute-decimal-representation",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Compute Decimal Representation. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(compute_decimal_representation([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction compute_decimal_representation() {\n  // Your code here\n  \n}`,
            python: `def compute_decimal_representation():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 48,
        supportedLanguages: ["javascript"]
    },
    {
        id: 26,
        title: "Earliest Time to Finish One Task",
        slug: "earliest-time-to-finish-one-task",
        difficulty: "Easy",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Earliest Time to Finish One Task. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(earliest_time_to_finish_one_task([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction earliest_time_to_finish_one_task() {\n  // Your code here\n  \n}`,
            python: `def earliest_time_to_finish_one_task():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 34,
        supportedLanguages: ["javascript"]
    },
    {
        id: 27,
        title: "Smallest Absent Positive Greater Than Average",
        slug: "smallest-absent-positive-greater-than-average",
        difficulty: "Easy",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Smallest Absent Positive Greater Than Average. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(smallest_absent_positive_greater_than_average([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction smallest_absent_positive_greater_than_average() {\n  // Your code here\n  \n}`,
            python: `def smallest_absent_positive_greater_than_average():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 36,
        supportedLanguages: ["javascript"]
    },
    {
        id: 28,
        title: "Bitwise OR of Even Numbers in an Array",
        slug: "bitwise-or-of-even-numbers-in-an-array",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Bitwise OR of Even Numbers in an Array. This is a Easy difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(bitwise_or_of_even_numbers_in_an_array([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction bitwise_or_of_even_numbers_in_an_array() {\n  // Your code here\n  \n}`,
            python: `def bitwise_or_of_even_numbers_in_an_array():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 65,
        supportedLanguages: ["javascript"]
    },
    {
        id: 29,
        title: "Check Digitorial Permutation",
        slug: "check-digitorial-permutation",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Check Digitorial Permutation. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(check_digitorial_permutation([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction check_digitorial_permutation() {\n  // Your code here\n  \n}`,
            python: `def check_digitorial_permutation():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 54,
        supportedLanguages: ["javascript"]
    },
    {
        id: 30,
        title: "Find the Score Difference in a Game",
        slug: "find-the-score-difference-in-a-game",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Find the Score Difference in a Game. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(find_the_score_difference_in_a_game([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction find_the_score_difference_in_a_game() {\n  // Your code here\n  \n}`,
            python: `def find_the_score_difference_in_a_game():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 57,
        supportedLanguages: ["javascript"]
    },
    {
        id: 31,
        title: "Longest Almost-Palindromic Substring",
        slug: "longest-almost-palindromic-substring",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Longest Almost-Palindromic Substring. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(longest_almost_palindromic_substring([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction longest_almost_palindromic_substring() {\n  // Your code here\n  \n}`,
            python: `def longest_almost_palindromic_substring():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 52,
        supportedLanguages: ["javascript"]
    },
    {
        id: 32,
        title: "First Element with Unique Frequency",
        slug: "first-element-with-unique-frequency",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for First Element with Unique Frequency. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(first_element_with_unique_frequency([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction first_element_with_unique_frequency() {\n  // Your code here\n  \n}`,
            python: `def first_element_with_unique_frequency():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 41,
        supportedLanguages: ["javascript"]
    },
    {
        id: 33,
        title: "Merge Adjacent Equal Elements",
        slug: "merge-adjacent-equal-elements",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Merge Adjacent Equal Elements. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(merge_adjacent_equal_elements([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction merge_adjacent_equal_elements() {\n  // Your code here\n  \n}`,
            python: `def merge_adjacent_equal_elements():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 71,
        supportedLanguages: ["javascript"]
    },
    {
        id: 34,
        title: "Count Subarrays With Cost Less Than or Equal to K",
        slug: "count-subarrays-with-cost-less-than-or-equal-to-k",
        difficulty: "Medium",
        category: "Stacks",
        tags: ["Stacks"],
        description: "Implement the solution for Count Subarrays With Cost Less Than or Equal to K. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_subarrays_with_cost_less_than_or_equal_to_k([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_subarrays_with_cost_less_than_or_equal_to_k() {\n  // Your code here\n  \n}`,
            python: `def count_subarrays_with_cost_less_than_or_equal_to_k():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 79,
        supportedLanguages: ["javascript"]
    },
    {
        id: 35,
        title: "Minimum Prefix Removal to Make Array Strictly Increasing",
        slug: "minimum-prefix-removal-to-make-array-strictly-increasing",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Minimum Prefix Removal to Make Array Strictly Increasing. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_prefix_removal_to_make_array_strictly_increasing([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_prefix_removal_to_make_array_strictly_increasing() {\n  // Your code here\n  \n}`,
            python: `def minimum_prefix_removal_to_make_array_strictly_increasing():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 59,
        supportedLanguages: ["javascript"]
    },
    {
        id: 36,
        title: "Minimum Operations to Reach Target Array",
        slug: "minimum-operations-to-reach-target-array",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Minimum Operations to Reach Target Array. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_operations_to_reach_target_array([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_operations_to_reach_target_array() {\n  // Your code here\n  \n}`,
            python: `def minimum_operations_to_reach_target_array():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 58,
        supportedLanguages: ["javascript"]
    },
    {
        id: 37,
        title: "Best Reachable Tower",
        slug: "best-reachable-tower",
        difficulty: "Medium",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Best Reachable Tower. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(best_reachable_tower([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction best_reachable_tower() {\n  // Your code here\n  \n}`,
            python: `def best_reachable_tower():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 63,
        supportedLanguages: ["javascript"]
    },
    {
        id: 38,
        title: "Count Caesar Cipher Pairs",
        slug: "count-caesar-cipher-pairs",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Count Caesar Cipher Pairs. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_caesar_cipher_pairs([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_caesar_cipher_pairs() {\n  // Your code here\n  \n}`,
            python: `def count_caesar_cipher_pairs():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 76,
        supportedLanguages: ["javascript"]
    },
    {
        id: 39,
        title: "Pythagorean Distance Nodes in a Tree",
        slug: "pythagorean-distance-nodes-in-a-tree",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Pythagorean Distance Nodes in a Tree. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(pythagorean_distance_nodes_in_a_tree([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction pythagorean_distance_nodes_in_a_tree() {\n  // Your code here\n  \n}`,
            python: `def pythagorean_distance_nodes_in_a_tree():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 34,
        supportedLanguages: ["javascript"]
    },
    {
        id: 40,
        title: "Minimum K to Reduce Array Within Limit",
        slug: "minimum-k-to-reduce-array-within-limit",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Minimum K to Reduce Array Within Limit. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_k_to_reduce_array_within_limit([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_k_to_reduce_array_within_limit() {\n  // Your code here\n  \n}`,
            python: `def minimum_k_to_reduce_array_within_limit():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 61,
        supportedLanguages: ["javascript"]
    },
    {
        id: 41,
        title: "Smallest All-Ones Multiple",
        slug: "smallest-all-ones-multiple",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Smallest All-Ones Multiple. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(smallest_all_ones_multiple([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction smallest_all_ones_multiple() {\n  // Your code here\n  \n}`,
            python: `def smallest_all_ones_multiple():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 68,
        supportedLanguages: ["javascript"]
    },
    {
        id: 42,
        title: "Maximum Score of a Split",
        slug: "maximum-score-of-a-split",
        difficulty: "Medium",
        category: "Stacks",
        tags: ["Stacks"],
        description: "Implement the solution for Maximum Score of a Split. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_score_of_a_split([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_score_of_a_split() {\n  // Your code here\n  \n}`,
            python: `def maximum_score_of_a_split():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 53,
        supportedLanguages: ["javascript"]
    },
    {
        id: 43,
        title: "Rotate Non Negative Elements",
        slug: "rotate-non-negative-elements",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Rotate Non Negative Elements. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(rotate_non_negative_elements([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction rotate_non_negative_elements() {\n  // Your code here\n  \n}`,
            python: `def rotate_non_negative_elements():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 37,
        supportedLanguages: ["javascript"]
    },
    {
        id: 44,
        title: "Minimum Number of Operations to Have Distinct Elements",
        slug: "minimum-number-of-operations-to-have-distinct-elements",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Minimum Number of Operations to Have Distinct Elements. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_number_of_operations_to_have_distinct_elements([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_number_of_operations_to_have_distinct_elements() {\n  // Your code here\n  \n}`,
            python: `def minimum_number_of_operations_to_have_distinct_elements():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 43,
        supportedLanguages: ["javascript"]
    },
    {
        id: 45,
        title: "Maximum Sum of Three Numbers Divisible by Three",
        slug: "maximum-sum-of-three-numbers-divisible-by-three",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Maximum Sum of Three Numbers Divisible by Three. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_sum_of_three_numbers_divisible_by_three([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_sum_of_three_numbers_divisible_by_three() {\n  // Your code here\n  \n}`,
            python: `def maximum_sum_of_three_numbers_divisible_by_three():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 35,
        supportedLanguages: ["javascript"]
    },
    {
        id: 46,
        title: "Reverse Words With Same Vowel Count",
        slug: "reverse-words-with-same-vowel-count",
        difficulty: "Medium",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Reverse Words With Same Vowel Count. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(reverse_words_with_same_vowel_count([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction reverse_words_with_same_vowel_count() {\n  // Your code here\n  \n}`,
            python: `def reverse_words_with_same_vowel_count():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 54,
        supportedLanguages: ["javascript"]
    },
    {
        id: 47,
        title: "Minimum Cost to Make Two Binary Strings Equal",
        slug: "minimum-cost-to-make-two-binary-strings-equal",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Minimum Cost to Make Two Binary Strings Equal. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_cost_to_make_two_binary_strings_equal([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_cost_to_make_two_binary_strings_equal() {\n  // Your code here\n  \n}`,
            python: `def minimum_cost_to_make_two_binary_strings_equal():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 37,
        supportedLanguages: ["javascript"]
    },
    {
        id: 48,
        title: "Minimum Subarray Length With Distinct Sum At Least K",
        slug: "minimum-subarray-length-with-distinct-sum-at-least-k",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Minimum Subarray Length With Distinct Sum At Least K. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_subarray_length_with_distinct_sum_at_least_k([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_subarray_length_with_distinct_sum_at_least_k() {\n  // Your code here\n  \n}`,
            python: `def minimum_subarray_length_with_distinct_sum_at_least_k():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 63,
        supportedLanguages: ["javascript"]
    },
    {
        id: 49,
        title: "Minimum Cost to Acquire Required Items",
        slug: "minimum-cost-to-acquire-required-items",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Minimum Cost to Acquire Required Items. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_cost_to_acquire_required_items([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_cost_to_acquire_required_items() {\n  // Your code here\n  \n}`,
            python: `def minimum_cost_to_acquire_required_items():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 57,
        supportedLanguages: ["javascript"]
    },
    {
        id: 50,
        title: "Total Score of Dungeon Runs",
        slug: "total-score-of-dungeon-runs",
        difficulty: "Medium",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Total Score of Dungeon Runs. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(total_score_of_dungeon_runs([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction total_score_of_dungeon_runs() {\n  // Your code here\n  \n}`,
            python: `def total_score_of_dungeon_runs():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 71,
        supportedLanguages: ["javascript"]
    },
    {
        id: 51,
        title: "Number of Alternating XOR Partitions",
        slug: "number-of-alternating-xor-partitions",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Number of Alternating XOR Partitions. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(number_of_alternating_xor_partitions([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction number_of_alternating_xor_partitions() {\n  // Your code here\n  \n}`,
            python: `def number_of_alternating_xor_partitions():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 54,
        supportedLanguages: ["javascript"]
    },
    {
        id: 52,
        title: "Count Elements With at Least K Greater Values",
        slug: "count-elements-with-at-least-k-greater-values",
        difficulty: "Medium",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Count Elements With at Least K Greater Values. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_elements_with_at_least_k_greater_values([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_elements_with_at_least_k_greater_values() {\n  // Your code here\n  \n}`,
            python: `def count_elements_with_at_least_k_greater_values():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 51,
        supportedLanguages: ["javascript"]
    },
    {
        id: 53,
        title: "Minimum Absolute Distance Between Mirror Pairs",
        slug: "minimum-absolute-distance-between-mirror-pairs",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Minimum Absolute Distance Between Mirror Pairs. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_absolute_distance_between_mirror_pairs([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_absolute_distance_between_mirror_pairs() {\n  // Your code here\n  \n}`,
            python: `def minimum_absolute_distance_between_mirror_pairs():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 50,
        supportedLanguages: ["javascript"]
    },
    {
        id: 54,
        title: "Minimum Deletion Cost to Make All Characters Equal",
        slug: "minimum-deletion-cost-to-make-all-characters-equal",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Minimum Deletion Cost to Make All Characters Equal. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_deletion_cost_to_make_all_characters_equal([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_deletion_cost_to_make_all_characters_equal() {\n  // Your code here\n  \n}`,
            python: `def minimum_deletion_cost_to_make_all_characters_equal():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 55,
        supportedLanguages: ["javascript"]
    },
    {
        id: 55,
        title: "Number of Prefix Connected Groups",
        slug: "number-of-prefix-connected-groups",
        difficulty: "Medium",
        category: "Stacks",
        tags: ["Stacks"],
        description: "Implement the solution for Number of Prefix Connected Groups. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(number_of_prefix_connected_groups([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction number_of_prefix_connected_groups() {\n  // Your code here\n  \n}`,
            python: `def number_of_prefix_connected_groups():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 51,
        supportedLanguages: ["javascript"]
    },
    {
        id: 56,
        title: "Concatenate Non-Zero Digits and Multiply by Sum II",
        slug: "concatenate-non-zero-digits-and-multiply-by-sum-ii",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Concatenate Non-Zero Digits and Multiply by Sum II. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(concatenate_non_zero_digits_and_multiply_by_sum_ii([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction concatenate_non_zero_digits_and_multiply_by_sum_ii() {\n  // Your code here\n  \n}`,
            python: `def concatenate_non_zero_digits_and_multiply_by_sum_ii():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 31,
        supportedLanguages: ["javascript"]
    },
    {
        id: 57,
        title: "Maximum Score After Binary Swaps",
        slug: "maximum-score-after-binary-swaps",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Maximum Score After Binary Swaps. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_score_after_binary_swaps([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_score_after_binary_swaps() {\n  // Your code here\n  \n}`,
            python: `def maximum_score_after_binary_swaps():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 72,
        supportedLanguages: ["javascript"]
    },
    {
        id: 58,
        title: "Number of Centered Subarrays",
        slug: "number-of-centered-subarrays",
        difficulty: "Medium",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Number of Centered Subarrays. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(number_of_centered_subarrays([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction number_of_centered_subarrays() {\n  // Your code here\n  \n}`,
            python: `def number_of_centered_subarrays():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 73,
        supportedLanguages: ["javascript"]
    },
    {
        id: 59,
        title: "Final Element After Subarray Deletions",
        slug: "final-element-after-subarray-deletions",
        difficulty: "Medium",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Final Element After Subarray Deletions. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(final_element_after_subarray_deletions([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction final_element_after_subarray_deletions() {\n  // Your code here\n  \n}`,
            python: `def final_element_after_subarray_deletions():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 67,
        supportedLanguages: ["javascript"]
    },
    {
        id: 60,
        title: "Minimum Distance Between Three Equal Elements II",
        slug: "minimum-distance-between-three-equal-elements-ii",
        difficulty: "Medium",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Minimum Distance Between Three Equal Elements II. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_distance_between_three_equal_elements_ii([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_distance_between_three_equal_elements_ii() {\n  // Your code here\n  \n}`,
            python: `def minimum_distance_between_three_equal_elements_ii():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 80,
        supportedLanguages: ["javascript"]
    },
    {
        id: 61,
        title: "Design Ride Sharing System",
        slug: "design-ride-sharing-system",
        difficulty: "Medium",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Design Ride Sharing System. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(design_ride_sharing_system([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction design_ride_sharing_system() {\n  // Your code here\n  \n}`,
            python: `def design_ride_sharing_system():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 64,
        supportedLanguages: ["javascript"]
    },
    {
        id: 62,
        title: "Maximum Product of Three Elements After One Replacement",
        slug: "maximum-product-of-three-elements-after-one-replacement",
        difficulty: "Medium",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Maximum Product of Three Elements After One Replacement. This is a Medium difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_product_of_three_elements_after_one_replacement([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_product_of_three_elements_after_one_replacement() {\n  // Your code here\n  \n}`,
            python: `def maximum_product_of_three_elements_after_one_replacement():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 51,
        supportedLanguages: ["javascript"]
    },
    {
        id: 63,
        title: "Palindromic Path Queries in a Tree",
        slug: "palindromic-path-queries-in-a-tree",
        difficulty: "Hard",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Palindromic Path Queries in a Tree. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(palindromic_path_queries_in_a_tree([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction palindromic_path_queries_in_a_tree() {\n  // Your code here\n  \n}`,
            python: `def palindromic_path_queries_in_a_tree():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 74,
        supportedLanguages: ["javascript"]
    },
    {
        id: 64,
        title: "Maximum Subarray XOR with Bounded Range",
        slug: "maximum-subarray-xor-with-bounded-range",
        difficulty: "Hard",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Maximum Subarray XOR with Bounded Range. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_subarray_xor_with_bounded_range([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_subarray_xor_with_bounded_range() {\n  // Your code here\n  \n}`,
            python: `def maximum_subarray_xor_with_bounded_range():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 62,
        supportedLanguages: ["javascript"]
    },
    {
        id: 65,
        title: "Maximum Score Using Exactly K Pairs",
        slug: "maximum-score-using-exactly-k-pairs",
        difficulty: "Hard",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Maximum Score Using Exactly K Pairs. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_score_using_exactly_k_pairs([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_score_using_exactly_k_pairs() {\n  // Your code here\n  \n}`,
            python: `def maximum_score_using_exactly_k_pairs():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 74,
        supportedLanguages: ["javascript"]
    },
    {
        id: 66,
        title: "Longest Alternating Subarray After Removing At Most One Element",
        slug: "longest-alternating-subarray-after-removing-at-most-one-element",
        difficulty: "Hard",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Longest Alternating Subarray After Removing At Most One Element. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(longest_alternating_subarray_after_removing_at_most_one_element([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction longest_alternating_subarray_after_removing_at_most_one_element() {\n  // Your code here\n  \n}`,
            python: `def longest_alternating_subarray_after_removing_at_most_one_element():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 68,
        supportedLanguages: ["javascript"]
    },
    {
        id: 67,
        title: "Find Nth Smallest Integer With K One Bits",
        slug: "find-nth-smallest-integer-with-k-one-bits",
        difficulty: "Hard",
        category: "Stacks",
        tags: ["Stacks"],
        description: "Implement the solution for Find Nth Smallest Integer With K One Bits. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(find_nth_smallest_integer_with_k_one_bits([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction find_nth_smallest_integer_with_k_one_bits() {\n  // Your code here\n  \n}`,
            python: `def find_nth_smallest_integer_with_k_one_bits():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 39,
        supportedLanguages: ["javascript"]
    },
    {
        id: 68,
        title: "Minimum Edge Toggles on a Tree",
        slug: "minimum-edge-toggles-on-a-tree",
        difficulty: "Hard",
        category: "Arrays",
        tags: ["Arrays"],
        description: "Implement the solution for Minimum Edge Toggles on a Tree. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(minimum_edge_toggles_on_a_tree([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction minimum_edge_toggles_on_a_tree() {\n  // Your code here\n  \n}`,
            python: `def minimum_edge_toggles_on_a_tree():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 33,
        supportedLanguages: ["javascript"]
    },
    {
        id: 69,
        title: "Last Remaining Integer After Alternating Deletion Operations",
        slug: "last-remaining-integer-after-alternating-deletion-operations",
        difficulty: "Hard",
        category: "Strings",
        tags: ["Strings"],
        description: "Implement the solution for Last Remaining Integer After Alternating Deletion Operations. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(last_remaining_integer_after_alternating_deletion_operations([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction last_remaining_integer_after_alternating_deletion_operations() {\n  // Your code here\n  \n}`,
            python: `def last_remaining_integer_after_alternating_deletion_operations():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 30,
        supportedLanguages: ["javascript"]
    },
    {
        id: 70,
        title: "Maximum Bitwise AND After Increment Operations",
        slug: "maximum-bitwise-and-after-increment-operations",
        difficulty: "Hard",
        category: "Math",
        tags: ["Math"],
        description: "Implement the solution for Maximum Bitwise AND After Increment Operations. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_bitwise_and_after_increment_operations([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_bitwise_and_after_increment_operations() {\n  // Your code here\n  \n}`,
            python: `def maximum_bitwise_and_after_increment_operations():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 76,
        supportedLanguages: ["javascript"]
    },
    {
        id: 71,
        title: "Count Routes to Climb a Rectangular Grid",
        slug: "count-routes-to-climb-a-rectangular-grid",
        difficulty: "Hard",
        category: "Dynammic Programming",
        tags: ["Dynammic Programming"],
        description: "Implement the solution for Count Routes to Climb a Rectangular Grid. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(count_routes_to_climb_a_rectangular_grid([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction count_routes_to_climb_a_rectangular_grid() {\n  // Your code here\n  \n}`,
            python: `def count_routes_to_climb_a_rectangular_grid():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 52,
        supportedLanguages: ["javascript"]
    },
    {
        id: 72,
        title: "Maximum Subgraph Score in a Tree",
        slug: "maximum-subgraph-score-in-a-tree",
        difficulty: "Hard",
        category: "Trees",
        tags: ["Trees"],
        description: "Implement the solution for Maximum Subgraph Score in a Tree. This is a Hard difficulty problem from LeetCode.",
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "[1,2,3]", output: "[1,2,3]" }
        ],
        testCases: [
            { input: "JSON.stringify(maximum_subgraph_score_in_a_tree([1,2,3]))", expected: "\"[1,2,3]\"" }
        ],
        starterCode: {
            javascript: `/**\n * @return {any}\n */\nfunction maximum_subgraph_score_in_a_tree() {\n  // Your code here\n  \n}`,
            python: `def maximum_subgraph_score_in_a_tree():\n    pass`
        },
        hints: ["Think about edge cases."],
        acceptance: 77,
        supportedLanguages: ["javascript"]
    },
];

export const getCategories = () => {
    const categories = new Set(codingProblems.map((p) => p.category));
    return Array.from(categories).sort();
};

export const getProblemById = (id: number) => codingProblems.find((p) => p.id === id);
