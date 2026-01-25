import axiosInstance from "@/lib/axios";

export interface UpdateAssessmentSection {
    name?: string;
    marksPerQuestion?: number;
}

export const updateAssessmentSection = async (
    sectionId: string,
    data: UpdateAssessmentSection,
)=>{
    const res = await axiosInstance.put(
        `/api/assessments/update-assessment-section/${sectionId}`,
        data
    );
    return res.data.data;
}