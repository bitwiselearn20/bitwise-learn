import axiosInstance from "@/lib/axios"

export const getAllBatches = async (stateFn: any) => {
    console.log("in batch func")
    const data = await axiosInstance.get("/api/batch");
    console.log(data);
    stateFn(data.data);
}