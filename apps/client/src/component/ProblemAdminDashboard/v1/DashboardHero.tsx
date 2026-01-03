"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";
import ProblemSubmissionForm from "./ProblemSubmissionForm";
import { getAllProblemCount } from "@/api/problems/get-problem-count";

type ProblemCount = {
  easy: number;
  medium: number;
  hard: number;
  totalQuestion: number;
};

function DashboardHero() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full px-6 pt-6">
      <HeroSection showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
}

export default DashboardHero;

function HeroSection({ showForm, setShowForm }: any) {
  const admin_name = "Britto Anand";
  const admin_email = "brittoanand@example.com";

  const [data, setData] = useState<ProblemCount | null>(null);

  useEffect(() => {
    getAllProblemCount(setData);
  }, []);

  return (
    <div className="w-full rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between bg-secondary-bg shadow-sm">
      {showForm && <ProblemSubmissionForm setOpen={setShowForm} />}

      {/* LEFT */}
      <div className="text-center md:text-left space-y-4">
        <h1 className="text-4xl font-semibold">
          <span className="text-primaryBlue">Greetings,</span>{" "}
          <span className="text-white">Admin</span>
        </h1>

        <p className="text-lg text-white">
          Enjoy managing{" "}
          <span className="text-primaryBlue font-semibold">Bitwise Learn</span>
        </p>

        <p className="text-white max-w-lg text-base leading-relaxed">
          Want to <span className="font-medium">add a new question</span> or{" "}
          <span className="font-medium">update an existing one</span>? Select an
          option below to continue.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primaryBlue mt-6 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:opacity-90"
        >
          Add New Question
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-center gap-4 mt-8 md:mt-0">
        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
          <User size={30} className="text-black" />
        </div>

        <div className="text-white">
          <h2 className="text-xl font-medium">{admin_name}</h2>
          <p className="text-sm opacity-90">{admin_email}</p>
        </div>

        {/* STATS */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatCard label="Easy" value={data.easy} color="green" />
            <StatCard label="Medium" value={data.medium} color="yellow" />
            <StatCard label="Hard" value={data.hard} color="red" />
            <StatCard
              label="Total Questions"
              value={data.totalQuestion}
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "yellow" | "red" | "blue";
}) {
  const colorMap = {
    green: "text-green-400 bg-green-400/10",
    yellow: "text-yellow-400 bg-yellow-400/10",
    red: "text-red-400 bg-red-400/10",
    blue: "text-blue-400 bg-blue-400/10",
  };

  return (
    <div
      className={`rounded-lg px-4 py-3 border border-white/10 ${colorMap[color]}`}
    >
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
