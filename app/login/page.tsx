import LoginForm from "@/components/LoginForm";
import React from "react";
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
    <div>
      <LoginForm />
    </div>
  );
}
// In a Server Component or Server Action
