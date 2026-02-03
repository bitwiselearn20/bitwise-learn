"use client";

import { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";
import TestCaseSection from "@/component/Problem/v1/TestcaseSection";
import MarkdownEditor, { THEME_MAP } from "@/component/ui/MarkDownEditor";
import { changeStatus } from "@/api/problems/change-status";
import { useColors } from "@/component/general/(Color Manager)/useColors";
import { useTheme } from "@/component/general/(Color Manager)/ThemeController";

function ProblemDescrption({
  data,
  testMode,
  setTestMode,
}: {
  data: any;
  testMode: boolean;
  setTestMode: any;
}) {
  if (!data) return null;

  const { name, description, hints, testCases, problemTopics } = data;

  const [width, setWidth] = useState(420); // initial width in px
  const isResizing = useRef(false);
  const Colors = useColors();

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
  const handlePublish = async (id: string) => {
    console.log("problem is + ", id);
    await changeStatus(id);
    data.problem = "LISTED";
    window.location.reload();
  };
  return (
    <div
      className={`relative h-screen overflow-y-auto border-r ${Colors.border.defaultRight} ${Colors.text.secondary} mt-12 p-4 space-y-6 ${Colors.background.primary}`}
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
      <div className="flex space-x-3 mx-auto items-center justify-between mb-4">
        <button
          onClick={() => handlePublish(data.id)}
          className={` px-2 py-2 text-white font-medium rounded-lg transition-colors cursor-pointer
    ${
      data.published === "NOT_LISTED"
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-red-600 hover:bg-red-700"
    }`}
        >
          {data.published === "NOT_LISTED"
            ? "List Question"
            : "Remove Question"}
        </button>
        <label className="items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={testMode}
            onChange={() => setTestMode(!testMode)}
            className="hidden"
          />
          <div
            className={`w-10 h-5 rounded-full transition-colors flex items-center py-3
      ${testMode ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transform transition-transform
        ${testMode ? "translate-x-5" : "translate-x-1"}`}
            />
          </div>
          <span className="text-sm font-medium">Test Mode</span>
        </label>
      </div>
      {/* Problem Title */}
      <h1 className={`text-xl font-semibold ${Colors.text.primary}`}>{name}</h1>
      {/* Problem Description */}
      <MarkdownEditor
        height={550}
        value={description}
        mode={"preview"}
        hideToolbar={true}
        theme={useTheme().theme === "Dark" ? "dark" : "light"}
      />
      <TestCaseSection testCases={testCases} />
      {/* Topics */}
      {problemTopics?.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold ${Colors.text.primary} mb-2`}>
            Topics
          </h2>

          <div className="flex flex-wrap gap-2">
            {problemTopics[0].tagName.map((tag: string) => (
              <span
                key={tag}
                className={`text-xs px-3 py-1 rounded-full ${Colors.background.secondary} ${Colors.border.defaultThin} ${Colors.text.secondary}`}
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Hints */}
      {hints?.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold ${Colors.text.primary} mb-2`}>
            Hints
          </h2>

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
  const Colors = useColors();

  return (
    <div
      className={`${Colors.background.secondary} ${Colors.border.defaultThin} rounded-lg`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${Colors.text.secondary} ${Colors.hover.special} cursor-pointer transition`}
      >
        <ChevronRight
          size={16}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className="font-medium">Hint {index + 1}</span>
      </button>

      {open && (
        <div className={`px-4 pb-3 text-sm ${Colors.text.secondary} mt-3`}>
          {hint}
        </div>
      )}
    </div>
  );
}
