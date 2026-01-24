import axiosInstance from "@/lib/axios";

export const createCourse = async (
  payload: {
    name: string;
    description: string;
    level: string;
    duration: string;
    instructorName: string;
  },
  stateFn?: any,
) => {
  const res = await axiosInstance.post("/api/course/create-course", payload);

  if (stateFn) {
    stateFn(res.data);
  }

  return res.data;
};
