import axiosInstance from "@/lib/axios";

export const uploadThumbnail = async (
  courseId: string,
  file: File,
  stateFn?: any,
) => {
  const formData = new FormData();
  formData.append("thumbnail", file);

  const res = await axiosInstance.post(
    `/api/course/upload-thumbnail/${courseId}`,
    formData,
  );

  if (stateFn) {
    stateFn(res.data);
  }

  return res.data;
};
