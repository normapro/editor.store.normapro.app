import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { menu } from "../../config/menu";

export default function Sidebar() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 bg-primary-dark flex flex-col border-r border-white/10 text-white">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-sm">NP</div>
        <span className="font-semibold text-[15px]">Store Editor</span>
      </div>

      <nav className="py-4 px-4 overflow-y-auto space-y-1">
        <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-white/20 uppercase tracking-[2px]">Navegación</div>

        {menu.map((group) => {
          const isOpen = !!openCategories[group.category];
          return (
            <div key={group.category} className="flex flex-col">
              <button
                onClick={() => toggleCategory(group.category)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>{group.category}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-1 ml-2 border-l border-white/10">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-md text-[13px] transition-all ${
                          isActive ? "text-accent font-medium bg-accent/5" : "text-white/50 hover:text-white hover:translate-x-1"
                        }`
                      }
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}