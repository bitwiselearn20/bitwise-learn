import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    console.log(backendUrl);
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 },
      );
    }
    const response = await axios.get(
      `${backendUrl}/api/v1/admins/get-all-admin`,
    );

    return NextResponse.json(response.data.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching admins:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 },
    );
  }
}
