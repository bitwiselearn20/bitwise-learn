"use client";

import React from "react";
import { useRouter } from "next/navigation";

type BatchData = {
  id: string;
  batchname: string;
  branch: string;
  batchEndYear: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  data: BatchData[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function DashboardInfo({ data }: Props) {
  const router = useRouter();

  const handleSeeDetails = (batchId: string) => {
    router.push(`/admin-dashboard/batches/${batchId}`);
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/50">
        No batches found
      </div>
    );
  }

  return (
    <>
      {/* Table */}
      <div
        className="w-full overflow-y-auto border border-white/10 bg-divBg shadow-lg"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          //@ts-ignore
          WebkitScrollbar: { display: "none" },
        }}
      >
        <table className="w-full border-collapse">
          <thead className="bg-black/30">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/40">
              <th className="px-6 py-4">Batch Name</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">End Year</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.map((batch) => (
              <tr
                key={batch.id}
                className="text-sm text-white transition hover:bg-primaryBlue/10"
              >
                <td className="px-6 py-4 font-medium">{batch.batchname}</td>

                <td className="px-6 py-4 text-white/70">{batch.branch}</td>

                <td className="px-6 py-4 text-white/70">
                  {batch.batchEndYear}
                </td>

                <td className="px-6 py-4 text-white/60">
                  {formatDate(batch.createdAt)}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSeeDetails(batch.id)}
                    className="rounded-md border border-primaryBlue/40 px-3 py-1.5 text-xs font-medium text-primaryBlue transition hover:bg-primaryBlue/20"
                  >
                    See details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DashboardInfo;
