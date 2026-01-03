import axiosInstance from "@/lib/axios";

export async function createSolution(id: string, data: any) {
  await axiosInstance.post("/api/admin/create-solution/" + id, data);
}
