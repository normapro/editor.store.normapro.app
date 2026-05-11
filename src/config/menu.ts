import { 
  Users, BookOpen, MessageSquareQuote, Newspaper, Calendar, 
  FileText, AppWindow, Briefcase, Lightbulb, Package, 
  Layers, LayoutGrid, ShieldCheck, AlertCircle, Zap, 
  ListChecks, HelpCircle 
} from "lucide-react";

export const menu = [
  {
    category: "Clientes",
    items: [
      { label: "Clientes", icon: Users, to: "/clientes", color: "bg-violet-500" },
      { label: "Historias", icon: BookOpen, to: "/historias", color: "bg-lime-600" },
      { label: "Testimonios", icon: MessageSquareQuote, to: "/testimonios", color: "bg-pink-500" },
    ],
  },
  {
    category: "Publicaciones",
    items: [
      { label: "Actualidad", icon: Newspaper, to: "/actualidad", color: "bg-orange-500" },
      { label: "Eventos", icon: Calendar, to: "/eventos", color: "bg-teal-500" },
      { label: "Informes", icon: FileText, to: "/informes", color: "bg-sky-500" },
    ]
  },
  {
    category: "Productos",
    items: [
      { label: "Aplicaciones", icon: AppWindow, to: "/aplicaciones", color: "bg-cyan-500" },
      { label: "Consultorías", icon: Briefcase, to: "/consultorias", color: "bg-indigo-500" },
    ]
  },
  {
    category: "Catálogo técnico",
    items: [
      { label: "Soluciones", icon: Lightbulb, to: "/soluciones", color: "bg-amber-500" },
      { label: "Packs", icon: Package, to: "/packs", color: "bg-emerald-500" },
      { label: "Ámbitos", icon: Layers, to: "/ambitos", color: "bg-yellow-500" },
      { label: "Sectores", icon: LayoutGrid, to: "/sectores", color: "bg-lime-500" },
      { label: "Soluciones-Ámbitos", icon: ListChecks, to: "/soluciones-ambitos", color: "bg-violet-500" },
      { label: "Soluciones-Ámbitos-Sectores", icon: Layers, to: "/soluciones-ambitos-sectores", color: "bg-fuchsia-500" },
      { label: "Beneficios", icon: ShieldCheck, to: "/beneficios", color: "bg-emerald-500" },
      { label: "Problemas", icon: AlertCircle, to: "/problemas", color: "bg-rose-500" },
      { label: "Casos de uso", icon: Zap, to: "/casos-de-uso", color: "bg-blue-500" },
      { label: "Características", icon: ListChecks, to: "/caracteristicas", color: "bg-slate-500" },
      { label: "FAQ", icon: HelpCircle, to: "/faq", color: "bg-orange-400" },
    ],
  }
];