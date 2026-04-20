import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white text-[#010D3D] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-[#00B2E3]/25 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-[26rem] w-[26rem] rounded-full bg-[#64D8CC]/30 blur-3xl" />
        <div className="absolute inset-x-0 top-[26%] h-px bg-gradient-to-r from-transparent via-[#00B2E3]/25 to-transparent" />
      </div>

      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl text-center bg-white/80 backdrop-blur-sm border border-[#010D3D]/10 rounded-3xl shadow-[0_30px_80px_rgba(1,13,61,0.12)] px-6 py-12 md:px-12 md:py-14">
          <img
            src="/logo.png"
            alt="NormaPro"
            className="h-16 md:h-20 mx-auto mb-9 select-none"
          />

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5">
            Bienvenido
          </h1>

          <p className="text-lg md:text-2xl font-semibold text-[#010D3D]/90 mb-10">
            Editor de la página NormaPro
          </p>

          <p className="text-sm md:text-base text-[#010D3D]/70 mb-9 max-w-2xl mx-auto leading-relaxed">
            Un saludo. Desde aquí podrás comenzar a gestionar contenidos y tablas.
          </p>

          <Link
            to="/inicio-sesion"
            className="inline-flex items-center justify-center h-12 px-10 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00B2E3] to-[#64D8CC] shadow-[0_10px_30px_rgba(0,178,227,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_34px_rgba(100,216,204,0.28)] transition-all"
          >
            Ir a inicio de sesión
          </Link>
        </div>
      </section>
    </main>
  );
}
