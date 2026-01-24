import axiosInstance from "@/lib/axios";

export const getInstituteData = async (statefn: any, paramId: string) => {
    try {
        const getInstitution = await axiosInstance.get("/api/institution/" + paramId);
        console.log(getInstitution.data);
        statefn(getInstitution.data);
    } catch (error) {
        console.log("ERRORR", error);
    }
};
