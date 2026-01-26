"use client";

import { useColors } from "@/component/general/(Color Manager)/useColors";



export default function AssignmentInfo({
  assignment,
  setAssignment,
  onSubmit,
  onClose,
  loading,
}: any) {
  const update = (key: string, value: any) =>
    setAssignment({ ...assignment, [key]: value });
  const Colors = useColors();

  return (
    <div
      className="
        flex flex-col gap-7
        rounded-2xl
        p-7
        bg-linear-to-br
        from-[#0b1630]
        via-[#0d1b36]
        to-[#0a1228]
        border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.7)]
      "
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
        <h1 className={`text-white text-2xl font-semibold`}>
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
          className="
            h-11 rounded-lg px-4 text-sm
            bg-[#0f1a30]
            text-white
            placeholder:text-white/40
            border border-white/10
            outline-none transition
            focus:border-sky-400
            focus:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]
          "
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/70">Description</label>
        <textarea
          value={assignment.description}
          placeholder="Brief description of the assignment"
          className="
            w-full              
            min-h-24       
            resize-none
            rounded-lg
            px-4 py-3
            text-sm
            bg-[#0f1a30]
            text-white
            placeholder:text-white/40
            border border-white/10
            outline-none
            transition
            focus:border-sky-400
            focus:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]
          "
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
          className="
            w-full      
            min-h-24       
            resize-none
            rounded-lg
            px-4 py-3
            text-sm
            bg-[#0f1a30]
            text-white
            placeholder:text-white/40
            border border-white/10
            outline-none
            transition
            focus:border-sky-400
            focus:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]
          "
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
          className="
            h-11 rounded-lg px-4 text-sm
            bg-[#0f1a30]
            text-white
            placeholder:text-white/40
            border border-white/10
            outline-none
            transition
            focus:border-sky-400
            focus:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]
          "
          onChange={(e) =>
            update(
              "marksPerQuestion",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button
          onClick={onClose}
          className="
            rounded-lg px-6 py-2.5 text-sm font-medium
            bg-[#14203a]
            text-white/70
            hover:bg-[#1b2a4a]
            transition
          "
        >
          Cancel
        </button>

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
