import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export function useTabSwitchCounter(started: boolean) {
  const [count, setCount] = useState(0);
  const lastHiddenTime = useRef<number | null>(null);
  const startedRef = useRef(started);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!startedRef.current) return;

      if (document.hidden) {
        lastHiddenTime.current = Date.now();
      } else {
        if (lastHiddenTime.current !== null) {
          setCount((prev) => {
            const next = prev + 1;

            toast.error(`Tab switch detected (${next}/3)`, {
              duration: 1500,
              position: "top-right",
              style: { background: "#000", color: "#fff" },
            });

            return next;
          });

          lastHiddenTime.current = null;
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, []);

  return count;
}
