import axiosInstance from "@/lib/axios";

export const getAllProblemSubmission = async (statefn: any, id: string) => {
  const getProblem = await axiosInstance.get(
    "/api/get-problem/submission/" + id,
  );
  console.log("testcases are : " + JSON.stringify(getProblem.data));
  statefn(getProblem.data);
};
