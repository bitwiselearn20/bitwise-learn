import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    try {
        const backendUrl = process.env.BACKEND_URL;
        if (!backendUrl) {
            return NextResponse.json(
                { error: "Backend URL not configured" },
                { status: 500 }
            );
        }

        const response = await axios.get(
            `${backendUrl}/api/v1/institutions`
        );

        return NextResponse.json(response.data.data, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching institutions:", error.message);

        return NextResponse.json(
            { error: "Failed to fetch institutions" },
            { status: 500 }
        );
    }
}
