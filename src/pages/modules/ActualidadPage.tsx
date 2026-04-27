import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import { Editor } from "../../components/shared/Editor";
import API_ENDPOINTS from "../../config/api";
import { getEditorToken } from "../../auth/session";
import type { Actualidad } from "../../types/actualidad";
import type { CampoEsquema } from "../../types/editor";

const ACTUALIDAD_FIELDS: CampoEsquema<Actualidad>[] = [
  { name: "title", label: "Titulo", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "fecha", label: "Fecha", type: "date" },
  { name: "categoria", label: "Categoria", type: "multiselect", options: ["Destacadas", "Tecnología", "Salud", 'Mediambiente', 'Digitalizacion', 'Formación', 'Industria', 'Seguridad alimentaria'] },
  { name: "id_pack", label: "Pack", type: "select" },
  { name: "id_soluciones", label: "Id soluciones", type: "text" },
  { name: "imagen", label: "Imagen", type: "text" },
  { name: "content", label: "Contenido", type: "paragraphs" },
];

export default function ActualidadPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [ACTUALIDAD_FIELDS_OPTIONS, setFields] = useState(ACTUALIDAD_FIELDS);

  useEffect(() => {
    let isMounted = true;

    const cargarPacks = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.LISTPACKS}?maxItems=50`);
        if (!res.ok) throw new Error("Error en red");
        const packs = await res.json();

        if (isMounted) {
          const opciones = packs.map((p: any) => ({
            label: p.description,
            value: p.id_pack
          }));

          setFields(ACTUALIDAD_FIELDS.map(f => 
            f.name === "id_pack" ? { ...f, options: opciones } : f
          ));
        }
      } catch (err) {
        console.error("Error cargando packs:", err);
      }
    };

    cargarPacks();

    return () => { isMounted = false; };
  }, []);

  const abrirCrear = () => {
    setIdEdicion(null);
    setModo("editor");
  };

  const abrirEditar = (id: number | string) => {
    setIdEdicion(id);
    setModo("editor");
  };

  const cerrarEditor = () => {
    setModo("listado");
  };

  const onGuardado = () => {
    setReloadKey((prev) => prev + 1);
  };

  const onDelete = async (id: number | string) => {
    const confirmar = window.confirm("Vas a eliminar esta noticia. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.ACTUALIDAD_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar la noticia.");
    }
  };

  return (
    <>
      <Header 
        title="Actualidad" 
        subtitle={modo === "listado" ? "Gestion de noticias" : "Editor de noticia"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Actualidad>
              endpoint={API_ENDPOINTS.ACTUALIDAD}
              titleField="title"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Actualidad>
              endpoint={API_ENDPOINTS.ACTUALIDAD}
              saveEndpoint={API_ENDPOINTS.ACTUALIDAD_EDITOR}
              fields={ACTUALIDAD_FIELDS_OPTIONS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
            />
          )}
        </div>
      </main>
    </>
  );
}