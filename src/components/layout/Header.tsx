import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, UserRound } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
      <div>
        <h1 className="text-[18px] font-semibold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="h-9 px-3 rounded-lg bg-surface-alt border border-border w-[260px] flex items-center gap-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-colors">
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-full w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
          <Bell size={16} />
        </button>

        {/* Avatar and menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer"
            title="Menú de usuario"
          >
            A
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-white shadow-lg p-1.5">
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
