import axiosInstance from "@/lib/axios";

export const deleteSectionById = async (sectionId: string) => {
  const res = await axiosInstance.delete(
    `/api/course/delete-section/${sectionId}`,
  );
  return res.data;
};
