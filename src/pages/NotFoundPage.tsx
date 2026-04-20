import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="w-full max-w-xl text-center">
        <p className="text-sm tracking-[0.3em] text-white/60 mb-4">ERROR</p>
        <h1 className="text-7xl md:text-8xl font-bold leading-none mb-4">404</h1>
        <p className="text-white/75 text-base md:text-lg mb-8">
          La página que intentas abrir no existe en este editor.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white text-black font-semibold hover:bg-white/85 transition-colors"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
