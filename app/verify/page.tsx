import VerifyOtpForm from "@/components/VerifyOtpForm";
import React from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/jwtToken";

export default async function page() {
  //acess the cokier
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (token) {
    const user = await verifyJwt(token);
    if (user?.isVerified) {
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <VerifyOtpForm />
    </div>
  );
}
