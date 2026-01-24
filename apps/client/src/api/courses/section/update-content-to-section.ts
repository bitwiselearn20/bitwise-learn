import axiosInstance from "@/lib/axios";

type UpdateContentPayload = {
  name?: string;
  description?: string;
  transcript?: string | null;
  videoUrl?: string;
};

export const updateContentToSection = async (
  contentId: string,
  data: UpdateContentPayload,
) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
  if (data.transcript) formData.append("transcript", data.transcript);

  console.log("content id is: ", contentId);
  const res = await axiosInstance.put(
    `/api/course/update-content-by-sectionId/${contentId}`,
    formData,
  );

  return res.data;
};
