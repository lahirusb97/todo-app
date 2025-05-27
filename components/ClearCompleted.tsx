"use client";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ClearCompleted({
  completedCount,
  disabled,
}: {
  completedCount: number;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClearCompleted = async () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/clear-completed", {
          method: "DELETE",
        });
        if (res.ok) {
          const data = await res.json();
          toast.success(`Cleared ${data.deleted} completed todos.`);
          router.refresh();
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to clear completed todos.");
        }
      } catch {
        toast.error("Network error. Please try again.");
      }
    });
  };

  // Don’t show button if there are no completed todos
  if (!completedCount) return null;

  return (
    <button
      onClick={handleClearCompleted}
      className="px-4 py-1.5 rounded-md bg-red-600 text-white font-medium shadow hover:bg-red-700 transition"
      disabled={isPending || disabled}
    >
      {isPending ? "Clearing..." : `Clear Completed (${completedCount})`}
    </button>
  );
}
