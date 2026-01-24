"use client";

import { getAllCourses } from "@/api/courses/course/get-all-courses";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
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
              <tr key={i} className="border-b border-neutral-800 animate-pulse">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 w-full rounded bg-neutral-700/60" />
                  </td>
                ))}
              </tr>
            ))}

          {/* ✅ Data Rows */}
          {!loading &&
            courses.map((course) => (
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
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400">
                    {course.isPublished}
                  </span>
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

          {!loading && courses.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-neutral-500"
              >
                No courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllCourses;
