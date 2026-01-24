import axiosInstance from "@/lib/axios";

export const deleteContentFromSection = async (contentId: string) => {
  const res = await axiosInstance.delete(
    `/api/course/delete-content-from-section/${contentId}`,
  );
  return res.data;
};
