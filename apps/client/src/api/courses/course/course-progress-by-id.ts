import axiosInstance from "@/lib/axios";

export const getCourseProgressById = async (courseId: string) => {
  const res = await axiosInstance.get(
    `/api/course/get-course-progress/${courseId}`
  );

  return res.data;
};
