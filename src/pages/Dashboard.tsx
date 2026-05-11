import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { menu } from "../config/menu";

export default function Dashboard() {
  return (
    <>
      <Header title="Inicio" subtitle="Panel principal de administración de NormaPro Store" />
      <div className="p-8 md:p-10">
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 mb-8 text-white shadow-[0_24px_60px_rgba(0,178,227,0.25)]">
          <h2 className="text-2xl font-bold mb-2">Bienvenido al Editor de NormaPro Store</h2>
          <p className="text-white/70 text-[15px]">Gestiona las tablas de la base de datos de NormaPro Store.</p>
        </div>

        {menu.map((group) => (
          <div key={group.category} className="mb-10">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">
              {group.category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="bg-surface rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-[15px] font-semibold text-text-primary">{item.label}</h4>
                  <p className="text-[13px] text-text-muted mt-1">Gestionar registros</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}