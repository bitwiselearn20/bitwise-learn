import React from "react";
import { Colors } from "@/component/general/Colors";

import "./assignment.css";

type Props = {
  question: string;
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
};

export default function LeftSection({
  question,
  currentIndex,
  totalQuestions,
  onNext,
  onPrevious,
}: Props) {
  return (
    <div
      className={`flex flex-col justify-between font-mono ${Colors.text.primary} ${Colors.background.secondary} h-full p-4 rounded-lg`}
    >
      <div
        className={`${Colors.background.primary} p-4 rounded-lg mb-4 overflow-y-auto`}
      >
        <p className="text-lg">
          {question}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onPrevious} disabled={currentIndex === 0}
          className={`${Colors.background.primary} group px-8 py-2 rounded-md hover:scale-105`}
        >
          <p className="button-wrap-left">Previous</p>
        </button>
        <div>
          <span>Question: </span>{" "}
          <span className={`${Colors.text.special}`}>{currentIndex + 1}</span> <span> / </span>
          <span>{totalQuestions}</span>
        </div>
        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className={`${Colors.background.primary} group px-8 py-2 rounded-md hover:scale-105 hover:opacity-90`}
        >
          <p className="button-wrap-right">Next</p>
        </button>
      </div>
    </div>
  );
}
