import axiosInstance from "@/lib/axios";

export const getAllAdmins = async (stateFn: any) => {
  const data = await axiosInstance.get("/api/admin");
  console.log(data);
  stateFn(data.data);
};
