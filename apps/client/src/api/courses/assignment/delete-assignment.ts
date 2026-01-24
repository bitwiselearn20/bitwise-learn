import axiosInstance from "@/lib/axios";

export const deleteAssignmentById = async (assignmentId: string) => {
  if (!assignmentId) throw new Error("Assignment ID is Required");

  const res = await axiosInstance.delete(
    `/api/course/assignment/delete-assignment/${assignmentId}`,
  );

  return res.data;
};
