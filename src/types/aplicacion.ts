export interface Aplicacion {
  id_app: number;
  description: string;
  uriIcon: string;
  shortDescription: string;
  slug: string;
  contenidos: unknown[] | string | null;
}
