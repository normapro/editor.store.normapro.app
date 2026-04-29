import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { HistoriaCliente } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";

const HISTORIACLIENTE_FIELDS: CampoEsquema<HistoriaCliente>[] = [
  { name: "id_cliente", label: "Empresa", type: "select", options: [] },
  { name: "nombre", label: "Nombre empresa", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "descripcion", label: "Descripción", type: "text" },
  { name: "imagen", label: "Imagen", type: "text" },
];

export default function HistoriasClientesPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [HISTORIACLIENTE_FIELDS_OPTIONS, setFields] = useState(HISTORIACLIENTE_FIELDS);


  useEffect(() => {
    let isMounted = true;

    const cargarPacks = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.CLIENTES}?maxItems=50`);
        if (!res.ok) throw new Error("Error en red");
        const packs = await res.json();

        if (isMounted) {
          const opciones = packs.map((p: any) => ({
            label: p.description,
            value: p.id_cliente
          }));

          setFields(HISTORIACLIENTE_FIELDS.map(f => 
            f.name === "id_cliente" ? { ...f, options: opciones } : f
          ));
        }
      } catch (err) {
        console.error("Error cargando clientes:", err);
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

  const abrirEditorContenido = () => {
    if (idEdicion === null) {
      window.alert("Primero crea y guarda la historia. Luego podras editar su contenido.");
      return;
    }

    navigate(`/historias/${idEdicion}/contenido`);
  };

  const onDelete = async (id: number | string) => {
    const confirmar = window.confirm("Vas a eliminar esta historia. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.HISTORIAS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar la historia.");
    }
  };

  return (
    <>
      <Header 
        title="Historia con Clientes" 
        subtitle={modo === "listado" ? "Gestion de historias con clientes" : "Editor de historia con cliente"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<HistoriaCliente>
              endpoint={API_ENDPOINTS.HISTORIAS}
              titleField="nombre"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<HistoriaCliente>
              endpoint={API_ENDPOINTS.HISTORIAS}
              saveEndpoint={API_ENDPOINTS.HISTORIAS_EDITOR}
              fields={HISTORIACLIENTE_FIELDS_OPTIONS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="flex justify-start">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"
                    onClick={abrirEditorContenido}
                  >
                    Editar contenido
                  </button>
                </div>
              )}
            />
          )}
        </div>
      </main>
    </>
  );
}