import axiosInstance from "@/lib/axios";

export const getProblemSolutionById = async (statefn: any, id: string) => {
  const getProblem = await axiosInstance.get("/api/get-problem/solution/" + id);
  console.log("solution are : " + JSON.stringify(getProblem.data));
  statefn(getProblem.data);
};
