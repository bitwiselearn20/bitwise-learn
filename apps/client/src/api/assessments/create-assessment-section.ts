import axiosInstance from "@/lib/axios";

type AssessmentSectionPayload = {
  name: string;
  marksPerQuestion: number;
  assessmentType: "CODE" | "NO_CODE";
  assessmentId: string;
};

export const createAssessmentSection = async (
  payload: AssessmentSectionPayload,
) => {
  const res = await axiosInstance.post(
    "/api/assessments/create-assessment-section",
    payload,
  );

  return res.data.data;
};
