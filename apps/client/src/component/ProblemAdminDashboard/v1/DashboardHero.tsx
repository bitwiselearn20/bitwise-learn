"use client";

import { User } from "lucide-react";
import { useState } from "react";
import ProblemSubmissionForm from "./ProblemSubmissionForm";

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

  return (
    <div className="w-full rounded-2xlpx-8 py-10 flex flex-col md:flex-row items-center justify-between shadow-sm">
      {/* Left Content */}
      {showForm && <ProblemSubmissionForm />}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-semibold">
          <span className="text-primaryBlue">Greetings,</span>{" "}
          <span className="text-white">Admin</span>
        </h1>

        <p className="mt-3 text-lg">
          <span className="text-white">Enjoy managing</span>{" "}
          <span className="text-primaryBlue font-semibold">Bitwise Learn</span>
        </p>

        <p className="text-white w-2/3 text-base leading-relaxed">
          Want to <span className="font-medium">add a new question</span> or
          <span className="font-medium"> update an existing one</span>? Select
          an option below to continue.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primaryBlue mt-4 text-white px-6 py-3 rounded-lg font-medium shadow-md"
        >
          Add New Question
        </button>
      </div>

      {/* Right Profile */}
      <div className="flex items-center gap-4 mt-8 md:mt-0">
        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
          <User size={30} className="text-black" />
        </div>

        <div className="text-white">
          <h2 className="text-xl font-medium">{admin_name}</h2>
          <p className="text-sm opacity-90">{admin_email}</p>
        </div>
      </div>
    </div>
  );
}
