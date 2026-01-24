import axiosInstance from "@/lib/axios";

export const getAssignmentsBySection = async (
  sectionId: string,
  stateFn?: any,
) => {
  const res = await axiosInstance.get(
    `/api/course/assignment/get-all-section-assignments/${sectionId}`,
  );

  if (stateFn) {
    stateFn(res.data);
  }

  return res.data;
};
