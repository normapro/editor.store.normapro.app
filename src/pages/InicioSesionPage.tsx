import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/api";
import { setEditorToken } from "../auth/session";

export default function InicioSesionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fromPath = (location.state as { from?: string } | null)?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.EDITOR_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("login_failed");
      }

      const data = await response.json();
      if (!data?.token) {
        throw new Error("token_missing");
      }

      setEditorToken(String(data.token));
      navigate(fromPath, { replace: true });
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#00B2E3] via-[#31c8d9] to-[#64D8CC] text-[#010D3D] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#00B2E3]/25 blur-3xl" />
      </div>

      <section className="relative z-10 min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/96 backdrop-blur-sm border border-[#010D3D]/10 rounded-3xl shadow-[0_30px_80px_rgba(1,13,61,0.22)] p-8 md:p-10">
            <img src="/logo.png" alt="NormaPro" className="h-14 mx-auto mb-7" />

            <h1 className="text-3xl font-extrabold text-center mb-2">Inicio de sesión</h1>
            <p className="text-center text-[#010D3D]/70 mb-7">
              Accede al editor de NormaPro
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {hasError && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  No se pudo iniciar sesion.
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-[#010D3D]/20 px-3.5 text-sm outline-none focus:border-[#00B2E3] focus:ring-2 focus:ring-[#00B2E3]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-[#010D3D]/20 px-3.5 text-sm outline-none focus:border-[#64D8CC] focus:ring-2 focus:ring-[#64D8CC]/25"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00B2E3] to-[#64D8CC] shadow-[0_10px_24px_rgba(0,178,227,0.28)] hover:brightness-105 transition-all"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm">
              <Link to="/" className="text-[#010D3D]/80 hover:text-[#010D3D] underline underline-offset-4">
                Volver a bienvenida
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
