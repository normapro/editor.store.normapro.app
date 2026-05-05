import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Beneficio } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";

const BENEFICIO_FIELDS: CampoEsquema<Beneficio>[] = [
  { name: "description", label: "Nombre", type: "textarea" },
  { name: "solucionesAmbitosIds", label: "Soluciones-Ámbitos asociados", type: "multiselect", options: [] },
  { name: "solucionesAmbitosSectoresIds", label: "Soluciones-Ámbitos-Sectores asociados", type: "multiselect", options: [] },
];

export default function BeneficiosPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [BENEFICIO_FIELDS_OPTIONS, setFields] = useState(BENEFICIO_FIELDS);

  useEffect(() => {
    let isMounted = true;

    const cargarOpcionesRelaciones = async () => {
      try {
        const [resSolucionesAmbitos, resSolucionesAmbitosSectores] = await Promise.all([
          fetch(`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos`),
          fetch(`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos-sectores`),
        ]);

        if (!resSolucionesAmbitos.ok || !resSolucionesAmbitosSectores.ok) throw new Error("Error cargando opciones");

        const solucionesAmbitosData = await resSolucionesAmbitos.json();
        const solucionesAmbitosSectoresData = await resSolucionesAmbitosSectores.json();

        if (isMounted) {
          const opcionesSolucionesAmbitos = solucionesAmbitosData.map((item: any) => ({
            value: `${item.id_solucion}-${item.id_ambito}`,
            label: item.description,
          }));
          const opcionesSolucionesAmbitosSectores = solucionesAmbitosSectoresData.map((item: any) => ({
            value: `${item.id_solucion}-${item.id_ambito}-${item.id_sector}`,
            label: item.description,
          }));

          setFields(BENEFICIO_FIELDS.map(f => {
            if (f.name === "solucionesAmbitosIds") return { ...f, options: opcionesSolucionesAmbitos };
            if (f.name === "solucionesAmbitosSectoresIds") return { ...f, options: opcionesSolucionesAmbitosSectores };
            return f;
          }));
        }
      } catch (err) {
        console.error("Error cargando datos del editor:", err);
      }
    };

    cargarOpcionesRelaciones();

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
    const confirmar = window.confirm("Vas a eliminar este beneficio. Esta accion no se puede deshacer y afectará a los recursos asociados. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.BENEFICIOS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el ambito.");
    }
  };

  return (
    <>
      <Header 
        title="Beneficios" 
        subtitle={modo === "listado" ? "Gestion de beneficios" : "Editor de beneficio"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Beneficio>
              endpoint={API_ENDPOINTS.BENEFICIOS}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Beneficio>
              endpoint={API_ENDPOINTS.BENEFICIOS}
              saveEndpoint={API_ENDPOINTS.BENEFICIOS_EDITOR}
              fields={BENEFICIO_FIELDS_OPTIONS}
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