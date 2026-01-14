"use client";

import Image from "next/image";
import { Pencil, Trash2, Clock } from "lucide-react";

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

  border: "border-t-2 border-[#B1AAA6]",
};

export type Course = {
  id: string;
  name: string;
  level: "Basic" | "Intermediate" | "Advanced" | "ALL";
  description: string;
  duration?: string;
  thumbnail?: string;
  instructor: string;
};


type CourseCardProps = {
  course: Course;
};



const CourseCard = ({ course }: CourseCardProps) => {
    const levelStyles =
    course.level === "Basic"
      ? "text-gray-300"
      : course.level === "Intermediate"
      ? "text-yellow-400"
      : "text-red-400";
  return (
    <div className={`overflow-hidden rounded-2xl ${colors.secondary_Bg} ${colors.primary_Font} shadow-md transition hover:shadow-lg p-3`}>
      {/* Image */}
      <div className="relative h-44 w-full">
        <Image
          src={course.thumbnail || "/images/jsCard.jpg"}
          alt="Course thumbnail"
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        {/* name + Icons */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{course.name}</h3>

          <div className={`flex gap-2 ${colors.secondary_Font}`}>
            <button className={`hover:text-white ${colors.primary_Bg} p-2 rounded-md`}>
              <Pencil size={16} />
            </button>
            <button className={`hover:text-red-500 ${colors.primary_Bg} p-2 rounded-md`}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* level + Duration */}
        <div className={`flex items-center justify-between text-sm ${colors.secondary_Font}`}>
          <span className={`rounded-sm font-semibold bg-neutral-800 px-3 py-1 text-xs ${levelStyles}`}>
            {course.level}
          </span>

          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
            {course.instructor.charAt(0)}
          </div>
          <span className="text-sm text-neutral-300">
            {course.instructor}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
