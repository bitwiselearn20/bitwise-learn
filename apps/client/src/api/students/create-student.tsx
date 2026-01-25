import axiosInstance from "@/lib/axios";

export type CreateStudentPayload = {
    name: string;
    rollNumber: string;
    email: string;
    loginPassword: string;
    batchId: string;
    institutionId?: string;
};

export const createStudent = async (payload: CreateStudentPayload) => {
    const response = await axiosInstance.post(
        "/api/student/create-student",
        payload,
    );

    return response.data?.data;
};
