"use client";

import { getCourseEnrollments } from "@/api/courses/course/enrollments/get-all-enrollment";
import { Eye, Search, Filter, Building2, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CourseInfo = {
  id?: string;
  name?: string;
  description?: string;
  level?: string;
  duration?: string;
  thumbnail?: string;
  instructorName?: string;
  certificate?: string;
  isPublished?: string;
  createdAt?: string;
};

type Enrollment = {
  institution: {
    name: string;
    id: string;
  };
  batch: {
    id: string;
    batchname: string;
    branch: string;
  };
};

function CourseEnrollmentV1({ courseId }: { courseId: string }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({});
  const [loading, setLoading] = useState(true);

  // 🔎 Filters
  const [search, setSearch] = useState("");
  const [institution, setInstitution] = useState("all");

  useEffect(() => {
    async function handleLoad() {
      setLoading(true);
      await getCourseEnrollments(courseId, setCourseInfo, setEnrollments);
      setLoading(false);
    }
    handleLoad();
  }, [courseId]);

  // 🧠 Unique institutions
  const institutions = useMemo(() => {
    return Array.from(new Set(enrollments.map((e) => e.institution.name)));
  }, [enrollments]);

  // 🧠 Filtered enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch =
        e.institution.name.toLowerCase().includes(search.toLowerCase()) ||
        e.batch.batchname.toLowerCase().includes(search.toLowerCase()) ||
        e.batch.branch.toLowerCase().includes(search.toLowerCase());

      const matchesInstitution =
        institution === "all" || e.institution.name === institution;

      return matchesSearch && matchesInstitution;
    });
  }, [enrollments, search, institution]);

  // 🧠 Group by Institution
  const groupedEnrollments = useMemo(() => {
    return filteredEnrollments.reduce<Record<string, Enrollment[]>>(
      (acc, curr) => {
        const key = curr.institution.name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(curr);
        return acc;
      },
      {},
    );
  }, [filteredEnrollments]);

  return (
    <div className="flex gap-6 text-white h-full">
      <aside className="w-[320px] ml-4 mt-4 shrink-0 border border-neutral-800 bg-neutral-900 rounded-xl overflow-hidden sticky top-4 h-fit">
        {courseInfo.thumbnail && (
          <div className="h-40 w-full overflow-hidden">
            <Image
              height={100}
              width={100}
              src={courseInfo.thumbnail}
              alt={courseInfo.name as string}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-5 space-y-4 mt-4">
          <div>
            <h2 className="text-lg font-semibold">{courseInfo.name}</h2>
            <p className="text-sm text-neutral-400 mt-1">
              {courseInfo.level} • {courseInfo.duration}
            </p>
          </div>

          <span className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400">
            {courseInfo.isPublished}
          </span>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-neutral-500">Instructor</p>
              <p className="text-neutral-200">{courseInfo.instructorName}</p>
            </div>

            <div>
              <p className="text-neutral-500">Description</p>
              <p className="text-neutral-300">{courseInfo.description}</p>
            </div>

            <div>
              <p className="text-neutral-500">Total Enrollments</p>
              <p className="font-semibold">
                {loading ? "—" : enrollments.length}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex-1 mt-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search institution, batch or branch..."
                className="pl-9 pr-4 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700
                           text-white placeholder:text-neutral-500 focus:outline-none"
              />
            </div>

            {/* Institution Filter */}
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="px-3 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700"
            >
              <option value="all">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Filter className="h-4 w-4" />
            {filteredEnrollments.length} enrollments
          </div>
        </div>
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr className="text-left text-sm text-neutral-400">
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Report</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                Object.entries(groupedEnrollments).map(
                  ([institutionName, items]) => (
                    <>
                      <tr
                        key={institutionName}
                        className="bg-neutral-900/60 text-neutral-300"
                      >
                        <td colSpan={4} className="px-4 py-3 font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {institutionName}
                            <span className="ml-2 text-xs text-neutral-500">
                              ({items.length} batches)
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Rows */}
                      {items.map((item) => (
                        <tr
                          key={item.batch.id}
                          className="border-b border-neutral-800 text-sm hover:bg-neutral-800/40"
                        >
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3">{item.batch.batchname}</td>
                          <td className="px-4 py-3 text-neutral-300">
                            {item.batch.branch}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              className="inline-flex items-center gap-1 text-sm text-neutral-300 hover:text-white"
                              href={`/admin-dashboard/reports/courses/${courseId}/${item.batch.id}`}
                            >
                              <Eye className="h-4 w-4" />
                              View Report
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </>
                  ),
                )}

              {!loading && filteredEnrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    No matching enrollments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CourseEnrollmentV1;
