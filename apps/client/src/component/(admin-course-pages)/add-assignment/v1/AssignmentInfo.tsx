"use client";

import React from "react";
import { Colors } from "@/component/general/Colors";

export default function AssignmentInfo({
  assignment,
  setAssignment,
  onSubmit,
  loading,
}: any) {
  const update = (key: string, value: any) =>
    setAssignment({ ...assignment, [key]: value });

  return (
    <div className={`flex flex-col gap-6 rounded-xl p-6`}>
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className={`${Colors.text.primary} text-2xl font-semibold`}>
          Create Assignment
        </h1>
        <p className="text-sm text-white/50">
          Configure assignment details before adding questions
        </p>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/70">Assignment Title</label>
        <input
          value={assignment.title}
          placeholder="Enter assignment title"
          className={`h-11 rounded-lg px-3 text-sm outline-none transition
            ${Colors.text.primary}
            ${Colors.background.secondary}
            ${Colors.border.fadedThin}
            focus:border-sky-500`}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/70">Description</label>
        <textarea
          value={assignment.description}
          placeholder="Brief description of the assignment"
          className={`min-h-22.5 resize-none rounded-lg px-3 py-2 text-sm outline-none transition
            ${Colors.text.primary}
            ${Colors.background.secondary}
            ${Colors.border.fadedThin}
            focus:border-sky-500`}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* Instructions */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/70">
          Instructions for students
        </label>
        <textarea
          value={assignment.instructions}
          placeholder="Rules, guidelines, or hints for students"
          className={`min-h-27.5 resize-none rounded-lg px-3 py-2 text-sm outline-none transition
            ${Colors.text.primary}
            ${Colors.background.secondary}
            ${Colors.border.fadedThin}
            focus:border-sky-500`}
          onChange={(e) => update("instructions", e.target.value)}
        />
      </div>

      {/* Marks */}
      <div className="flex flex-col gap-1 w-1/5">
        <label className="text-sm text-white/70">Marks per question</label>
        <input
          type="number"
          value={assignment.marksPerQuestion}
          placeholder="e.g. 2"
          className={`h-11 rounded-lg px-3 text-sm outline-none transition
            ${Colors.text.primary}
            ${Colors.background.secondary}
            ${Colors.border.fadedThin}
            focus:border-sky-500`}
          onChange={(e) =>
            update(
              "marksPerQuestion",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`rounded-lg px-8 py-2.5 text-sm font-semibold transition
            ${
              loading
                ? "cursor-not-allowed bg-slate-700 text-white/50"
                : "bg-sky-600 text-black hover:bg-sky-500 active:scale-[0.98]"
            }`}
        >
          {loading ? "Creating Assignment..." : "Create Assignment"}
        </button>
      </div>
    </div>
  );
}
