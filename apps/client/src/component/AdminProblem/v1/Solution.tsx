"use client";

import { getProblemSolutionById } from "@/api/problems/get-problem-solution";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddSolution from "./AddSolution";
import { updateSolution } from "@/api/problems/update-solution";

type SolutionType = {
  id: string;
  solution: string;
  videoSolution: string | null;
  problemId: string;
};

function Solution() {
  const params = useParams();
  const problemId = params.id as string;

  const [solutionForm, setShowSolutionForm] = useState(false);
  const [solution, setSolution] = useState<SolutionType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProblemSolutionById((data: SolutionType | null) => {
      setSolution(data);
    }, problemId);
  }, [problemId]);

  const handleSave = async () => {
    if (!solution) return;

    try {
      setLoading(true);

      await updateSolution(problemId, {
        solution: solution.solution,
        videoSolution: solution.videoSolution,
      });

      alert("Solution saved successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to save solution ❌");
    } finally {
      setLoading(false);
    }
  };

  if (solution === null) {
    return (
      <div className="h-screen flex justify-end">
        <button
          onClick={() => setShowSolutionForm(true)}
          className="inline-flex h-fit items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
        >
          + Add New Solution
        </button>

        {solutionForm && (
          <AddSolution stateFn={setShowSolutionForm} id={problemId} />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-fit rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <input
          type="text"
          placeholder="Video solution URL"
          value={solution.videoSolution ?? ""}
          onChange={(e) =>
            setSolution({
              ...solution,
              videoSolution: e.target.value,
            })
          }
          className="rounded-md border bg-neutral-900 px-3 py-2 text-white"
        />
      </div>

      <div className="mt-4" data-color-mode="dark">
        <MDEditor
          height={600}
          value={solution.solution}
          onChange={(value) =>
            setSolution({
              ...solution,
              solution: value || "",
            })
          }
          preview="live"
          hideToolbar={false}
          spellCheck
        />
      </div>
    </div>
  );
}

export default Solution;
