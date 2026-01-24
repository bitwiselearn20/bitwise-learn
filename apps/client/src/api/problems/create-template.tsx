import axiosInstance from "@/lib/axios";

export const createProblemTemplate = async (problemId: string, data: any) => {
  const response = await axiosInstance.post(
    "/api/admin/create-template/" + problemId,
    data,
  );

  return response.data;
};
