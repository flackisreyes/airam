import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Autenticación sencilla del panel: una sola contraseña (variable ADMIN_PASSWORD).
 * La sesión es una cookie httpOnly firmada con HMAC que caduca a los 7 días.
 */
export const SESSION_COOKIE = "airam_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Entrada sin contraseña: SOLO en desarrollo local (npm run dev).
 * En producción (Vercel) siempre es false, así nadie puede entrar sin contraseña.
 */
export const devLoginEnabled = process.env.NODE_ENV !== "production";

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || (devLoginEnabled ? "solo-desarrollo-local" : "")
  );
}

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(sign(input), sign(expected));
}

export async function createSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `admin.${exp}`;
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  if (!isAdminConfigured() && !devLoginEnabled) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const i = value.lastIndexOf(".");
  const payload = value.slice(0, i);
  const sig = value.slice(i + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now() / 1000;
}

/** Respuesta 401 si no hay sesión; null si todo bien. */
export async function requireAdmin() {
  if (await isAuthenticated()) return null;
  return Response.json({ error: "No autorizado" }, { status: 401 });
}
