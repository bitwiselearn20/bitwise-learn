"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, ChevronUp, ChevronDown } from "lucide-react";
import SideBar from "@/component/general/SideBar";
import Link from "next/link";
import { useRef } from "react";

type CourseLevel = "Basic" | "Intermediate" | "Advanced" | "ALL";

interface Course {
  id: string;
  name: string;
  description: string;
  level: CourseLevel;
  duration?: string;
  thumbnail?: string;
  instructorName: string;
}

async function fetchCourses(): Promise<Course[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "HTML Basics",
          description: "Learn HTML from scratch.",
          level: "Basic",
          duration: "7d",
          instructorName: "John Doe",
        },
        {
          id: "2",
          name: "CSS Intermediate",
          description: "Layouts, Flexbox, Grid.",
          level: "Intermediate",
          duration: "10d",
          instructorName: "Jane Smith",
        },
        {
          id: "3",
          name: "Advanced JS",
          description: "Closures, performance, patterns.",
          level: "Advanced",
          duration: "14d",
          instructorName: "Alex Ray",
        },
        {
          id: "4",
          name: "React Basics",
          description: "Components & hooks.",
          level: "Basic",
          duration: "8d",
          instructorName: "John Doe",
        },
        {
          id: "5",
          name: "Node Intermediate",
          description: "APIs & Auth.",
          level: "Intermediate",
          duration: "12d",
          instructorName: "Jane Smith",
        },
        {
          id: "6",
          name: "System Design",
          description: "Scalable architectures.",
          level: "Advanced",
          duration: "15d",
          instructorName: "Alex Ray",
        },
      ]);
    }, 1200)
  );
}

function CourseCard({ course }: { course: Course }) {
  const router = useRouter();

  const levelStyles =
    course.level === "Basic"
      ? "text-gray-300"
      : course.level === "Intermediate"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      onClick={() => router.push(`/courses/${course.id}`)}
      className="bg-divBg rounded-xl p-4 flex flex-col gap-3 cursor-pointer
      hover:scale-[1.02] hover:bg-[#1a1a1a]
      border border-transparent hover:border-[#64ACFF]/40
      transition-all duration-300"
    >
      <div className="rounded-lg overflow-hidden">
        <Image
          src={course.thumbnail || "/images/jsCard.jpg"}
          alt={course.name}
          width={400}
          height={200}
          className="w-full h-auto"
        />
      </div>

      <h3 className="text-lg font-semibold">{course.name}</h3>

      <div className="flex items-center justify-between text-xs">
        <span
          className={`px-2 py-0.5 rounded-md bg-white/5 font-medium ${levelStyles}`}
        >
          {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
        </span>

        {course.duration && (
          <span className="text-gray-500 flex items-center gap-2">
            <Clock size={18} />
            {course.duration}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
        {course.description}
      </p>

      <div className="flex items-center justify-end gap-2 mt-auto">
        <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-black font-semibold">
          {course.instructorName.charAt(0)}
        </div>
        <span className="text-sm text-gray-300 font-medium">
          {course.instructorName}
        </span>
      </div>
    </div>
  );
}

/* ---------- Skeleton ---------- */
function CourseSkeleton() {
  return (
    <div className="bg-divBg rounded-xl p-4 flex flex-col gap-4 animate-pulse">
      <div className="h-40 bg-white/10 rounded-lg" />
      <div className="h-5 w-3/4 bg-white/10 rounded" />
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded" />
        <div className="h-4 w-5/6 bg-white/10 rounded" />
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <div className="w-7 h-7 bg-white/10 rounded-full" />
        <div className="h-4 w-20 bg-white/10 rounded" />
      </div>
    </div>
  );
}

/*------------ NO COURSES FOUND ANIMATION ------------ */
function NoCoursesFound() {
  return (
    <div className="col-span-full animate-fadeIn flex flex-col items-center justify-center py-20 text-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-primaryBlue/30 animate-ping absolute" />
        <div className="w-24 h-24 rounded-full border-4 border-primaryBlue flex items-center justify-center text-primaryBlue text-4xl font-bold">
          ?
        </div>
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-gray-200">
        No courses found
      </h3>
      <p className="text-sm text-gray-400 mt-1 max-w-sm">
        No matching courses found. Try adjusting your search.
      </p>
    </div>
  );
}


export default function AllCoursesV1() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<CourseLevel>("ALL");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount,setVisibleCount] = useState(6);

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  useEffect(()=>{
    function handleClickOutside(e:MouseEvent){
      if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
        setOpen(false);
      }
    }
    document.addEventListener("mousedown",handleClickOutside);
    return ()=>document.removeEventListener("mousedown",handleClickOutside);
  },[]);

  const filteredCourses = useMemo(() => {
    let data = courses.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());

      const matchesLevel = level === "ALL" || c.level === level;

      return matchesSearch && matchesLevel;
    });

    const order = { Basic: 1, Intermediate: 2, Advanced: 3,ALL : 0 };
    data.sort((a, b) => order[a.level] - order[b.level]);

    return data;
  }, [courses, search, level]);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white">
      <SideBar />

      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center gap-10 mb-5">
          {/* Search */}
          <div className="w-1/2 bg-[#1a1a1a] rounded-lg px-4 py-2 flex items-center gap-2">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="bg-divBg px-4 py-2 rounded-xl flex items-center gap-2 text-sm cursor-pointer"
            >
              {level === "ALL" ? "All Levels" : level}
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0f0f0f] rounded-xl border border-white/10 shadow-lg overflow-hidden z-50">
                {["ALL", "Basic", "Intermediate", "Advanced"].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLevel(l as CourseLevel);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 cursor-pointer"
                  >
                    {l === "ALL" ? "All Levels" : l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="flex mb-5 text-xl gap-1 items-center">
            <Link href="/learning" className="font-semibold text-gray-400 hover:text-gray-300">
              My Learnings
            </Link>
            <span className="text-primaryBlue text-6xl mb-3 font-light">
              &gt;
            </span>
            <div className="font-light mb-1 text-4xl">
              Courses
            </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
           Array.from({ length: 6 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
            ): filteredCourses.length===0?(
              <NoCoursesFound />
            ):(
            filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              )))}
        </section>
      </main>
    </div>
  );
}
