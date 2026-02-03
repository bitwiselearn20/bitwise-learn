import axiosInstance from "@/lib/axios";

export async function handleReport(id: string) {
  await axiosInstance.get("/api/assessment-report/" + id);
}
