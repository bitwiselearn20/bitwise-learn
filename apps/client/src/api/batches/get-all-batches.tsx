import axiosInstance from "@/lib/axios";

export const getAllBatches = async (stateFn: any, paramId: string) => {
    // console.log("in batch func")
    const data = await axiosInstance.get("/api/batch/get-batches-for-institution/" + paramId);
    // console.log(data);
    stateFn(data.data);
}
