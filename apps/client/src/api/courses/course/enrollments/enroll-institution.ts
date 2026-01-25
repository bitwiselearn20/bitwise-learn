import axiosInstance from "@/lib/axios";

export async function enrollInstitutionCourses(data: {
  batchId: string;
  courses: string[];
}) {
  const result = await axiosInstance.post(
    "/api/course/create-enrollment",
    data,
  );
  console.log(result);
}
