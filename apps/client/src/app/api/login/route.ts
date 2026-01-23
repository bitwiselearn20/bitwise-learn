import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
interface LoginProp {
  email: string;
  password: string;
  role: "STUDENT" | "INSTITUTION" | "ADMIN" | "VENDOR" | "TEACHER";
}
const URL_MAP = {
  STUDENT: "/student/login",
  INSTITUTION: "/institution/login",
  ADMIN: "/admin/login",
  VENDOR: "/vendor/login",
  TEACHER: "/teacher/login",
};

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const data: LoginProp = await req.json();

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 },
      );
    }
    const response = await axios.post(
      `${backendUrl}/api/v1/auth` + URL_MAP[data.role],
      { email: data.email, password: data.password },
    );

    (await cookies()).set("token", response.data.data.tokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    (await cookies()).set("role", data.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    return NextResponse.json(response.data.data, { status: 200 });
  } catch (error: any) {
    console.error("Error loggin in :", error.message);
    console.log(error);

    return NextResponse.json({ error: "Failed loggin in " }, { status: 500 });
  }
}
