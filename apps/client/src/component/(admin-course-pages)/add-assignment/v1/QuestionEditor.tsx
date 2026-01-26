import { v4 as uuid } from "uuid";
import { Plus, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { deleteAssignmentQuestion } from "@/api/courses/assignment-questions/delete-question";
import { useState } from "react";

export default function QuestionEditor({
  assignmentId,
  question,
  index,
  total,
  saveQuestion,
  onPrev,
  onNext,
  onNew,
  onSubmit,
  locked,
  onEdit,
  onClose,
}: any) {
  const updateOption = (id: string, key: string, value: any) => {
    saveQuestion({
      ...question,
      options: question.options.map((o: any) =>
        o.id === id ? { ...o, [key]: value } : o,
      ),
    });
  };

  const addOption = () => {
    saveQuestion({
      ...question,
      options: [
        ...question.options,
        { id: uuid(), text: "", isCorrect: false },
      ],
    });
  };

  const handleComplete = () => {
    onSubmit();
  };

  const ConfirmDeleteQuestionModal = ({
    open,
    onClose,
    onConfirm,
    loading,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
  }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6"
        >
          <h2 className="text-lg font-semibold text-white">
            Delete this question?
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="
              px-4 py-2 rounded-lg
              bg-slate-800 text-slate-300
              hover:bg-slate-700 transition
              disabled:opacity-50
            "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`
              px-4 py-2 rounded-lg text-white transition
              ${
                loading
                  ? "bg-red-600/60 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-500"
              }
            `}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteQuestion = async () => {
    if (!question?.id) return;

    setDeleting(true);
    const toastId = toast.loading("Deleting question...");

    try {
      await deleteAssignmentQuestion(question.id);
      toast.success("Question deleted", { id: toastId });

      if (index > 0) onPrev();
      else if (total > 1) onNext();
      else onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete question",
        { id: toastId },
      );
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const removeOption = (id: string) => {
    saveQuestion({
      ...question,
      options: question.options.filter((o: any) => o.id !== id),
    });
  };

  return (
    <div className="flex w-1/2 flex-col justify-between rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-lg">
      {/* TOP BAR */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <div className="flex flex-col gap-3">
            <XCircle
              size={26}
              onClick={onClose}
              className={`cursor-pointer text-slate-500 hover:text-red-500 transition
              relative ${locked?"left-5":"left-38.5"}`}
            />
            <div className="flex justify-end gap-4">
              {locked && (
                <button
                  onClick={onEdit}
                  className="
        rounded-md border border-yellow-500/30
        bg-yellow-500/10 px-3 py-1.5 text-sm
        text-yellow-400 hover:bg-yellow-500/20
        transition cursor-pointer
      "
                >
                  Edit
                </button>
              )}

              {!locked && (
                <>
                  <button
                    onClick={onNew}
                    className="flex items-center gap-2 rounded-md border border-white/10 bg-slate-800 px-3 py-1.5 text-sm text-sky-300 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Plus size={16} />
                    New Question
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="
          p-2 rounded-md
          bg-red-500/10
          border border-red-500/30
          text-red-400
          hover:bg-red-500/20
          hover:border-red-400/60
          transition cursor-pointer
        "
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* HEADER */}
        <h2 className="text-lg font-medium text-white">
          Question{" "}
          <span className="text-sky-400">
            {index + 1} / {total}
          </span>
        </h2>

        {/* QUESTION INPUT */}
        <input
          disabled={locked}
          value={question.text}
          placeholder="Type your question here…"
          onChange={(e) => saveQuestion({ ...question, text: e.target.value })}
          className={`${locked?"cursor-not-allowed opacity-70":"cursor-pointer"}
            w-full rounded-lg px-4 py-2 text-sm
            bg-slate-800 text-slate-100
            border border-white/10
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-sky-500/40
            disabled:opacity-50
          `}
        />

        {/* OPTIONS */}
        <div className="flex flex-col gap-3">
          {question.options.map((opt: any) => (
            <div
              key={opt.id}
              className={`
                flex items-center gap-3 rounded-lg px-4 py-2
                bg-slate-800 border border-white/10
                ${opt.isCorrect ? "ring-2 ring-emerald-500/40" : ""}
              `}
            >
              <input
                type="checkbox"
                checked={opt.isCorrect}
                disabled={locked}
                className={`
  accent-emerald-500
  ${locked ? "cursor-not-allowed" : "cursor-pointer"}
`}
                onChange={() =>
                  saveQuestion({
                    ...question,
                    options: question.options.map((o: any) => ({
                      ...o,
                      isCorrect: o.id === opt.id,
                    })),
                  })
                }
              />

              <input
                disabled={locked}
                value={opt.text}
                onChange={(e) => updateOption(opt.id, "text", e.target.value)}
                placeholder="Option text"
                className={`${locked ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
                  flex-1 rounded-md px-2 py-1
                  bg-slate-900 text-slate-100
                  placeholder:text-slate-400
                  outline-none
                  focus:ring-1 focus:ring-sky-500/40
                `}
              />
              {!locked && (
                <XCircle
                  size={18}
                  onClick={() => removeOption(opt.id)}
                  className={`${locked ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
      cursor-pointer text-slate-500
      hover:text-red-400 transition
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {!locked && (
          <button
            onClick={addOption}
            className="
              mt-2 w-fit rounded-md border border-white/10
              bg-slate-800 px-3 py-1.5 text-sm
              text-sky-300 hover:bg-slate-700 transition
              cursor-pointer
            "
          >
            Add option
          </button>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="
              rounded-md border border-white/10
              bg-slate-800 px-4 py-2 text-sm text-white
              hover:bg-slate-700 disabled:opacity-40
              cursor-pointer
            "
          >
            Previous
          </button>

          <button
            onClick={onNext}
            disabled={index === total - 1}
            className="
              rounded-md border border-white/10
              bg-slate-800 px-4 py-2 text-sm text-white
              hover:bg-slate-700 disabled:opacity-40
              cursor-pointer
            "
          >
            Next
          </button>
        </div>

        <button
          onClick={handleComplete}
          className="
            rounded-md bg-blue-500 px-5 py-2
            text-sm font-medium text-white
            hover:bg-blue-400 transition
            cursor-pointer
          "
        >
          Complete
        </button>
      </div>
      <ConfirmDeleteQuestionModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteQuestion}
        loading={deleting}
      />
    </div>
  );
}
