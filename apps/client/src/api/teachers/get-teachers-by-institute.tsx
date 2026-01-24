import axiosInstance from "@/lib/axios";

export const getTeacherByInstitute = async (statefn: any, paramId: string) => {
  const getStudents = await axiosInstance.get(
    "/api/teacher/get-by-institute/" + paramId,
  );
  // console.log(getStudents.data);
  statefn(getStudents.data);
};
