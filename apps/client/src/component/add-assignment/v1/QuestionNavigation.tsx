import React from "react";

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

export default function QuestionNavigation() {
  return (
    <div className="flex justify-between pt-6">
      <button
        className={`rounded ${colors.primary_Bg} ${colors.primary_Font} px-6 py-2 cursor-pointer hover:opacity-95`}
      >
        Previous
      </button>

      <button
        className={`rounded ${colors.special_Bg} ${colors.primary_Font} px-6 py-2 cursor-pointer hover:opacity-95`}
      >
        Submit
      </button>

      <button
        className={`rounded ${colors.primary_Bg} ${colors.primary_Font} px-6 py-2 cursor-pointer hover:opacity-95`}
      >
        Next
      </button>
    </div>
  );
}
