import axiosInstance from "@/lib/axios";

export const addContentToSection = async (
  sectionId: string,
  name: string,
  description: string,
) => {
  const res = await axiosInstance.post(
    `/api/course/add-content-by-sectionId/${sectionId}`,
    {
      name,
      description,
      sectionId,
    },
  );

  return res.data;
};
