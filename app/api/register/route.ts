import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/hashPassword"; // adjust import as needed
import { prisma } from "@/lib/prisma";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";
import { signJwt } from "@/lib/jwtToken";
import { errorMsgRetrn } from "@/lib/errorMsgRetrn";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "TODO App", email: "lahirushirant@gmail.com" },
        to: [{ email: email, name: name }],
        subject: "Your OTP Code",
        htmlContent: `<html><body><h2>Your OTP is: <strong>${otp}</strong></h2></body></html>`,
        textContent: `Your OTP is: ${otp}`,
      }),
    });

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, verificationToken: otp },
    });
    const { name: userName } = user;
    // Sign a JWT token
    const token = await signJwt({
      userId: user.id,
      name: userName,
      isVerified: false,
    });

    const res = NextResponse.json(
      { message: "Registration successful!", user: userName },
      { status: 201 }
    );

    // Set the cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (error) {
    if (isPrismaKnownRequestError(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return errorMsgRetrn(error);
  }
}
