import axiosInstance from "@/lib/axios";

export const getSectionQuestions = async(
    sectionId: string,
)=>{
    console.log(`/api/assessments/get-section-questions/${sectionId}`)
    const res = await axiosInstance.get(
        `/api/assessments/get-section-questions/${sectionId}`
    );


    return res.data.data;
}