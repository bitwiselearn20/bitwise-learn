"use client";

import React, { useState, useMemo } from "react";
import { useColors } from "@/component/general/(Color Manager)/useColors";

type TestCase = {
  id: string;
  input: string;
  output: string;
  testType: string;
};

function TestCases({
  testCases = [],
  output = [],
}: {
  testCases?: TestCase[];
  output: any[];
}) {
  const Colors = useColors();

  const [mode, setMode] = useState<"example" | "output">("example");
  const [activeCase, setActiveCase] = useState(0);

  const exampleCases = useMemo(
    () => testCases.filter((t) => t.testType === "EXAMPLE"),
    [testCases],
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
    <div
      className={`
        h-full flex flex-col
        ${Colors.background.secondary}
        ${Colors.border.default}
        text-sm
      `}
    >
      {/* Top Tabs */}
      <div
        className={`
          flex gap-6 px-4 py-2
          ${Colors.background.primary}
          ${Colors.border.default}
        `}
      >
        {["example", "output"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setMode(tab as any);
              setActiveCase(0);
            }}
            className={`
              relative pb-1 text-sm font-medium transition cursor-pointer
              ${
                mode === tab
                  ? `${Colors.text.primary}`
                  : `${Colors.text.secondary}`
              }
            `}
          >
            {tab === "example" ? "Example" : "Output"}

            {mode === tab && (
              <span
                className={`
                  absolute left-0 -bottom-[9px] h-[2px] w-full
                  ${Colors.background.heroPrimary}
                `}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= EXAMPLES ================= */}
        {mode === "example" && (
          <>
            {/* Testcase Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {exampleCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCase(index)}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap
                    transition cursor-pointer
                    ${
                      activeCase === index
                        ? `${Colors.background.heroSecondaryFaded} ${Colors.text.primary}`
                        : `${Colors.background.primary} ${Colors.text.secondary} hover:${Colors.background.special}`
                    }
                    ${Colors.border.fadedThin}
                  `}
                >
                  Testcase {index + 1}
                </button>
              ))}
            </div>

            {/* Body */}
            {currentTest ? (
              <div className="space-y-4">
                {/* Input */}
                <div>
                  <p className={`mb-1 text-xs ${Colors.text.secondary}`}>
                    Input
                  </p>
                  <div
                    className={`
                      rounded-lg p-3 space-y-1 font-mono text-sm
                      ${Colors.background.primary}
                      ${Colors.border.fadedThin}
                    `}
                  >
                    {Object.entries(parseInput(currentTest.input)).map(
                      ([key, value], idx) => (
                        <div key={idx}>
                          <span className={`${Colors.text.primary}`}>
                            {key}
                          </span>
                          {" : "}
                          <span className={Colors.text.special}>
                            {Array.isArray(value)
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Expected Output */}
                <div>
                  <p className={`mb-1 text-xs ${Colors.text.secondary}`}>
                    Expected Output
                  </p>
                  <pre
                    className={`
                      rounded-lg p-3 text-sm font-mono overflow-x-auto
                      ${Colors.background.primary}
                      ${Colors.border.fadedThin}
                      ${Colors.text.special}
                    `}
                  >
                    {currentTest.output}
                  </pre>
                </div>
              </div>
            ) : (
              <p className={Colors.text.secondary}>No test cases available.</p>
            )}
          </>
        )}

        {/* ================= OUTPUT ================= */}
        {mode === "output" && (
          <>
            {output.length === 0 ? (
              <p className={Colors.text.secondary}>No output available.</p>
            ) : (
              <>
                {/* Selector */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {output.map((o, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCase(index)}
                      className={`
                        px-3 py-1.5 rounded-md text-xs font-medium
                        ${Colors.border.fadedThin}
                        ${
                          activeCase === index
                            ? `${Colors.background.heroSecondaryFaded} ${Colors.text.primary}`
                            : `${Colors.background.primary} ${Colors.text.secondary}`
                        }
                      `}
                    >
                      Test {index + 1}
                    </button>
                  ))}
                </div>

                {/* Active Output */}
                {output[activeCase] && (() => {
                  const o = output[activeCase];
                  const parsedInput = parseInput(o.input);

                  return (
                    <div
                      className={`
                        rounded-xl p-4 space-y-4
                        ${Colors.background.primary}
                        ${Colors.border.fadedThin}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${Colors.text.secondary}`}>
                          Testcase {activeCase + 1}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            o.isCorrect
                              ? Colors.text.special
                              : Colors.text.secondary
                          }`}
                        >
                          {o.isCorrect ? "Passed" : "Failed"}
                        </span>
                      </div>

                      {/* Input */}
                      <div>
                        <p className={`mb-1 text-xs ${Colors.text.secondary}`}>
                          Input
                        </p>
                        <div
                          className={`
                            rounded-md p-2 font-mono text-sm
                            ${Colors.background.secondary}
                            ${Colors.border.fadedThin}
                          `}
                        >
                          {Object.entries(parsedInput).map(([key, value], i) => (
                            <div key={i}>
                              <span className={Colors.text.primary}>
                                {key}
                              </span>
                              {" : "}
                              <span className={Colors.text.special}>
                                {Array.isArray(value)
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected */}
                      <div>
                        <p className={`mb-1 text-xs ${Colors.text.secondary}`}>
                          Expected Output
                        </p>
                        <pre
                          className={`
                            rounded-md p-2 font-mono text-sm
                            ${Colors.background.secondary}
                            ${Colors.border.fadedThin}
                            ${Colors.text.primary}
                          `}
                        >
                          {o.expectedOutput}
                        </pre>
                      </div>

                      {/* Actual */}
                      <div>
                        <p className={`mb-1 text-xs ${Colors.text.secondary}`}>
                          Your Output
                        </p>
                        <pre
                          className={`
                            rounded-md p-2 font-mono text-sm
                            ${Colors.background.secondary}
                            ${Colors.border.fadedThin}
                            ${o.isCorrect ? Colors.text.special : Colors.text.secondary}
                          `}
                        >
                          {o.actualOutput || "—"}
                        </pre>
                      </div>

                      {/* Error */}
                      {o.stderr && (
                        <div>
                          <p className={`mb-1 text-xs ${Colors.text.secondary}`}>
                            Error
                          </p>
                          <pre
                            className={`
                              rounded-md p-2 font-mono text-sm
                              ${Colors.background.secondary}
                              ${Colors.border.specialThin}
                              ${Colors.text.secondary}
                            `}
                          >
                            {o.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TestCases;
