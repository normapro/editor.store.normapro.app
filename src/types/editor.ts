export interface CampoEsquema<T> {
  name: keyof T;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "multiselect" | "paragraphs" | "contenido_informe";
  options?: string[]; // Solo para selects y multiselects
}

export interface RecursoConfig<T> {
  key: string;
  endpoint: string;
  plural: string;
  singular: string;
  columnaPrincipal: keyof T;
  idFields?: Array<keyof T | string>;
  extractList?: (payload: unknown) => T[];
  getItemId?: (item: T, index: number) => number | string;
  esquema: CampoEsquema<T>[];
}