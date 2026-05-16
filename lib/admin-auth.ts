import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "birthday_admin";
const TOKEN_MESSAGE = "birthday-rsvp-admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function createToken(password: string) {
  return createHmac("sha256", password).update(TOKEN_MESSAGE).digest("hex");
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(candidate: string) {
  const password = getAdminPassword();

  if (!password) {
    return false;
  }

  return safeEqual(candidate, password);
}

export async function isAdminAuthenticated() {
  const password = getAdminPassword();

  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) {
    return false;
  }

  return safeEqual(token, createToken(password));
}

export async function setAdminCookie() {
  const password = getAdminPassword();

  if (!password) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
