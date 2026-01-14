import React from "react";
import './assignment.css'
import AssignmentInfo from "./AssignmentInfo";
import QuestionEditor from "./QuestionEditor";

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

export default function AddAssignmentV1() {
  return (
    <div className="absolute inset-0 backdrop-blur-xs flex items-center justify-center">
      <div
        className={`${colors.secondary_Bg} ${colors.border} rounded-xl w-[90%] max-w-6xl min-h-[60%] p-6`}
      >
        <div className="flex h-full gap-6">
          {/* LEFT SECTION */}
          <AssignmentInfo />

          {/* VERTICAL DIVIDER */}
          <div className={`w-px ${colors.accent_Faded}`} />

          {/* RIGHT SECTION */}
            <QuestionEditor />
        </div>
      </div>
    </div>
  );
}