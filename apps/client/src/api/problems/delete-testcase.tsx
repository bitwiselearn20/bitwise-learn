import axiosInstance from "@/lib/axios";

export const deleteTestCase = async (id: string) => {
  const getProblem = await axiosInstance.get(
    "/api/get-problem/testcases/" + id
  );
};
