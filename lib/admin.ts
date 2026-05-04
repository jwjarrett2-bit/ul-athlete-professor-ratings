import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  return {
    session,
    isAdmin: isAdminEmail(session?.user?.email)
  };
}
