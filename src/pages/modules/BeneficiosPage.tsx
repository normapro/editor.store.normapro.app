import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Beneficio } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { RemoteRelationMultiSelector } from "../../components/campos/RemoteRelationMultiSelector";
import { getEditorToken } from "../../auth/session";

const BENEFICIO_FIELDS: CampoEsquema<Beneficio>[] = [
  { name: "description", label: "Nombre", type: "textarea" },
];

export default function BeneficiosPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const idBeneficioActual = useMemo(() => {
    if (idEdicion === null) {
      return null;
    }

    const parsed = Number(idEdicion);
    return Number.isFinite(parsed) ? parsed : null;
  }, [idEdicion]);



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
              fields={BENEFICIO_FIELDS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="space-y-4">
                  <RemoteRelationMultiSelector
                    title="Packs relacionados"
                    description="Selecciona los packs que quieras asociar a este beneficio."
                    createModeMessage="Guarda el beneficio primero para poder relacionarlo con packs."
                    entityId={idBeneficioActual}
                    catalogEndpoint={`${API_ENDPOINTS.PACKS_EDITOR_READ}`}
                    relationEndpointBase={`${API_ENDPOINTS.BENEFICIOS_EDITOR}/packs`}
                    token={getEditorToken()}
                    optionIdField="id_pack"
                    optionLabelField="description"
                    relationIdsField="id_packs"
                    createBodyField="id_pack"
                    openLabel="Seleccionar packs"
                  />

                  <RemoteRelationMultiSelector
                    title="Soluciones-Ámbitos asociadas"
                    description="Selecciona las soluciones por ámbito que aplican a este beneficio."
                    createModeMessage="Guarda el beneficio primero para poder relacionarlo con soluciones-ámbitos."
                    entityId={idBeneficioActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos`}
                    relationEndpointBase={`${API_ENDPOINTS.BENEFICIOS_EDITOR}/soluciones-ambitos`}
                    token={getEditorToken()}
                    relationIdsField="ids"
                    createBodyField="relationId"
                    optionResolver={(item) => {
                      const idSolucion = Number(item.id_solucion);
                      const idAmbito = Number(item.id_ambito);
                      if (!Number.isFinite(idSolucion) || !Number.isFinite(idAmbito)) {
                        return null;
                      }

                      const compositeId = `${idSolucion}-${idAmbito}`;
                      const nombre = String(item.description ?? "").trim();

                      return {
                        id: compositeId,
                        label: nombre ? `${compositeId} - ${nombre}` : compositeId,
                      };
                    }}
                    openLabel="Seleccionar soluciones-ámbitos"
                  />

                  <RemoteRelationMultiSelector
                    title="Soluciones-Ámbitos-Sectores asociadas"
                    description="Selecciona las soluciones por ámbito y sector que aplican a este beneficio."
                    createModeMessage="Guarda el beneficio primero para poder relacionarlo con soluciones-ámbitos-sectores."
                    entityId={idBeneficioActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos-sectores`}
                    relationEndpointBase={`${API_ENDPOINTS.BENEFICIOS_EDITOR}/soluciones-ambitos-sectores`}
                    token={getEditorToken()}
                    relationIdsField="ids"
                    createBodyField="relationId"
                    optionResolver={(item) => {
                      const idSolucion = Number(item.id_solucion);
                      const idAmbito = Number(item.id_ambito);
                      const idSector = Number(item.id_sector);
                      if (!Number.isFinite(idSolucion) || !Number.isFinite(idAmbito) || !Number.isFinite(idSector)) {
                        return null;
                      }

                      const compositeId = `${idSolucion}-${idAmbito}-${idSector}`;
                      const nombre = String(item.description ?? "").trim();

                      return {
                        id: compositeId,
                        label: nombre ? `${compositeId} - ${nombre}` : compositeId,
                      };
                    }}
                    openLabel="Seleccionar soluciones-ámbitos-sectores"
                  />
                </div>
              )}
            />
          )}
        </div>
      </main>
    </>
  );
}