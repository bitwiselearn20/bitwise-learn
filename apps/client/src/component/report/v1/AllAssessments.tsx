"use client";

import { getAllAssessments } from "@/api/assessments/get-all-assessments";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  CalendarClock,
  PlayCircle,
  CheckCircle,
} from "lucide-react";

type Assessment = {
  id: string;
  name: string;
  description: string;
  instruction: string;
  startTime: string;
  endTime: string;
  individualSectionTimeLimit: number | null;
  status: "UPCOMING" | "ONGOING" | "ENDED";
  batchId: string;
};

function AllAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Assessment["status"]>("all");

  const router = useRouter();

  useEffect(() => {
    async function handleLoad() {
      setLoading(true);
      const data = await getAllAssessments();
      setAssessments(data.data);
      setLoading(false);
    }
    handleLoad();
  }, []);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesSearch =
        assessment.name.toLowerCase().includes(search.toLowerCase()) ||
        assessment.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || assessment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [assessments, search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assessments..."
              className="pl-9 pr-4 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700
                         text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "all" | Assessment["status"])
            }
            className="px-3 py-2 text-sm rounded-md bg-neutral-800 border border-neutral-700
                       text-neutral-200 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="ENDED">Ended</option>
          </select>
        </div>

        {/* Result Count */}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Filter className="h-4 w-4" />
          {filteredAssessments.length} results
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border border-neutral-800 rounded-lg overflow-hidden">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr className="text-left text-sm text-neutral-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3">End Time</th>
              <th className="px-4 py-3">Section Time</th>
              <th className="px-4 py-3">Status</th>
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
              filteredAssessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  className="border-b border-neutral-800 text-sm hover:bg-neutral-800/40 transition"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {assessment.name}
                  </td>

                  <td className="px-4 py-3 text-neutral-300 line-clamp-2">
                    {assessment.description}
                  </td>

                  <td className="px-4 py-3 text-neutral-300">
                    {new Date(assessment.startTime).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-neutral-300">
                    {new Date(assessment.endTime).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-neutral-300">
                    {assessment.individualSectionTimeLimit
                      ? `${assessment.individualSectionTimeLimit} mins`
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {assessment.status === "UPCOMING" && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                                       bg-blue-500/10 text-blue-400"
                      >
                        <CalendarClock className="h-3.5 w-3.5" />
                        Upcoming
                      </span>
                    )}

                    {assessment.status === "ONGOING" && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                                       bg-yellow-500/10 text-yellow-400"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Ongoing
                      </span>
                    )}

                    {assessment.status === "ENDED" && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                                       bg-emerald-500/10 text-emerald-400"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Ended
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {assessment.status === "ENDED" && (
                      <button
                        onClick={() =>
                          router.push(
                            `/admin-dashboard/reports/assessment/${assessment.id}`,
                          )
                        }
                        className="px-3 py-1.5 text-xs font-medium rounded-md
                                   bg-neutral-700 hover:bg-neutral-600 text-white transition"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}

            {!loading && filteredAssessments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-neutral-500"
                >
                  No matching assessments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllAssessments;
