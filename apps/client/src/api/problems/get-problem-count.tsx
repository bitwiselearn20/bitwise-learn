import axiosInstance from "@/lib/axios";

export const getAllProblemCount = async (statefn: any) => {
  const getProblem = await axiosInstance.get("/api/get-problem/count/");
  statefn(getProblem.data.data);
};
