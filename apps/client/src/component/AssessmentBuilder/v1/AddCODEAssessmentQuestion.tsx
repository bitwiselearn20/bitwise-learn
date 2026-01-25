"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface CodeQuestion {
  id: string;
  title: string;
  difficulty: string;
}

interface AddAssessmentCodeProps {
  open: boolean;
  onClose: () => void;
}

const AddAssessmentCode = ({ open, onClose }: AddAssessmentCodeProps) => {
  const [query, setQuery] = useState("");
  const [questions, setQuestions] = useState<CodeQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;           
    if (query.length > 2) {
      fetchQuestions(query);
    }
  }, [query, open]);

  const fetchQuestions = async (search: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/code-questions?search=${search}`
      );
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RETURN AFTER HOOKS
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Add Coding Question
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search coding questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-slate-700 bg-slate-800 p-2 rounded text-white"
        />

        {loading && <p className="text-slate-400">Loading...</p>}

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {questions.map((q) => (
            <li
              key={q.id}
              className="border border-slate-700 p-3 rounded flex justify-between"
            >
              <span className="text-white">{q.title}</span>
              <span className="text-sm text-slate-400">
                {q.difficulty}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddAssessmentCode;
