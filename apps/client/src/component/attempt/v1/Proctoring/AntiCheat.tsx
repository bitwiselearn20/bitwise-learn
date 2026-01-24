import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export function useAntiCheatControls(started: boolean) {
  const startedRef = useRef(started);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    if (!startedRef.current) return;

    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right click is disabled during the test.", {
        duration: 1000,
        position: "top-right",
        style: { background: "#000", color: "#fff" },
      });
    };

    const disableCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copy / Paste is disabled during the test.", {
        duration: 1000,
        position: "top-right",
        style: { background: "#000", color: "#fff" },
      });
    };

    const disableShortcuts = (e: KeyboardEvent) => {
      if (!startedRef.current) return;

      const key = e.key.toLowerCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (ctrlOrCmd && ["c", "v", "x", "a"].includes(key)) {
        e.preventDefault();

        toast.error("Copy / paste is disabled during the test.", {
          duration: 750,
          position: "top-right",
          style: { background: "#000", color: "#fff" },
        });
        return;
      }

      if (key === "tab") {
        e.preventDefault();

        toast.error("Tab navigation is disabled during the test.", {
          duration: 750,
          position: "top-right",
          style: { background: "#000", color: "#fff" },
        });
        return;
      }

      if (e.metaKey) {
        toast.error("System keys are restricted during the test.", {
          duration: 750,
          position: "top-right",
          style: { background: "#000", color: "#fff" },
        });
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("keydown", disableShortcuts, true);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("keydown", disableShortcuts, true);
    };
  }, [started]);
}
