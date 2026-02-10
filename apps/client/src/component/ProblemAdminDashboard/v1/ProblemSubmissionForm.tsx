"use client";
import { createProblem } from "@/api/problems/create-admin-problem";
import MarkdownEditor from "@/component/ui/MarkDownEditor";
import { X } from "lucide-react";
import { useState } from "react";
import { useColors } from "@/component/general/(Color Manager)/useColors";
import toast from "react-hot-toast";

function ProblemSubmissionForm({ setOpen }: any) {
  const Colors = useColors();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(`# Problem Statement

## Constraints

## Examples

\`\`\`txt
Input:
Output:
\`\`\`
`);
  const [hints, setHints] = useState<string[]>([""]);

  const addHint = () => setHints([...hints, ""]);
  const updateHint = (i: number, v: string) => {
    const copy = [...hints];
    copy[i] = v;
    setHints(copy);
  };
  const removeHint = (i: number) =>
    setHints(hints.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    const toastId = toast.loading("Creating Problem...");
    try {
      await createProblem({
        name,
        description,
        hints: hints.filter((h) => h.trim()),
      });

      toast.success("Create Success!", { id: toastId });
      window.location.reload();
      setOpen(false);
    } catch (error) {
      toast.error("Unable to create problem", { id: toastId });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center`}
    >
      <div
        className={`flex h-[80svh] w-full max-w-6xl flex-col rounded-lg ${Colors.background.secondary} shadow-xl`}
      >
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b border-white/10 ${Colors.background.secondary} px-6 py-4 rounded-lg`}
        >
          <div>
            <h2 className={`text-xl font-semibold ${Colors.text.primary}`}>
              Add New Problem
            </h2>
            <p className={`${Colors.text.secondary} text-xs`}>
              GitHub-flavored Markdown editor
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className={`rounded-lg ${Colors.background.special} px-5 py-2 text-sm font-medium ${Colors.text.primary} shadow-md hover:opacity-90`}
            >
              Submit Problem
            </button>
            <button onClick={() => setOpen(false)}>
              <X className={Colors.text.primary} size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 ${Colors.text.primary} no-scrollbar`}
        >
          {/* Problem Name */}
          <div className="space-y-1">
            <label className={`text-sm ${Colors.text.secondary}`}>
              Problem Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Two Sum"
              className={`w-full rounded-md ${Colors.background.primary} border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue`}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className={`text-sm ${Colors.text.secondary}`}>
              Problem Description
            </label>
            <div
              className={`rounded-md border border-white/10 ${Colors.background.secondary}`}
            >
              <MarkdownEditor
                value={description}
                setValue={setDescription}
                mode={"live"}
                theme="light"
                hideToolbar={false}
              />
            </div>
          </div>

          {/* Hints */}
          <div className="space-y-2">
            <label className={`text-sm ${Colors.text.secondary}`}>Hints</label>

            {hints.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  placeholder={`Hint ${index + 1}`}
                  className={`flex-1 rounded-md ${Colors.background.primary} border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue`}
                />
                {hints.length > 1 && (
                  <button
                    onClick={() => removeHint(index)}
                    className="rounded-md bg-red-500/10 px-3 text-red-400 hover:bg-red-500/20"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addHint}
              className="text-sm text-primaryBlue hover:underline"
            >
              + Add another hint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemSubmissionForm;
