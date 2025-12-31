"use client";
import { useEffect, useState } from "react";
import Filter from "./Filter";
import QuestionCard from "./QuestionCard";
import { getAllProblemData } from "@/api/problems/get-all-problems";

type Difficulty = "easy" | "medium" | "hard";

function AllListedQuestions() {
  const [questions, setQuestions] = useState<any>([]);

  useEffect(() => {
    getAllProblemData(setQuestions);
  }, []);
  return (
    <div>
      <Filter />
      <div className="w-full">
        {questions.map((question: any, index: number) => {
          return (
            <QuestionCard
              key={index}
              topics={question.problemTopics}
              id={question.id}
              name={question.name}
              difficulty={question.difficulty}
              solved={false}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AllListedQuestions;
