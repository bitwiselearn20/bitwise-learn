"use client";

import MDEditor from "@uiw/react-md-editor";

export default function MarkdownEditor({ value, setValue, mode }: any) {
  return (
    <MDEditor
      height={350}
      value={value}
      onChange={setValue}
      preview={mode}
      className="bg-gray-800 text-white rounded-md"
      style={{ fontFamily: "Inter, sans-serif", fontSize: 16 }}
    />
  );
}
