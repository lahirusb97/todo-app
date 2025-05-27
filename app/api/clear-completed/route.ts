// app/api/todos/clear-completed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const result = await prisma.todo.deleteMany({
      where: { completed: true },
    });
    return NextResponse.json(
      { success: true, deleted: result.count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to clear completed todos",
      },
      { status: 500 }
    );
  }
}
