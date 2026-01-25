"use client";

import { useEffect, useRef, useState } from "react";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { useRouter } from "next/navigation";
import { useColors } from "@/component/general/(Color Manager)/useColors";
import toast from "react-hot-toast";

import { dummyAssignmentData } from "../../assignment/DummyData/dummyData";
import ConfirmSubmit from "./ConfirmSubmit";
import ConfirmExit from "./ConfirmExit";

import { useFullscreenEnforcer } from "./Proctoring/FullScreenEnforcer";
import { useTabSwitchCounter } from "./Proctoring/TabSwitchCounter";
import { useAntiCheatControls } from "./Proctoring/AntiCheat";

const Colors = useColors();

export default function AttemptV1({ assignmentId }: { assignmentId: string }) {
  const [started, setStarted] = useState(false);
  const router = useRouter();
  const assignment = dummyAssignmentData[assignmentId];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | null>>(
    {},
  );
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const intentionalExitRef = useRef(false);

  // ------------------ MANAGE FULLSCREEN ------------------
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const { enterFullscreen } = useFullscreenEnforcer(() => {
    if (intentionalExitRef.current) {
      return;
    }

    toast.error("Fullscreen exited! Assignment auto-submitted.", {
      duration: 1500,
      position: "top-right",
      style: { background: "#000000", color: "#fff" },
    });

    setTimeout(forceSubmit, 1500);
  });

  // ------------------ MANAGE TAB SWITCHING ------------------

  const tabSwitchCount = useTabSwitchCounter(started);

  useEffect(() => {
    if (tabSwitchCount >= 3) {
      toast.error("Too many tab switches. Submitting assignment.", {
        duration: 1500,
        position: "top-right",
        style: { background: "#000000", color: "#fff" },
      });

      setTimeout(() => {
        document.exitFullscreen();
        forceSubmit();
      }, 1500);
    }
  }, [tabSwitchCount]);

  useAntiCheatControls(started);

  if (!started) {
    return (
      // -------------------- START SCREEN ---------------------
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 font-mono ${started ? "select-none" : ""}`}
      >
        <div
          className={`w-full max-w-md rounded-2xl p-8 shadow-2xl flex flex-col gap-6 ${Colors.background.secondary}`}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1
              className={`text-2xl font-bold tracking-wide ${Colors.text.special}`}
            >
              Assignment Instructions
            </h1>

            <div className="h-px w-full bg-white/10 mt-2" />
          </div>

          <div className="flex flex-col gap-4 text-sm sm:text-base text-center">
            <p className={`${Colors.text.primary}`}>
              This assignment requires{" "}
              <span className="font-semibold">fullscreen mode</span>.
            </p>

            <p className="text-neutral-400">
              Exiting fullscreen or switching tabs may result in automatic
              submission.
            </p>

            <p className="text-neutral-500 text-xs sm:text-sm">
              Make sure you are in a quiet environment and ready to begin.
            </p>
          </div>

          <button
            autoFocus
            onClick={async () => {
              intentionalExitRef.current = false;
              await enterFullscreen();
              setStarted(true);
            }}
            className={`mt-4 rounded-xl py-3 text-sm sm:text-base font-semibold transition-all
            ${Colors.text.primary}
            ${Colors.background.heroSecondary}
            hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black`}
          >
            Start Assignment
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const questions = assignment.questions;
  const questionIds = questions.map((q) => q.id);

  const currentQuestion = questions[currentIndex];

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
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);

    intentionalExitRef.current = true;

    toast.success("Exitting the assignment...", {
      duration: 1500,
      position: "top-right",
      style: { background: "#000", color: "#fff" },
    });

    setTimeout(() => {
      document.exitFullscreen();
      router.push("/courses");
    }, 1500);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);

    intentionalExitRef.current = true;

    toast.success("Assignment submitted successfully!", {
      duration: 1500,
      position: "top-right",
      style: { background: "#000000", color: "#fff" },
    });

    setTimeout(() => {
      document.exitFullscreen();
      router.push("/courses");
    }, 1500);
  };

  const cancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  const forceSubmit = () => {
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

      <ConfirmSubmit
        open={showSubmitConfirm}
        onCancel={cancelSubmit}
        onConfirm={confirmSubmit}
      />
      <ConfirmExit
        open={showExitConfirm}
        onCancel={cancelExit}
        onConfirm={confirmExit}
      />
    </div>
  );
}
