import axiosInstance from "@/lib/axios";

export const getCourseById = async (courseId: string) => {
  const res = await axiosInstance.get(
    `/api/course/get-course-by-id/${courseId}`,
  );

  return res.data;
};
