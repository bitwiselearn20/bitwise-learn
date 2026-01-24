import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const token = req.cookies.get("accessToken")?.value;
    const body = await req.json();

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/courses/update-course/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(body),
      },
    );

    const data = res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
