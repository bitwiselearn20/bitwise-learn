import axiosInstance from "@/lib/axios";

export const deleteAssessment = async (
    assessmentId : string,
)=>{
    const res = await axiosInstance.delete(
        `/api/assessments/delete-assessment/${assessmentId}`
    );
    return res.data.data;
}