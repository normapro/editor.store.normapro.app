import { NavLink } from "react-router-dom";
import {
  AppWindow,
  BookOpen,
  MessageSquareQuote,
  Lightbulb,
  Package,
  Briefcase,
  FileText,
  Newspaper,
  Calendar,
} from "lucide-react";

const navItems = [
  { label: "Aplicaciones", icon: AppWindow, to: "/aplicaciones" },
  { label: "Historias", icon: BookOpen, to: "/historias" },
  { label: "Testimonios", icon: MessageSquareQuote, to: "/testimonios" },
  { label: "Soluciones", icon: Lightbulb, to: "/soluciones" },
  { label: "Packs", icon: Package, to: "/packs" },
  { label: "Informes", icon: FileText, to: "/informes" },
  { label: "Eventos", icon: Calendar, to: "/eventos" },
  { label: "Consultorias", icon: Briefcase, to: "/consultorias" },
  { label: "Ambitos", icon: Package, to: "/ambitos" },
  { label: "Sectores", icon: Package, to: "/sectores" },
  { label: "SolucionesAmbitos", icon: Package, to: "/soluciones-ambitos" },
  { label: "SolucionesAmbitosSectores", icon: Package, to: "/soluciones-ambitos-sectores" },
  { label: "Clientes", icon: Briefcase, to: "/clientes" },
  { label: "Beneficios", icon: Lightbulb, to: "/beneficios" },
  { label: "Problemas", icon: Lightbulb, to: "/problemas"}
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
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors mb-0.5 ${
                isActive
                  ? "bg-accent text-white"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
