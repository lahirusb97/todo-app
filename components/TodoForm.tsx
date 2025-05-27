"use client";
import { PencilIcon, PlusCircleIcon } from "lucide-react";
import React, { useState, useTransition } from "react";
import { addTodo } from "./todo-actions/todoActions";
import LogoutButton from "./LogoutButton";

export default function TodoForm() {
  const [todoName, setTodoName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = async () => {
    if (!todoName.trim()) return;

    startTransition(async () => {
      try {
        await addTodo(todoName);
        setTodoName(""); // Clear input on success
      } catch (err) {
        alert("Failed to add task.");
        console.error(err);
      }
    });
  };

  return (
    <div>
      <div className="rounded-xl border border-focus p-6 w-full shadow-md mb-6 bg-surface">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <PencilIcon size={20} className="text-primary" />
          Add a New Task
        </h2>

        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-md border text-sm border-accent"
            type="text"
            placeholder="Enter a task..."
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
          />
          <button
            onClick={handleAdd}
            disabled={isPending}
            className="px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2 shadow bg-primary hover:scale-[1.02] transition-transform"
          >
            <PlusCircleIcon size={16} />
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
