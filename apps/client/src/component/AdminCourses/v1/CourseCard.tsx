"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const colors = {
  primary_Bg: "bg-[#121313]",
  secondary_Bg: "bg-[#1E1E1E]",
  special_Bg: "bg-[#64ACFF]",
  primary_Font: "text-[#FFFFFF]",
  secondary_Font: "text-[#B1AAA6]",
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
  const router = useRouter();

  const levelStyles =
    course.level === "Basic"
      ? "text-gray-300"
      : course.level === "Intermediate"
      ? "text-yellow-400"
      : "text-red-400";

  const handleNavigate = () => {
    router.push(`/admin-dashboard/courses/${course.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className={`
        group cursor-pointer overflow-hidden rounded-2xl
        ${colors.secondary_Bg} ${colors.primary_Font}
        p-3 transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        hover:shadow-[0_0_0_1px_#64ACFF,0_20px_40px_rgba(0,0,0,0.4)]
      `}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl">
        <Image
          src={course.thumbnail || "/images/jsCard.jpg"}
          alt="Course thumbnail"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        <h3 className="text-xl font-semibold tracking-tight">
          {course.name}
        </h3>

        <div className={`flex items-center justify-between text-sm ${colors.secondary_Font}`}>
          <span
            className={`rounded-md bg-neutral-800 px-3 py-1 text-xs font-semibold ${levelStyles}`}
          >
            {course.level}
          </span>

          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
        </div>

        <p className="text-sm text-neutral-300 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
              {course.instructor.charAt(0)}
            </div>
            <span className="text-sm text-neutral-300">
              {course.instructor}
            </span>
          </div>

          {/* Hover-only text */}
          <span className="text-sm text-[#64ACFF] opacity-0 transition-opacity group-hover:opacity-100">
            Manage →
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
