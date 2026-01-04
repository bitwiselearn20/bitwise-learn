import axiosInstance from "@/lib/axios";

export const getAllTeachers = async (statefn: any) => {
  const getAllTeachers = await axiosInstance.get("/api/teacher/get-all-teachers");
  console.log("all teachers " + JSON.stringify(getAllTeachers.data));
  statefn(getAllTeachers.data);
};
