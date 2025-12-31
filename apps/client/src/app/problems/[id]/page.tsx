import Problem from "@/component/Problem/Problem";

const data = {
  id: "64f1c9b9a3c12f0012345678",
  name: "Two Sum",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input will have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  hints: [
    "Use a hash map to store previously seen numbers",
    "Check if target - current exists",
  ],
  createdBy: "64f1c8a9a3c12f0011111111",
  sectionId: "64f1c7a9a3c12f0022222222",
  createdAt: "2025-01-10T10:12:30.000Z",
  updatedAt: "2025-01-12T08:45:00.000Z",

  testCases: [
    {
      id: "64f1d1a9a3c12f0033333333",
      testType: "EXAMPLE",
      input: "[2,7,11,15], 9",
      output: "[0,1]",
      problemId: "64f1c9b9a3c12f0012345678",
      createdAt: "2025-01-10T10:15:00.000Z",
      updatedAt: "2025-01-10T10:15:00.000Z",
    },
    {
      id: "64f1d1b9a3c12f0044444444",
      testType: "EXAMPLE",
      input: "[3,2,4], 6",
      output: "[1,2]",
      problemId: "64f1c9b9a3c12f0012345678",
      createdAt: "2025-01-10T10:16:00.000Z",
      updatedAt: "2025-01-10T10:16:00.000Z",
    },
  ],
  problemTemplates: [
    {
      id: "64f1d5a9a3c12f0055555555",
      problemId: "64f1c9b9a3c12f0012345678",
      functionBody: "function twoSum(nums, target) {\n  // your code here\n}",
      defaultCode: "function twoSum(nums, target) {\n  return [];\n}",
      language: "JAVASCRIPT",
      studentsId: null,
      createdAt: "2025-01-10T10:20:00.000Z",
      updatedAt: "2025-01-10T10:20:00.000Z",
    },
    {
      id: "64f1d6a9a3c12f0066666666",
      problemId: "64f1c9b9a3c12f0012345678",
      functionBody: "def twoSum(nums, target):\n    # your code here",
      defaultCode: "def twoSum(nums, target):\n    return []",
      language: "PYTHON",
      studentsId: null,
      createdAt: "2025-01-10T10:21:00.000Z",
      updatedAt: "2025-01-10T10:21:00.000Z",
    },
  ],

  problemTopics: [
    {
      id: "64f1e1a9a3c12f0077777777",
      problemId: "64f1c9b9a3c12f0012345678",
      tagName: ["Array", "Hash Table"],
      createdAt: "2025-01-10T10:25:00.000Z",
      updatedAt: "2025-01-10T10:25:00.000Z",
    },
  ],

  solution: {
    id: "64f1f1a9a3c12f0088888888",
    solution: `## 🧠 Intuition

To efficiently find two numbers that add up to the target, we use a **hash map** to keep track of numbers we have already seen along with their indices.

For each number in the array:
- Calculate the complement needed to reach the target
- Check if the complement already exists in the map
- If it exists, we have found the solution
- Otherwise, store the current number and its index in the map

This approach allows us to solve the problem in a **single pass**.

---

## ⚙️ Algorithm

1. Create an empty hash map \`seen\`
2. Iterate through the array \`nums\`
3. For each element:
   - Compute \`complement = target - nums[i]\`
   - If \`complement\` exists in \`seen\`, return the indices
   - Otherwise, store \`nums[i]\` with its index
4. The problem guarantees exactly one valid solution

---

## ⏱️ Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)
`,
    videoSolution: "https://cdn.example.com/two-sum-solution.mp4",
    problemId: "64f1c9b9a3c12f0012345678",
    createdAt: "2025-01-10T10:30:00.000Z",
    updatedAt: "2025-01-10T10:30:00.000Z",
  },
};

function page() {
  return (
    <div className="w-full h-screen">
      <Problem data={data} />
    </div>
  );
}

export default page;
