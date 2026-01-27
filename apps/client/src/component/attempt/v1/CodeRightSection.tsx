"use client";
import CodeEditor from "@/component/Problem/v1/Editor";
import { useEffect, useState } from "react";

type Props = {
  problem: any;
  problemId: string;
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
};

export default function CodeRightSection({
  problem,
  problemId,
  code,
  onChange,
  onRun,
  onSubmit,
}: Props) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    console.log(problem);
  }, []);

  return (
    <div className="h-full w-full flex flex-col min-h-0 rounded-xl p-4 bg-[#0f172a] text-white font-mono">
      
      {/* Header */}
      <div className="text-sm opacity-70 mb-2">
        {problem?.title || "Coding Question"}
      </div>

      {/* Editor container (THIS FIXES OVERFLOW) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {problem && (
          <CodeEditor
            questionId={problemId}
            template={problem.problemTemplates}
            output={output}
          />
        )}
      </div>

    </div>
  );
}
