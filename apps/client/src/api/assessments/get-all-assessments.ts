import axiosInstance from "@/lib/axios";

export const getAllAssessments = async () => {
  const res = await axiosInstance.get("/api/assessments/get-all-assessments");
  return res.data;
};
