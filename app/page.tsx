import TodoContainer from "@/components/TodoContainer";
import TodoForm from "@/components/TodoForm";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}) {
  // Get user id from cookie/JWT
  const userId = await getCurrentUserId();
  console.log(userId);

  if (!userId) {
    return redirect("/login");
  }

  // Parse params (with default values)
  const page = parseInt((searchParams.page as string) || "1", 10);
  const page_size = parseInt((searchParams.page_size as string) || "10", 10);
  const filter = (searchParams.filter as string) || "all";

  // Build Prisma filter (user-specific)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId }; // Always filter by userId
  console.log("Where filter:", where);
  if (filter === "active") where.completed = false;
  if (filter === "completed") where.completed = true;

  // Get paginated data from database
  const total = await prisma.todo.count({ where });
  const todos = await prisma.todo.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * page_size,
    take: page_size,
  });

  return (
    <div className="min-h-screen px-4 py-8 bg-background text-foreground">
      <TodoForm />
      <div className="flex flex-col gap-2 mx-16">
        <TodoContainer
          todos={todos}
          total={total}
          page={page}
          page_size={page_size}
          filter={filter}
        />
      </div>
    </div>
  );
}
