"use client";

import { Search } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard" | null;
type Status = "solved" | "unsolved" | null;

type FilterProps = {
  query: string;
  setQuery: (v: string) => void;
  difficulty: Difficulty;
  setDifficulty: (v: Difficulty) => void;
  status: Status;
  setStatus: (v: Status) => void;
};

function Filter({
  query,
  setQuery,
  difficulty,
  setDifficulty,
  status,
  setStatus,
}: FilterProps) {
  return (
    <div className="w-full bg-primary-bg rounded-b-xl p-4 flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-60">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions"
          className="
            w-full pl-9 pr-3 py-2
            rounded-md bg-secondary-bg/80
            text-sm text-white
            placeholder:text-white/40
            focus:outline-none focus:ring-1 focus:ring-white/20
          "
        />
      </div>

      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <FilterPill
          label="Easy"
          active={difficulty === "easy"}
          color="green"
          onClick={() => setDifficulty(difficulty === "easy" ? null : "easy")}
        />
        <FilterPill
          label="Medium"
          active={difficulty === "medium"}
          color="yellow"
          onClick={() =>
            setDifficulty(difficulty === "medium" ? null : "medium")
          }
        />
        <FilterPill
          label="Hard"
          active={difficulty === "hard"}
          color="red"
          onClick={() => setDifficulty(difficulty === "hard" ? null : "hard")}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <FilterPill
          label="Solved"
          active={status === "solved"}
          onClick={() => setStatus(status === "solved" ? null : "solved")}
        />
        <FilterPill
          label="Unsolved"
          active={status === "unsolved"}
          onClick={() => setStatus(status === "unsolved" ? null : "unsolved")}
        />
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: "green" | "yellow" | "red";
  onClick: () => void;
}) {
  const colorMap = {
    green: "text-green-400 border-green-400/40 bg-green-400/10",
    yellow: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
    red: "text-red-400 border-red-400/40 bg-red-400/10",
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md text-sm
        border transition-all
        ${
          active
            ? color
              ? colorMap[color]
              : "text-white border-white/40 bg-white/10"
            : "text-white/60 border-white/10 hover:border-white/30"
        }
      `}
    >
      {label}
    </button>
  );
}

export default Filter;
