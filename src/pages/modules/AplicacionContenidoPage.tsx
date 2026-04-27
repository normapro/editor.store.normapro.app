import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { Editor } from "../../components/shared/Editor";
import API_ENDPOINTS from "../../config/api";
import { LANDING_COMPONENT_LIBRARY } from "../../config/componentLibraries";
import type { Aplicacion } from "../../types";
import type { CampoEsquema } from "../../types/editor";

const APLICACION_CONTENIDO_FIELDS: CampoEsquema<Aplicacion>[] = [
  {
    name: "contenidos",
    label: "Contenido",
    type: "componentes_json",
    componentLibrary: LANDING_COMPONENT_LIBRARY,
  },
];

export default function AplicacionContenidoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Header
        title="Editor de contenido"
        subtitle="Edicion visual de bloques de la aplicacion"
      />

      <main className="p-8">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <div className="text-sm text-text-secondary">
            Aplicacion ID: <span className="font-bold text-text-primary">{id}</span>
          </div>
          <Link
            to="/aplicaciones"
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"
          >
            Volver a aplicaciones
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <Editor<Aplicacion>
            endpoint={API_ENDPOINTS.APLICACIONES}
            saveEndpoint={API_ENDPOINTS.APLICACIONES_EDITOR}
            fields={APLICACION_CONTENIDO_FIELDS}
            idEdicion={id ?? null}
            onCerrar={() => {
              navigate("/aplicaciones");
            }}
          />
        </div>
      </main>
    </>
  );
}
