import axiosInstance from "@/lib/axios";

type question = {
    question: string;
    options: string[];
    correctOption: number,
    problem?: string;
    maxMarks: number;
}

export const createQuestion = async (
    sectionId:string,
    payload : question
)=>{
    const reqBody = {
        question: payload.question,
        options: payload.options,
        correctOption: payload.correctOption,
        problem: payload.problem || "",
        maxMarks: payload.maxMarks,
    }

    const response = await axiosInstance.post(
        `/api/assessments/create-question/${sectionId}`,
        reqBody
    );

    return response.data.data;
}