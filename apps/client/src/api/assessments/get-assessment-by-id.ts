import axiosInstance from "@/lib/axios";

export const getAssessmentById = async (assessmentId: string) => {
  const res = await axiosInstance.get(
    `/api/assessments/get-assessment-by-id/${assessmentId}`,
  );

  return res.data;
};
