import axiosInstance from "@/lib/axios";

export const deleteAssessmentQuestion = async (
    questionId: string,
)=>{
    const res = await axiosInstance.delete(
        `/api/assessments/delete-assessment-question/${questionId}`
    );

    return res.data.data;
}