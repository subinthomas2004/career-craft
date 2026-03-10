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
    return "// Write your " + language + " solution here";
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
    "id": 1,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "javascript"
    ],
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [2,7,11,15], target = 9",
            "output": "[0,1]"
        }
    ],
    "testCases": [
        {
            "input": "twoSum([2,7,11,15], 9)",
            "expected": "[0,1]"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 33,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 2,
    "title": "Valid Anagram",
    "slug": "valid-anagram",
    "difficulty": "Easy",
    "category": "Strings",
    "tags": [
        "Strings",
        "javascript"
    ],
    "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = 'anagram', t = 'nagaram'",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "isAnagram('anagram', 'nagaram')",
            "expected": "true"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 49,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 3,
    "title": "Reverse String",
    "slug": "reverse-string",
    "difficulty": "Easy",
    "category": "Strings",
    "tags": [
        "Strings",
        "javascript"
    ],
    "description": "Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = ['h','e','l','l','o']",
            "output": "['o','l','l','e','h']"
        }
    ],
    "testCases": [
        {
            "input": "reverseString(['h','e','l','l','o'])",
            "expected": "['o','l','l','e','h']"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nfunction reverseString(s) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 55,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 4,
    "title": "Group Anagrams",
    "slug": "group-anagrams",
    "difficulty": "Medium",
    "category": "Hash Table",
    "tags": [
        "Hash Table",
        "javascript"
    ],
    "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "strs = ['eat','tea','tan','ate','nat','bat']",
            "output": "[['bat'],['nat','tan'],['ate','eat','tea']]"
        }
    ],
    "testCases": [
        {
            "input": "groupAnagrams(['eat','tea','tan','ate','nat','bat'])",
            "expected": "[['eat','tea','ate'],['tan','nat'],['bat']]"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nfunction groupAnagrams(strs) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 37,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 5,
    "title": "Longest Consecutive Sequence",
    "slug": "longest-consecutive-sequence",
    "difficulty": "Medium",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "javascript"
    ],
    "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [100,4,200,1,3,2]",
            "output": "4"
        }
    ],
    "testCases": [
        {
            "input": "longestConsecutive([100,4,200,1,3,2])",
            "expected": "4"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction longestConsecutive(nums) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 78,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 6,
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "tags": [
        "Two Pointers",
        "javascript"
    ],
    "description": "You are given an integer array `height` of length n. There are n vertical lines drawn such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "height = [1,8,6,2,5,4,8,3,7]",
            "output": "49"
        }
    ],
    "testCases": [
        {
            "input": "maxArea([1,8,6,2,5,4,8,3,7])",
            "expected": "49"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 55,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 7,
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Hard",
    "category": "Two Pointers",
    "tags": [
        "Two Pointers",
        "javascript"
    ],
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
            "output": "6"
        }
    ],
    "testCases": [
        {
            "input": "trap([0,1,0,2,1,0,1,3,2,1,2,1])",
            "expected": "6"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 66,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 8,
    "title": "Merge k Sorted Lists",
    "slug": "merge-k-sorted-lists",
    "difficulty": "Hard",
    "category": "Linked List",
    "tags": [
        "Linked List",
        "javascript"
    ],
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
            "output": "[1,1,2,3,4,4,5,6]"
        }
    ],
    "testCases": [
        {
            "input": "mergeKLists([[1,4,5],[1,3,4],[2,6]])",
            "expected": "[1,1,2,3,4,4,5,6]"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nfunction mergeKLists(lists) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 78,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 9,
    "title": "Minimum Window Substring",
    "slug": "minimum-window-substring",
    "difficulty": "Hard",
    "category": "Sliding Window",
    "tags": [
        "Sliding Window",
        "javascript"
    ],
    "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = 'ADOBECODEBANC', t = 'ABC'",
            "output": "'BANC'"
        }
    ],
    "testCases": [
        {
            "input": "minWindow('ADOBECODEBANC', 'ABC')",
            "expected": "'BANC'"
        }
    ],
    "starterCode": {
        "javascript": "/**\n * @param {string} s\n * @param {string} t\n * @return {string}\n */\nfunction minWindow(s, t) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 35,
    "supportedLanguages": [
        "javascript"
    ]
},
{
    "id": 10,
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "difficulty": "Easy",
    "category": "Stack",
    "tags": [
        "Stack",
        "python"
    ],
    "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = '()[]{}'",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "isValid('()[]{}')",
            "expected": "true"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 50,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 11,
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "python"
    ],
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "prices = [7,1,5,3,6,4]",
            "output": "5"
        }
    ],
    "testCases": [
        {
            "input": "maxProfit([7,1,5,3,6,4])",
            "expected": "5"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 73,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 12,
    "title": "Contains Duplicate",
    "slug": "contains-duplicate",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "python"
    ],
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,2,3,1]",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "containsDuplicate([1,2,3,1])",
            "expected": "true"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 56,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 13,
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating-characters",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "tags": [
        "Sliding Window",
        "python"
    ],
    "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = 'abcabcbb'",
            "output": "3"
        }
    ],
    "testCases": [
        {
            "input": "lengthOfLongestSubstring('abcabcbb')",
            "expected": "3"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 53,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 14,
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "difficulty": "Medium",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "python"
    ],
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. The algorithm must run in O(n) time without using the division operation.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,2,3,4]",
            "output": "[24,12,8,6]"
        }
    ],
    "testCases": [
        {
            "input": "productExceptSelf([1,2,3,4])",
            "expected": "[24,12,8,6]"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 34,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 15,
    "title": "Maximum Subarray",
    "slug": "maximum-subarray",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "python"
    ],
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            "output": "6"
        }
    ],
    "testCases": [
        {
            "input": "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])",
            "expected": "6"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 33,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 16,
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "difficulty": "Hard",
    "category": "Binary Search",
    "tags": [
        "Binary Search",
        "python"
    ],
    "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums1 = [1,3], nums2 = [2]",
            "output": "2.0"
        }
    ],
    "testCases": [
        {
            "input": "findMedianSortedArrays([1,3], [2])",
            "expected": "2.0"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 44,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 17,
    "title": "Regular Expression Matching",
    "slug": "regular-expression-matching",
    "difficulty": "Hard",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "python"
    ],
    "description": "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` and `'*'` where: `'.'` Matches any single character. `'*'` Matches zero or more of the preceding element.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = 'aa', p = 'a*'",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "isMatch('aa', 'a*')",
            "expected": "true"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 74,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 18,
    "title": "Largest Rectangle in Histogram",
    "slug": "largest-rectangle-in-histogram",
    "difficulty": "Hard",
    "category": "Stack",
    "tags": [
        "Stack",
        "python"
    ],
    "description": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "heights = [2,1,5,6,2,3]",
            "output": "10"
        }
    ],
    "testCases": [
        {
            "input": "largestRectangleArea([2,1,5,6,2,3])",
            "expected": "10"
        }
    ],
    "starterCode": {
        "python": "class Solution:\n    def largestRectangleArea(self, heights: list[int]) -> int:\n        "
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 51,
    "supportedLanguages": [
        "python"
    ]
},
{
    "id": 19,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "java"
    ],
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [2,7,11,15], target = 9",
            "output": "[0,1]"
        }
    ],
    "testCases": [
        {
            "input": "twoSum(new int[]{2,7,11,15}, 9)",
            "expected": "new int[]{0,1}"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 65,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 20,
    "title": "Merge Two Sorted Lists",
    "slug": "merge-two-sorted-lists",
    "difficulty": "Easy",
    "category": "Linked List",
    "tags": [
        "Linked List",
        "java"
    ],
    "description": "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "list1 = [1,2,4], list2 = [1,3,4]",
            "output": "[1,1,2,3,4,4]"
        }
    ],
    "testCases": [
        {
            "input": "mergeTwoLists(l1, l2)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 66,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 21,
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "java"
    ],
    "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "n = 2",
            "output": "2"
        }
    ],
    "testCases": [
        {
            "input": "climbStairs(2)",
            "expected": "2"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 77,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 22,
    "title": "Word Break",
    "slug": "word-break",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "java"
    ],
    "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = 'leetcode', wordDict = ['leet','code']",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "wordBreak('leetcode', Arrays.asList('leet','code'))",
            "expected": "true"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 78,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 23,
    "title": "Coin Change",
    "slug": "coin-change",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "java"
    ],
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "coins = [1,2,5], amount = 11",
            "output": "3"
        }
    ],
    "testCases": [
        {
            "input": "coinChange(new int[]{1,2,5}, 11)",
            "expected": "3"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 78,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 24,
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "difficulty": "Medium",
    "category": "Graphs",
    "tags": [
        "Graphs",
        "java"
    ],
    "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]",
            "output": "3"
        }
    ],
    "testCases": [
        {
            "input": "numIslands(grid)",
            "expected": "3"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 30,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 25,
    "title": "N-Queens",
    "slug": "n-queens",
    "difficulty": "Hard",
    "category": "Backtracking",
    "tags": [
        "Backtracking",
        "java"
    ],
    "description": "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Given an integer `n`, return all distinct solutions to the n-queens puzzle.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "n = 4",
            "output": "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]"
        }
    ],
    "testCases": [
        {
            "input": "solveNQueens(4)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 57,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 26,
    "title": "Edit Distance",
    "slug": "edit-distance",
    "difficulty": "Hard",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "java"
    ],
    "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "word1 = 'horse', word2 = 'ros'",
            "output": "3"
        }
    ],
    "testCases": [
        {
            "input": "minDistance('horse', 'ros')",
            "expected": "3"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public int minDistance(String word1, String word2) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 40,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 27,
    "title": "Word Search II",
    "slug": "word-search-ii",
    "difficulty": "Hard",
    "category": "Trie",
    "tags": [
        "Trie",
        "java"
    ],
    "description": "Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "board = [['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], words = ['oath','pea','eat','rain']",
            "output": "['eat','oath']"
        }
    ],
    "testCases": [
        {
            "input": "findWords(board, new String[]{'oath','pea','eat','rain'})",
            "expected": "['eat','oath']"
        }
    ],
    "starterCode": {
        "java": "class Solution {\n    public List<String> findWords(char[][] board, String[] words) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 45,
    "supportedLanguages": [
        "java"
    ]
},
{
    "id": 28,
    "title": "Palindrome Number",
    "slug": "palindrome-number",
    "difficulty": "Easy",
    "category": "Math",
    "tags": [
        "Math",
        "cpp"
    ],
    "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "x = 121",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "isPalindrome(121)",
            "expected": "true"
        }
    ],
    "starterCode": {
        "cpp": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 30,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 29,
    "title": "Maximum Depth of Binary Tree",
    "slug": "maximum-depth-of-binary-tree",
    "difficulty": "Easy",
    "category": "Trees",
    "tags": [
        "Trees",
        "cpp"
    ],
    "description": "Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "root = [3,9,20,null,null,15,7]",
            "output": "3"
        }
    ],
    "testCases": [
        {
            "input": "maxDepth(root)",
            "expected": "3"
        }
    ],
    "starterCode": {
        "cpp": "/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 49,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 30,
    "title": "Single Number",
    "slug": "single-number",
    "difficulty": "Easy",
    "category": "Bit Manipulation",
    "tags": [
        "Bit Manipulation",
        "cpp"
    ],
    "description": "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [2,2,1]",
            "output": "1"
        }
    ],
    "testCases": [
        {
            "input": "singleNumber({2,2,1})",
            "expected": "1"
        }
    ],
    "starterCode": {
        "cpp": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 53,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 31,
    "title": "Generate Parentheses",
    "slug": "generate-parentheses",
    "difficulty": "Medium",
    "category": "Backtracking",
    "tags": [
        "Backtracking",
        "cpp"
    ],
    "description": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "n = 3",
            "output": "['((()))','(()())','(())()','()(())','()()()']"
        }
    ],
    "testCases": [
        {
            "input": "generateParenthesis(3)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "cpp": "class Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 57,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 32,
    "title": "Permutations",
    "slug": "permutations",
    "difficulty": "Medium",
    "category": "Backtracking",
    "tags": [
        "Backtracking",
        "cpp"
    ],
    "description": "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,2,3]",
            "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
        }
    ],
    "testCases": [
        {
            "input": "permute({1,2,3})",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "cpp": "class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 40,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 33,
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "Medium",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "cpp"
    ],
    "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            "output": "[[1,6],[8,10],[15,18]]"
        }
    ],
    "testCases": [
        {
            "input": "merge({{1,3},{2,6},{8,10},{15,18}})",
            "expected": "{{1,6},{8,10},{15,18}}"
        }
    ],
    "starterCode": {
        "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 32,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 34,
    "title": "LRU Cache",
    "slug": "lru-cache",
    "difficulty": "Hard",
    "category": "Design",
    "tags": [
        "Design",
        "cpp"
    ],
    "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class. It must support `get` and `put` operations in O(1) average time complexity.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "LRUCache lRUCache = new LRUCache(2); lRUCache.put(1, 1);",
            "output": "null"
        }
    ],
    "testCases": [
        {
            "input": "cache.get(1)",
            "expected": "1"
        }
    ],
    "starterCode": {
        "cpp": "class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n    \n    int get(int key) {\n        \n    }\n    \n    void put(int key, int value) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 50,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 35,
    "title": "Reverse Nodes in k-Group",
    "slug": "reverse-nodes-in-k-group",
    "difficulty": "Hard",
    "category": "Linked List",
    "tags": [
        "Linked List",
        "cpp"
    ],
    "description": "Given the `head` of a linked list, reverse the nodes of the list `k` at a time, and return the modified list. `k` is a positive integer and is less than or equal to the length of the linked list.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "head = [1,2,3,4,5], k = 2",
            "output": "[2,1,4,3,5]"
        }
    ],
    "testCases": [
        {
            "input": "reverseKGroup(head, 2)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "cpp": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseKGroup(ListNode* head, int k) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 60,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 36,
    "title": "First Missing Positive",
    "slug": "first-missing-positive",
    "difficulty": "Hard",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "cpp"
    ],
    "description": "Given an unsorted integer array `nums`, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses constant extra space.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [3,4,-1,1]",
            "output": "2"
        }
    ],
    "testCases": [
        {
            "input": "firstMissingPositive({3,4,-1,1})",
            "expected": "2"
        }
    ],
    "starterCode": {
        "cpp": "class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        \n    }\n};"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 41,
    "supportedLanguages": [
        "cpp"
    ]
},
{
    "id": 37,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "c"
    ],
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [2,7,11,15], target = 9",
            "output": "[0,1]"
        }
    ],
    "testCases": [
        {
            "input": "twoSum(nums, 4, 9, returnSize)",
            "expected": "[0,1]"
        }
    ],
    "starterCode": {
        "c": "/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 36,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 38,
    "title": "Remove Element",
    "slug": "remove-element",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "c"
    ],
    "description": "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. The relative order of the elements may be changed.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [3,2,2,3], val = 3",
            "output": "2, nums = [2,2,_,_]"
        }
    ],
    "testCases": [
        {
            "input": "removeElement(nums, 4, 3)",
            "expected": "2"
        }
    ],
    "starterCode": {
        "c": "int removeElement(int* nums, int numsSize, int val) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 76,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 39,
    "title": "Search Insert Position",
    "slug": "search-insert-position",
    "difficulty": "Easy",
    "category": "Binary Search",
    "tags": [
        "Binary Search",
        "c"
    ],
    "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime complexity.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,3,5,6], target = 5",
            "output": "2"
        }
    ],
    "testCases": [
        {
            "input": "searchInsert(nums, 4, 5)",
            "expected": "2"
        }
    ],
    "starterCode": {
        "c": "int searchInsert(int* nums, int numsSize, int target) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 74,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 40,
    "title": "Search a 2D Matrix",
    "slug": "search-a-2d-matrix",
    "difficulty": "Medium",
    "category": "Binary Search",
    "tags": [
        "Binary Search",
        "c"
    ],
    "description": "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`. This matrix has the following properties: Integers in each row are sorted from left to right. The first integer of each row is greater than the last integer of the previous row.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "searchMatrix(matrix, 3, 4, 3)",
            "expected": "true"
        }
    ],
    "starterCode": {
        "c": "bool searchMatrix(int** matrix, int matrixSize, int* matrixColSize, int target) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 40,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 41,
    "title": "Sort Colors",
    "slug": "sort-colors",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "tags": [
        "Two Pointers",
        "c"
    ],
    "description": "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [2,0,2,1,1,0]",
            "output": "[0,0,1,1,2,2]"
        }
    ],
    "testCases": [
        {
            "input": "sortColors(nums, 6)",
            "expected": "[0,0,1,1,2,2]"
        }
    ],
    "starterCode": {
        "c": "void sortColors(int* nums, int numsSize) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 36,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 42,
    "title": "Reverse Linked List II",
    "slug": "reverse-linked-list-ii",
    "difficulty": "Medium",
    "category": "Linked List",
    "tags": [
        "Linked List",
        "c"
    ],
    "description": "Given the `head` of a singly linked list and two integers `left` and `right` where `left <= right`, reverse the nodes of the list from position `left` to position `right`, and return the reversed list.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "head = [1,2,3,4,5], left = 2, right = 4",
            "output": "[1,4,3,2,5]"
        }
    ],
    "testCases": [
        {
            "input": "reverseBetween(head, 2, 4)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "c": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     struct ListNode *next;\n * };\n */\nstruct ListNode* reverseBetween(struct ListNode* head, int left, int right) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 78,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 43,
    "title": "Merge k Sorted Lists",
    "slug": "merge-k-sorted-lists",
    "difficulty": "Hard",
    "category": "Linked List",
    "tags": [
        "Linked List",
        "c"
    ],
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
            "output": "[1,1,2,3,4,4,5,6]"
        }
    ],
    "testCases": [
        {
            "input": "mergeKLists(lists, 3)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "c": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     struct ListNode *next;\n * };\n */\nstruct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 35,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 44,
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-maximum",
    "difficulty": "Hard",
    "category": "Sliding Window",
    "tags": [
        "Sliding Window",
        "c"
    ],
    "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
            "output": "[3,3,5,5,6,7]"
        }
    ],
    "testCases": [
        {
            "input": "maxSlidingWindow(nums, 8, 3, returnSize)",
            "expected": "[3,3,5,5,6,7]"
        }
    ],
    "starterCode": {
        "c": "/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* maxSlidingWindow(int* nums, int numsSize, int k, int* returnSize) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 45,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 45,
    "title": "Sudoku Solver",
    "slug": "sudoku-solver",
    "difficulty": "Hard",
    "category": "Backtracking",
    "tags": [
        "Backtracking",
        "c"
    ],
    "description": "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, column, and 3x3 sub-box. The empty cells are indicated by the character '.'.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "board = [...]",
            "output": "solved_board"
        }
    ],
    "testCases": [
        {
            "input": "solveSudoku(board, 9, boardColSize)",
            "expected": "solved_board"
        }
    ],
    "starterCode": {
        "c": "void solveSudoku(char** board, int boardSize, int* boardColSize) {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 35,
    "supportedLanguages": [
        "c"
    ]
},
{
    "id": 46,
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "difficulty": "Easy",
    "category": "Stack",
    "tags": [
        "Stack",
        "csharp"
    ],
    "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = '()[]{}'",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "IsValid('()[]{}')",
            "expected": "true"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public bool IsValid(string s) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 71,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 47,
    "title": "Maximum Subarray",
    "slug": "maximum-subarray",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "csharp"
    ],
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            "output": "6"
        }
    ],
    "testCases": [
        {
            "input": "MaxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})",
            "expected": "6"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public int MaxSubArray(int[] nums) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 40,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 48,
    "title": "Symmetric Tree",
    "slug": "symmetric-tree",
    "difficulty": "Easy",
    "category": "Trees",
    "tags": [
        "Trees",
        "csharp"
    ],
    "description": "Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "root = [1,2,2,3,4,4,3]",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "IsSymmetric(root)",
            "expected": "true"
        }
    ],
    "starterCode": {
        "csharp": "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     public int val;\n *     public TreeNode left;\n *     public TreeNode right;\n *     public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\npublic class Solution {\n    public bool IsSymmetric(TreeNode root) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 44,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 49,
    "title": "Top K Frequent Elements",
    "slug": "top-k-frequent-elements",
    "difficulty": "Medium",
    "category": "Heap",
    "tags": [
        "Heap",
        "csharp"
    ],
    "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,1,1,2,2,3], k = 2",
            "output": "[1,2]"
        }
    ],
    "testCases": [
        {
            "input": "TopKFrequent(new int[]{1,1,1,2,2,3}, 2)",
            "expected": "[1,2]"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public int[] TopKFrequent(int[] nums, int k) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 77,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 50,
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "difficulty": "Medium",
    "category": "Binary Search",
    "tags": [
        "Binary Search",
        "csharp"
    ],
    "description": "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index. Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [4,5,6,7,0,1,2], target = 0",
            "output": "4"
        }
    ],
    "testCases": [
        {
            "input": "Search(new int[]{4,5,6,7,0,1,2}, 0)",
            "expected": "4"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public int Search(int[] nums, int target) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 51,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 51,
    "title": "Course Schedule",
    "slug": "course-schedule",
    "difficulty": "Medium",
    "category": "Graphs",
    "tags": [
        "Graphs",
        "csharp"
    ],
    "description": "There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "numCourses = 2, prerequisites = [[1,0]]",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "CanFinish(2, new int[][]{new int[]{1,0}})",
            "expected": "true"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public bool CanFinish(int numCourses, int[][] prerequisites) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 51,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 52,
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "difficulty": "Hard",
    "category": "Binary Search",
    "tags": [
        "Binary Search",
        "csharp"
    ],
    "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums1 = [1,3], nums2 = [2]",
            "output": "2.0"
        }
    ],
    "testCases": [
        {
            "input": "FindMedianSortedArrays(new int[]{1,3}, new int[]{2})",
            "expected": "2.0"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public double FindMedianSortedArrays(int[] nums1, int[] nums2) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 38,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 53,
    "title": "Serialize and Deserialize Binary Tree",
    "slug": "serialize-and-deserialize-binary-tree",
    "difficulty": "Hard",
    "category": "Trees",
    "tags": [
        "Trees",
        "csharp"
    ],
    "description": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "root = [1,2,3,null,null,4,5]",
            "output": "[1,2,3,null,null,4,5]"
        }
    ],
    "testCases": [
        {
            "input": "codec.deserialize(codec.serialize(root))",
            "expected": "root"
        }
    ],
    "starterCode": {
        "csharp": "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     public int val;\n *     public TreeNode left;\n *     public TreeNode right;\n *     public TreeNode(int x) { val = x; }\n * }\n */\npublic class Codec {\n    // Encodes a tree to a single string.\n    public string serialize(TreeNode root) {\n        \n    }\n\n    // Decodes your encoded data to tree.\n    public TreeNode deserialize(string data) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 72,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 54,
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Hard",
    "category": "Two Pointers",
    "tags": [
        "Two Pointers",
        "csharp"
    ],
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
            "output": "6"
        }
    ],
    "testCases": [
        {
            "input": "Trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})",
            "expected": "6"
        }
    ],
    "starterCode": {
        "csharp": "public class Solution {\n    public int Trap(int[] height) {\n        \n    }\n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 33,
    "supportedLanguages": [
        "csharp"
    ]
},
{
    "id": 55,
    "title": "Contains Duplicate",
    "slug": "contains-duplicate",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "typescript"
    ],
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [1,2,3,1]",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "containsDuplicate([1,2,3,1])",
            "expected": "true"
        }
    ],
    "starterCode": {
        "typescript": "function containsDuplicate(nums: number[]): boolean {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 67,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 56,
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "difficulty": "Easy",
    "category": "Strings",
    "tags": [
        "Strings",
        "typescript"
    ],
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = 'A man, a plan, a canal: Panama'",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "isPalindrome('A man, a plan, a canal: Panama')",
            "expected": "true"
        }
    ],
    "starterCode": {
        "typescript": "function isPalindrome(s: string): boolean {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 69,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 57,
    "title": "Intersection of Two Arrays",
    "slug": "intersection-of-two-arrays",
    "difficulty": "Easy",
    "category": "Arrays",
    "tags": [
        "Arrays",
        "typescript"
    ],
    "description": "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums1 = [1,2,2,1], nums2 = [2,2]",
            "output": "[2]"
        }
    ],
    "testCases": [
        {
            "input": "intersection([1,2,2,1], [2,2])",
            "expected": "[2]"
        }
    ],
    "starterCode": {
        "typescript": "function intersection(nums1: number[], nums2: number[]): number[] {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 33,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 58,
    "title": "Kth Largest Element in an Array",
    "slug": "kth-largest-element-in-an-array",
    "difficulty": "Medium",
    "category": "Heap",
    "tags": [
        "Heap",
        "typescript"
    ],
    "description": "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array. Note that it is the `kth` largest element in the sorted order, not the `kth` distinct element.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [3,2,1,5,6,4], k = 2",
            "output": "5"
        }
    ],
    "testCases": [
        {
            "input": "findKthLargest([3,2,1,5,6,4], 2)",
            "expected": "5"
        }
    ],
    "starterCode": {
        "typescript": "function findKthLargest(nums: number[], k: number): number {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 47,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 59,
    "title": "Validate Binary Search Tree",
    "slug": "validate-binary-search-tree",
    "difficulty": "Medium",
    "category": "Trees",
    "tags": [
        "Trees",
        "typescript"
    ],
    "description": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "root = [2,1,3]",
            "output": "true"
        }
    ],
    "testCases": [
        {
            "input": "isValidBST(root)",
            "expected": "true"
        }
    ],
    "starterCode": {
        "typescript": "/**\n * Definition for a binary tree node.\n * class TreeNode {\n *     val: number\n *     left: TreeNode | null\n *     right: TreeNode | null\n *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n *         this.val = (val===undefined ? 0 : val)\n *         this.left = (left===undefined ? null : left)\n *         this.right = (right===undefined ? null : right)\n *     }\n * }\n */\nfunction isValidBST(root: TreeNode | null): boolean {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 46,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 60,
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "tags": [
        "Dynamic Programming",
        "typescript"
    ],
    "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "nums = [10,9,2,5,3,7,101,18]",
            "output": "4"
        }
    ],
    "testCases": [
        {
            "input": "lengthOfLIS([10,9,2,5,3,7,101,18])",
            "expected": "4"
        }
    ],
    "starterCode": {
        "typescript": "function lengthOfLIS(nums: number[]): number {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 51,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 61,
    "title": "Merge k Sorted Lists",
    "slug": "merge-k-sorted-lists",
    "difficulty": "Hard",
    "category": "Linked List",
    "tags": [
        "Linked List",
        "typescript"
    ],
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
            "output": "[1,1,2,3,4,4,5,6]"
        }
    ],
    "testCases": [
        {
            "input": "mergeKLists(lists)",
            "expected": "expected_list"
        }
    ],
    "starterCode": {
        "typescript": "/**\n * Definition for singly-linked list.\n * class ListNode {\n *     val: number\n *     next: ListNode | null\n *     constructor(val?: number, next?: ListNode | null) {\n *         this.val = (val===undefined ? 0 : val)\n *         this.next = (next===undefined ? null : next)\n *     }\n * }\n */\nfunction mergeKLists(lists: Array<ListNode | null>): ListNode | null {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 48,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 62,
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "difficulty": "Hard",
    "category": "Trees",
    "tags": [
        "Trees",
        "typescript"
    ],
    "description": "Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
            "output": "[3,9,20,null,null,15,7]"
        }
    ],
    "testCases": [
        {
            "input": "buildTree([3,9,20,15,7], [9,3,15,20,7])",
            "expected": "root"
        }
    ],
    "starterCode": {
        "typescript": "/**\n * Definition for a binary tree node.\n * class TreeNode {\n *     val: number\n *     left: TreeNode | null\n *     right: TreeNode | null\n *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n *         this.val = (val===undefined ? 0 : val)\n *         this.left = (left===undefined ? null : left)\n *         this.right = (right===undefined ? null : right)\n *     }\n * }\n */\nfunction buildTree(preorder: number[], inorder: number[]): TreeNode | null {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 57,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 63,
    "title": "Basic Calculator",
    "slug": "basic-calculator",
    "difficulty": "Hard",
    "category": "Strings",
    "tags": [
        "Strings",
        "typescript"
    ],
    "description": "Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation. The expression string may contain open `(` and closing parentheses `)`, the plus `+` or minus sign `-`, non-negative integers and empty spaces.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "s = '(1+(4+5+2)-3)+(6+8)'",
            "output": "23"
        }
    ],
    "testCases": [
        {
            "input": "calculate('(1+(4+5+2)-3)+(6+8)')",
            "expected": "23"
        }
    ],
    "starterCode": {
        "typescript": "function calculate(s: string): number {\n    \n}"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 37,
    "supportedLanguages": [
        "typescript"
    ]
},
{
    "id": 64,
    "title": "Combine Two Tables",
    "slug": "combine-two-tables",
    "difficulty": "Easy",
    "category": "Joins",
    "tags": [
        "Joins",
        "sql"
    ],
    "description": "Write a SQL query to report the first name, last name, city, and state of each person in the `Person` table. If the address of a `PersonId` is not present in the `Address` table, report `null` instead.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Person table, Address table",
            "output": "FirstName, LastName, City, State"
        }
    ],
    "testCases": [
        {
            "input": "Run Combine Two Tables query",
            "expected": "Return matching rows"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 30,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 65,
    "title": "Duplicate Emails",
    "slug": "duplicate-emails",
    "difficulty": "Easy",
    "category": "Group By",
    "tags": [
        "Group By",
        "sql"
    ],
    "description": "Write an SQL query to report all the duplicate emails. Note that it's guaranteed that the email field is not NULL.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Person table: (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com')",
            "output": "Email: a@b.com"
        }
    ],
    "testCases": [
        {
            "input": "Run Duplicate Emails query",
            "expected": "Return duplicate emails"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 66,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 66,
    "title": "Customers Who Never Order",
    "slug": "customers-who-never-order",
    "difficulty": "Easy",
    "category": "Joins",
    "tags": [
        "Joins",
        "sql"
    ],
    "description": "Write an SQL query to report all customers who never order anything.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Customers table, Orders table",
            "output": "Customers"
        }
    ],
    "testCases": [
        {
            "input": "Run Customers Who Never Order query",
            "expected": "Return unmatched customers"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 46,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 67,
    "title": "Nth Highest Salary",
    "slug": "nth-highest-salary",
    "difficulty": "Medium",
    "category": "Functions",
    "tags": [
        "Functions",
        "sql"
    ],
    "description": "Write an SQL query to report the `n`th highest salary from the Employee table. If there is no `n`th highest salary, the query should report `null`.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Employee table, n = 2",
            "output": "Second Highest Salary"
        }
    ],
    "testCases": [
        {
            "input": "Run Nth Highest Salary query",
            "expected": "Return nth salary"
        }
    ],
    "starterCode": {
        "sql": "CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT\nBEGIN\n  RETURN (\n      # Write your MySQL query statement below.\n      \n  );\nEND"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 65,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 68,
    "title": "Department Highest Salary",
    "slug": "department-highest-salary",
    "difficulty": "Medium",
    "category": "Joins",
    "tags": [
        "Joins",
        "sql"
    ],
    "description": "Write an SQL query to find employees who have the highest salary in each of the departments.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Employee table, Department table",
            "output": "Department, Employee, Salary"
        }
    ],
    "testCases": [
        {
            "input": "Run Department Highest Salary query",
            "expected": "Return max earner per branch"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 56,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 69,
    "title": "Rank Scores",
    "slug": "rank-scores",
    "difficulty": "Medium",
    "category": "Window Functions",
    "tags": [
        "Window Functions",
        "sql"
    ],
    "description": "Write an SQL query to rank the scores. The ranking should be calculated according to the following rules: 1. The scores should be ranked from the highest to the lowest. 2. If there is a tie between two scores, both should have the same ranking. 3. After a tie, the next ranking number should be the next consecutive integer value.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Scores table",
            "output": "Score, Rank"
        }
    ],
    "testCases": [
        {
            "input": "Run Rank Scores query",
            "expected": "Return dense rank"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 49,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 70,
    "title": "Department Top Three Salaries",
    "slug": "department-top-three-salaries",
    "difficulty": "Hard",
    "category": "Joins",
    "tags": [
        "Joins",
        "sql"
    ],
    "description": "A company's executives are interested in seeing who earns the most money in each of the company's departments. A high earner in a department is an employee who has a salary in the top three unique salaries for that department.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Employee table, Department table",
            "output": "Department, Employee, Salary"
        }
    ],
    "testCases": [
        {
            "input": "Run Department Top Three Salaries query",
            "expected": "Return top 3 earners"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 70,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 71,
    "title": "Human Traffic of Stadium",
    "slug": "human-traffic-of-stadium",
    "difficulty": "Hard",
    "category": "Window Functions",
    "tags": [
        "Window Functions",
        "sql"
    ],
    "description": "Write an SQL query to display the records with three or more rows with consecutive `id`'s, and the number of people is greater than or equal to 100 for each. Return the result table ordered by `visit_date` in ascending order.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Stadium table",
            "output": "id, visit_date, people"
        }
    ],
    "testCases": [
        {
            "input": "Run Human Traffic of Stadium query",
            "expected": "Return consecutive days > 100"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 47,
    "supportedLanguages": [
        "sql"
    ]
},
{
    "id": 72,
    "title": "Trips and Users",
    "slug": "trips-and-users",
    "difficulty": "Hard",
    "category": "Joins",
    "tags": [
        "Joins",
        "sql"
    ],
    "description": "The cancellation rate is computed by dividing the number of canceled (by client or driver) requests with unbanned users by the total number of requests with unbanned users on that day. Write an SQL query to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between '2013-10-01' and '2013-10-03'. Round Cancellation Rate to two decimal points.",
    "constraints": [
        "1 <= n <= 10^4",
        "Data types fit within standard bounds"
    ],
    "examples": [
        {
            "input": "Trips table, Users table",
            "output": "Day, Cancellation Rate"
        }
    ],
    "testCases": [
        {
            "input": "Run Trips and Users query",
            "expected": "Return rounded rate"
        }
    ],
    "starterCode": {
        "sql": "-- Write your MySQL query statement below\n"
    },
    "hints": [
        "Think about optimal time complexity.",
        "Consider edge cases."
    ],
    "acceptance": 47,
    "supportedLanguages": [
        "sql"
    ]
}
];

export function getCategories() {
    return Array.from(new Set(codingProblems.map(p => p.category)));
}

export function getProblemById(id: number) {
    return codingProblems.find(p => p.id === id);
}
