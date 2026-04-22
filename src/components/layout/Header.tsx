import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, UserRound, Moon, Sun } from "lucide-react";
import { clearEditorToken } from "../../auth/session";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    clearEditorToken();
    navigate("/inicio-sesion");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <header className="h-20 bg-surface border-b border-border flex items-center justify-between pl-10 pr-8">


      <div className="flex flex-col gap-1  w-full ">

        {/* Titulo y subtitulo */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-[25px] font-bold">
            {title}
          </h1>

          {subtitle && (
            <p className="text-[13px] text-text-muted">
              {subtitle}
            </p>
          )}
        </div>

        {/* Migas de pan (abajo) */}
        <nav className="flex items-center gap-1 text-[12px] text-text-muted">
          <Link to="/dashboard" className="hover:text-text-secondary transition-colors">
            Inicio
          </Link>

          {pathSegments.map((segment, index) => {
            const to = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            const label = decodeURIComponent(segment)
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            return (
              <div key={to} className="flex items-center gap-1">
                <span>/</span>
                {isLast ? (
                  <span className="text-text-secondary">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-text-secondary transition-colors">
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

      </div>


      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div className="h-9 px-3 rounded-lg bg-surface-alt border border-border w-[260px] flex items-center gap-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-colors">
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-full w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>

        {/* Modo oscuro */}
        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          className={`h-9 rounded-full border border-border px-2.5 flex items-center gap-2 text-[12px] font-medium transition-colors cursor-pointer ${
            isDarkMode ? "bg-[#111827] text-[#E5E7EB]" : "bg-surface text-text-secondary"
          }`}
          aria-pressed={isDarkMode}
          title="Cambiar modo oscuro"
        >
          {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
          <span>{isDarkMode ? "Oscuro" : "Claro"}</span>
        </button>

        {/* Notificaciones */}
        <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
          <Bell size={16} />
        </button>

        {/* Avatar y menú */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer"
            title="Menú de usuario"
          >
            A
          </button>

          {/* Desplegable de perfil*/}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface shadow-lg p-1.5">
              <div className="px-3 py-2 text-[12px] text-text-muted border-b border-border mb-1">
                Sesión actual
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
                <UserRound size={15} />
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
