"use client";
import axiosInstance from "@/lib/axios";
import { Editor } from "@monaco-editor/react";
import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";

const LANGUAGE_CONFIG: Record<string, any> = {
  python: {
    monaco: "python",
    boilerplate: `print("Hello, World!")`,
  },
  javascript: {
    monaco: "javascript",
    boilerplate: `console.log("Hello, World!");`,
  },
  java: {
    monaco: "java",
    boilerplate: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
  },
  c: {
    monaco: "c",
    boilerplate: `#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}`,
  },
  cpp: {
    monaco: "cpp",
    boilerplate: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,
  },
  go: {
    monaco: "go",
    boilerplate: `package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`,
  },
  rust: {
    monaco: "rust",
    boilerplate: `fn main() {
  println!("Hello, World!");
}`,
  },
};

function CodeCompiler() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGE_CONFIG.python.boilerplate);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Change boilerplate when language changes
  useEffect(() => {
    setCode(LANGUAGE_CONFIG[language].boilerplate);
  }, [language]);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const res = await axiosInstance.post("/api/compile", {
        code,
        language: language === "cpp" ? "c++" : language,
        input,
      });

      const data = res.data.run;
      if (data.signal === "SIGKILL") {
        if (data.output === "Sandbox keeper received fatal signal 6\n") {
          setOutput("Infinite Loop in program");
        } else {
          setOutput(data.message);
        }
      } else {
        setOutput(data.output || data.error);
      }
    } catch (err) {
      setOutput("Execution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-[#020617]">
        <h1 className="font-semibold text-lg">Online Code Compiler</h1>

        <div className="flex gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-600 px-3 py-1 rounded text-sm"
          >
            {Object.keys(LANGUAGE_CONFIG).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            className="flex gap-2 bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm font-medium"
          >
            <Play /> Run
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-3">
          <Editor
            language={LANGUAGE_CONFIG[language].monaco}
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
            }}
            className="p-1"
          />
        </div>

        <div className="h-[90svh] w-[35%] min-w-[300px] max-w-[50%] flex flex-col border-l border-slate-700 resize-x">
          {/* Input */}
          <div className="flex-1 min-h-[150px] p-3">
            <p className="text-xs text-slate-400 mb-1">Input</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full bg-slate-900 border border-slate-700 rounded p-2 text-sm resize-y overflow-auto"
              placeholder="Enter input here..."
            />
          </div>

          {/* Output */}
          <div className="flex-1 min-h-[150px] p-3 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Output</p>
            <textarea
              value={output}
              readOnly
              className="w-full h-full bg-black border border-slate-700 rounded p-2 text-sm resize-y overflow-auto text-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeCompiler;
