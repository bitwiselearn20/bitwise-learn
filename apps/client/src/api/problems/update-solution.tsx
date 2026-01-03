import axiosInstance from "@/lib/axios";

export async function updateSolution(id: string, data: any) {
  await axiosInstance.post("/api/admin/update-solution/" + id, data);
}
