import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header";
import { Editor } from "../../../components/shared/Editor";
import { LANDING_COMPONENT_LIBRARY } from "../../../config/componentLibraries";
import type { CampoEsquema } from "../../../types/editor";

type LandingContenidoEditorProps = {
  id: string | null;
  title: string;
  subtitle: string;
  itemLabel: string;
  backTo: string;
  backLabel: string;
  endpoint: string;
  saveEndpoint: string;
  contentField: string;
};

type GenericRecord = Record<string, unknown>;

export default function LandingContenidoEditor({
  id,
  title,
  subtitle,
  itemLabel,
  backTo,
  backLabel,
  endpoint,
  saveEndpoint,
  contentField,
}: LandingContenidoEditorProps) {
  const navigate = useNavigate();

  const fields: CampoEsquema<GenericRecord>[] = [
    {
      name: contentField as keyof GenericRecord,
      label: "Contenido",
      type: "componentes_json",
      componentLibrary: LANDING_COMPONENT_LIBRARY,
    },
  ];

  return (
    <>
      <Header title={title} subtitle={subtitle} />

      <main className="p-8">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <div className="text-sm text-text-secondary">
            {itemLabel} ID: <span className="font-bold text-text-primary">{id}</span>
          </div>
          <Link to={backTo} className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">
            {backLabel}
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <Editor<GenericRecord>
            endpoint={endpoint}
            saveEndpoint={saveEndpoint}
            fields={fields}
            idEdicion={id}
            onCerrar={() => {
              navigate(backTo);
            }}
          />
        </div>
      </main>
    </>
  );
}
