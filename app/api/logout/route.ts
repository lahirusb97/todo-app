// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Expire the token cookie by setting maxAge=0
  const res = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0, // Expire immediately
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
