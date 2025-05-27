"use client";

import React, { useState, useEffect } from "react";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState("");
  const [matched, setMatched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const score =
      (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[^a-zA-Z0-9]/.test(password) ? 1 : 0);

    if (!password) setStrength("");
    else if (score <= 1) setStrength("Weak");
    else if (score === 2) setStrength("Moderate");
    else setStrength("Strong");
  }, [password]);

  useEffect(() => {
    setMatched(confirm.length > 0 && confirm === password);
  }, [confirm, password]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!matched || strength === "Weak" || !name || !email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/verify");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface border border-gray-300 rounded-xl shadow-md p-6 space-y-6 text-foreground">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">
            Begin Your Journey to Organized Living
          </h1>
          <p className="text-sm text-muted mt-1">
            Sign up to unlock your focused workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white">
              <UserIcon size={16} className="text-primary" />
              <input
                type="text"
                className="w-full outline-none text-sm"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white">
              <MailIcon size={16} className="text-primary" />
              <input
                type="email"
                className="w-full outline-none text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white">
              <LockIcon size={16} className="text-primary" />
              <input
                type="password"
                className="w-full outline-none text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {strength && (
              <div className="mt-1 text-xs font-medium">
                Password Strength:{" "}
                <span
                  className={
                    strength === "Weak"
                      ? "text-red-500"
                      : strength === "Moderate"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }
                >
                  {strength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <div
              className={`flex items-center gap-2 border px-3 py-2 rounded-md bg-white ${
                matched ? "border-green-500" : "border-red-300"
              }`}
            >
              {matched ? (
                <CheckCircleIcon size={16} className="text-green-600" />
              ) : (
                <XCircleIcon size={16} className="text-red-400" />
              )}
              <input
                type="password"
                className="w-full outline-none text-sm"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <div className="text-xs mt-1 font-medium text-foreground/70">
              {confirm.length > 0 &&
                (matched ? "✅ Passwords match" : "❌ Passwords do not match")}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md font-semibold flex justify-center items-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <SparklesIcon size={16} />
            )}
            Register
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
