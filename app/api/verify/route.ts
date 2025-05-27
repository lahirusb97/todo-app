import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwtToken";

export async function POST(req: NextRequest) {
  try {
    // 1. Get JWT from cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Verify JWT and extract userId
    const payload = await verifyJwt(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. Get OTP from request body
    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    // 4. Fetch user from DB using userId
    const user = await prisma.user.findUnique({
      where: { id: payload.userId.toString() },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Match OTP
    if (user.verificationToken !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // 6. Mark user as verified (set verificationToken to null)
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: null, emailVerified: true }, // assuming you have an emailVerified field
    });

    return NextResponse.json(
      { message: "Verification successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
