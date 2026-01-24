import axiosInstance from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const token = req.headers.get("authorization");

    const response = await axiosInstance.post(
      `${process.env.BACKEND_URL}/api/v1/courses/add-course-section/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      },
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error("Create section error:", error);

    return NextResponse.json(
      {
        message: error.response?.data?.message || error.message || "",
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
}
