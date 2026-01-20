import axiosInstance from "@/lib/axios";

type AddAssignmentPayload = {
    name:string;
    description:string;
    instruction:string;
    marksPerQuestion:number;
    sectionId:string;
};

export const addAssignmentToSection = async (
    payload:AddAssignmentPayload,
    stateFn?:any,
)=>{
    const res = await axiosInstance.post(
        "/api/course/assignment/add-assignment-to-section",
        payload,
    );

    if(stateFn){
        stateFn(res.data);
    }

    return res.data;
}