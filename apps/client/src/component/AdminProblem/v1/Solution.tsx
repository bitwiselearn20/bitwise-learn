"use state";
import { getProblemSolutionById } from "@/api/problems/get-problem-solution";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Solution() {
  const param = useParams();
  const [solution, setSolution] = useState("");
  useEffect(() => {
    getProblemSolutionById(setSolution, param.id as string);
    console.log(solution);
  }, []);
  return (
    <div className="h-screen">
      <div className="flex justify-end">
        <button
          className="rounded-md bg-green-600 px-5 py-2 my-4 text-sm font-semibold text-white
               shadow-sm transition hover:bg-green-700
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>

      <MDEditor
        height={600}
        //@ts-ignore
        value={solution.solution as string}
        onChange={() => {}}
        preview="live"
        hideToolbar={false}
        spellCheck
      />
      <div className="relative mt-32 aspect-video rounded-md overflow-hidden bg-slate-900">
        <iframe
          //@ts-ignore
          src={solution.videoSolution}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default Solution;
