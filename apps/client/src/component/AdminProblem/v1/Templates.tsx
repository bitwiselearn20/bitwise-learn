"use client";

import { getAllProblemTemplate } from "@/api/problems/get-all-template";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ShowAddTemplateForm from "./ShowAddTemplateForm";
import { createProblemTemplate } from "@/api/problems/create-template";

type Template = {
  id: string;
  problemId: string;
  language: string;
  defaultCode: string;
  functionBody: string;
};

const LANGUAGE_MAP: Record<string, string> = {
  PYTHON: "python",
  JAVA: "java",
  CPP: "cpp",
  JAVASCRIPT: "javascript",
  TYPESCRIPT: "typescript",
};

function Templates() {
  const param = useParams();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [currentDisplay, setCurrentDisplay] = useState<
    "defaultCode" | "functionBody"
  >("defaultCode");

  const [showTemplateForm, setShowTemplateForm] = useState(false);

  /** user editable default code per language */
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    getAllProblemTemplate((res: Template[]) => {
      setTemplates(res);

      if (res.length === 0) return;

      const initialLang = res[0].language;
      setSelectedLang(initialLang);

      const initialCode: Record<string, string> = {};
      res.forEach((t) => {
        initialCode[t.language] = t.defaultCode;
      });
      setCodeMap(initialCode);
    }, param.id as string);
  }, [param.id]);

  /* ---------------- MAP ---------------- */
  const templateMap = useMemo(() => {
    const map: Record<string, Template> = {};
    templates.forEach((t) => {
      map[t.language] = t;
    });
    return map;
  }, [templates]);

  if (!selectedLang) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-gray-400">
        {showTemplateForm && (
          <ShowAddTemplateForm
            onClose={() => setShowTemplateForm(false)}
            onSave={(data) => createProblemTemplate(param.id as string, data)}
          />
        )}
        No templates available
        <button
          onClick={() => setShowTemplateForm(true)}
          className="rounded-md bg-blue-600 mt-3 px-4 py-2 text-sm font-medium text-white
                     hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Template
        </button>
      </div>
    );
  }

  const activeTemplate = templateMap[selectedLang];
  const monacoLanguage = LANGUAGE_MAP[selectedLang] || "plaintext";

  const editorValue =
    currentDisplay === "defaultCode"
      ? (codeMap[selectedLang] ?? "")
      : (activeTemplate?.functionBody ?? "");

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen flex flex-col bg-neutral-900 text-gray-300">
      {showTemplateForm && (
        <ShowAddTemplateForm
          onClose={() => setShowTemplateForm(false)}
          onSave={(data) => createProblemTemplate(param.id as string, data)}
        />
      )}

      {/* Top Action */}
      <div className="w-full p-3 gap-3 flex justify-end">
        <button
          onClick={() => setShowTemplateForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Template
        </button>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-green-700 focus:outline-none focus:ring-2
                     focus:ring-green-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        {["defaultCode", "functionBody"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setCurrentDisplay(tab as "defaultCode" | "functionBody")
            }
            className={`px-4 py-2 text-sm font-medium transition ${
              currentDisplay === tab
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "defaultCode" ? "Default Code" : "Function Body"}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">
          {selectedLang} Editor
        </h2>

        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-md"
        >
          {Object.keys(templateMap).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeTemplate && (
          <Editor
            key={`${selectedLang}-${currentDisplay}`} // 🔑 CRITICAL FIX
            language={monacoLanguage}
            value={editorValue}
            theme="vs-dark"
            onChange={(value) => {
              if (currentDisplay === "defaultCode") {
                setCodeMap((prev) => ({
                  ...prev,
                  [selectedLang]: value ?? "",
                }));
              }
            }}
            options={{
              readOnly: currentDisplay === "functionBody",
              fontSize: 14,
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Templates;
