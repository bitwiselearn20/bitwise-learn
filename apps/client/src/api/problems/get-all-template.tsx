import axiosInstance from "@/lib/axios";
import React from "react";

export const getAllProblemTemplate = async (statefn: any, id: string) => {
  const getProblem = await axiosInstance.get("/api/get-problem/template/" + id);
  console.log("template is : " + JSON.stringify(getProblem.data));
  statefn(getProblem.data);
};
