import axiosInstance from "@/lib/axios";

export const createTopic = async (id: string, data: any) => {
  await axiosInstance.post("/api/admin/create-topic/" + id, data);
};
