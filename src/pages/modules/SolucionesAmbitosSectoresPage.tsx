import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Solucion } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";
import { RemoteRelationMultiSelector } from "../../components/campos/RemoteRelationMultiSelector";

const SOLUCIONAMBITOSECTOR_FIELDS: CampoEsquema<Solucion>[] = [
  { name: "id_solucion", label: "Solución", type: "select", options: [] },
  { name: "id_ambito", label: "Ambito", type: "select", options: [] },
  { name: "id_sector", label: "Sector", type: "select", options: [] },
  { name: "description", label: "Nombre", type: "text" },
  { name: "title", label: "Título", type: "text" },
  { name: "subtitle", label: "Subtítulo", type: "text" },
  { name: "icon", label: "Ícono", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "titleweb", label: "Título web", type: "text" },
  { name: "multimediaUri", label: "Multimedia URI", type: "text" },
  { name: "multimediaTypeId", label: "Tipo de Multimedia", type: "number" },
  { name: "problemaTitle", label: "Título del problema", type: "text" },
  { name: "problemaPragma", label: "Pragma del problema", type: "textarea" },
  { name: "solucionTitle", label: "Título de la solución", type: "text" },
  { name: "solucionPragma", label: "Pragma de la solución", type: "textarea" },
  { name: "caracteristicasTitle", label: "Título de características", type: "text" },
  { name: "caracteristicasPragma", label: "Pragma de características", type: "textarea" },
  { name: "casosdeusoTitle", label: "Título de casos de uso", type: "text" },
  { name: "casosdeusoPragma", label: "Pragma de casos de uso", type: "textarea" },
  { name: "beneficiosTitle", label: "Título de beneficios", type: "text" },
  { name: "beneficiosPragma", label: "Pragma de beneficios", type: "textarea" },
  { name: "firstCtaTitle", label: "Título del primer CTA", type: "text" },
  { name: "firstCtaPragma", label: "Pragma del primer CTA", type: "textarea" },
  { name: "secondCtaTitle", label: "Título del segundo CTA", type: "text" },
  { name: "secondCtaPragma", label: "Pragma del segundo CTA", type: "textarea" },
  { name: "fraseCierre", label: "Frase de cierre", type: "text" },
  { name: "thread_id", label: "Thread ID", type: "text" },
];

export default function SolucionesPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [SOLUCIONAMBITOSECTOR_FIELDS_OPTIONS, setFields] = useState(SOLUCIONAMBITOSECTOR_FIELDS);
  const idSolucionAmbitoSectorActual = idEdicion;

  useEffect(() => {
    let isMounted = true;

    const cargarOpcionesEditor = async () => {
      try {
        const [resSoluciones, resAmbitos, resSectores] = await Promise.all([
          fetch(`${API_ENDPOINTS.LISTSOLUCIONES}?ambito=all&sector=all`),
          fetch(`${API_ENDPOINTS.AMBITOS}`),
          fetch(`${API_ENDPOINTS.SECTORES}`)
        ]);

        if (!resSoluciones.ok || !resAmbitos.ok || !resSectores.ok) throw new Error("Error cargando opciones");

        const solucionesData = await resSoluciones.json();
        const ambitosData = await resAmbitos.json();
        const sectoresData = await resSectores.json();

        if (isMounted) {
          const opcionesSoluciones = solucionesData.map((s: any) => ({
            label: s.title || s.description,
            value: s.id_solucion
          }));

          const opcionesAmbitos = ambitosData.map((a: any) => ({
            label: a.description,
            value: a.id_ambito
          }));

          const opcionesSectores = sectoresData.map((s: any) => ({
            label: s.description,
            value: s.id_sector
          }));

          setFields(SOLUCIONAMBITOSECTOR_FIELDS.map(f => {
            if (f.name === "id_solucion") {
              return { ...f, options: opcionesSoluciones };
            }
            if (f.name === "id_ambito") {
              return { ...f, options: opcionesAmbitos };
            }
            if (f.name === "id_sector") {
              return { ...f, options: opcionesSectores };
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

  const abrirEditar = (_: any, item?: Solucion) => {
    if (item) {
      setIdEdicion(`${item.id_solucion}-${item.id_ambito}-${item.id_sector}`);
      setModo("editor");
    }
  };

  const cerrarEditor = () => {
    setModo("listado");
  };

  const onGuardado = () => {
    setReloadKey((prev) => prev + 1);
  };

  const onDelete = async (_: any, item?: Solucion) => {
    if (!item) return;

    const compositeId = `${item.id_solucion}-${item.id_ambito}-${item.id_sector}`;
    const confirmar = window.confirm("Vas a eliminar esta solución. Esta accion no se puede deshacer y afectará a los recursos asociados. ¿Continuar?");
    if (!confirmar) return;

    const token = getEditorToken();
    try {
      const res = await fetch(`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/${compositeId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error();
      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar.");
    }
  };

  return (
    <>
      <Header
        title="Soluciones-Ambitos-Sectores"
        subtitle={modo === "listado" ? "Gestion de soluciones-ambitos-sectores" : "Editor de solución-ambito-sector"}
      />

      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Solucion>
              endpoint={API_ENDPOINTS.SOLUCIONES_EDITOR_READ + "/soluciones-ambitos-sectores"}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Solucion>
              endpoint={API_ENDPOINTS.SOLUCIONES_EDITOR_READ + "/soluciones-ambitos-sectores"}
              saveEndpoint={API_ENDPOINTS.SOLUCIONES_EDITOR + "/soluciones-ambitos-sectores"}
              fields={SOLUCIONAMBITOSECTOR_FIELDS_OPTIONS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="space-y-4">
                  <RemoteRelationMultiSelector
                    title="Beneficios relacionados"
                    description="Selecciona los beneficios asociados a esta solución por ámbito y sector."
                    createModeMessage="Guarda la solución-ámbito-sector primero para poder relacionarla con beneficios."
                    entityId={idSolucionAmbitoSectorActual}
                    catalogEndpoint={API_ENDPOINTS.BENEFICIOS}
                    relationEndpointBase={`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/relaciones/beneficios`}
                    token={getEditorToken()}
                    optionIdField="id_beneficio"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar beneficios"
                  />

                  <RemoteRelationMultiSelector
                    title="Características relacionadas"
                    description="Selecciona las características asociadas a esta solución por ámbito y sector."
                    createModeMessage="Guarda la solución-ámbito-sector primero para poder relacionarla con características."
                    entityId={idSolucionAmbitoSectorActual}
                    catalogEndpoint={API_ENDPOINTS.CARACTERISTICAS}
                    relationEndpointBase={`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/relaciones/caracteristicas`}
                    token={getEditorToken()}
                    optionIdField="id_caracteristica"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar características"
                  />

                  <RemoteRelationMultiSelector
                    title="Casos de uso relacionados"
                    description="Selecciona los casos de uso asociados a esta solución por ámbito y sector."
                    createModeMessage="Guarda la solución-ámbito-sector primero para poder relacionarla con casos de uso."
                    entityId={idSolucionAmbitoSectorActual}
                    catalogEndpoint={API_ENDPOINTS.CASOS_DE_USO}
                    relationEndpointBase={`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/relaciones/casos-de-uso`}
                    token={getEditorToken()}
                    optionIdField="id_casodeuso"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar casos de uso"
                  />

                  <RemoteRelationMultiSelector
                    title="Clientes relacionados"
                    description="Selecciona los clientes asociados a esta solución por ámbito y sector."
                    createModeMessage="Guarda la solución-ámbito-sector primero para poder relacionarla con clientes."
                    entityId={idSolucionAmbitoSectorActual}
                    catalogEndpoint={API_ENDPOINTS.CLIENTES}
                    relationEndpointBase={`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/relaciones/clientes`}
                    token={getEditorToken()}
                    optionIdField="id_cliente"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar clientes"
                  />

                  <RemoteRelationMultiSelector
                    title="FAQ relacionadas"
                    description="Selecciona las FAQ asociadas a esta solución por ámbito y sector."
                    createModeMessage="Guarda la solución-ámbito-sector primero para poder relacionarla con FAQ."
                    entityId={idSolucionAmbitoSectorActual}
                    catalogEndpoint={API_ENDPOINTS.FAQ}
                    relationEndpointBase={`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/relaciones/faq`}
                    token={getEditorToken()}
                    optionIdField="id_faq"
                    optionLabelField="question"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar FAQ"
                  />

                  <RemoteRelationMultiSelector
                    title="Problemas relacionados"
                    description="Selecciona los problemas asociados a esta solución por ámbito y sector."
                    createModeMessage="Guarda la solución-ámbito-sector primero para poder relacionarla con problemas."
                    entityId={idSolucionAmbitoSectorActual}
                    catalogEndpoint={API_ENDPOINTS.PROBLEMAS}
                    relationEndpointBase={`${API_ENDPOINTS.SOLUCIONES_EDITOR}/soluciones-ambitos-sectores/relaciones/problemas`}
                    token={getEditorToken()}
                    optionIdField="id_problema"
                    optionLabelField="description"
                    relationIdsField="ids"
                    createBodyField="relationId"
                    openLabel="Seleccionar problemas"
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