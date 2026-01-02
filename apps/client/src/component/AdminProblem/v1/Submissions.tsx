"use client";

import { getAllProblemSubmission } from "@/api/problems/get-all-submission";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Submission = {
  id: string;
  status: string;
  language: string;
  runtime?: string;
  createdAt: string;
};

function Submissions() {
  const params = useParams();
  const problemId = params.id as string;

  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!problemId) return;

    setLoading(true);
    getAllProblemSubmission(setData, problemId).finally(() =>
      setLoading(false)
    );
  }, [problemId]);

  if (loading) {
    return <div className="p-4 text-slate-400">Loading submissions...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-slate-400">No submissions yet.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Submissions</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-400">
              <th className="py-2">Status</th>
              <th className="py-2">Language</th>
              <th className="py-2">Runtime</th>
              <th className="py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {data.map((submission) => (
              <tr
                key={submission.id}
                className="border-b border-slate-800 text-white"
              >
                <td className="py-2">
                  <span
                    className={`font-medium ${
                      submission.status === "Accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td className="py-2">{submission.language}</td>
                <td className="py-2">{submission.runtime ?? "-"}</td>
                <td className="py-2 text-slate-400">
                  {new Date(submission.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Submissions;
