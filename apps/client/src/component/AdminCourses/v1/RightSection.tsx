"use client";

import { motion } from "framer-motion";
import CourseCard, { Course } from "./CourseCard";
import { useState, useEffect } from "react";
import { Search, BookAlert } from "lucide-react";
import { useRouter } from "next/navigation";

type RightSectionProps = {
  courses: Course[];
};

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

const RightSection = ({ courses }: RightSectionProps) => {
  const [searchText, setSearchText] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<
    "ALL" | "Basic" | "Intermediate" | "Advanced"
  >("ALL");

      const router = useRouter();

  useEffect(() => {
    let result = courses;

    if (searchText.trim()) {
      result = result.filter((course) =>
        course.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filter !== "ALL") {
      result = result.filter((course) => course.level === filter);
    }

    setFilteredCourses(result);
  }, [searchText, filter, courses]);

  /* ---------------- NO DATA STATE ---------------- */
  if (!courses || courses.length === 0) {

    return (
      <section className="flex h-full w-full flex-col items-center justify-center gap-6 p-6 text-center">
        {/* Text Above */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`text-xl font-semibold ${colors.primary_Font}`}
        >
          Looks like you haven&apos;t created any Courses
        </motion.p>

        {/* Plus / Cross Animation */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-23 w-23 items-center justify-center rounded-full bg-[#64ACFF]"
        >
          <BookAlert size={42} className="text-white" />
        </motion.div>

        {/* Sub Text */}
        <p className={`max-w-md text-sm ${colors.secondary_Font}`}>
          Start by creating your first course to organize lessons, assignments,
          and evaluations in one place.
        </p>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={()=>router.push("/admin-dashboard/courses/123")}
          className={`rounded-md ${colors.special_Bg} px-6 py-2 font-medium ${colors.primary_Font}`}
        >
          + Create your first course
        </motion.button>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col gap-6 p-4 w-full">
      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-font"
          />

          <input
            type="text"
            placeholder="Search courses..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`w-full rounded-md ${colors.secondary_Bg} pl-10 pr-4 py-2 text-sm outline-none ${colors.primary_Font}`}
          />
        </div>

        <div className="flex gap-3">
          {/* Add Course */}
          <button
            onClick={()=>router.push("/admin-dashboard/courses/123")}
            className={`rounded-md ${colors.special_Bg} px-4 py-2 text-sm font-medium ${colors.primary_Font} hover:opacity-90`}
          >
            + Add Course
          </button>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className={`rounded-md ${colors.secondary_Bg} px-4 py-2 text-sm outline-none ${colors.primary_Font}`}
          >
            <option value="ALL">All Levels</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* -------- SEARCH EMPTY STATE -------- */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 pt-20 text-center">
          {/* Animated Visual */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Core Circle */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-[#64ACFF] text-black font-bold text-xl shadow-lg"
            >
              <Search size={40} />
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <p className={`text-xl font-semibold ${colors.primary_Font}`}>
              No matching courses found
            </p>

            <p className={`max-w-md text-sm ${colors.secondary_Font}`}>
              We couldn’t find any courses that match your search. Try adjusting
              the keywords or explore a different topic.
            </p>
          </div>
        </div>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RightSection;
