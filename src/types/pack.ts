export interface ItemListPack {
  id_pack: number;
  description: string;
  shortDescription: string;
  uriIcon: string;
  slug: string;
  id_ambito?: number;
  id_sector?: number;
  slug_ambito?: string;
  slug_sector?: string;
  descriptionForHighLight?: string;
}

export interface Pack extends ItemListPack {
  title: string;
  subtitle: string;
  problemaTitle: string;
  problemaPragma: string;
  multimediaUri: string;
  multimediaTypeId: number;
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
  fraseCierre: string;
  descriptionForHighLight?: string;
  titleweb?: string;
  id_ambito?: number;
}
