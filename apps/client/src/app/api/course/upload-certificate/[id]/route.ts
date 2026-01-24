import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const token = req.headers.get("authorization");
    const formData = await req.formData();

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/courses/upload-completion-certificate/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
        body: formData,
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
