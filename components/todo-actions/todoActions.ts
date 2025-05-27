"use server";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

//  Add new todo
export async function addTodo(title: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const todo = await prisma.todo.create({ data: { title, userId } });
  revalidatePath("/"); // Re-fetches homepage
  return todo;
}

//  Toggle completion
export async function toggleTodo(id: string, completed: boolean) {
  const updated = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  revalidatePath("/");
  return updated;
}

//  Delete todo
export async function deleteTodo(id: string) {
  const deleted = await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
  return deleted;
}

//  Edit todo title
export async function editTodo(id: string, title: string) {
  const updated = await prisma.todo.update({
    where: { id },
    data: { title },
  });
  revalidatePath("/");
  return updated;
}
