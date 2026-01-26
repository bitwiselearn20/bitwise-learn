import axiosInstance from "@/lib/axios";

export async function changeStatus(problemId: string) {
  const response = await axiosInstance.post(
    "/api/admin/change-status/" + problemId,
  );
  return response.data;
}
