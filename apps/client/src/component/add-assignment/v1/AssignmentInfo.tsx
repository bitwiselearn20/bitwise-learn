import React from 'react'

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

export default function AssignmentInfo() {
  return (
    <div className="flex w-1/2 flex-col gap-6">
            {/* Assignment Name */}
            <div className="flex flex-col gap-2">
                            <label className={colors.primary_Font}>
                <span className={`${colors.special_Font} font-semibold`}>Assignment</span> <span>Name</span>
              </label>
              <input
                
                className={`h-10 w-full rounded-lg ${colors.primary_Font} p-2 ${colors.primary_Bg}`}
              />
            </div>

            {/* Assignment Description */}
            <div className="flex flex-col gap-2">
              <label className={colors.primary_Font}>
                <span className={`${colors.special_Font} font-semibold`}>Assignment</span> <span>Description</span>
              </label>
              <textarea
                
                className={`h-20 w-full no-scrollbar rounded-lg ${colors.primary_Font} p-2 ${colors.primary_Bg} resize-none`}
              />
            </div>

            {/* Assignment Instructions */}
            <div className="flex flex-col gap-2">
              <label className={colors.primary_Font}>
                <span className={`${colors.special_Font} font-semibold`}>Assignment</span> <span>Instructions</span>
              </label>
              <textarea
                
                className={`h-20 w-full no-scrollbar rounded-lg ${colors.primary_Font} p-2 ${colors.primary_Bg} resize-none`}
              />
            </div>

            {/* Marks Per Question */}
            <div className="flex items-center justify-between gap-4">
              <label className={colors.primary_Font}>
                <span className={`${colors.special_Font} font-semibold`}>Marks</span> <span>per question</span>
              </label>
              <input
                
                className={`h-8 w-24 rounded-lg ${colors.primary_Font} p-2 ${colors.primary_Bg}`}
              />
            </div>
          </div>
  )
}
