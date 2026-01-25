"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { DarkSemantic, LightSemantic } from "@/component/general/(Color Manager)/SemanticColors";
import { applySemanticToCSS } from "@/component/general/(Color Manager)/SemanticCSSVariables";

type Theme = "Light" | "Dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("Light");

  useEffect(() => {
    const semantic = theme === "Dark" ? DarkSemantic : LightSemantic;
    applySemanticToCSS(semantic);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "Dark" ? "Light" : "Dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
