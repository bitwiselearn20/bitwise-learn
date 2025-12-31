"use client";

import { Editor } from "@monaco-editor/react";
import React, { useEffect, useMemo, useState } from "react";

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
];

const normalizeLanguage = (lang: string) => lang.toLowerCase();

export default function CodeEditor({ template }: { template: any[] }) {
  /* Map backend templates by language */
  const templatesByLanguage = useMemo(() => {
    const map: Record<string, any> = {};
    template?.forEach((t) => {
      map[normalizeLanguage(t.language)] = t;
    });
    return map;
  }, [template]);

  /* Pick first available language deterministically */
  const defaultLang = template?.length
    ? normalizeLanguage(template[0].language)
    : "python";
  const defaultCode = template?.length ? template[0].defaultCode : "";

  const [language, setLanguage] = useState(defaultLang);
  const [code, setCode] = useState(defaultCode);

  /* Load defaultCode first, fallback to functionBody */
  useEffect(() => {
    const tpl = templatesByLanguage[language];
    if (!tpl) return;

    if (tpl.defaultCode && tpl.defaultCode.trim().length > 0) {
      setCode(tpl.defaultCode);
    } else if (tpl.functionBody) {
      setCode(tpl.functionBody);
    } else {
      setCode("");
    }
  }, [language, templatesByLanguage]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#262626] border-b border-[#333]">
        <span className="text-sm font-semibold text-gray-300">Code</span>

        <div className="flex">
          <button className="px-3 ml-3 rounded-sm bg-secondary-bg text-md font-semibold">
            Run
          </button>
          <button className="px-3 ml-3 rounded-sm bg-secondary-hero text-md font-semibold">
            Submit
          </button>
        </div>

        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-[#1e1e1e] text-gray-300 text-sm px-3 py-1 rounded border border-[#333] outline-none"
        >
          {languageOptions
            .filter((lang) => templatesByLanguage[lang.value])
            .map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
        </select>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Editor
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            mouseWheelZoom: true,
            tabSize: 2,
            cursorBlinking: "smooth",
            fontLigatures: true,
            smoothScrolling: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}
