"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getAssignmentById } from "@/api/courses/assignment/get-assignment-by-id";
import { submitAssignment } from "@/api/courses/assignment/submit-assignment";

type AnswerMap = {
  [questionId: string]: string[];
};

function AttemptAssignmentV1({ assignmentId }: { assignmentId: string }) {
  const [assignment, setAssignment] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);

  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // ⏱ 10 minutes

  /* -------------------- LOAD ASSIGNMENT -------------------- */
  useEffect(() => {
    async function load() {
      const res = await getAssignmentById(assignmentId, null);
      setAssignment(res.data);
      setCurrentIndex(0);
    }
    load();
  }, [assignmentId]);

  /* -------------------- TIMER -------------------- */
  useEffect(() => {
    if (showReviewScreen) return;

    // if (timeLeft <= 0) {
    //   handleFinalSubmit();
    //   return;
    // }

    const interval = setInterval(() => {
      setTimeLeft((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showReviewScreen]);

  /* -------------------- QUESTIONS -------------------- */
  const questions =
    assignment?.courseAssignemntQuestions ??
    assignment?.courseAssignmentQuestions ??
    [];

  const currentQuestion = questions[currentIndex];

  if (!assignment) return <div className="p-6">Loading assignment...</div>;
  if (questions.length === 0)
    return <div className="p-6">No questions found.</div>;

  /* -------------------- HELPERS -------------------- */
  function handleOptionSelect(option: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: [option], // MCQ
    }));
  }

  function toggleReview(questionId: string) {
    setMarkedForReview((prev) => {
      const set = new Set(prev);
      set.has(questionId) ? set.delete(questionId) : set.add(questionId);
      return set;
    });
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  /* -------------------- SUBMIT -------------------- */
  async function handleFinalSubmit() {
    const payload = questions
      .filter((q: any) => answers[q.id])
      .map((q: any) => ({
        questionId: q.id,
        answer: answers[q.id],
      }));

    if (payload.length === 0) {
      alert("No answers selected");
      return;
    }

    setLoading(true);

    await submitAssignment(assignmentId, payload);
    setLoading(false);
    setShowReviewScreen(false);
  }

  /* -------------------- REVIEW SCREEN -------------------- */
  if (showReviewScreen) {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const reviewCount = markedForReview.size;
    const unansweredCount = totalQuestions - answeredCount;

    return (
      <div className="p-8 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">
          Review Before Final Submit
        </h2>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Total Questions</span>
            <span className="font-medium">{totalQuestions}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-green-700">Answered</span>
            <span className="font-medium text-green-700">{answeredCount}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-red-600">Unanswered</span>
            <span className="font-medium text-red-600">{unansweredCount}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-yellow-600">Marked for Review</span>
            <span className="font-medium text-yellow-600">{reviewCount}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setShowReviewScreen(false)}
            className="px-4 py-2 border rounded"
          >
            Back to Assignment
          </button>

          <button
            onClick={handleFinalSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Submitting..." : "Confirm Submit"}
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Questions</h3>

        <div className="space-y-2">
          {questions.map((q: any, idx: number) => {
            const answered = !!answers[q.id];
            const review = markedForReview.has(q.id);

            return (
              <div
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex justify-between px-3 py-2 rounded cursor-pointer
                  ${
                    idx === currentIndex
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
              >
                <span>Q{idx + 1}</span>
                <div className="flex gap-1">
                  {answered && <span className="text-green-600">✔</span>}
                  {review && <span className="text-yellow-500">★</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">{assignment.name}</h2>
          <span className="font-mono text-red-600">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between mb-3">
            <h4>
              Question {currentIndex + 1} of {questions.length}
            </h4>
            <button
              onClick={() => toggleReview(currentQuestion.id)}
              className="text-yellow-600 text-sm"
            >
              {markedForReview.has(currentQuestion.id)
                ? "Unmark Review"
                : "Mark for Review"}
            </button>
          </div>

          <p className="mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((opt: string) => {
              const selected = answers[currentQuestion.id]?.includes(opt);

              return (
                <div
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className={`p-3 border rounded cursor-pointer
                    ${
                      selected
                        ? "bg-blue-100 border-blue-400"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {opt}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                disabled={!answers[currentQuestion.id]}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setShowReviewScreen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Review & Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttemptAssignmentV1;
