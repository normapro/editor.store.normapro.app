import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/ListaRecurso";
import { Editor } from "../../components/Editor";
import { CONFIG_ACTUALIDAD } from "../../config/actualidadConfig";
import type { Actualidad } from "../../types/actualidad";

export default function ActualidadPage() {
  const [vista, setVista] = useState<"listado" | "formulario">("listado");
  const [idAEditar, setIdAEditar] = useState<number | string | null>(null);

  // Funciones de navegación
  // Nota: id ya viene del componente ListaRecurso (item.id_noticia)
  const irAEditar = (id: number | string) => {
    setIdAEditar(id);
    setVista("formulario");
  };

  const irACrear = () => {
    setIdAEditar(null);
    setVista("formulario");
  };

  const volverAlListado = () => {
    setVista("listado");
    setIdAEditar(null);
  };

  return (
    <>
      <Header 
        title="Actualidad" 
        subtitle={vista === "listado" ? "Gestión de noticias" : "Editor de noticia"} 
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          
          {vista === "listado" ? (
            /* Mostrar listado */
            /* Pasamos la interfaz Actualidad al componente genérico */
            <ListaRecurso<Actualidad> 
              config={CONFIG_ACTUALIDAD} 
              onEditar={irAEditar} 
              onCrear={irACrear} 
            />
          ) : (
            /* Mostrar formulario */
            <div>
              <button 
                onClick={volverAlListado}
                className="mb-6 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                ← Volver al listado de noticias
              </button>
              
              <Editor<Actualidad> 
                config={CONFIG_ACTUALIDAD} 
                idEdicion={idAEditar} 
                onCerrar={volverAlListado} 
              />
            </div>
          )}

        </div>
      </main>
    </>
  );
}