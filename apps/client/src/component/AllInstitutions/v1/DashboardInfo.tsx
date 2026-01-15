"use client";

import React from "react";
import { useRouter } from "next/navigation";

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

function DashboardInfo({ data }: Props) {
  const router = useRouter();

  const handleSeeDetails = (institutionId: string) => {
    router.push(`/institutionInfo?id=${institutionId}`);
  };

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
                    onClick={() => handleSeeDetails(item.id)}
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
