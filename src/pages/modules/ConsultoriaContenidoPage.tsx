import { useParams } from "react-router-dom";
import API_ENDPOINTS from "../../config/api";
import LandingContenidoEditor from "./shared/LandingContenidoEditor";

export default function ConsultoriaContenidoPage() {
  const { id } = useParams();

  return (
    <LandingContenidoEditor
      id={id ?? null}
      title="Editor de contenido"
      subtitle="Edicion visual de bloques de la consultoria"
      itemLabel="Consultoria"
      backTo="/consultorias"
      backLabel="Volver a consultorias"
      endpoint={API_ENDPOINTS.CONSULTORIA_EDITOR_READ}
      saveEndpoint={API_ENDPOINTS.CONSULTORIA_EDITOR}
      contentField="contenidos"
    />
  );
}
