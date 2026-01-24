import axiosInstance from "@/lib/axios";

export const createInstitution = async (data: any) => {
  const createInstitution = await axiosInstance.post(
    "/api/institution/create-institution/",
    data,
  );
  console.log(createInstitution);
};
