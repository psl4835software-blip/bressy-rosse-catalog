"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const result = await authClient.signIn.username({
        username: String(formData.get("username") ?? "").trim().toLowerCase(),
        password: String(formData.get("password") ?? ""),
      });
      if (result.error) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
      window.location.assign("/admin");
    } catch {
      setError("No se pudo validar el acceso. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <section className="admin-login-brand" aria-labelledby="login-brand-title">
        <Link className="brand-lockup" href="/" aria-label="Volver al catálogo">
          <span className="brand-mark" aria-hidden="true">BR</span>
          <span>
            <span className="brand-name">BR · Bressy Rosse</span>
            <span className="brand-subtitle">Catálogo de marcas</span>
          </span>
        </Link>
        <h1 id="login-brand-title">Las vitrinas, desde dentro.</h1>
        <p>Administra productos, fotografías y precios promocionales en un solo lugar.</p>
      </section>
      <section className="admin-login-panel" aria-labelledby="login-title">
        <div className="login-card">
          <Link href="/" className="login-back"><ArrowLeft size={14} aria-hidden="true" /> Volver al catálogo</Link>
          <h2 id="login-title">Ingresar</h2>
          <p>Acceso solo para personas autorizadas.</p>
          {error && <p className="feedback feedback--error" role="alert">{error}</p>}
          <form onSubmit={handleSubmit} className="form-grid form-grid--one">
            <div className="field">
              <label htmlFor="username">Usuario</label>
              <input id="username" name="username" autoComplete="username" required minLength={3} maxLength={160} />
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} />
            </div>
            <button className="button button-primary" type="submit" disabled={pending}>
              <KeyRound size={15} aria-hidden="true" /> {pending ? "Validando acceso…" : "Ingresar al panel"}
            </button>
          </form>
          <p className="field-hint" style={{ marginTop: "1rem" }}>Si no tienes acceso, solicita una cuenta a la persona administradora del catálogo.</p>
        </div>
      </section>
    </div>
  );
}
