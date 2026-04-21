import type { Actualidad } from "../types/actualidad";
import type { RecursoConfig } from "../types/editor";
import API_ENDPOINTS from "./api";

export const CONFIG_ACTUALIDAD: RecursoConfig<Actualidad> = {
  key: 'actualidad',
  endpoint: API_ENDPOINTS.ACTUALIDAD,
  plural: 'Noticias',
  singular: 'noticia',
  columnaPrincipal: 'title',
  esquema: [
    { name: 'title', label: 'Título de la Noticia', type: 'text' },
    { name: 'slug', label: 'Slug (URL)', type: 'text' },
    { name: 'fecha', label: 'Fecha de Publicación', type: 'date' },
    { name: 'categoria', label: 'Categoría', type: 'text' },
    { name: 'id_pack', label: 'ID del Pack', type: 'number' },
    { name: 'content', label: 'Contenido completo', type: 'textarea' },
    { name: 'imagen', label: 'URL de la Imagen', type: 'text' },
  ]
};