import axiosInstance from "@/lib/axios";

type UpdateAssignmentPayload = {
  description?: string;
  marksPerQuestion?: number;
  instruction?: string;
};

export const updateAssignment = async (
  assignmentId: string,
  data: UpdateAssignmentPayload,
) => {
  const res = await axiosInstance.put(
    `/api/course/assignment/update-assignment/${assignmentId}`,
    data,
  );

  return res.data;
};
