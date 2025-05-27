"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  PlusCircle,
  Sparkles,
  Sun,
  ListTodo,
  Pencil,
} from "lucide-react";

export default function SerenityBlueShowcase() {
  const [tasks, setTasks] = useState([
    { text: "Build wireframes", completed: false },
    { text: "Brainstorm ideas", completed: true },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, { text: inputValue, completed: false }]);
      setInputValue("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 flex flex-col items-center gap-10 font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Section 1: Add Task */}

        {/* Section 2: Task List */}
        <div className="rounded-xl border border-focus p-6 w-full shadow-xl bg-background">
          <h2 className="text-2xl font-bold mb-3 tracking-tight text-primary">
            <ListTodo className="inline mr-2" />
            Let’s Get Things Done!
          </h2>

          <p className="text-sm mb-4 text-gray-600">
            Improves focus, reduces anxiety. Headers, dividers, and category
            cards.
          </p>

          <ul className="space-y-3 text-sm">
            {tasks.map((task, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg border font-medium transition-all ${
                  task.completed
                    ? "bg-gradient-to-r from-surface to-background line-through text-opacity-80"
                    : "bg-surface"
                }`}
                style={{
                  borderColor: "var(--color-accent)",
                  color: task.completed ? "#4B5563" : "var(--color-primary)",
                }}
              >
                {task.completed ? (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    🎉 Completed: {task.text}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Active Task: {task.text}
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-accent"></span>
            Quick Add is your productivity boost!
          </div>
        </div>
      </div>
    </div>
  );
}
