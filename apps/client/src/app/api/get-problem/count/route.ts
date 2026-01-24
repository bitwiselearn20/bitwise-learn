import axiosInstance from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const url = backendUrl + "/api/v1/problems/admin/get-user-solved-questions";

    const response = await axiosInstance.get(url);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error(
      "Get solved questions error:",
      error?.response?.data || error,
    );

    return NextResponse.json(
      {
        message: error?.response?.data?.message || "Something went wrong",
      },
      { status: error?.response?.status || 500 },
    );
  }
}
