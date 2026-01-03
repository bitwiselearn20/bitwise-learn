"use client";

import MDEditor from "@uiw/react-md-editor";

type Mode = "live" | "preview" | "edit";

export default function MarkdownEditor({
  height = 350,
  value,
  setValue,
  mode,
  hideToolbar = true,
}: {
  height: number;
  value: string;
  setValue: (val: string) => void;
  mode: Mode;
  hideToolbar: boolean;
}) {
  return (
    <div>
      <MDEditor
        height={height}
        value={value}
        onChange={(val) => setValue(val ?? "")}
        preview={mode}
        hideToolbar={hideToolbar}
        spellCheck
        className={mode !== "live" ? "md-no-toolbar" : ""}
      />
    </div>
  );
}
