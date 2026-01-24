import axiosInstance from "@/lib/axios";

export const getAssessmentSections = async (assessmentId: string) => {
  if (!assessmentId) return [];

  const res = await axiosInstance.get(
    `/api/assessments/get-all-sections/${assessmentId}`,
  );

  return res.data?.data ?? [];
};
