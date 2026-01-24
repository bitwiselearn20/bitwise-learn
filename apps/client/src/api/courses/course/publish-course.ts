import axiosInstance from "@/lib/axios";

export const publishCourse = async (courseId: string, stateFn?: any) => {
  const res = await axiosInstance.put(`/api/course/publish-course/${courseId}`);

  if (stateFn) {
    stateFn(res.data);
  }

  return res.data;
};
