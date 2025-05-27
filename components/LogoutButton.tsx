"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`cursor-pointer
        flex items-center gap-2
        py-1 px-3
        rounded-lg
        text-sm font-medium
        transition
        shadow
        mt-2
        hover:opacity-90
        active:scale-95
        disabled:opacity-60
        focus:outline-none
      `}
      style={{
        background: "var(--color-primary)",
        color: "white",
        minWidth: 80,
        maxWidth: 140,
      }}
      aria-label="Logout"
    >
      <LogOut size={16} />
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
