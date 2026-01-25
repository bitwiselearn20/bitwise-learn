import axiosInstance from "@/lib/axios";

export const publishAssessment = async (
    assessmentId: string,
)=>{
    const res = await axiosInstance.put(
        `/api/assessments/publish-assessment/${assessmentId}`,
        { status: "LIVE" }
    );

    return res.data.data;
}