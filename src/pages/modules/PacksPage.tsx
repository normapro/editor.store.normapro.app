import { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Pack } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";
import { RemoteRelationMultiSelector } from "../../components/campos/RemoteRelationMultiSelector";

const PACK_FIELDS: CampoEsquema<Pack>[] = [
  { name: "description", label: "Nombre", type: "text" },
  { name: "shortDescription", label: "Descripción corta", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "uriIcon", label: "Icono", type: "text" },
  { name: "title", label: "Título", type: "text" },
  { name: "subtitle", label: "Subtítulo", type: "text" },
  { name: "titleweb", label: "Título web", type: "text" },
  { name: "descriptionForHighLight", label: "Descripción destacada", type: "textarea" },
  { name: "problemaTitle", label: "Título problema", type: "text" },
  { name: "problemaPragma", label: "Pragma problema", type: "textarea" },
  { name: "multimediaUri", label: "Multimedia URI", type: "text" },
  { name: "multimediaTypeId", label: "Tipo multimedia", type: "number" },
  { name: "solucionTitle", label: "Título solución", type: "text" },
  { name: "solucionPragma", label: "Pragma solución", type: "textarea" },
  { name: "caracteristicasTitle", label: "Título características", type: "text" },
  { name: "caracteristicasPragma", label: "Pragma características", type: "textarea" },
  { name: "casosdeusoTitle", label: "Título casos de uso", type: "text" },
  { name: "casosdeusoPragma", label: "Pragma casos de uso", type: "textarea" },
  { name: "beneficiosTitle", label: "Título beneficios", type: "text" },
  { name: "beneficiosPragma", label: "Pragma beneficios", type: "textarea" },
  { name: "firstCtaTitle", label: "Primer CTA título", type: "text" },
  { name: "firstCtaPragma", label: "Primer CTA pragma", type: "textarea" },
  { name: "secondCtaTitle", label: "Segundo CTA título", type: "text" },
  { name: "secondCtaPragma", label: "Segundo CTA pragma", type: "textarea" },
  { name: "consultoriaTitle", label: "Título consultoría", type: "text" },
  { name: "consultoriaDescription", label: "Descripción consultoría", type: "textarea" },
  { name: "fraseCierre", label: "Frase cierre", type: "textarea" },
  { name: "id_ambito", label: "ID ámbito", type: "select", options: [] },
];

export default function PacksPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [PACK_FIELDS_OPTIONS, setFields] = useState(PACK_FIELDS);

  const idPackActual = useMemo(() => {
    if (idEdicion === null) {
      return null;
    }

    const parsed = Number(idEdicion);
    return Number.isFinite(parsed) ? parsed : null;
  }, [idEdicion]);

  useEffect(() => {
    let isMounted = true;

    const cargarOpcionesEditor = async () => {
      try {
        const [resAmbitos] = await Promise.all([
          fetch(`${API_ENDPOINTS.AMBITOS}`)
        ]);

        if (!resAmbitos.ok) throw new Error("Error cargando opciones");

        const ambitosData = await resAmbitos.json();

        if (isMounted) {
          const opcionesAmbitos = ambitosData.map((a: any) => ({
            label: a.description,
            value: a.id_ambito
          }));

          setFields(PACK_FIELDS.map(f => {
            if (f.name === "id_ambito") {
              return { ...f, options: opcionesAmbitos };
            }
            return f;
          }));
        }
      } catch (err) {
        console.error("Error cargando datos del editor:", err);
      }
    };

    cargarOpcionesEditor();

    return () => {
      isMounted = false;
    };
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
    const confirmar = window.confirm("Vas a eliminar este pack. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.PACKS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el pack.");
    }
  };

  return (
    <>
      <Header
        title="Packs"
        subtitle={modo === "listado" ? "Gestion de packs" : "Editor de pack"}
      />
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Pack>
              endpoint={API_ENDPOINTS.PACKS_EDITOR_READ}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Pack>
              endpoint={API_ENDPOINTS.PACKS_EDITOR_READ}
              saveEndpoint={API_ENDPOINTS.PACKS_EDITOR}
              fields={PACK_FIELDS_OPTIONS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="space-y-4">
                  <RemoteRelationMultiSelector
                    title="Beneficios relacionados"
                    description="Asocia los beneficios que aplican a este pack."
                    createModeMessage="Guarda el pack primero para poder relacionarlo con beneficios."
                    entityId={idPackActual}
                    catalogEndpoint={API_ENDPOINTS.BENEFICIOS}
                    relationEndpointBase={`${API_ENDPOINTS.PACKS_EDITOR}/relaciones/beneficios`}
                    token={getEditorToken()}
                    optionIdField="id_beneficio"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar beneficios"
                  />

                  <RemoteRelationMultiSelector
                    title="Características relacionadas"
                    description="Asocia las características que aplican a este pack."
                    createModeMessage="Guarda el pack primero para poder relacionarlo con características."
                    entityId={idPackActual}
                    catalogEndpoint={API_ENDPOINTS.CARACTERISTICAS}
                    relationEndpointBase={`${API_ENDPOINTS.PACKS_EDITOR}/relaciones/caracteristicas`}
                    token={getEditorToken()}
                    optionIdField="id_caracteristica"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar características"
                  />

                  <RemoteRelationMultiSelector
                    title="Casos de uso relacionados"
                    description="Asocia los casos de uso que aplican a este pack."
                    createModeMessage="Guarda el pack primero para poder relacionarlo con casos de uso."
                    entityId={idPackActual}
                    catalogEndpoint={API_ENDPOINTS.CASOS_DE_USO}
                    relationEndpointBase={`${API_ENDPOINTS.PACKS_EDITOR}/relaciones/casos-de-uso`}
                    token={getEditorToken()}
                    optionIdField="id_casodeuso"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar casos de uso"
                  />

                  <RemoteRelationMultiSelector
                    title="FAQ relacionadas"
                    description="Asocia las FAQ que aplican a este pack."
                    createModeMessage="Guarda el pack primero para poder relacionarlo con FAQ."
                    entityId={idPackActual}
                    catalogEndpoint={API_ENDPOINTS.FAQ}
                    relationEndpointBase={`${API_ENDPOINTS.PACKS_EDITOR}/relaciones/faq`}
                    token={getEditorToken()}
                    optionIdField="id_faq"
                    optionLabelField="question"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar FAQ"
                  />

                  <RemoteRelationMultiSelector
                    title="Sectores relacionados"
                    description="Asocia los sectores que aplican a este pack."
                    createModeMessage="Guarda el pack primero para poder relacionarlo con sectores."
                    entityId={idPackActual}
                    catalogEndpoint={API_ENDPOINTS.SECTORES}
                    relationEndpointBase={`${API_ENDPOINTS.PACKS_EDITOR}/relaciones/sectores`}
                    token={getEditorToken()}
                    optionIdField="id_sector"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar sectores"
                  />

                  <RemoteRelationMultiSelector
                    title="Soluciones relacionadas"
                    description="Asocia las soluciones simples que aplican a este pack."
                    createModeMessage="Guarda el pack primero para poder relacionarlo con soluciones."
                    entityId={idPackActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones`}
                    relationEndpointBase={`${API_ENDPOINTS.PACKS_EDITOR}/relaciones/soluciones`}
                    token={getEditorToken()}
                    optionIdField="id_solucion"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar soluciones"
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
