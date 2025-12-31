"use client";

import React from "react";
import MarkdownComponent from "./MarkdownComponent";

function Solution({ content }: any) {
  if (!content) {
    return (
      <div className="text-gray-400 text-sm p-4">No solution available.</div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-3 space-y-6">
      {/* Video Solution */}
      {content.videoSolution && (
        <div className="space-y-2">
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-neutral-700 bg-black">
            <video
              src={content.videoSolution}
              className="w-full h-full"
              controls
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-neutral-700" />

      {/* Written Solution */}
      <div className="space-y-2">
        <MarkdownComponent content={content.solution} />
      </div>
    </div>
  );
}

export default Solution;
