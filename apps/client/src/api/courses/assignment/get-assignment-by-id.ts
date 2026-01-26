import axiosInstance from "@/lib/axios";

export const getAssignmentById = async (assignmentId: string,stateFn?:any) => {
  if (!assignmentId) throw new Error("Assignment ID is required");

  const res = await axiosInstance.get(
    `/api/course/assignment/get/${assignmentId}`,
  );

  if(stateFn){
    stateFn(res.data);
  }

  return res.data;
};
