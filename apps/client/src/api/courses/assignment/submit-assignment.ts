import axiosInstance from "@/lib/axios";

export const submitAssignment = async (id: string, payload: any) => {
  try {
    await axiosInstance.post(`/api/course/assignment/submit/${id}`, payload);
  } catch (error) {
    console.log(error);
  }
};
