"use client";

import React, { useState, useMemo } from "react";

type TestCase = {
  id: string;
  input: string;
  output: string;
  testType: string;
};

function TestCases({ testCases = [] }: { testCases?: TestCase[] }) {
  const [mode, setMode] = useState<"example" | "custom">("example");
  const [activeCase, setActiveCase] = useState(0);
  const [customInput, setCustomInput] = useState("");

  const exampleCases = useMemo(
    () => testCases.filter((t) => t.testType === "EXAMPLE"),
    [testCases]
  );

  const currentTest = exampleCases[activeCase];

  const parseInput = (input: string) => {
    try {
      return JSON.parse(input);
    } catch {
      return {};
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900 border-t border-neutral-700 text-sm">
      {/* Top Tabs */}
      <div className="flex gap-6 px-4 py-2 border-b border-neutral-700">
        <button
          onClick={() => setMode("example")}
          className={`pb-1 ${
            mode === "example"
              ? "text-white border-b-2 border-indigo-500"
              : "text-gray-400"
          }`}
        >
          Example
        </button>

        <button
          onClick={() => setMode("custom")}
          className={`pb-1 ${
            mode === "custom"
              ? "text-white border-b-2 border-indigo-500"
              : "text-gray-400"
          }`}
        >
          Custom Input
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          //@ts-ignore
          WebkitScrollbar: { display: "none" },
        }}
      >
        {/* ================= EXAMPLE TESTCASES ================= */}
        {mode === "example" && (
          <div className="p-4 space-y-4">
            {/* Testcase Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {exampleCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCase(index)}
                  className={`px-3 py-1 rounded-md text-xs border ${
                    activeCase === index
                      ? "bg-neutral-700 border-neutral-500 text-white"
                      : "bg-neutral-800 border-neutral-700 text-gray-400 hover:text-white"
                  }`}
                >
                  Testcase {index + 1}
                </button>
              ))}
            </div>

            {/* Testcase Body */}
            {currentTest ? (
              <div className="space-y-4">
                {/* Input */}
                <div>
                  <p className="text-gray-400 mb-1">Input</p>
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 space-y-1">
                    {Object.entries(parseInput(currentTest.input)).map(
                      ([key, value], idx) => (
                        <div key={idx} className="text-[#facc15]">
                          <span className="font-medium text-gray-300">
                            {key}
                          </span>
                          {" : "}
                          <span>
                            {Array.isArray(value)
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Expected Output */}
                <div>
                  <p className="text-gray-400 mb-1">Expected Output</p>
                  <pre className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-[#facc15] overflow-x-auto">
                    {currentTest.output}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No test cases available.</p>
            )}
          </div>
        )}

        {/* ================= CUSTOM INPUT ================= */}
        {mode === "custom" && (
          <div className="p-4 space-y-3">
            <p className="text-gray-400">Enter custom test input</p>

            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={`Example:\nnums = [2,7,11,15]\ntarget = 9`}
              className="w-full h-40 resize-none bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCases;
