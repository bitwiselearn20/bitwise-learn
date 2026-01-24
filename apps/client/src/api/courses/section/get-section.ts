import axiosInstance from "@/lib/axios";

export const getSections = async (courseId: string) => {
  const res = await axiosInstance.get(
    `/api/course/get-section-by-courseId/${courseId}`,
  );

  return res.data;
};
