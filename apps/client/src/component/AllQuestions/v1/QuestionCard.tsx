"use client";

import Link from "next/link";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

function QuestionCard({
  id,
  name,
  topics,
  difficulty,
  solved,
}: {
  id: string;
  name: string;
  topics: any[]; // array of topic objects
  difficulty: Difficulty;
  solved: boolean;
}) {
  // Flatten all tagNames into a single array
  const topicNames: string[] = topics.flatMap((topic) => topic.tagName || []);

  return (
    <div
      className="
        group flex items-center
        px-4 py-3
        bg-primary-bg hover:bg-secondary-bg
        transition w-[90%] mx-auto
      "
    >
      {/* Status */}
      <div className="w-8 flex justify-center shrink-0">
        {solved && <span className="text-green-400 text-sm">✔</span>}
      </div>

      {/* Title */}
      <div className="flex-1 max-w-[60%]">
        <Link
          href={`/problems/${id}`}
          className="text-md text-white group-hover:text-blue-400 truncate"
        >
          {name}
        </Link>
      </div>

      {/* Difficulty */}
      <div className="w-24 text-sm shrink-0">
        <DifficultyBadge difficulty={difficulty} />
      </div>

      {/* Topics */}
      <div className="w-56 flex gap-2 justify-end shrink-0">
        {topicNames.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="
              text-xs px-2 py-1
              rounded-md
              bg-white/5
              text-white/60
              whitespace-nowrap
            "
          >
            {topic}
          </span>
        ))}
        {topicNames.length > 3 && (
          <span className="text-xs text-white/40">
            +{topicNames.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map = {
    EASY: "text-green-400",
    MEDIUM: "text-yellow-400",
    HARD: "text-red-400",
  };

  return (
    <span className={`font-medium ${map[difficulty]}`}>
      {difficulty.toLowerCase()}
    </span>
  );
}

export default QuestionCard;
