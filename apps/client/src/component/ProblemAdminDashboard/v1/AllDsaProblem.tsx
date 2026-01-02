"use client";
import { useEffect, useState } from "react";
import { getAllProblemData } from "@/api/problems/get-all-problems";
import Filter from "@/component/AllQuestions/v1/Filter";
import QuestionCard from "@/component/AllQuestions/v1/QuestionCard";

type Difficulty = "easy" | "medium" | "hard";

function AllDsaProblem() {
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
              isAdmin={true}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AllDsaProblem;
