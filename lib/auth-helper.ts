import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function getUserId() {
  const session = await getAuthSession();
  return {userId: session?.user?.id};
}