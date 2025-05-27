// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwtToken"; // You'll define this

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;

  const PUBLIC_PATHS = [
    "/login",
    "/register",
    "/api",
    "/_next",
    "/favicon.ico",
  ];
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isStaticAsset =
    pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico");
  if (isPublic || isStaticAsset) {
    // Publicly accessible routes: do not block
    return NextResponse.next();
  }

  // Prevent unauthenticated access to '/', '/verify', or any other private routes
  const protectedRoutes = ["/", "/verify"];
  const isProtected = protectedRoutes.some((path) => pathname === path);

  if (isProtected && (!token || !payload)) {
    // Not authenticated: redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated or not protected, continue
}
// Protect only root and verify routes, but you can expand this as needed
export const config = {
  matcher: ["/", "/verify"],
};
