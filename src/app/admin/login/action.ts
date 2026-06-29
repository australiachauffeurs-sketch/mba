"use server";

import { cookies } from "next/headers";

export async function adminLogin(password: string): Promise<{ ok: boolean }> {
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@UniConnect2025";
  if (password !== adminPassword) return { ok: false };

  const cookieStore = await cookies();
  cookieStore.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
