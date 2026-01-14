"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

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

function formatValue(value: any) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && value.includes("T")) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date.toLocaleString();
  }
  return String(value);
}

function DashboardInfo({ data }: Props) {
  const [selected, setSelected] = useState<BatchData | null>(null);

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
      <div className="w-full overflow-x-auto border border-white/10 bg-divBg shadow-lg">
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
                    onClick={() => setSelected(batch)}
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

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-divBg p-6 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-white/50 transition hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Batch Details
              </h2>
              <p className="mt-1 text-sm text-white/40">ID: {selected.id}</p>
            </div>

            {/* Content */}
            <div className="grid max-h-[60vh] grid-cols-1 gap-x-6 gap-y-5 overflow-y-auto pr-2 sm:grid-cols-2">
              {Object.entries(selected).map(([key, value]) => (
                <div key={key}>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-primaryBlue">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="mb-2 break-words text-sm text-white">
                    {formatValue(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardInfo;
