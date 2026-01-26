import axiosInstance from "@/lib/axios";

type AddAssignmentQuestionPayload = {
  assignmentId: string;
  question: string;
  options: any[];
  correctAnswer: string | string[];
};

export const addAssignmentQuestion = async (
  assignmentId: string,
  payload: AddAssignmentQuestionPayload,
) => {
  const res = await axiosInstance.post(
    `/api/course/assignment-question/add/${assignmentId}`,
    payload,
  );

  return res.data;
};
