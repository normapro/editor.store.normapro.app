import { useParams } from "react-router-dom";
import API_ENDPOINTS from "../../config/api";
import LandingContenidoEditor from "./shared/LandingContenidoEditor";

export default function HistoriaContenidoPage() {
  const { id } = useParams();

  return (
    <LandingContenidoEditor
      id={id ?? null}
      title="Editor de contenido"
      subtitle="Edicion visual de bloques de la historia"
      itemLabel="Historia"
      backTo="/historias"
      backLabel="Volver a historias"
      endpoint={API_ENDPOINTS.HISTORIAS}
      saveEndpoint={API_ENDPOINTS.HISTORIAS_EDITOR}
      contentField="componentes"
    />
  );
}
