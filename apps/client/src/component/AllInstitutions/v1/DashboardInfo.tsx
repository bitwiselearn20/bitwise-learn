"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type EntityData = {
  id: string;
  name?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

type Props = {
  data: EntityData[];
};

function formatDate(date?: string) {
  if (!date) return "—";
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
  const [selected, setSelected] = useState<EntityData | null>(null);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="py-12 mt-12 text-center text-sm text-white/50">
        No data available
      </div>
    );
  }

  return (
    <>
      {/* Table Container */}
      <div className="w-full overflow-x-auto border border-white/10 bg-divBg shadow-lg">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead className="bg-black/30">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/40">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {data.map((item) => (
              <tr
                key={item.id}
                className="text-sm text-white transition-colors hover:bg-primaryBlue/10"
              >
                <td className="px-6 py-4 font-medium truncate">
                  {item.name || "Unnamed"}
                </td>

                <td className="px-6 py-4 truncate text-white/70">
                  {item.email || "—"}
                </td>

                <td className="px-6 py-4 text-white/60">
                  {formatDate(item.createdAt)}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelected(item)}
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
                Entity Details
              </h2>
              <p className="mt-1 text-sm text-white/40">ID: {selected.id}</p>
            </div>

            {/* Content */}
            <div className="grid max-h-[60vh] grid-cols-1 gap-x-6 gap-y-5 overflow-y-auto pr-2 sm:grid-cols-2">
              {Object.entries(selected)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="my-3 text-[11px] uppercase tracking-wide text-primaryBlue">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="break-words text-sm text-white">
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
