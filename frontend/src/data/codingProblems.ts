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

// Languages list and utility
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

/**
 * Get starter code for a problem in any supported language.
 * Returns explicit starter code if available, or auto-generates a template.
 */
export function getStarterCode(problem: CodingProblem, language: LanguageId): string {
    // Return explicit starter code if available
    const explicit = problem.starterCode[language as keyof StarterCode];
    if (explicit) return explicit;

    // Auto-generate based on the JS starter code (if available) or defaults
    const jsCode = problem.starterCode.javascript;
    if (!jsCode) {
        // Fallback for language-specific problems that might not have JS code
        return generateTemplateForLanguage(language, problem);
    }

    const funcMatch = jsCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
    const classMatch = jsCode.match(/class\s+(\w+)/);

    if (classMatch) {
        return generateClassTemplate(jsCode, language);
    }

    const funcName = funcMatch ? funcMatch[1] : "solution";
    const params = funcMatch ? funcMatch[2].split(",").map(p => p.trim()).filter(Boolean) : ["input"];

    return generateTemplateForLanguage(language, problem, funcName, params);
}

function generateTemplateForLanguage(language: LanguageId, problem: CodingProblem, funcName = "solution", params = ["input"]): string {
    switch (language) {
        case "java": return generateJavaTemplate(funcName, params, problem);
        case "cpp": return generateCppTemplate(funcName, params, problem);
        case "c": return generateCTemplate(funcName, params, problem);
        case "csharp": return generateCSharpTemplate(funcName, params, problem);
        case "typescript": return generateTypeScriptTemplate(funcName, params, problem);
        case "python": return `def ${funcName}(${params.join(", ")}):\n    # ${problem.title}\n    # Your code here\n    pass`;
        case "javascript": return `function ${funcName}(${params.join(", ")}) {\n    // ${problem.title}\n    // Your code here\n}`;
        case "sql": return `-- ${problem.title}\n-- Write your SQL query here\n\nSELECT * FROM table_name;`;
        default: return `// Write your ${language} solution here`;
    }
}

function generateJavaTemplate(funcName: string, params: string[], problem: CodingProblem): string {
    const javaParams = params.map(p => `Object ${p}`).join(", ");
    return `import java.util.*;

class Solution {
    /**
     * ${problem.title}
     * ${problem.constraints?.[0] || ""}
     */
    public Object ${funcName}(${javaParams}) {
        // Your code here
        return null;
    }
}`;
}

function generateCppTemplate(funcName: string, params: string[], _problem: CodingProblem): string {
    const cppParams = params.map(p => `auto ${p}`).join(", ");
    return `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    auto ${funcName}(${cppParams}) {
        // Your code here
        
    }
};`;
}

function generateCTemplate(funcName: string, params: string[], _problem: CodingProblem): string {
    const cParams = params.map(p => `int ${p}`).join(", ");
    return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

/*
 * Note: The returned value must be freed by the caller.
 */
int ${funcName}(${cParams}) {
    // Your code here
    return 0;
}`;
}

function generateCSharpTemplate(funcName: string, params: string[], _problem: CodingProblem): string {
    const csParams = params.map(p => `object ${p}`).join(", ");
    const pascalName = funcName.charAt(0).toUpperCase() + funcName.slice(1);
    return `using System;
using System.Collections.Generic;
using System.Linq;

public class Solution {
    public object ${pascalName}(${csParams}) {
        // Your code here
        return null;
    }
}`;
}

function generateTypeScriptTemplate(funcName: string, params: string[], _problem: CodingProblem): string {
    const tsParams = params.map(p => `${p}: any`).join(", ");
    return `function ${funcName}(${tsParams}): any {
  // Your code here
  
}`;
}

function generateClassTemplate(jsCode: string, language: string): string {
    const className = jsCode.match(/class\s+(\w+)/)?.[1] || "Solution";
    const methods = [...jsCode.matchAll(/(\w+)\s*\(([^)]*)\)\s*\{/g)];

    switch (language) {
        case "java": {
            const javaMethods = methods
                .filter(m => m[1] !== "constructor")
                .map(m => `    public void ${m[1]}(${m[2].split(",").map(p => `int ${p.trim()}`).join(", ")}) {\n        // Your code here\n    }`)
                .join("\n\n");
            return `class ${className} {\n    public ${className}() {\n        // Initialize\n    }\n\n${javaMethods}\n}`;
        }
        case "cpp": {
            const cppMethods = methods
                .filter(m => m[1] !== "constructor")
                .map(m => `    void ${m[1]}(${m[2].split(",").map(p => `int ${p.trim()}`).join(", ")}) {\n        // Your code here\n    }`)
                .join("\n\n");
            return `#include <stack>\n#include <algorithm>\nusing namespace std;\n\nclass ${className} {\npublic:\n    ${className}() {\n        // Initialize\n    }\n\n${cppMethods}\n};`;
        }
        case "typescript": {
            return jsCode.replace(/function /g, "").replace(/(\w+)\(([^)]*)\)/g, (_, name, params) => {
                if (name === "constructor") return `constructor()`;
                return `${name}(${params.split(",").map((p: string) => `${p.trim()}: any`).join(", ")}): any`;
            });
        }
        default:
            return `// ${className} implementation\n// Your code here`;
    }
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

export const baseProblems: CodingProblem[] = [
    // ========== ARRAYS ==========
    {
        id: 1,
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Array", "Hash Table"],
        description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the answer as an array of two indices.",
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ],
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1, 2]" },
            { input: "nums = [3,3], target = 6", output: "[0, 1]" }
        ],
        testCases: [
            { input: "JSON.stringify(twoSum([2,7,11,15], 9))", expected: "[0,1]" },
            { input: "JSON.stringify(twoSum([3,2,4], 6))", expected: "[1,2]" },
            { input: "JSON.stringify(twoSum([3,3], 6))", expected: "[0,1]" },
            { input: "JSON.stringify(twoSum([1,5,3,7], 8))", expected: "[1,2]" },
            { input: "JSON.stringify(twoSum([-1,-2,-3,-4,-5], -8))", expected: "[2,4]" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
  
}`,
            python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`
        },
        hints: [
            "Think about what value you need to find for each element to reach the target.",
            "Use a hash map to store values you've already seen and their indices.",
            "For each element, check if (target - element) exists in your hash map. If yes, return both indices."
        ],
        acceptance: 49
    },
    {
        id: 2,
        title: "Remove Duplicates from Sorted Array",
        slug: "remove-duplicates",
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Array", "Two Pointers"],
        description: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.\n\nReturn the number of unique elements in `nums`.",
        constraints: [
            "1 <= nums.length <= 3 * 10^4",
            "-100 <= nums[i] <= 100",
            "nums is sorted in non-decreasing order."
        ],
        examples: [
            { input: "nums = [1,1,2]", output: "2", explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively." },
            { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5", explanation: "Your function should return k = 5." }
        ],
        testCases: [
            { input: "removeDuplicates([1,1,2])", expected: "2" },
            { input: "removeDuplicates([0,0,1,1,1,2,2,3,3,4])", expected: "5" },
            { input: "removeDuplicates([1])", expected: "1" },
            { input: "removeDuplicates([1,2,3])", expected: "3" },
            { input: "removeDuplicates([1,1,1,1])", expected: "1" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function removeDuplicates(nums) {
  // Your code here
  
}`,
            python: `def removeDuplicates(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "Use two pointers: one for iterating and one for the position of the next unique element.",
            "Since the array is sorted, duplicates are always adjacent.",
            "Keep a slow pointer at position 1. For each element from index 1, if it's different from the previous, place it at the slow pointer and increment."
        ],
        acceptance: 52
    },
    {
        id: 3,
        title: "Container With Most Water",
        slug: "container-with-most-water",
        difficulty: "Medium",
        category: "Arrays",
        tags: ["Array", "Two Pointers", "Greedy"],
        description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the i-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
        constraints: [
            "n == height.length",
            "2 <= n <= 10^5",
            "0 <= height[i] <= 10^4"
        ],
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area of water the container can contain is 49." },
            { input: "height = [1,1]", output: "1" }
        ],
        testCases: [
            { input: "maxArea([1,8,6,2,5,4,8,3,7])", expected: "49" },
            { input: "maxArea([1,1])", expected: "1" },
            { input: "maxArea([4,3,2,1,4])", expected: "16" },
            { input: "maxArea([1,2,1])", expected: "2" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Your code here
  
}`,
            python: `def maxArea(height):
    """
    :type height: List[int]
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "The brute force approach tries every pair — can you do better?",
            "Use two pointers at both ends. The area is limited by the shorter line.",
            "Move the pointer pointing to the shorter line inward, as moving the taller one can never increase the area."
        ],
        acceptance: 54
    },
    {
        id: 4,
        title: "3Sum",
        slug: "three-sum",
        difficulty: "Medium",
        category: "Arrays",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
        constraints: [
            "3 <= nums.length <= 3000",
            "-10^5 <= nums[i] <= 10^5"
        ],
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
            { input: "nums = [0,1,1]", output: "[]" },
            { input: "nums = [0,0,0]", output: "[[0,0,0]]" }
        ],
        testCases: [
            { input: "JSON.stringify(threeSum([-1,0,1,2,-1,-4]).sort())", expected: "[[-1,-1,2],[-1,0,1]]" },
            { input: "JSON.stringify(threeSum([0,1,1]))", expected: "[]" },
            { input: "JSON.stringify(threeSum([0,0,0]))", expected: "[[0,0,0]]" },
            { input: "JSON.stringify(threeSum([-2,0,1,1,2]).sort())", expected: "[[-2,0,2],[-2,1,1]]" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Your code here
  
}`,
            python: `def threeSum(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    # Your code here
    pass`
        },
        hints: [
            "Sort the array first. This helps avoid duplicates and enables two-pointer technique.",
            "Fix one element and use two pointers to find the other two that sum to the negative of the fixed element.",
            "Skip duplicate values for both the fixed element and the two pointers to avoid duplicate triplets."
        ],
        acceptance: 32
    },
    // ========== STRINGS ==========
    {
        id: 5,
        title: "Valid Palindrome",
        slug: "valid-palindrome",
        difficulty: "Easy",
        category: "Strings",
        tags: ["String", "Two Pointers"],
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
        constraints: [
            '1 <= s.length <= 2 * 10^5',
            's consists only of printable ASCII characters.'
        ],
        examples: [
            { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
            { input: 's = "race a car"', output: "false" },
            { input: 's = " "', output: "true", explanation: "After removing non-alphanumeric characters, s is an empty string." }
        ],
        testCases: [
            { input: 'isPalindrome("A man, a plan, a canal: Panama")', expected: "true" },
            { input: 'isPalindrome("race a car")', expected: "false" },
            { input: 'isPalindrome(" ")', expected: "true" },
            { input: 'isPalindrome("abba")', expected: "true" },
            { input: 'isPalindrome("0P")', expected: "false" }
        ],
        starterCode: {
            javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Your code here
  
}`,
            python: `def isPalindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    pass`
        },
        hints: [
            "First, remove all non-alphanumeric characters and convert to lowercase.",
            "Use two pointers — one at the start, one at the end — moving inward.",
            "Compare characters at both pointers; if they ever differ, it's not a palindrome."
        ],
        acceptance: 43
    },
    {
        id: 6,
        title: "Reverse String",
        slug: "reverse-string",
        difficulty: "Easy",
        category: "Strings",
        tags: ["String", "Two Pointers"],
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\nReturn the reversed array.",
        constraints: [
            "1 <= s.length <= 10^5",
            "s[i] is a printable ASCII character."
        ],
        examples: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        testCases: [
            { input: 'JSON.stringify(reverseString(["h","e","l","l","o"]))', expected: '["o","l","l","e","h"]' },
            { input: 'JSON.stringify(reverseString(["H","a","n","n","a","h"]))', expected: '["h","a","n","n","a","H"]' },
            { input: 'JSON.stringify(reverseString(["a"]))', expected: '["a"]' },
            { input: 'JSON.stringify(reverseString(["a","b"]))', expected: '["b","a"]' }
        ],
        starterCode: {
            javascript: `/**
 * @param {character[]} s
 * @return {character[]}
 */
function reverseString(s) {
  // Your code here — modify s in-place and return it
  
}`,
            python: `def reverseString(s):
    """
    :type s: List[str]
    :rtype: List[str]
    """
    # Your code here — modify s in-place and return it
    pass`
        },
        hints: [
            "Use two pointers — one at the start, one at the end.",
            "Swap the characters at the two pointers, then move both pointers inward.",
            "Continue until the two pointers meet in the middle."
        ],
        acceptance: 75
    },
    {
        id: 7,
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring",
        difficulty: "Medium",
        category: "Strings",
        tags: ["String", "Hash Table", "Sliding Window"],
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        constraints: [
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols and spaces."
        ],
        examples: [
            { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
            { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
            { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' }
        ],
        testCases: [
            { input: 'lengthOfLongestSubstring("abcabcbb")', expected: "3" },
            { input: 'lengthOfLongestSubstring("bbbbb")', expected: "1" },
            { input: 'lengthOfLongestSubstring("pwwkew")', expected: "3" },
            { input: 'lengthOfLongestSubstring("")', expected: "0" },
            { input: 'lengthOfLongestSubstring("au")', expected: "2" },
            { input: 'lengthOfLongestSubstring("dvdf")', expected: "3" }
        ],
        starterCode: {
            javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your code here
  
}`,
            python: `def lengthOfLongestSubstring(s):
    """
    :type s: str
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "Use a sliding window approach with two pointers.",
            "Use a Set or Map to track characters in the current window.",
            "When you find a duplicate, shrink the window from the left until the duplicate is removed."
        ],
        acceptance: 33
    },
    // ========== STACKS ==========
    {
        id: 8,
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "Easy",
        category: "Stacks",
        tags: ["String", "Stack"],
        description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
        ],
        examples: [
            { input: 's = "()"', output: "true" },
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "(]"', output: "false" }
        ],
        testCases: [
            { input: 'isValid("()")', expected: "true" },
            { input: 'isValid("()[]{}")', expected: "true" },
            { input: 'isValid("(]")', expected: "false" },
            { input: 'isValid("([)]")', expected: "false" },
            { input: 'isValid("{[]}")', expected: "true" },
            { input: 'isValid("(")', expected: "false" }
        ],
        starterCode: {
            javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your code here
  
}`,
            python: `def isValid(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    pass`
        },
        hints: [
            "Use a stack to keep track of opening brackets.",
            "When you encounter a closing bracket, check if the top of the stack is the matching opening bracket.",
            "At the end, the stack should be empty if all brackets are matched."
        ],
        acceptance: 40
    },
    {
        id: 9,
        title: "Min Stack",
        slug: "min-stack",
        difficulty: "Medium",
        category: "Stacks",
        tags: ["Stack", "Design"],
        description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `push(val)` pushes the element val onto the stack.\n- `pop()` removes the element on the top of the stack.\n- `top()` gets the top element of the stack.\n- `getMin()` retrieves the minimum element in the stack.\n\nYou must implement a solution with O(1) time complexity for each function.",
        constraints: [
            "-2^31 <= val <= 2^31 - 1",
            "Methods pop, top and getMin will always be called on non-empty stacks.",
            "At most 3 * 10^4 calls will be made to push, pop, top, and getMin."
        ],
        examples: [
            {
                input: 'MinStack operations: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
                output: "getMin()→-3, top()→0, getMin()→-2"
            }
        ],
        testCases: [
            {
                input: `(() => {
  const s = new MinStack();
  s.push(-2); s.push(0); s.push(-3);
  const r1 = s.getMin(); s.pop();
  const r2 = s.top(); const r3 = s.getMin();
  return r1 + "," + r2 + "," + r3;
})()`,
                expected: "-3,0,-2"
            },
            {
                input: `(() => {
  const s = new MinStack();
  s.push(1); s.push(2); s.push(0);
  const r1 = s.getMin(); s.pop();
  const r2 = s.getMin();
  return r1 + "," + r2;
})()`,
                expected: "0,1"
            }
        ],
        starterCode: {
            javascript: `class MinStack {
  constructor() {
    // Initialize your data structure here
    
  }

  /**
   * @param {number} val
   * @return {void}
   */
  push(val) {
    
  }

  /**
   * @return {void}
   */
  pop() {
    
  }

  /**
   * @return {number}
   */
  top() {
    
  }

  /**
   * @return {number}
   */
  getMin() {
    
  }
}`,
            python: `class MinStack:
    def __init__(self):
        # Initialize your data structure here
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def getMin(self) -> int:
        pass`
        },
        hints: [
            "Consider using two stacks: one for the actual values and one for tracking minimums.",
            "Every time you push, also push onto the min stack if the value is <= the current minimum.",
            "When you pop, also pop from the min stack if the value equals the current minimum."
        ],
        acceptance: 51
    },
    // ========== MATH ==========
    {
        id: 10,
        title: "FizzBuzz",
        slug: "fizzbuzz",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math", "String"],
        description: 'Given an integer `n`, return a string array `answer` (1-indexed) where:\n\n- `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5.\n- `answer[i] == "Fizz"` if `i` is divisible by 3.\n- `answer[i] == "Buzz"` if `i` is divisible by 5.\n- `answer[i] == i` (as a string) if none of the above conditions are true.',
        constraints: ["1 <= n <= 10^4"],
        examples: [
            { input: "n = 3", output: '["1","2","Fizz"]' },
            { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
            { input: "n = 15", output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }
        ],
        testCases: [
            { input: "JSON.stringify(fizzBuzz(3))", expected: '["1","2","Fizz"]' },
            { input: "JSON.stringify(fizzBuzz(5))", expected: '["1","2","Fizz","4","Buzz"]' },
            { input: "JSON.stringify(fizzBuzz(1))", expected: '["1"]' },
            { input: "fizzBuzz(15).length", expected: "15" },
            { input: "fizzBuzz(15)[14]", expected: "FizzBuzz" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
  // Your code here
  
}`,
            python: `def fizzBuzz(n):
    """
    :type n: int
    :rtype: List[str]
    """
    # Your code here
    pass`
        },
        hints: [
            "Iterate from 1 to n and check divisibility conditions.",
            "Check divisibility by 15 first (both 3 and 5), then by 3, then by 5.",
            "Use the modulo operator (%) to check divisibility."
        ],
        acceptance: 68
    },
    {
        id: 11,
        title: "Palindrome Number",
        slug: "palindrome-number",
        difficulty: "Easy",
        category: "Math",
        tags: ["Math"],
        description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.\n\nFor example, 121 is a palindrome while 123 is not.",
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        examples: [
            { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
            { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left it becomes 121-." },
            { input: "x = 10", output: "false" }
        ],
        testCases: [
            { input: "isPalindromeNum(121)", expected: "true" },
            { input: "isPalindromeNum(-121)", expected: "false" },
            { input: "isPalindromeNum(10)", expected: "false" },
            { input: "isPalindromeNum(0)", expected: "true" },
            { input: "isPalindromeNum(12321)", expected: "true" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindromeNum(x) {
  // Your code here
  
}`,
            python: `def isPalindromeNum(x):
    """
    :type x: int
    :rtype: bool
    """
    # Your code here
    pass`
        },
        hints: [
            "Negative numbers are never palindromes.",
            "Try reversing the number mathematically without converting to string.",
            "Reverse only half of the number and compare with the other half."
        ],
        acceptance: 52
    },
    {
        id: 12,
        title: "Power of x, n",
        slug: "pow-x-n",
        difficulty: "Medium",
        category: "Math",
        tags: ["Math", "Recursion"],
        description: "Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).",
        constraints: [
            "-100.0 < x < 100.0",
            "-2^31 <= n <= 2^31 - 1",
            "n is an integer.",
            "Either x is not zero or n > 0."
        ],
        examples: [
            { input: "x = 2.00000, n = 10", output: "1024.00000" },
            { input: "x = 2.10000, n = 3", output: "9.26100" },
            { input: "x = 2.00000, n = -2", output: "0.25000" }
        ],
        testCases: [
            { input: "myPow(2.0, 10)", expected: "1024" },
            { input: "myPow(2.0, -2)", expected: "0.25" },
            { input: "myPow(3.0, 0)", expected: "1" },
            { input: "myPow(2.0, 3)", expected: "8" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
function myPow(x, n) {
  // Your code here
  
}`,
            python: `def myPow(x, n):
    """
    :type x: float
    :type n: int
    :rtype: float
    """
    # Your code here
    pass`
        },
        hints: [
            "Consider negative exponents: x^(-n) = 1 / x^n.",
            "Use binary exponentiation: x^n = (x^(n/2))^2.",
            "If n is odd, multiply by x one extra time. Handle the base cases: n=0 returns 1."
        ],
        acceptance: 33
    },
    // ========== SORTING ==========
    {
        id: 13,
        title: "Merge Sorted Array",
        slug: "merge-sorted-array",
        difficulty: "Easy",
        category: "Sorting",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums2` into `nums1` as one sorted array.\n\nThe final sorted array should be returned (not stored inside the array `nums1`).",
        constraints: [
            "nums1.length == m + n",
            "nums2.length == n",
            "0 <= m, n <= 200",
            "1 <= m + n <= 200"
        ],
        examples: [
            { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
            { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" }
        ],
        testCases: [
            { input: "JSON.stringify(mergeSorted([1,2,3,0,0,0], 3, [2,5,6], 3))", expected: "[1,2,2,3,5,6]" },
            { input: "JSON.stringify(mergeSorted([1], 1, [], 0))", expected: "[1]" },
            { input: "JSON.stringify(mergeSorted([0], 0, [1], 1))", expected: "[1]" },
            { input: "JSON.stringify(mergeSorted([4,5,6,0,0,0], 3, [1,2,3], 3))", expected: "[1,2,3,4,5,6]" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {number[]}
 */
function mergeSorted(nums1, m, nums2, n) {
  // Your code here — return the merged sorted array
  
}`,
            python: `def mergeSorted(nums1, m, nums2, n):
    """
    :type nums1: List[int]
    :type m: int
    :type nums2: List[int]
    :type n: int
    :rtype: List[int]
    """
    # Your code here — return the merged sorted array
    pass`
        },
        hints: [
            "You can merge from the end to avoid shifting elements.",
            "Use three pointers: one at end of nums1's elements, one at end of nums2, one at the very end of nums1.",
            "Compare from the back and place the larger element at the end position."
        ],
        acceptance: 45
    },
    {
        id: 14,
        title: "Sort Colors",
        slug: "sort-colors",
        difficulty: "Medium",
        category: "Sorting",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.\n\nReturn the sorted array.",
        constraints: [
            "n == nums.length",
            "1 <= n <= 300",
            "nums[i] is either 0, 1, or 2."
        ],
        examples: [
            { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
            { input: "nums = [2,0,1]", output: "[0,1,2]" }
        ],
        testCases: [
            { input: "JSON.stringify(sortColors([2,0,2,1,1,0]))", expected: "[0,0,1,1,2,2]" },
            { input: "JSON.stringify(sortColors([2,0,1]))", expected: "[0,1,2]" },
            { input: "JSON.stringify(sortColors([0]))", expected: "[0]" },
            { input: "JSON.stringify(sortColors([1,0]))", expected: "[0,1]" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function sortColors(nums) {
  // Your code here — sort in-place and return nums
  
}`,
            python: `def sortColors(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # Your code here — sort in-place and return nums
    pass`
        },
        hints: [
            "This is known as the Dutch National Flag problem.",
            "Use three pointers: low, mid, high.",
            "If nums[mid] is 0, swap with low; if 2, swap with high; if 1, just advance mid."
        ],
        acceptance: 57
    },
    // ========== LINKED LISTS ==========
    {
        id: 15,
        title: "Reverse Linked List",
        slug: "reverse-linked-list",
        difficulty: "Easy",
        category: "Linked Lists",
        tags: ["Linked List", "Recursion"],
        description: "Given the head of a singly linked list represented as an array, reverse the list, and return the reversed list as an array.\n\nFor this problem, a linked list [1,2,3,4,5] means 1→2→3→4→5.",
        constraints: [
            "The number of nodes in the list is in the range [0, 5000].",
            "-5000 <= Node.val <= 5000"
        ],
        examples: [
            { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
            { input: "head = [1,2]", output: "[2,1]" },
            { input: "head = []", output: "[]" }
        ],
        testCases: [
            { input: "JSON.stringify(reverseList([1,2,3,4,5]))", expected: "[5,4,3,2,1]" },
            { input: "JSON.stringify(reverseList([1,2]))", expected: "[2,1]" },
            { input: "JSON.stringify(reverseList([]))", expected: "[]" },
            { input: "JSON.stringify(reverseList([1]))", expected: "[1]" }
        ],
        starterCode: {
            javascript: `/**
 * Reverses a linked list represented as an array.
 * @param {number[]} arr - the linked list as an array
 * @return {number[]} - the reversed linked list as an array
 */
function reverseList(arr) {
  // Your code here
  
}`,
            python: `def reverseList(arr):
    """
    Reverses a linked list represented as an array.
    :type arr: List[int]
    :rtype: List[int]
    """
    # Your code here
    pass`
        },
        hints: [
            "You can reverse an array in-place using two pointers.",
            "Swap the first and last elements, then move inward.",
            "Alternatively, use the built-in reverse method or slicing."
        ],
        acceptance: 72
    },
    {
        id: 16,
        title: "Merge Two Sorted Lists",
        slug: "merge-two-sorted-lists",
        difficulty: "Easy",
        category: "Linked Lists",
        tags: ["Linked List", "Recursion"],
        description: "You are given two sorted arrays (representing linked lists) `list1` and `list2`.\n\nMerge the two lists into one sorted array. Return the merged sorted array.",
        constraints: [
            "The number of nodes in both lists is in the range [0, 50].",
            "-100 <= Node.val <= 100",
            "Both lists are sorted in non-decreasing order."
        ],
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
            { input: "list1 = [], list2 = []", output: "[]" },
            { input: "list1 = [], list2 = [0]", output: "[0]" }
        ],
        testCases: [
            { input: "JSON.stringify(mergeTwoLists([1,2,4], [1,3,4]))", expected: "[1,1,2,3,4,4]" },
            { input: "JSON.stringify(mergeTwoLists([], []))", expected: "[]" },
            { input: "JSON.stringify(mergeTwoLists([], [0]))", expected: "[0]" },
            { input: "JSON.stringify(mergeTwoLists([1,3,5], [2,4,6]))", expected: "[1,2,3,4,5,6]" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} list1
 * @param {number[]} list2
 * @return {number[]}
 */
function mergeTwoLists(list1, list2) {
  // Your code here
  
}`,
            python: `def mergeTwoLists(list1, list2):
    """
    :type list1: List[int]
    :type list2: List[int]
    :rtype: List[int]
    """
    # Your code here
    pass`
        },
        hints: [
            "Use two pointers, one for each list.",
            "Compare the current elements and add the smaller one to the result.",
            "After one list is exhausted, append the remaining elements from the other list."
        ],
        acceptance: 61
    },
    // ========== TREES ==========
    {
        id: 17,
        title: "Maximum Depth of Binary Tree",
        slug: "max-depth-binary-tree",
        difficulty: "Easy",
        category: "Trees",
        tags: ["Tree", "DFS", "BFS", "Recursion"],
        description: "Given the root of a binary tree represented as an array (level-order), return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\nUse `null` for missing nodes in the array representation.",
        constraints: [
            "The number of nodes in the tree is in the range [0, 10^4].",
            "-100 <= Node.val <= 100"
        ],
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3" },
            { input: "root = [1,null,2]", output: "2" },
            { input: "root = []", output: "0" }
        ],
        testCases: [
            { input: "maxDepth([3,9,20,null,null,15,7])", expected: "3" },
            { input: "maxDepth([1,null,2])", expected: "2" },
            { input: "maxDepth([])", expected: "0" },
            { input: "maxDepth([1])", expected: "1" },
            { input: "maxDepth([1,2,3,4,5])", expected: "3" }
        ],
        starterCode: {
            javascript: `/**
 * Given a binary tree as a level-order array, find its max depth.
 * null represents missing nodes.
 * @param {(number|null)[]} arr
 * @return {number}
 */
function maxDepth(arr) {
  // Your code here
  
}`,
            python: `def maxDepth(arr):
    """
    Given a binary tree as a level-order array, find its max depth.
    None represents missing nodes.
    :type arr: List[Optional[int]]
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "Think about the relationship between the last non-null element's index and the tree depth.",
            "The depth of a node at index i in a level-order array is floor(log2(i+1)) + 1.",
            "Find the index of the last non-null element, then calculate its depth."
        ],
        acceptance: 72
    },
    // ========== DYNAMIC PROGRAMMING ==========
    {
        id: 18,
        title: "Climbing Stairs",
        slug: "climbing-stairs",
        difficulty: "Easy",
        category: "Dynamic Programming",
        tags: ["Math", "DP", "Memoization"],
        description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        constraints: ["1 <= n <= 45"],
        examples: [
            { input: "n = 2", output: "2", explanation: "There are two ways: 1+1 and 2." },
            { input: "n = 3", output: "3", explanation: "There are three ways: 1+1+1, 1+2, and 2+1." }
        ],
        testCases: [
            { input: "climbStairs(2)", expected: "2" },
            { input: "climbStairs(3)", expected: "3" },
            { input: "climbStairs(1)", expected: "1" },
            { input: "climbStairs(5)", expected: "8" },
            { input: "climbStairs(10)", expected: "89" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Your code here
  
}`,
            python: `def climbStairs(n):
    """
    :type n: int
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "This is essentially the Fibonacci sequence.",
            "The number of ways to reach step n = ways(n-1) + ways(n-2).",
            "Use bottom-up DP with just two variables to track the previous two values."
        ],
        acceptance: 51
    },
    {
        id: 19,
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        difficulty: "Medium",
        category: "Dynamic Programming",
        tags: ["Array", "DP", "Divide and Conquer"],
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
        constraints: [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
            { input: "nums = [1]", output: "1" },
            { input: "nums = [5,4,-1,7,8]", output: "23" }
        ],
        testCases: [
            { input: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", expected: "6" },
            { input: "maxSubArray([1])", expected: "1" },
            { input: "maxSubArray([5,4,-1,7,8])", expected: "23" },
            { input: "maxSubArray([-1])", expected: "-1" },
            { input: "maxSubArray([-2,-1])", expected: "-1" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Your code here
  
}`,
            python: `def maxSubArray(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "This is Kadane's Algorithm.",
            "At each position, decide: start a new subarray, or extend the previous one?",
            "Track currentSum = max(nums[i], currentSum + nums[i]) and keep a global maxSum."
        ],
        acceptance: 49
    },
    {
        id: 20,
        title: "Longest Common Subsequence",
        slug: "longest-common-subsequence",
        difficulty: "Medium",
        category: "Dynamic Programming",
        tags: ["String", "DP"],
        description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\nA subsequence is a string that can be derived from another string by deleting some or no characters without changing the relative order of the remaining characters.",
        constraints: [
            "1 <= text1.length, text2.length <= 1000",
            "text1 and text2 consist of only lowercase English characters."
        ],
        examples: [
            { input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: 'The longest common subsequence is "ace" and its length is 3.' },
            { input: 'text1 = "abc", text2 = "abc"', output: "3" },
            { input: 'text1 = "abc", text2 = "def"', output: "0" }
        ],
        testCases: [
            { input: 'longestCommonSubsequence("abcde", "ace")', expected: "3" },
            { input: 'longestCommonSubsequence("abc", "abc")', expected: "3" },
            { input: 'longestCommonSubsequence("abc", "def")', expected: "0" },
            { input: 'longestCommonSubsequence("bl", "yby")', expected: "1" },
            { input: 'longestCommonSubsequence("oxcpqrsvwf", "shmtulqrypy")', expected: "2" }
        ],
        starterCode: {
            javascript: `/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
function longestCommonSubsequence(text1, text2) {
  // Your code here
  
}`,
            python: `def longestCommonSubsequence(text1, text2):
    """
    :type text1: str
    :type text2: str
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "Use a 2D DP table where dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1].",
            "If text1[i-1] == text2[j-1], dp[i][j] = dp[i-1][j-1] + 1.",
            "Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1])."
        ],
        acceptance: 58
    },
    // ========== SEARCHING ==========
    {
        id: 21,
        title: "Binary Search",
        slug: "binary-search",
        difficulty: "Easy",
        category: "Searching",
        tags: ["Array", "Binary Search"],
        description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
        constraints: [
            "1 <= nums.length <= 10^4",
            "-10^4 < nums[i], target < 10^4",
            "All the integers in nums are unique.",
            "nums is sorted in ascending order."
        ],
        examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
        ],
        testCases: [
            { input: "binarySearch([-1,0,3,5,9,12], 9)", expected: "4" },
            { input: "binarySearch([-1,0,3,5,9,12], 2)", expected: "-1" },
            { input: "binarySearch([5], 5)", expected: "0" },
            { input: "binarySearch([2,5], 5)", expected: "1" },
            { input: "binarySearch([1,2,3,4,5,6,7,8,9,10], 7)", expected: "6" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function binarySearch(nums, target) {
  // Your code here
  
}`,
            python: `def binarySearch(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "Use two pointers: left = 0, right = nums.length - 1.",
            "Find the middle element. If it equals target, return mid.",
            "If target is less than mid, search the left half; otherwise, search the right half."
        ],
        acceptance: 56
    },
    {
        id: 22,
        title: "Search in Rotated Sorted Array",
        slug: "search-rotated-sorted",
        difficulty: "Medium",
        category: "Searching",
        tags: ["Array", "Binary Search"],
        description: "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
        constraints: [
            "1 <= nums.length <= 5000",
            "-10^4 <= nums[i] <= 10^4",
            "All values of nums are unique.",
            "nums is an ascending array that is possibly rotated."
        ],
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
            { input: "nums = [1], target = 0", output: "-1" }
        ],
        testCases: [
            { input: "searchRotated([4,5,6,7,0,1,2], 0)", expected: "4" },
            { input: "searchRotated([4,5,6,7,0,1,2], 3)", expected: "-1" },
            { input: "searchRotated([1], 0)", expected: "-1" },
            { input: "searchRotated([3,1], 1)", expected: "1" },
            { input: "searchRotated([1,3], 3)", expected: "1" }
        ],
        starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchRotated(nums, target) {
  // Your code here
  
}`,
            python: `def searchRotated(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # Your code here
    pass`
        },
        hints: [
            "Use modified binary search. One half of the array is always sorted.",
            "Determine which half is sorted by comparing nums[left] with nums[mid].",
            "Check if the target lies in the sorted half; if yes, search there, otherwise search the other half."
        ],
        acceptance: 38
    }
];


// --- GENERATOR LOGIC ---

const TOPICS = [
    "Arrays", "Strings", "Hash Maps", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs",
    "DP", "Recursion", "Sorting", "Searching", "Bit Manipulation", "Greedy", "Backtracking", "Math"
];

function generateProblemsForLanguage(langId: LanguageId, startId: number): CodingProblem[] {
    const problems: CodingProblem[] = [];
    const langLabel = ALL_LANGUAGES.find(l => l.id === langId)?.label || langId;

    // 50 problems per language
    for (let i = 0; i < 50; i++) {
        const difficulty: "Easy" | "Medium" | "Hard" = i < 15 ? "Easy" : i < 40 ? "Medium" : "Hard";
        const category = TOPICS[i % TOPICS.length];
        const title = `${langLabel} Challenge ${i + 1}: ${category}`;

        problems.push({
            id: startId + i,
            title,
            slug: `${langId}-challenge-${i + 1}`,
            difficulty,
            category,
            tags: [langLabel, category, "Practice"],
            description: `This is a **${difficulty}** level problem designed to test your **${langLabel}** skills in **${category}**.\n\nImplement a solution that solves the specific requirements for this challenge.`,
            constraints: [
                "Time Limit: 1.0 second",
                "Memory Limit: 256 MB",
                "1 <= input.length <= 10^5"
            ],
            examples: [
                {
                    input: "input_value",
                    output: "output_value",
                    explanation: "This is a sample explanation for the generated problem."
                }
            ],
            testCases: [
                { input: "test_input_1", expected: "test_output_1" },
                { input: "test_input_2", expected: "test_output_2" }
            ],
            starterCode: {
                javascript: "",
                python: "",
            },
            supportedLanguages: [langId], // Exclusive to this language
            hints: [
                `Think about using ${langLabel} specific features.`,
                `This problem can be solved with O(n) complexity.`
            ],
            acceptance: 40 + Math.floor(Math.random() * 50)
        });
    }
    return problems;
}

// Generate 50 problems for each language
const jsProblems = generateProblemsForLanguage("javascript", 100);
const pythonProblems = generateProblemsForLanguage("python", 200);
const javaProblems = generateProblemsForLanguage("java", 300);
const cppProblems = generateProblemsForLanguage("cpp", 400);
const cProblems = generateProblemsForLanguage("c", 500);
const csharpProblems = generateProblemsForLanguage("csharp", 600);
const tsProblems = generateProblemsForLanguage("typescript", 700);
const sqlProblems = generateProblemsForLanguage("sql", 800);

export const codingProblems: CodingProblem[] = [
    ...baseProblems,
    ...jsProblems,
    ...pythonProblems,
    ...javaProblems,
    ...cppProblems,
    ...cProblems,
    ...csharpProblems,
    ...tsProblems,
    ...sqlProblems
];

// Helper: get all unique categories
export const getCategories = (): string[] => {
    return [...new Set(codingProblems.map(p => p.category))];
};

// Helper: get problems by category
export const getProblemsByCategory = (category: string): CodingProblem[] => {
    return codingProblems.filter(p => p.category === category);
};

// Helper: get problem by id
export const getProblemById = (id: number): CodingProblem | undefined => {
    return codingProblems.find(p => p.id === id);
};

// Helper: get problems by difficulty
export const getProblemsByDifficulty = (difficulty: string): CodingProblem[] => {
    return codingProblems.filter(p => p.difficulty === difficulty);
};
