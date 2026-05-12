export interface PrologoItem {
  title?: string;
  content?: string;
  titulo?: string;
  texto?: string;
}

export interface IndiceItem {
  title?: string;
  titulo?: string;
  ul?: string[];
  claims?: { titulo?: string; texto?: string; title?: string; claim?: string }[];
}

export interface ResponsableInforme {
  nombre?: string;
  empresa?: string;
  cargo?: string;
  imagen?: string;
}

export interface Informe {
  id: number;
  slug: string;
  categoria: string;
  titulo: string;
  textoDescarga: string | null;
  imgPortada?: string;
  imgInforme?: string;
  img_portada?: string;
  img_informe?: string;
  prologo: PrologoItem[];
  indice: IndiceItem[];
  responsables: ResponsableInforme[];
}
