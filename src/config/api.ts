const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3010";

const API_ENDPOINTS = {
  AMBITOS: `${API_BASE_URL}/v1/store/ambitos`,
  AMBITOS_SOLUCIONES: `${API_BASE_URL}/v1/store/ambitosWithSolCounter`,
  LISTSOLUCIONES: `${API_BASE_URL}/v1/store/listsoluciones`,
  SECTORES: `${API_BASE_URL}/v1/store/sectores`,
  HIGLIGHTEDPACKS: `${API_BASE_URL}/v1/store/highlighted/packs`,
  CLIENTES: `${API_BASE_URL}/v1/store/clientes`,
  LISTPACKS: `${API_BASE_URL}/v1/store/listpacks`,
  SECTOR_INFO: `${API_BASE_URL}/v1/store/sector`,
  SOLUCION: `${API_BASE_URL}/v1/store/solucion`,
  TESTIMONIOS: `${API_BASE_URL}/v1/store/testimonios`,
  HISTORIAS: `${API_BASE_URL}/v1/store/historias`,
  INFORMES: `${API_BASE_URL}/v1/store/informes`,
  APLICACIONES: `${API_BASE_URL}/v1/store/aplicaciones`,
  CONSULTORIA: `${API_BASE_URL}/v1/store/consultoria`,
  PACKS: `${API_BASE_URL}/v1/store/packs`,
  COOKIES: `${API_BASE_URL}/v1/store/cookies`,
  EVENTOS: `${API_BASE_URL}/v1/store/eventos`,
  ACTUALIDAD: `${API_BASE_URL}/v1/store/actualidad`,
};

export default API_ENDPOINTS;
