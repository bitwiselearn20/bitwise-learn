import { NextRequest, NextResponse } from "next/server";
const URL_MAP: Record<string, string> = {
  STUDENT: "students",
  BATCH: "batches",
  TESTCASE: "testcases",
};
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const token = req.headers.get("authorization");
    const formData = await req.formData();
    console.log("route hit");
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/bulk-upload/${URL_MAP[formData.get("type") as string]}/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
        body: formData,
      },
    );
    console.log("output recived");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
