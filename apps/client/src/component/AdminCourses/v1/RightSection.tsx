"use client";

import { motion } from "framer-motion";
import CourseCard, { Course } from "./CourseCard";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

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

  useEffect(() => {
    if (courses) {
      setFilteredCourses(courses);
    }
  }, [courses]);

  const handleSearch = () => {
    if (!courses) return;

    const query = searchText.trim().toLowerCase();

    if (!query) {
      setFilteredCourses(courses);
      return;
    }

    const result = courses.filter(course =>
      course.name.toLowerCase().includes(query)
    );

    setFilteredCourses(result);
  };

  /* ---------------- NO DATA STATE ---------------- */
  if (!courses || courses.length === 0) {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-6 p-6 text-center">
      {/* Animated Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative h-40 w-40"
      >
        {/* Back Card */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl bg-[#1E1E1E] border border-gray-600"
        />

        {/* Front Card */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
          className="absolute inset-2 rounded-xl bg-[#121313] border border-gray-500"
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-md space-y-2"
      >
        <p className={`text-xl font-semibold ${colors.primary_Font}`}>
          No courses yet
        </p>

        <p className={`text-sm ${colors.secondary_Font}`}>
          You haven&apos;t created any courses so far.  
          Start by adding your first course and begin organizing assignments,
          lessons, and evaluations in one place.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className={`rounded-md ${colors.special_Bg} px-6 py-2 font-medium ${colors.primary_Font}`}
      >
        Create your first course
      </motion.button>
    </section>
  );
}

  return (
    <section className="flex h-full flex-col gap-6 p-4 w-full">
      {/* Search Bar */}
      <div className="flex justify-center flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search Courses..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className={`w-full rounded-md ${colors.secondary_Bg} px-4 py-2 outline-none ${colors.primary_Font}`}
        />

        <button
          onClick={handleSearch}
          className={`rounded-md ${colors.special_Bg} ${colors.primary_Font} px-6 py-2 font-medium hover:bg-neutral-300`}
        >
          Search
        </button>
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
      {/* Pulsing Ring */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-28 w-28 rounded-full bg-[#64ACFF]/20"
      />

      {/* Core Circle */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-[#64ACFF] text-black font-bold text-xl shadow-lg"
      >
        <Search size={40}/>
      </motion.div>
    </motion.div>

    {/* Text */}
    <div className="flex flex-col gap-2">
      <p className={`text-xl font-semibold ${colors.primary_Font}`}>
        No matching courses found
      </p>

      <p className={`max-w-md text-sm ${colors.secondary_Font}`}>
        We couldn’t find any courses that match your search.
        Try adjusting the keywords or explore a different topic.
      </p>
    </div>
  </div>
) : (
  /* Cards */
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {filteredCourses.map(course => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
)}
    </section>
  );
};

export default RightSection;