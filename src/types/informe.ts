export interface PrologoItem {
  titulo: string;
  texto: string;
}

export interface IndiceItem {
  titulo: string;
  claims: { titulo: string; texto: string }[];
}

export interface ResponsableInforme {
  nombre: string;
  cargo: string;
  imagen: string;
}

export interface Informe {
  id: number;
  slug: string;
  categoria: string;
  titulo: string;
  textoDescarga: string;
  img_portada: string;
  img_informe: string;
  prologo: PrologoItem[];
  indice: IndiceItem[];
  responsables: ResponsableInforme[];
}
