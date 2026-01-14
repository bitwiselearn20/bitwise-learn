import React from "react";
import { Plus } from "lucide-react";
import QuestionNavigation from "./QuestionNavigation";

const colors = {
  primary_Bg: "bg-[#121313]",
  secondary_Bg: "bg-[#1E1E1E]",
  special_Bg: "bg-[#64ACFF]",
  primary_Hero: "bg-[#129274]",
  primary_Hero_Faded: "bg-[rgb(18, 146, 116, 0.24)]",
  secondary_Hero: "bg-[#64ACFF]",
  secondary_Hero_Faded: "bg-[rgb(100, 172, 255, 0.56)]",
  primary_Font: "text-[#FFFFFF]",
  secondary_Font: "text-[#B1AAA6]",
  special_Font: "text-[#64ACFF]",
  accent: "#B1AAA6",
  accent_Faded: "bg-[rgb(177, 170, 166, 0.41)]",
  primary_Icon: "white",
  secondary_Icon: "black",
  special_Icon: "#64ACFF",

  border: "border-2 border-gray-400",
};

export default function QuestionEditor() {
  return (
    <div className="flex w-1/2 flex-col justify-between">
      <div className="flex flex-col gap-4">
        {/* Question Header */}
        <h2 className={`text-lg ${colors.primary_Font}`}>
          <span className={`${colors.special_Font} font-semibold`}>
            Question:{" "}
          </span>
          <span>1</span>
        </h2>

        {/* Question Input */}
        <input
          placeholder="Question"
          className={`h-10 w-full no-scrollbar rounded-lg ${colors.primary_Font} p-2 ${colors.primary_Bg}`}
        />

        {/* Option Card */}
        <div className="flex items-center gap-3">
          <div
            className={`flex flex-1 items-center gap-3 rounded-lg ${colors.primary_Bg} px-4 py-2`}
          >
            <input type="checkbox" />
            <input
              placeholder="Option"
              className={`flex-1 bg-transparent outline-none ${colors.primary_Font}`}
            />
          </div>

          {/* Plus Button */}
          <button
            className={` rounded ${colors.primary_Bg} ${colors.primary_Font} text-xl`}
          >
            <Plus size={20} color="white" />
          </button>
        </div>

        {/* Add Question Button */}
        <button
          className={`mt-4 w-fit rounded ${colors.special_Bg} ${colors.primary_Font} px-6 py-2 cursor-pointer hover:opacity-95`}
        >
          Add Question
        </button>
      </div>

      {/* Navigation Buttons */}
      <QuestionNavigation />
    </div>
  );
}
