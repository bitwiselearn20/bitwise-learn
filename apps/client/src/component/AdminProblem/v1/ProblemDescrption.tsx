"use client";

import { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";
import TestCaseSection from "@/component/Problem/v1/TestcaseSection";
import MarkdownComponent from "@/component/Problem/v1/MarkdownComponent";

function ProblemDescrption({ data }: { data: any }) {
  if (!data) return null;

  const { name, description, hints, testCases, problemTopics } = data;

  const [width, setWidth] = useState(420); // initial width in px
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX;
    const minWidth = 300;
    const maxWidth = 700;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
  };

  return (
    <div
      className="relative h-screen overflow-y-auto border-r border-gray-800 mt-12 p-4 space-y-6 text-gray-300"
      style={{
        width,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        //@ts-ignore
        WebkitScrollbar: { display: "none" },
      }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-500/30"
      />

      {/* Problem Title */}
      <h1 className="text-xl font-semibold text-white">{name}</h1>

      {/* Problem Description */}
      <MarkdownComponent content={description} />
      <TestCaseSection testCases={testCases} />

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

export default ProblemDescrption;

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
