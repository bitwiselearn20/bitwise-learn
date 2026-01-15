"use client";

import { useState } from "react";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { useRouter } from "next/navigation";
import { Colors } from "@/component/general/Colors";


import { dummyAssignmentData } from "../../assignment/DummyData/dummyData";


export default function AttemptV1({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const assignment = dummyAssignmentData[assignmentId];

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const questions = assignment.questions;
  const questionIds = questions.map((q) => q.id);


  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

    const [userAnswers, setUserAnswers] = useState<
    Record<string, string | null>
  >({});

  const handleSelectAnswer = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleResetCurrentAnswer = () => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: null,
    }));
  };

  const handleExit = () => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be lost."
      )
    ) {
      router.push("/courses");
    }
  };

  const handleSubmit = () => {
    if (!window.confirm("Submit assignment?")) return;

    // Later: send userAnswers to backend
    alert("Assignment submitted!");
    router.push("/courses");
  };

  return (
    <div
      className={`${Colors.background.primary} min-h-screen grid grid-cols-2 p-4 gap-4`}
    >
      <div className="rounded-xl">
        <LeftSection
          question={currentQuestion.question}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          onNext={() =>
            setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
          }
          onPrevious={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        />
      </div>
      <div className="rounded-xl">
      <RightSection
        assignmentName={assignment.name}
        choices={currentQuestion.choices}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selectedAnswer={userAnswers[currentQuestion.id] ?? null}
        onSelectAnswer={handleSelectAnswer}
        onResetCurrentAnswer={handleResetCurrentAnswer}
        onJumpToQuestion={setCurrentIndex}
        onExit={handleExit}
        onSubmit={handleSubmit}
        questionIds={questionIds}
        userAnswers={userAnswers}
      />
      </div>
    </div>
  );
}
