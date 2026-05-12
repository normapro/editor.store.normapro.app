export type ComponentPropType = "text" | "textarea" | "number" | "boolean" | "stringList" | "json";

export interface ComponentPropDefinition {
  key: string;
  label: string;
  type: ComponentPropType;
  required?: boolean;
  defaultValue?: unknown;
}

export interface ComponentLibraryItem {
  type: string;
  label: string;
  description?: string;
  image?: string;
  defaultData?: Record<string, unknown>;
  propsSchema?: ComponentPropDefinition[];
}

export interface CampoEsquema<T> {
  name: keyof T;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "time" | "select" | "multiselect" | "paragraphs" | "contenido_informe" | "indice_informe" | "autores_informe" | "componentes_json";
  options?: string[]; // Solo para selects y multiselects
  componentLibrary?: ComponentLibraryItem[];
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