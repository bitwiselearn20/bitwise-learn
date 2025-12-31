"use client";

import { useState } from "react";
import MarkdownComponent from "./MarkdownComponent";
import { ChevronRight } from "lucide-react";

function Description({ content }: { content: any }) {
  if (!content) return null;

  const { name, description, hints, testCases, problemTopics } = content;

  return (
    <div className="space-y-6 text-gray-300">
      {/* Problem Title */}
      <h1 className="text-xl font-semibold text-white">{name}</h1>

      {/* Problem Description */}
      <MarkdownComponent content={description} />

      {/* Examples */}
      {testCases?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Examples</h2>

          <div className="space-y-4">
            {testCases.map((test: any, index: number) => (
              <div
                key={test.id}
                className="bg-neutral-800 border border-neutral-700 rounded-lg p-4"
              >
                <p className="text-sm text-gray-400 mb-2">
                  Example {index + 1}
                </p>

                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium text-gray-200">Input:</span>{" "}
                    <code className="text-[#facc15]">{test.input}</code>
                  </div>

                  <div>
                    <span className="font-medium text-gray-200">Output:</span>{" "}
                    <code className="text-[#facc15]">{test.output}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {problemTopics?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Topics</h2>

          <div className="flex flex-wrap gap-2">
            {problemTopics[0].tagName.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Hints */}
      {hints?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Hints</h2>

          <div className="space-y-2">
            {hints.map((hint: string, idx: number) => (
              <HintItem key={idx} index={idx} hint={hint} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Description;

function HintItem({ hint, index }: { hint: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-neutral-700 rounded-lg bg-neutral-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700 transition"
      >
        <ChevronRight
          size={16}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className="font-medium">Hint {index + 1}</span>
      </button>

      {open && (
        <div className="px-4 pb-3 text-sm text-gray-400 mt-3">{hint}</div>
      )}
    </div>
  );
}
