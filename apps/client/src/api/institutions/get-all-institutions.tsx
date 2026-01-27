import axiosInstance from "@/lib/axios";

export const getAllInstitutions = async (stateFn: any) => {
  const data = await axiosInstance.get("/api/institution");
  console.log("Institutions" + JSON.stringify(data.data));
  stateFn(data.data);
  // return data.data;
};
