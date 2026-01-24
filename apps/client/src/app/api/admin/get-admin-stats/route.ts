import axiosInstance from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const response = await axiosInstance.get(
      backendUrl + "/api/v1/admins/db-info",
    );
    let filteredResponse = response.data.data;

    //TODO: ADD ROLE BASED FILTERING WHEN REQUIRED
    return NextResponse.json(filteredResponse, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching problem:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 },
    );
  }
}
