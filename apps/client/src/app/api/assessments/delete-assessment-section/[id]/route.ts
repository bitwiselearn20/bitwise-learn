import { NextResponse, NextRequest } from "next/server";

export async function DELETE(
    req: NextRequest,
    context: {params: Promise<{id: string}>}
){
    try {
        const sectionId = (await context.params).id;
        const token = req.headers.get("authorization");

        const res = await fetch(
            `${process.env.BACKEND_URL}/api/v1/assessments/delete-assessment-section/${sectionId}`,
            {
                method:"DELETE",
                headers:{
                    Authorization: token || "",
                }
            }
        );

        const data = await res.json();
        return NextResponse.json(data, {status:res.status});
    } catch (error: any) {
        return NextResponse.json(
            {message: error.message},
            {status: 500}
        )
    }
}