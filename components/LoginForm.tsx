"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LockIcon,
  MailIcon,
  LogInIcon,
  UserPlus2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/getErrorMsg";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.user) {
        router.push("/");
      } else {
        toast.error(data.error || "Invalid email or password.");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to login. Please try again."));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-sm w-full mx-auto bg-surface border border-focus rounded-xl shadow-lg p-6 text-foreground space-y-6">
        {/* Heading and Subheading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">
            Organize Your Day with Clarity and Confidence
          </h1>
          <p className="text-sm text-foreground/80">
            Our task manager helps you focus on what matters most with clean
            design, quick actions, and a calm interface built for your
            productivity rhythm.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <div className="flex items-center gap-2 border border-accent px-3 py-2 rounded-md bg-white">
              <MailIcon size={16} className="text-primary" />
              <input
                id="email"
                type="email"
                className="w-full outline-none text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <div className="flex items-center gap-2 border border-accent px-3 py-2 rounded-md bg-white">
              <LockIcon size={16} className="text-primary" />
              <input
                id="password"
                type="password"
                className="w-full outline-none text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-white py-2 rounded-md font-semibold flex justify-center items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogInIcon size={16} />
                Login
              </>
            )}
          </button>
        </form>

        <div className="text-sm text-center">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline flex justify-center items-center gap-1 mt-1"
          >
            <UserPlus2 size={14} />
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
