import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id;
    const token = req.headers.get("authorization");
  
    if (!assessmentId) {
      return NextResponse.json(
        { message: "Assessment ID is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${process.env.BACKEND_URL}/api/v1/assessments/get-assessment-section/${assessmentId}`,
      {
        method: "GET",
        headers: {
          Authorization: token || "",
        },
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
