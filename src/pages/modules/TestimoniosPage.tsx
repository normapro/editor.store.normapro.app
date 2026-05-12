import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import { Editor } from "../../components/shared/Editor";
import API_ENDPOINTS from "../../config/api";
import { getEditorToken } from "../../auth/session";
import type { CampoEsquema } from "../../types/editor";
import type { Testimonio } from "../../types";

const TESTIMONIO_FIELDS: CampoEsquema<Testimonio>[] = [
  { name: "id_cliente", label: "Cliente", type: "select", options: [] },
  { name: "description", label: "Testimonio", type: "textarea" },
  { name: "persona", label: "Persona", type: "text" },
  { name: "cargo", label: "Cargo de la persona", type: "text" },
];

export default function TestimoniosPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [TESTIMONIO_FIELDS_OPTIONS, setFields] = useState(TESTIMONIO_FIELDS);

  useEffect(() => {
    let isMounted = true;

    const cargarClientes = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.CLIENTES}?maxItems=50`);
        if (!res.ok) throw new Error("Error en red");
        const packs = await res.json();

        if (isMounted) {
          const opciones = packs.map((p: any) => ({
            label: p.description,
            value: p.id_cliente
          }));

          setFields(TESTIMONIO_FIELDS.map(f => 
            f.name === "id_cliente" ? { ...f, options: opciones } : f
          ));
        }
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    };

    cargarClientes();

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
    const confirmar = window.confirm("Vas a eliminar este testimonio. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.TESTIMONIOS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el testimonio.");
    }
  };

  return (
    <>
      <Header 
        title="Testimonios" 
        subtitle={modo === "listado" ? "Gestion de testimonios" : "Editor de testimonio"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Testimonio>
              endpoint={`${API_ENDPOINTS.TESTIMONIOS}?maxItems=50`}
              titleField="persona"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Testimonio>
              endpoint={API_ENDPOINTS.TESTIMONIOS}
              saveEndpoint={API_ENDPOINTS.TESTIMONIOS_EDITOR}
              fields={TESTIMONIO_FIELDS_OPTIONS}
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