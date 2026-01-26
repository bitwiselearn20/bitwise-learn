import axiosInstance from "@/lib/axios";

export const createAdmin = async (data: any) => {
  const createAdmin = await axiosInstance.post(
    "/api/admin/admins/create-admin/",
    data,
  );
  console.log(createAdmin);
};
