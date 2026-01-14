import axiosInstance from "@/lib/axios";

export const getAllStats = async (stateFn: any) => {
  const data = await axiosInstance.post("/api/admin/get-admin-stats", {
    role: "admin",
  });
  console.log(data);
  stateFn(data.data);
};
