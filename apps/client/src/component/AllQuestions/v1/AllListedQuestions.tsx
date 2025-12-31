"use client";
import { useState } from "react";
import Filter from "./Filter";
import QuestionCard from "./QuestionCard";

type Difficulty = "easy" | "medium" | "hard";

export const QUESTIONS: Array<{
  id: string;
  name: string;
  topics: string[];
  difficulty: Difficulty;
  solved: boolean;
}> = [
  {
    id: "two-sum",
    name: "Two Sum",
    topics: ["Array", "Hash Table"],
    difficulty: "easy",
    solved: true,
  },
  {
    id: "valid-parentheses",
    name: "Valid Parentheses",
    topics: ["Stack", "String"],
    difficulty: "easy",
    solved: true,
  },
  {
    id: "merge-two-sorted-lists",
    name: "Merge Two Sorted Lists",
    topics: ["Linked List", "Recursion"],
    difficulty: "easy",
    solved: false,
  },
  {
    id: "best-time-to-buy-sell-stock",
    name: "Best Time to Buy and Sell Stock",
    topics: ["Array", "Dynamic Programming"],
    difficulty: "easy",
    solved: true,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    topics: ["Binary Search", "Array"],
    difficulty: "easy",
    solved: false,
  },
  {
    id: "longest-substring-without-repeating-characters",
    name: "Longest Substring Without Repeating Characters",
    topics: ["Hash Table", "Sliding Window"],
    difficulty: "medium",
    solved: true,
  },
  {
    id: "add-two-numbers",
    name: "Add Two Numbers",
    topics: ["Linked List", "Math"],
    difficulty: "medium",
    solved: false,
  },
  {
    id: "longest-palindromic-substring",
    name: "Longest Palindromic Substring",
    topics: ["String", "Dynamic Programming"],
    difficulty: "medium",
    solved: false,
  },
  {
    id: "container-with-most-water",
    name: "Container With Most Water",
    topics: ["Two Pointers", "Greedy"],
    difficulty: "medium",
    solved: true,
  },
  {
    id: "group-anagrams",
    name: "Group Anagrams",
    topics: ["Hash Table", "String"],
    difficulty: "medium",
    solved: false,
  },
  {
    id: "median-of-two-sorted-arrays",
    name: "Median of Two Sorted Arrays",
    topics: ["Binary Search", "Array"],
    difficulty: "hard",
    solved: false,
  },
  {
    id: "merge-k-sorted-lists",
    name: "Merge K Sorted Lists",
    topics: ["Heap", "Linked List"],
    difficulty: "hard",
    solved: false,
  },
  {
    id: "trapping-rain-water",
    name: "Trapping Rain Water",
    topics: ["Stack", "Two Pointers"],
    difficulty: "hard",
    solved: true,
  },
  {
    id: "regular-expression-matching",
    name: "Regular Expression Matching",
    topics: ["Dynamic Programming", "Recursion"],
    difficulty: "hard",
    solved: false,
  },
  {
    id: "word-ladder",
    name: "Word Ladder",
    topics: ["BFS", "Graph"],
    difficulty: "hard",
    solved: false,
  },
  {
    id: "invert-binary-tree",
    name: "Invert Binary Tree",
    topics: ["Tree", "DFS"],
    difficulty: "easy",
    solved: true,
  },
  {
    id: "maximum-depth-of-binary-tree",
    name: "Maximum Depth of Binary Tree",
    topics: ["Tree", "DFS"],
    difficulty: "easy",
    solved: true,
  },
  {
    id: "course-schedule",
    name: "Course Schedule",
    topics: ["Graph", "Topological Sort"],
    difficulty: "medium",
    solved: false,
  },
  {
    id: "kth-largest-element-in-an-array",
    name: "Kth Largest Element in an Array",
    topics: ["Heap", "Quickselect"],
    difficulty: "medium",
    solved: true,
  },
  {
    id: "n-queens",
    name: "N-Queens",
    topics: ["Backtracking"],
    difficulty: "hard",
    solved: false,
  },
];

function AllListedQuestions() {
  const [questions, setQuestions] = useState(QUESTIONS);
  return (
    <div>
      <Filter />
      <div className="w-full">
        {questions.map((question, index) => {
          return <QuestionCard key={index} {...question} />;
        })}
      </div>
    </div>
  );
}

export default AllListedQuestions;
