export interface CampoEsquema<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select';
  options?: string[]; // Solo para selects
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