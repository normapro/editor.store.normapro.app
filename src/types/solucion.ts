export interface ItemListSolucion {
  id_solucion: number;
  description: string;
  title: string;
  subtitle: string;
  icon: string;
  slug: string;
  id_ambito?: number;
  id_sector?: number;
}

export interface Solucion extends ItemListSolucion {
  titleweb: string;
  textoprincipal_titulo: string;
  textoprincipal_parrafo: string;
  multimediaUri: string;
  multimediaTypeId: number;
  problemaTitle: string;
  problemaPragma: string;
  solucionTitle: string;
  solucionPragma: string;
  caracteristicasTitle: string;
  caracteristicasPragma: string;
  casosdeusoTitle: string;
  casosdeusoPragma: string;
  beneficiosTitle: string;
  beneficiosPragma: string;
  firstCtaTitle: string;
  firstCtaPragma: string;
  secondCtaTitle: string;
  secondCtaPragma: string;
  consultoriaTitle: string;
  consultoriaDescription: string;
  fraseCierre?: string;
  thread_id?: string;
}

export interface Problema {
  id_problema: number;
  description: string;
}

export interface Faq {
  id_faq: number;
  question: string;
  answer: string;
}

export interface Beneficio {
  id_beneficio: number;
  description: string;
}

export interface Caracteristica {
  id_caracteristica: number;
  description: string;
}

export interface CasosDeUso {
  id_casodeuso: number;
  description: string;
}
