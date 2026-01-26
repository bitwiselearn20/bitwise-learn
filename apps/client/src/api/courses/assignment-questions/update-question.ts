import axiosInstance from "@/lib/axios";

type UpdateAssignmentQuestionPayload = {
  question?: string;
  options?: any[];
  correctAnswer?: string | string[];
  type?: "SCQ" | "MCQ";
};

export const updateAssignmentQuestion = async (
  questionId: string,
  payload: UpdateAssignmentQuestionPayload,
) => {
  if (!questionId) throw new Error("Question ID is required");

  const res = await axiosInstance.put(
    `/api/course/assignment-question/update/${questionId}`,
    payload,
  );

  return res.data;
};
