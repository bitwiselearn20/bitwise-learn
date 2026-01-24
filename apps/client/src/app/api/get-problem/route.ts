import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axios";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const response = await axiosInstance.get(
      `${backendUrl}/api/v1/problems/get-all-dsa-problem`,
    );
    return NextResponse.json(response.data.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching problem:", error.message);
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 },
    );
  }
}
