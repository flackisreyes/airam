import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { LoginForm } from "@/components/admin/LoginForm";
import { devLoginEnabled, isAdminConfigured, isAuthenticated } from "@/lib/booking/auth";
import { isDemoMode, isPersistentStore } from "@/lib/booking/store";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminConfigured() && !devLoginEnabled) {
    return (
      <main className="grid min-h-dvh place-items-center bg-nude-50 p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-nude-100">
          <h1 className="font-display text-3xl text-ink-900">Panel sin configurar</h1>
          <p className="mt-3 text-sm text-ink-600">
            Añade la variable de entorno <code className="rounded bg-nude-100 px-1.5 py-0.5">ADMIN_PASSWORD</code> con la
            contraseña del panel (en local, en el archivo <code>.env.local</code>; en Vercel, en Settings → Environment
            Variables) y vuelve a cargar la página.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isAuthenticated()))
    return <LoginForm devLogin={devLoginEnabled} passwordEnabled={isAdminConfigured()} demo={isDemoMode} />;

  return <AdminPanel storageWarning={isDemoMode} localStorage={!isPersistentStore && !isDemoMode} />;
}
