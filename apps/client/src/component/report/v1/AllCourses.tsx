"use client";

import { getAllCourses } from "@/api/courses/course/get-all-courses";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, CheckCircle, XCircle } from "lucide-react";

type Course = {
  id: string;
  name: string;
  description: string;
  level: string;
  duration: string;
  instructorName: string;
  isPublished: string;
  createdAt: string;
};

function AllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");

  const router = useRouter();

  useEffect(() => {
    async function handleLoad() {
      setLoading(true);
      const data = await getAllCourses(true);
      setCourses(data);
      setLoading(false);
    }
    handleLoad();
  }, []);

  const uniqueLevels = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.level)));
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(search.toLowerCase());

      const matchesLevel = level === "all" || course.level === level;

      const matchesStatus = status === "all" || course.isPublished === status;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [courses, search, level, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search batch, institution or name..."
              className="pl-9 pr-4 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700
                         text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
          </div>

          {/* Level Filter */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700
                       text-neutral-200 focus:outline-none"
          >
            <option value="all">All Levels</option>
            {uniqueLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700
                       text-neutral-200 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Filter className="h-4 w-4" />
          {filteredCourses.length} results
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border border-neutral-800 rounded-lg overflow-hidden">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr className="text-left text-sm text-neutral-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-neutral-800 animate-pulse"
                >
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 w-full rounded bg-neutral-700/60" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-neutral-800 text-sm hover:bg-neutral-800/40 transition"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {course.name}
                  </td>

                  <td className="px-4 py-3 text-neutral-300">
                    {course.instructorName}
                  </td>

                  <td className="px-4 py-3 text-neutral-300">{course.level}</td>

                  <td className="px-4 py-3 text-neutral-300">
                    {course.duration}
                  </td>

                  <td className="px-4 py-3">
                    {course.isPublished === "PUBLISHED" ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                                       bg-emerald-500/10 text-emerald-400"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Published
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                                       bg-rose-500/10 text-rose-400"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Not Published
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin-dashboard/reports/courses/${course.id}`,
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium rounded-md
                                 bg-neutral-700 hover:bg-neutral-600 text-white transition"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && filteredCourses.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-neutral-500"
                >
                  No matching courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllCourses;
