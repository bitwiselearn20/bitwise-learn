"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { X } from "lucide-react";
import { useColors } from "@/component/general/(Color Manager)/useColors";
import { useTheme } from "@/component/general/(Color Manager)/ThemeController";

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
  const Colors = useColors();
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

    onSave?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start">
      <div className={` w-full max-w-5xl mt-10 rounded-lg shadow-xl ${Colors.border.defaultThin} flex flex-col ${Colors.background.secondary}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className={`font-semibold ${Colors.text.primary}`}>Add New Template</h2>
          <button onClick={onClose} className={`hover:text-red-500 ${Colors.text.primary} cursor-pointer active:scale-95 transition-all`}>
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-3 py-1.5 rounded-md text-sm ${Colors.background.primary} ${Colors.border.defaultThin} ${Colors.text.primary} cursor-pointer`}
          >
            {Object.keys(LANGUAGE_MAP).map((lang) => (
              <option className="cursor-pointer" key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("defaultCode")}
              className={`px-3 py-1.5 text-sm rounded-md cursor-pointer active:scale-95 transition-all ${
                activeTab === "defaultCode"
                  ? `${Colors.background.special} ${Colors.text.primary}`
                  : `${Colors.background.primary} ${Colors.text.secondary}`
              }`}
            >
              Default Code
            </button>

            <button
              onClick={() => setActiveTab("functionBody")}
              className={`px-3 py-1.5 text-sm rounded-md cursor-pointer active:scale-95 transition-all ${
                activeTab === "functionBody"
                  ? `${Colors.background.special} ${Colors.text.primary}`
                  : `${Colors.background.primary} ${Colors.text.secondary}`
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
            theme={useTheme().theme === "Dark" ? "vs-dark" : "vs-light"}
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
        <div className="flex gap-3 p-4">
          <button
            onClick={onClose}
            className={`flex-1  py-2 rounded-md ${Colors.text.special} hover:underline cursor-pointer active:scale-95 transition-all`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-2 rounded-md font-semibold ${Colors.background.special} ${Colors.text.primary} ${Colors.hover.special} cursor-pointer active:scale-95 transition-all`}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowAddTemplateForm;
