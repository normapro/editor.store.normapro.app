import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import { Editor } from "../../components/shared/Editor";
import API_ENDPOINTS from "../../config/api";
import { getEditorToken } from "../../auth/session";
import type { Cliente } from "../../types/cliente";
import type { CampoEsquema } from "../../types/editor";

const CLIENTE_FIELDS: CampoEsquema<Cliente>[] = [
  { name: "description", label: "Nombre", type: "text" },
  { name: "url", label: "URL", type: "text" },
  { name: "logo", label: "Logo", type: "text" },
  { name: "permisoweb", label: "Permiso web", type: "number"},
  { name: "logoType", label: "Tipo de logo", type: "select", options: ["square", "wide", "ultrawide"] }
];

export default function ClientesPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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
    const confirmar = window.confirm("Vas a eliminar este cliente. Esta accion no se puede deshacer y afectara a los recursos relacionados. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.CLIENTES_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el cliente.");
    }
  };

  return (
    <>
      <Header 
        title="Clientes" 
        subtitle={modo === "listado" ? "Gestion de clientes" : "Editor de cliente"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Cliente>
              endpoint={`${API_ENDPOINTS.CLIENTES}?maxItems=50`}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Cliente>
              endpoint={API_ENDPOINTS.CLIENTES}
              saveEndpoint={API_ENDPOINTS.CLIENTES_EDITOR}
              fields={CLIENTE_FIELDS}
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