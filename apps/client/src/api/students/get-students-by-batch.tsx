import axiosInstance from "@/lib/axios";

export const getStudentsByBatch = async (statefn: any, paramId: string) => {
  const getStudents = await axiosInstance.get(
    "/api/student/get-by-batch/" + paramId,
  );
  // console.log(getStudents.data);
  statefn(getStudents.data);
};
