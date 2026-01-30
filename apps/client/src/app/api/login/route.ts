import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { createJWT } from "@/lib/authJwt";
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
    console.log(response.data);
    (await cookies()).set("token", response.data.data.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    const roleToken = createJWT({ role: data.role });


    (await cookies()).set("role", roleToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    if (data.role.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    } else if (data.role === "INSTITUTION") {
      return NextResponse.redirect(new URL("/institute-dashboard", req.url));
    } else if (data.role === "VENDOR") {
      return NextResponse.redirect(new URL("/vendor-dashboard", req.url));
    } else if (data.role === "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else if (data.role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher-dashboard", req.url));
    }

    return NextResponse.json(response.data.data, { status: 200 });
  } catch (error: any) {
    console.error("Error loggin in :", error.message);
    console.log(error);

    return NextResponse.json({ error: "Failed loggin in " }, { status: 500 });
  }
}
