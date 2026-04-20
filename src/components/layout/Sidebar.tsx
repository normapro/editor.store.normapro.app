import { NavLink } from "react-router-dom";
import {
  AppWindow,
  BookOpen,
  MessageSquareQuote,
  Lightbulb,
  Package,
  FileText,
  Newspaper,
  Calendar,
} from "lucide-react";

const navItems = [
  { label: "Aplicaciones", icon: AppWindow },
  { label: "Historias", icon: BookOpen },
  { label: "Testimonios", icon: MessageSquareQuote },
  { label: "Soluciones", icon: Lightbulb },
  { label: "Packs", icon: Package },
  { label: "Informes", icon: FileText },
  { label: "Eventos", icon: Calendar },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 bg-primary-dark flex flex-col border-r border-white/10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
          NP
        </div>
        <span className="text-white font-semibold text-[15px] whitespace-nowrap">
          Store Editor
        </span>
      </div>

      {/* Navigation */}
      <nav className="py-3 px-3 overflow-y-auto">
        <NavLink
          to="/actualidad"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors mb-0.5 ${
              isActive
                ? "bg-accent text-white"
                : "text-white/70 hover:text-white hover:bg-white/8"
            }`
          }
        >
          <Newspaper size={20} className="shrink-0" />
          <span className="whitespace-nowrap">Actualidad</span>
        </NavLink>

        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors cursor-pointer mb-0.5"
          >
            <item.icon size={20} className="shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
