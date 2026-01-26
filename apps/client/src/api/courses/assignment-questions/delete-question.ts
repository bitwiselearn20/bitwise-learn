import axiosInstance from "@/lib/axios";

export const deleteAssignmentQuestion = async (questionId: string) => {
  if (!questionId) throw new Error("Question ID is required");

  const res = await axiosInstance.delete(
    `/api/course/assignment-question/delete/${questionId}`,
  );

  return res.data;
};
