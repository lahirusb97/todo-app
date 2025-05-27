// scripts/testPrismaConnection.ts
import { PrismaClient } from "../generated/prisma"; // adjust if you use another path

const prisma = new PrismaClient();

async function main() {
  try {
    // Try a basic operation (list all users)
    const users = await prisma.user.findMany();
    console.log("Connected successfully! Users:", users);
  } catch (error) {
    console.error("Prisma or MongoDB connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
