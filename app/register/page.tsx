import React from "react";
import RegisterForm from "@/components/RegisterForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  //acess the cokier
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (token) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}
