import axiosInstance from "@/lib/axios";

export const getInstituteData = async (statefn: any, paramId: string) => {
    const getProblem = await axiosInstance.get("/api/institution/" + paramId);
    console.log(getProblem.data);
    statefn(getProblem.data);
};
