import { useParams } from "react-router-dom";
import API_ENDPOINTS from "../../config/api";
import LandingContenidoEditor from "./shared/LandingContenidoEditor";

export default function AplicacionContenidoPage() {
  const { id } = useParams();

  return (
    <LandingContenidoEditor
      id={id ?? null}
      title="Editor de contenido"
      subtitle="Edicion visual de bloques de la aplicacion"
      itemLabel="Aplicacion"
      backTo="/aplicaciones"
      backLabel="Volver a aplicaciones"
      endpoint={API_ENDPOINTS.APLICACIONES}
      saveEndpoint={API_ENDPOINTS.APLICACIONES_EDITOR}
      contentField="contenidos"
    />
  );
}
