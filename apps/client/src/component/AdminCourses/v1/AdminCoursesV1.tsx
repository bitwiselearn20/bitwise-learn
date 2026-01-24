"use client";

import React from "react";
import RightSection from "./RightSection";

import { Course } from "./CourseCard";
import SideBar from "@/component/general/SideBar";

const colors = {
  primary_Bg: "bg-[#121313]",
  secondary_Bg: "bg-[#1E1E1E]",
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

  border: "border-t-2 border-[#B1AAA6]",
};

export default function AdminCoursesV1() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-10 py-10">
        <RightSection />
      </main>
    </div>
  );
}
