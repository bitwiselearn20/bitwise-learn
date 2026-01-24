import axiosInstance from "@/lib/axios";

export const updateProblemTemplate = async (
  id: string,
  data: any,
  templateMap: any,
) => {
  const res = await axiosInstance.post(
    "/api/admin/update-template/" + id,
    data,
  );
  console.log(data.data);
  templateMap[data.currentLanguage] = res.data;
};
