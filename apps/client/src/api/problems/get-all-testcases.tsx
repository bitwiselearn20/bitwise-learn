import axiosInstance from "@/lib/axios";
import React from "react";

export const getAllProblemTestCases = async (statefn: any, id: string) => {
  const getProblem = await axiosInstance.get(
    "/api/get-problem/testcases/" + id
  );
  console.log("testcases are : " + JSON.stringify(getProblem.data));
  statefn(getProblem.data);
};
