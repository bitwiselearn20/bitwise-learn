"use client";

import React from "react";
import RightSection from "./RightSection";

import { Course } from "./CourseCard";
import SideBar from "@/component/general/SideBar";

const dummyCourses: Course[] = [
  {
    id: "1",
    name: "HTML Basics",
    level: "Basic",
    description: "Learn HTML from scratch.",
    duration: "7d",
    instructor: "John Doe",
  },
  {
    id: "2",
    name: "Modern JavaScript",
    level: "Intermediate",
    description: "Master modern JavaScript concepts and patterns.",
    duration: "14d",
    instructor: "Jane Smith",
  },
  {
    id: "3",
    name: "Advanced React",
    level: "Advanced",
    description: "Build scalable applications with React.",
    duration: "21d",
    instructor: "Alex Johnson",
  },
];

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
    <div className={`${colors.primary_Bg} flex`}>
      <SideBar />
      <RightSection courses={dummyCourses} />
    </div>
  );
}
