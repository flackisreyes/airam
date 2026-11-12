"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function LoginForm({
  devLogin,
  passwordEnabled,
  demo = false,
}: {
  devLogin: boolean;
  passwordEnabled: boolean;
  demo?: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(false);
  };

  const login = async (dev: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(dev ? "/api/admin/session?dev" : "/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dev ? {} : { password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo iniciar sesión.");
        return;
      }
      router.refresh();
    } catch {
      setError("Sin conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-nude-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-nude-100">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-champagne-100 text-champagne-600">
          <LockKeyhole className="size-5" />
        </span>
        <h1 className="mt-4 text-center font-display text-3xl text-ink-900">Estética Airam</h1>
        <p className="mt-1 text-center text-sm text-ink-500">Panel de administración</p>

        {passwordEnabled && (
          <>
            <label className="mt-8 block">
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-600">
                Contraseña
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !password}
              className="btn btn-primary mt-6 w-full disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Entrar
            </button>
          </>
        )}
        {devLogin && (
          <>
            <button
              type="button"
              onClick={() => login(true)}
              disabled={loading}
              className="btn btn-outline mt-3 w-full disabled:opacity-60"
            >
              {demo ? "Entrar a la demostración" : "Entrar sin contraseña"}
            </button>
            <p className="mt-2 text-center text-[0.7rem] text-ink-500">
              {demo
                ? "Modo demostración: los datos son de ejemplo y se reinician solos."
                : "Solo disponible en tu ordenador. En la web publicada no aparece."}
            </p>
          </>
        )}
        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-blush-600">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
