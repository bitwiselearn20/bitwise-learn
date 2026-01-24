"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { X } from "lucide-react";

const LANGUAGE_MAP: Record<string, string> = {
  PYTHON: "python",
  JAVA: "java",
  CPP: "cpp",
  JAVASCRIPT: "javascript",
  C: "c",
};

type Props = {
  onClose: () => void;
  onSave?: (data: {
    language: string;
    defaultCode: string;
    functionBody: string;
  }) => void;
};

function ShowAddTemplateForm({ onClose, onSave }: Props) {
  const [language, setLanguage] = useState("PYTHON");
  const [defaultCode, setDefaultCode] = useState("");
  const [functionBody, setFunctionBody] = useState("");
  const [activeTab, setActiveTab] = useState<"defaultCode" | "functionBody">(
    "defaultCode",
  );

  const monacoLanguage = LANGUAGE_MAP[language] || "plaintext";

  const editorValue = activeTab === "defaultCode" ? defaultCode : functionBody;

  const handleSave = () => {
    const payload = {
      language,
      defaultCode,
      functionBody,
    };

    console.log("New Template:", payload);
    onSave?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start">
      <div className="bg-neutral-900 w-full max-w-5xl mt-10 rounded-lg shadow-xl border border-neutral-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <h2 className="text-white font-semibold">Add New Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-md text-sm"
          >
            {Object.keys(LANGUAGE_MAP).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("defaultCode")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                activeTab === "defaultCode"
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-gray-400"
              }`}
            >
              Default Code
            </button>

            <button
              onClick={() => setActiveTab("functionBody")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                activeTab === "functionBody"
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-gray-400"
              }`}
            >
              Function Body
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <Editor
            height={500}
            key={`${language}-${activeTab}`}
            language={monacoLanguage}
            value={editorValue}
            theme="vs-dark"
            onChange={(value) => {
              if (activeTab === "defaultCode") {
                setDefaultCode(value ?? "");
              } else {
                setFunctionBody(value ?? "");
              }
            }}
            options={{
              fontSize: 14,
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 py-2 rounded-md font-semibold"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowAddTemplateForm;
