import axiosInstance from "@/lib/axios";

export const getAllStudents = async (statefn: any) => {
  const getAllStudents = await axiosInstance.get("/api/student/");
  console.log("all students " + JSON.stringify(getAllStudents.data));
  statefn(getAllStudents.data);
};
