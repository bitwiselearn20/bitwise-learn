import axiosInstance from "@/lib/axios";

export const deleteAssessmentSection = async (
    sectionId : string,
)=>{
    const res = await axiosInstance.delete(
        `/api/assessments/delete-assessment-section/${sectionId}`,
    );
    return res.data.data;
}