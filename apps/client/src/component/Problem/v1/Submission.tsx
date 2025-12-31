import React from "react";

function Submission({ content }: any) {
  return (
    <div className="h-full w-full bg-neutral-900 border border-neutral-700 rounded-lg p-4 text-gray-300">
      <div className="flex flex-col items-center justify-center text-center text-wrap h-48 text-gray-400">
        <p className="text-3xl">No submissions yet.</p>
        <p className="text-xl mt-1">
          Run or submit your code to see results here.
        </p>
      </div>
    </div>
  );
}

export default Submission;
