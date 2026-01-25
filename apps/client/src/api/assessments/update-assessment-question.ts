import axiosInstance from "@/lib/axios";

interface UpdateAssessmentQuestionBody {
    question?: string;
    options?: string[];
    correctOption?: number;
    maxMarks?: number;
}

export const updateAssessmentQuestion = async (
    questionId: string,
    data: UpdateAssessmentQuestionBody
)=>{
    const res = await axiosInstance.put(
        `/api/assessments/update-assessment-question/${questionId}`,
        data
    );

    return res.data.data;
}