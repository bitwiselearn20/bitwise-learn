import axiosInstance from "@/lib/axios";
import { requestToBodyStream } from "next/dist/server/body-streams";
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
    const request = await fetch("https://api.ipify.org?format=json");
    const data = await request.json();
    const clientIp = data.ip;
    console.log(clientIp);
    await axiosInstance.post("/api/assessments/submit/" + id, {
      ...data,
      ip: clientIp,
    });
  } catch (error) {
    toast.error("error submitting test");
  }
};
