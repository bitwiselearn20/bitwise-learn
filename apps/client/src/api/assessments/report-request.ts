import axiosInstance from "@/lib/axios";
import axios from "axios";

export const sebdAssessmentReport = async (id: string) => {
  await axiosInstance.get("/api/assessment-report/" + id);
};
