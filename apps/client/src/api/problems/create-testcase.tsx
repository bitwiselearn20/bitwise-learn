import axiosInstance from "@/lib/axios";

export const createTestCase = async (problemId: string, data: any) => {
  const response = await axiosInstance.post(
    "/api/admin/create-testcase/" + problemId,
    data,
  );

  return response.data;
};
