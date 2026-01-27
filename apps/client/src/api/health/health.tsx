import axiosInstance from "@/lib/axios";

export const getAllStats = async (stateFn: any) => {
    const data = await axiosInstance.get("/health");
    console.log(data);
    stateFn(data.data);
};
