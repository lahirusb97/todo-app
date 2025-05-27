import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwtToken"; // Adjust the import path as needed
import { prisma } from "@/lib/prisma";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Compare password with bcrypt
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Convert userId to bigint if your schema uses string ObjectId, or use user.id directly
    // Here, we assume user.id is a string, so we convert to BigInt for your JWT helper

    // Sign JWT with { userId, name }
    const token = await signJwt({
      userId: user.id,
      name: user.name,
      isVerified: user.emailVerified,
    });

    // Set JWT as HTTP-only cookie
    const res = NextResponse.json(
      {
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error: unknown) {
    if (isPrismaKnownRequestError(error)) {
      // Handle Prisma known errors
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
