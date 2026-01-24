import axiosInstance from "@/lib/axios";

export const uploadCertificate = async (
  courseId: string,
  file: File,
  stateFn?: any,
) => {
  const formData = new FormData();
  formData.append("certificate", file);

  const res = await axiosInstance.post(
    `/api/course/upload-certificate/${courseId}`,
    formData,
  );

  if (stateFn) {
    stateFn(res.data);
  }

  return res.data;
};
