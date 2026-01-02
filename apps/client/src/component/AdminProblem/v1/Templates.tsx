"use client";

import { getAllProblemTemplate } from "@/api/problems/get-all-template";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ShowAddTemplateForm from "./ShowAddTemplateForm";

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
  const [selectedLang, setSelectedLang] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState<
    "defaultCode" | "functionBody"
  >("defaultCode");
  const [showTemplateFrom, setShowTemplateForm] = useState(false);
  /** user editable code per language */
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllProblemTemplate((res: Template[]) => {
      setTemplates(res);

      if (res.length > 0) {
        setSelectedLang(res[0].language);

        const initialCode: Record<string, string> = {};
        res.forEach((t) => {
          initialCode[t.language] = t.defaultCode;
        });
        setCodeMap(initialCode);
      }
    }, param.id as string);
  }, [param.id]);

  const templateMap = useMemo(() => {
    const map: Record<string, Template> = {};
    templates.forEach((t) => {
      map[t.language] = t;
    });
    return map;
  }, [templates, currentDisplay]);

  const activeTemplate = templateMap[selectedLang];
  const monacoLanguage = LANGUAGE_MAP[selectedLang] || "plaintext";

  const editorValue =
    currentDisplay === "defaultCode"
      ? (codeMap[selectedLang] ?? "")
      : (activeTemplate?.functionBody ?? "");

  return (
    <div className="h-screen flex flex-col bg-neutral-900 text-gray-300">
      {showTemplateFrom && <ShowAddTemplateForm />}
      <div className="w-full p-3 flex justify-end">
        <button
          onClick={() => setShowTemplateForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
               shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2
               focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Template
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        <button
          onClick={() => setCurrentDisplay("defaultCode")}
          className={`px-4 py-2 text-sm font-medium transition ${
            currentDisplay === "defaultCode"
              ? "text-white border-b-2 border-indigo-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Default Code
        </button>

        <button
          onClick={() => setCurrentDisplay("functionBody")}
          className={`px-4 py-2 text-sm font-medium transition ${
            currentDisplay === "functionBody"
              ? "text-white border-b-2 border-indigo-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Function Body
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">
          {selectedLang} Editor
        </h2>

        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 text-gray-300 text-sm px-3 py-1.5 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
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
            language={monacoLanguage}
            value={editorValue}
            theme="vs-dark"
            onChange={(value) => {
              if (currentDisplay === "defaultCode") {
                setCodeMap((prev) => ({
                  ...prev,
                  [selectedLang]: value || "",
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
