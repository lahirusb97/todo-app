"use client";
import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Reorder } from "framer-motion";
import TodoItem from "./TodoItem";
import { Todo } from "@/generated/prisma";
import ClearCompleted from "./ClearCompleted";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function TodoContainer({
  todos: initialTodos,
  total,
  page,
  page_size,
  filter,
}: {
  todos: Todo[];
  total: number;
  page: number;
  page_size: number;
  filter: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / page_size));
  const [isPending, startTransition] = useTransition();

  // --- DRAG & DROP STATE ---
  const [todos, setTodos] = useState(initialTodos);

  // Sync local todos with server-provided todos
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  // Handle drag-and-drop reorder
  const handleReorder = (newOrder: Todo[]) => {
    setTodos(newOrder);
    // Optionally: Persist newOrder to backend here if needed
  };

  // Pagination numbers
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  // Query updater for filter/pagination
  const updateQuery = (key: string, value: string) => {
    if (isPending) return;
    const qp = new URLSearchParams(searchParams.toString());
    qp.set(key, value);
    if (key !== "page") qp.set("page", "1");
    startTransition(() => {
      router.push(`/?${qp.toString()}`);
    });
  };

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  return (
    <div className="mt-10">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center sm:justify-start">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => updateQuery("filter", f.value)}
            className={`px-4 py-1.5 rounded-md border font-medium transition-all
              ${
                filter === f.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-foreground border-accent hover:bg-accent/10"
              }
            `}
            disabled={isPending}
            aria-pressed={filter === f.value}
            aria-label={`Show ${f.label} todos`}
          >
            {f.label}
          </button>
        ))}
        <ClearCompleted completedCount={completedCount} />
      </div>

      {/* Todo List - DRAGGABLE */}
      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={handleReorder}
        className="space-y-3 min-h-[100px] relative"
        transition={{ duration: 0.32, ease: [0.24, 1, 0.32, 1] }} // cubic-bezier for "fluid" feel
      >
        {todos.map((item) => (
          <TodoItem
            key={item.id}
            id={item.id}
            text={item.title}
            completed={item.completed}
            value={item}
            // pass transition to item if you want finer control
          />
        ))}
      </Reorder.Group>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => updateQuery("page", p.toString())}
              disabled={page === p || isPending}
              className={`w-9 h-9 rounded-full text-sm font-medium transition
                ${
                  page === p
                    ? "bg-primary text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-gray-700"
                }
                ${page === p ? "cursor-default" : "hover:scale-105"}
              `}
              aria-current={page === p}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
