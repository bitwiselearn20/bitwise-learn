import axiosInstance from "@/lib/axios";

export const createProblem = async (data: any) => {
  const createProblem = await axiosInstance.post(
    "/api/admin/create-problem/",
    data,
  );
  console.log(createProblem);
};
