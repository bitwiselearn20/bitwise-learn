import axiosInstance from "@/lib/axios";

export const getAllProblemData = async (statefn: any) => {
  const getProblem = await axiosInstance.get("/api/get-problem/");
  console.log("question data is : " + JSON.stringify(getProblem.data));
  statefn(getProblem.data);
};
