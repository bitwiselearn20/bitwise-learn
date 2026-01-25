"use client";

import MDEditor from "@uiw/react-md-editor";
import { useColors } from "../general/(Color Manager)/useColors";

const Colors = useColors();

type Mode = "live" | "preview" | "edit";
export const THEME_MAP = {
  light: {
    backgroundColor: "#dbe4e8",
    color: "black",
  },
  dark: {
    backgroundColor: "#171717",
    color: "white",
  },
};
export default function MarkdownEditor({
  height = 350,
  value,
  setValue,
  mode,
  hideToolbar = true,
  theme = "dark",
}: {
  height: number;
  value: string;
  setValue: (val: string) => void;
  mode: Mode;
  hideToolbar: boolean;
  theme: "light" | "dark";
}) {
  return (
    <div
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        //@ts-ignore
        WebkitScrollbar: { display: "none" },
      }}
    >
      <MDEditor
        data-color-mode={theme}
        height={height}
        value={value}
        onChange={(val) => setValue(val ?? "")}
        preview={mode}
        hideToolbar={hideToolbar}
        spellCheck
        className={mode !== "live" ? `${Colors.background.primary} ${Colors.text.primary}` : ""}
        style={{
          ...THEME_MAP[theme],
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          //@ts-ignore
          WebkitScrollbar: { display: "none" },
        }}
      />
    </div>
  );
}
