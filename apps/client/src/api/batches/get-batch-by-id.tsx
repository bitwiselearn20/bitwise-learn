import axiosInstance from "@/lib/axios";

export const getBatchData = async (statefn: any, paramId: string) => {
  const getBatch = await axiosInstance.get("/api/batch/" + paramId);
  console.log(getBatch.data);
  statefn(getBatch.data);
};
