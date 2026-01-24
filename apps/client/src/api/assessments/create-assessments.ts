import axiosInstance from "@/lib/axios";
type CreateAssessment = {
  name: string;
  description: string;
  instructions: string;
  startTime: string;
  endTime: string;
  individualSectionTimeLimit?: number;
  status?: "UPCOMING" | "LIVE" | "ENDED";
  batchId: string;
};

export const createAssessments = async (payload: CreateAssessment) => {
  const requestBody = {
    name: payload.name,
    description: payload.description,
    instruction: payload.instructions,
    startTime: payload.startTime,
    endTime: payload.endTime,
    individualSectionTimeLimit: payload.individualSectionTimeLimit,
    status: payload.status,
    batchId: payload.batchId,
  };

  const response = await axiosInstance.post(
    "/api/assessments/create-assessment",
    requestBody,
  );

  return response.data.data;
};
