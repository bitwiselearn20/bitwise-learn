import axiosInstance from "@/lib/axios";

export type createBatch = {
    batchname: string;
    branch: string;
    batchEndYear: string;
    institutionId: string;
};

export const createBatch = async (payload: createBatch) => {
    const response = await axiosInstance.post(
        "/api/batch/create-batch",
        payload,
    );

    return response.data?.data;
};
