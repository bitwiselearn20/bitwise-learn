import { NextResponse, NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const token = req.cookies.get("accessToken")?.value;
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/courses/delete-course/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      },
    );

    const data = await res.json();
    console.log("This is res data", data);

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
