"use client";

import { createSolution } from "@/api/problems/create-solution";
import MarkdownEditor from "@/component/ui/MarkDownEditor";
import { useState } from "react";

type AddSolutionProps = {
  id: string;
  stateFn: (open: boolean) => void;
};

function AddSolution({ stateFn, id }: AddSolutionProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [solutionDescription, setSolutionDescription] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!solutionDescription.trim()) {
      setError("Solution description is required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await createSolution(id, {
        videoUrl: videoUrl || null,
        solution: solutionDescription,
      });

      stateFn(false); // close form
    } catch (err) {
      setError("Failed to save solution. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-neutral-900 rounded-lg shadow-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Add New Solution</h2>
          <button
            onClick={() => stateFn(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Video URL (optional)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Markdown Editor */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Solution Description *
          </label>
          <MarkdownEditor
            value={solutionDescription}
            setValue={setSolutionDescription}
            mode="live"
            hideToolbar={false}
          />
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
          <button
            onClick={() => stateFn(false)}
            className="px-4 py-2 bg-neutral-700 rounded-md text-sm hover:bg-neutral-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-500 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Solution"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSolution;
