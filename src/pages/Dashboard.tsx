import {
  Newspaper,
  Calendar,
  BookOpen,
  FileText,
  MessageSquareQuote,
  AppWindow,
  Briefcase,
  Lightbulb,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";

const mainModules = [
  { label: "Actualidad", icon: Newspaper, color: "bg-orange-500", to: "/actualidad" },
  { label: "Eventos", icon: Calendar, color: "bg-teal-500", to: "/eventos" },
  { label: "Historias", icon: BookOpen, color: "bg-lime-600", to: "/historias" },
  { label: "Informes", icon: FileText, color: "bg-sky-500", to: "/informes" },
  { label: "Testimonios", icon: MessageSquareQuote, color: "bg-pink-500", to: "/testimonios" },
  { label: "Aplicaciones", icon: AppWindow, color: "bg-cyan-500", to: "/aplicaciones" },
  { label: "Consultorias", icon: Briefcase, color: "bg-indigo-500", to: "/consultorias" },
];

const secondaryModules = [
  { label: "Soluciones", icon: Lightbulb, color: "bg-amber-500", to: "/soluciones" },
  { label: "Packs", icon: Package, color: "bg-emerald-500", to: "/packs" },
  { label: "Ambitos", icon: Package, color: "bg-emerald-500", to: "/ambitos" },
];

export default function Dashboard() {
  return (
    <>
      <Header title="Inicio" subtitle="Panel principal de administración de NormaPro Store" />
      <div className="p-8 md:p-10">
        {/* Welcome card */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 mb-8 text-white shadow-[0_24px_60px_rgba(0,178,227,0.25)]">
          <h2 className="text-2xl font-bold mb-2">
            Bienvenido al Editor de Store
          </h2>
          <p className="text-white/70 text-[15px] max-w-xl">
            Gestiona las tablas de la base de datos de NormaPro Store. 
          </p>
          <p className="text-white/70 text-[15px] max-w-xl">
            Selecciona una entidad del  menu lateral o de abajo para modificarla.
          </p>
        </div>

        {/* Entity cards grid */}
        <h3 className="text-[15px] font-semibold text-text-primary mb-4">
          Módulos principales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mainModules.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="bg-surface rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-md transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
              >
                <item.icon size={20} />
              </div>
              <h4 className="text-[15px] font-semibold text-text-primary">
                {item.label}
              </h4>
              <p className="text-[13px] text-text-muted mt-1">
                Gestionar registros
              </p>
            </Link>
          ))}
        </div>

        <h3 className="text-[15px] font-semibold text-text-primary mt-10 mb-4">
          Catálogo técnico
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {secondaryModules.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="bg-surface rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-md transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
              >
                <item.icon size={20} />
              </div>
              <h4 className="text-[15px] font-semibold text-text-primary">
                {item.label}
              </h4>
              <p className="text-[13px] text-text-muted mt-1">
                Gestionar Registro
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
