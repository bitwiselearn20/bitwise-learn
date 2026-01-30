import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { URL_ACCESS_MAP } from "./lib/access";
import { checkJWT } from "./lib/authJwt";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes
  const PUBLIC_ROUTES = [
    "/",
    "/about",
    "/contact",
    "/student-login",
    "/multi-login",
    "/admin-login",
    "/api/run"
  ];
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }
  const roleToken = request.cookies.get("token")?.value
  const { type: role } = checkJWT(roleToken as string);
  ;

  // Not logged in
  if (!role) {
    return NextResponse.redirect(new URL("/student-login", request.url));
  }

  let allowedRoutes = URL_ACCESS_MAP[role];
  if (role === "SUPERADMIN") {
    URL_ACCESS_MAP["ADMIN"]
  }

  if (!allowedRoutes) {
    if (role === "ADMIN" || role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher-dashboard", request.url));
    } else if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/student-dashboard", request.url));
    } else if (role === "INSTITUTE") {
      return NextResponse.redirect(new URL("/institute-dashboard", request.url));
    } else if (role === "VENDOR") {
      return NextResponse.redirect(new URL("/vendor-dashboard", request.url));
    }
  }

  if (allowedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
