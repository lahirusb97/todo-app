import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken"; // Adjust path as needed

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyJwt(token);
    return payload?.userId || null;
  } catch {
    return null;
  }
}
