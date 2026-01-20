"use client";

import React, { useState } from "react";
import AssignmentInfo from "./AssignmentInfo";
import { Colors } from "@/component/general/Colors";
import { addAssignmentToSection } from "@/api/courses/assignment/add-assignment-to-section";
import toast from "react-hot-toast";

type AddAssignmentV1Props = {
  sectionId: string;
  onClose: () => void;
};

export default function AddAssignmentV1({
  sectionId,
  onClose,
}: AddAssignmentV1Props) {
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    instructions: "",
    marksPerQuestion: 0,
  });

  const [loading, setLoading] = useState(false);

  const submitAssignment = async () => {
    if (!assignment.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Creating assignment...", { id: "assignment" });

      await addAssignmentToSection({
        name: assignment.title,
        description: assignment.description,
        instruction: assignment.instructions,
        marksPerQuestion: assignment.marksPerQuestion,
        sectionId,
      });

      toast.success("Assignment created!", { id: "assignment" });
      onClose();
    } catch (error) {
      toast.error("Failed to create assignment", { id: "assignment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 flex justify-center">
      <div
        className={`${Colors.background.secondary} ${Colors.border} rounded-xl w-[90%] max-w-3xl p-2`}
      >
        <AssignmentInfo
          assignment={assignment}
          setAssignment={setAssignment}
          onSubmit={submitAssignment}
          loading={loading}
        />
      </div>
    </div>
  );
}
