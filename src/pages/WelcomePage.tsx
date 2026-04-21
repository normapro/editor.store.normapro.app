import { Link } from "react-router-dom";

export default function WelcomePage() {
  const iceBubbles = [
    { src: "/ice1.png", left: "6%", size: "30rem", duration: "22s", delay: "-3s"  },
    { src: "/ice2.png", left: "16%", size: "25rem", duration: "18s", delay: "-9s" },
    { src: "/ice3.png", left: "28%", size: "20rem", duration: "24s", delay: "-13s" },
    { src: "/ice1.png", left: "41%", size: "15rem", duration: "20s", delay: "-6s" },
    { src: "/ice2.png", left: "54%", size: "22rem", duration: "27s", delay: "-16s" },
    { src: "/ice3.png", left: "66%", size: "18rem", duration: "19s", delay: "-11s"  }

  ];

  return (
    <main className="min-h-screen bg-white text-[#010D3D] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {iceBubbles.map((item, index) => (
          <img
            key={`${item.src}-${index}`}
            src={item.src}
            alt=""
            aria-hidden="true"
            className="ice-bubble object-contain"
            style={{
              left: item.left,
              width: item.size,
              height: item.size,
              animationDuration: item.duration,
              animationDelay: item.delay
            }}
          />
        ))}
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
