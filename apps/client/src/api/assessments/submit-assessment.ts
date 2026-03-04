import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

export const submitIndividualQuestion = async (
  id: string,
  data: any,
  type: "CODE" | "NO_CODE",
) => {
  try {
    await axiosInstance.post("/api/assessments/submit/question/" + id, data);
  } catch (error) {
    toast.error("error submitting question");
  }
};

export const submitTest = async (id: string, data: any) => {
  try {
    const request = await axiosInstance.get("http://jsonip.com/");
    const clientIp = request.data.ip;

    await axiosInstance.post("/api/assessments/submit/" + id, {
      ...data,
      ip: clientIp,
    });
  } catch (error) {
    toast.error("error submitting test");
  }
};
