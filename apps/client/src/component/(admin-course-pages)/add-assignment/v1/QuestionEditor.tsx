import { v4 as uuid } from "uuid";
import { Plus, XCircle } from "lucide-react";
import QuestionNavigation from "./QuestionNavigation";
import { Colors } from "@/component/general/Colors";

export default function QuestionEditor({
  question,
  index,
  total,
  saveQuestion,
  onPrev,
  onNext,
  onNew,
  onSubmit,
  locked,
  onEdit, //  NEW PROP
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

  return (
    <div className="flex w-1/2 flex-col justify-between">
      <div>
        {/* TOP RIGHT ACTION */}
        <div className="flex w-full justify-end">
          {locked ? (
            <button
              onClick={onEdit}
              className="text-sm text-blue-400 hover:underline"
            >
              Edit Assignment
            </button>
          ) : (
            <XCircle
              size={30}
              onClick={onClose}
              className="cursor-pointer text-neutral-600 hover:text-red-800 transition-colors duration-150"
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Question Header */}
          <h2 className={`text-lg ${Colors.text.primary}`}>
            <span className="font-semibold">Question: </span>
            {index + 1}
          </h2>

          {/* Question Input */}
          <input
            disabled={locked}
            value={question.text}
            placeholder="Question"
            onChange={(e) =>
              saveQuestion({ ...question, text: e.target.value })
            }
            className={`h-10 w-full rounded-lg ${Colors.text.primary} p-2 ${Colors.background.secondary} ${Colors.border.fadedThin} text-sm placeholder:text-white/40 disabled:opacity-50`}
          />

          {/* OPTIONS */}
          {question.options.map((opt: any) => (
            <div key={opt.id} className="flex items-center gap-3">
              <div
                className={`flex flex-1 items-center gap-3 rounded-lg ${Colors.background.secondary} px-4 py-2 ${Colors.border.fadedThin}`}
              >
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  disabled={locked}
                  className={Colors.accent.secondary}
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
                  placeholder="Option"
                  className={`flex-1 bg-transparent outline-none ${Colors.text.primary}`}
                />
              </div>
            </div>
          ))}

          {/* ADD OPTION */}
          {!locked && (
            <button
              onClick={addOption}
              className={`w-fit p-2 rounded-md ${Colors.background.secondary} ${Colors.text.primary} ${Colors.border.fadedThin} text-xl hover:opacity-55 cursor-pointer group`}
            >
              <Plus
                size={20}
                color="white"
                className="group-hover:scale-125 ease-in-out duration-150"
              />
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <QuestionNavigation
        index={index}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        onNew={onNew}
        onSubmit={onSubmit}
        locked={locked}
      />
    </div>
  );
}
