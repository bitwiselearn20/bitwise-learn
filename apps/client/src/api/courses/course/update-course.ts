import axiosInstance from "@/lib/axios";

export const updateCourse = async (
  courseId: string,
  payload: {
    description?: string;
    duration?: string;
    instructorName?: string;
    level?: "BASIC" | "INTERMEDIATE" | "ADVANCE";
  },
) => {
  const res = await axiosInstance.put(
    `/api/course/update-course/${courseId}`,
    payload,
  );

  return res.data;
};
