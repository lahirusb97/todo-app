"use client";
import React, { useRef, useState, useCallback } from "react";
import { Reorder } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Trash2,
  Pencil,
  Save,
  X,
  LoaderIcon,
  GripVertical,
} from "lucide-react";
import { deleteTodo, editTodo, toggleTodo } from "./todo-actions/todoActions";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/getErrorMsg";

export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  value: any; // required for Reorder.Item
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, value }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [loadingType, setLoadingType] = useState<
    "edit" | "toggle" | "delete" | null
  >(null);
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const isBusy = !!loadingType && isPending;

  const handleToggle = useCallback(() => {
    if (isBusy) return;
    setLoadingType("toggle");
    setIsPending(true);
    toggleTodo(id, !completed)
      .catch((err) =>
        toast.error(getErrorMessage(err, "Failed to update todo."))
      )
      .finally(() => {
        setLoadingType(null);
        setIsPending(false);
      });
  }, [id, completed, isBusy]);

  const handleDelete = useCallback(() => {
    if (isBusy) return;
    setLoadingType("delete");
    setIsPending(true);
    deleteTodo(id)
      .catch((err) =>
        toast.error(getErrorMessage(err, "Failed to delete todo."))
      )
      .finally(() => {
        setLoadingType(null);
        setIsPending(false);
      });
  }, [id, isBusy]);

  const handleEditSave = useCallback(() => {
    const trimmed = editText.trim();
    if (!trimmed) {
      toast.error("Todo cannot be empty.");
      return;
    }
    if (trimmed === text) {
      setIsEditing(false);
      return;
    }
    setLoadingType("edit");
    setIsPending(true);
    editTodo(id, trimmed)
      .then(() => setIsEditing(false))
      .catch((err) => toast.error(getErrorMessage(err, "Failed to edit todo.")))
      .finally(() => {
        setLoadingType(null);
        setIsPending(false);
      });
  }, [id, editText, text]);

  const handleCancelEdit = useCallback(() => {
    setEditText(text);
    setIsEditing(false);
  }, [text]);

  return (
    <Reorder.Item
      value={value}
      id={id}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg border font-medium transition-all justify-between bg-white
        ${completed ? "line-through text-gray-400" : "text-gray-800"}
        ${isBusy ? "opacity-70 pointer-events-none" : ""}
      `}
      style={{ borderColor: "#e5e7eb" }}
      whileDrag={{ scale: 1.04, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.32, ease: [0.24, 1, 0.32, 1] }}
    >
      {/* Drag Handle */}
      <span className="cursor-grab select-none text-gray-400">
        <GripVertical size={18} />
      </span>

      {/* Left side: toggle + text */}
      <div className="flex items-center gap-2 flex-1">
        <button
          aria-label={completed ? "Mark as active" : "Mark as completed"}
          onClick={handleToggle}
          disabled={isBusy}
          className="relative"
          tabIndex={0}
        >
          {completed ? (
            <CheckCircle size={18} className="text-green-500" />
          ) : (
            <Circle size={18} className="text-gray-400" />
          )}
          {loadingType === "toggle" && isPending && (
            <span className="absolute inset-0 flex items-center justify-center">
              <LoaderIcon size={16} className="animate-spin text-primary" />
            </span>
          )}
        </button>
        {isEditing ? (
          <input
            ref={inputRef}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm flex-1"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") handleCancelEdit();
            }}
            disabled={isBusy}
            aria-label="Edit todo"
            maxLength={120}
          />
        ) : (
          <span className="break-all">{text}</span>
        )}
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleEditSave}
              disabled={isBusy}
              aria-label="Save"
            >
              {loadingType === "edit" && isPending ? (
                <LoaderIcon size={16} className="animate-spin text-green-600" />
              ) : (
                <Save size={16} className="text-green-600" />
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isBusy}
              aria-label="Cancel edit"
            >
              <X size={16} className="text-red-400" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditText(text);
              }}
              disabled={isBusy}
              aria-label="Edit"
            >
              <Pencil size={16} className="text-blue-500" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isBusy}
              aria-label="Delete"
            >
              {loadingType === "delete" && isPending ? (
                <LoaderIcon size={16} className="animate-spin text-red-500" />
              ) : (
                <Trash2 size={16} className="text-red-500" />
              )}
            </button>
          </>
        )}
      </div>
    </Reorder.Item>
  );
};

export default TodoItem;
