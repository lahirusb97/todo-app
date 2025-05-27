"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/getErrorMsg";

export default function VerifyOtpForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("OTP verified! Redirecting...");
        setTimeout(() => router.push("/"), 1200);
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Failed to delete todo. Please try again.")
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-surface border border-focus rounded-xl shadow-lg p-6 space-y-6 text-foreground">
      <h2 className="text-2xl font-bold text-primary text-center mb-2">
        Verify Your Account
      </h2>
      <p className="text-center text-sm mb-4 text-foreground/80">
        Enter the 6-digit code sent to your email.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full border border-accent px-4 py-2 rounded-md text-lg tracking-widest text-center outline-none"
          placeholder="Enter OTP"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:scale-105 active:scale-95 transition-transform"
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      {error && <div className="text-red-600 text-center">{error}</div>}
      {successMsg && (
        <div className="text-green-600 text-center">{successMsg}</div>
      )}
      {/* //validate late */}
      <Link href={"/"} className="text-sm text-foreground/70 hover:underline">
        Verify later
      </Link>
    </div>
  );
}
