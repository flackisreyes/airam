"use client";

/** Llamada JSON al API del panel. Lanza Error con el mensaje del servidor. */
export async function api<T>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401) {
    window.location.reload();
    throw new Error("Sesión caducada.");
  }
  if (!res.ok) throw new Error(data.error ?? "Algo salió mal.");
  return data;
}

/** Enlace de WhatsApp al número de la clienta (añade 52 si son 10 dígitos). */
export function clientWhatsapp(phone: string, text: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `52${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
