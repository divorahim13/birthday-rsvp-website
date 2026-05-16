"use server";

import { redirect } from "next/navigation";

import {
  clearAdminCookie,
  isAdminPasswordConfigured,
  setAdminCookie,
  verifyAdminPassword
} from "@/lib/admin-auth";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password");

  if (!isAdminPasswordConfigured()) {
    redirect("/admin?error=missing-admin-password");
  }

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    redirect("/admin?error=invalid-password");
  }

  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin");
}
