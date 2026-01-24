import axiosInstance from "@/lib/axios";

export const deleteCourseById = async (courseId: string) => {
  const res = await axiosInstance.delete(
    `/api/course/delete-course/${courseId}`,
  );
  console.log(res);
  return res.data;
};
