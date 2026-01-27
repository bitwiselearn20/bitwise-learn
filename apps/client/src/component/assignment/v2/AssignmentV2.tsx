"use client";

import AssignmentCard from "./AssignmentCard";
import { useEffect } from "react";

export type BackendAssignment = {
  id: string;
  name: string;
  description: string;
  instruction: string;
  marksPerQuestion: number;
};

export type AssignmentCardData = {
  id: string;
  name: string;
  description: string;
  totalMarks: number;
  durationInMinutes: number;
  status: "UPCOMING" | "LIVE" | "ENDED";
};

export default function AssignmentV2({
  assignments = [],
}: {
  assignments?: BackendAssignment[];
}) {
  useEffect(() => {
    console.log("Assignments from backend:", assignments);
  }, [assignments]);

  if (!assignments.length) {
    return (
      <div className="text-sm text-white/50 text-center mt-12">
        Loading assignments...
      </div>
    );
  }

  const mappedAssignments: AssignmentCardData[] = assignments.map((a) => {
    const totalMarks = a.marksPerQuestion;

    return {
      id: a.id,
      name: a.name,
      description: a.description,
      totalMarks,
      durationInMinutes: totalMarks * 2,
      status: "LIVE",
    };
  });

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mappedAssignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
}
