"use client";

import axiosInstance from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const DEFAULT_COURSES = [
  {
    id: 1,
    href: "/courses/1",
    thumbnail:
      "https://res.cloudinary.com/djy3ewpb8/image/upload/v1763095938/Screenshot_from_2025-11-14_10-20-55_pvvfnd.png",
  },
  {
    id: 2,
    href: "/courses/2",
    thumbnail:
      "https://res.cloudinary.com/djy3ewpb8/image/upload/v1745761645/Screenshot_2025-04-27_191353_fihjpq.png",
  },
];

function OngoingCourses() {
  const [courses] = useState(DEFAULT_COURSES);
  const user = "User";

  return (
    <div className="bg-secondary-bg border border-white/10 p-6 my-3 ml-3 rounded-2xl">
      {/* Header */}
      <span className="text-6xl text-white font-semibold">Welcome,</span>{" "}
      <span className="text-6xl text-primaryBlue font-semibold"> {user}</span>
      <p className="mt-1 text-xl text-white/60">
        Continue where you left off or pick an ongoing course
      </p>
      {/* Courses */}
      <div className="mt-12 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={course.href}
            className="
              relative min-w-90 h-40
              rounded-xl overflow-hidden
              border border-white/10
              transition-all duration-200
              hover:scale-[1.02] hover:shadow-lg
            "
          >
            <Image
              src={course.thumbnail}
              alt="Course banner"
              fill
              className="object-cover"
              priority
            />

            {/* subtle overlay like LeetCode */}
            <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OngoingCourses;
