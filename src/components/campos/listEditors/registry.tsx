import type { ComponentType } from "react";
import type { CollectionListEditorProps } from "./types";
import { FaqSectionFaqsListEditor } from "./FaqSectionListEditor";
import {
  ClientPerceptionItemsListEditor,
  ClientPerceptionListListEditor,
  ClientPerceptionTablaListEditor,
} from "./ClientPerceptionSectionListEditors";
import { CaracteristicasIncorporadasDataListEditor } from "./CaracteristicasIncorporadasListEditor";
import { ObstaculosTableListEditor } from "./ObstaculosYSolucionesSectionListEditor";
import { ResumenListListEditor } from "./ResumenSectionListEditor";
import { RazonesListListEditor } from "./RazonesSectionListEditor";
import { AportacionesListEditor } from "./AportacionesSectionListEditor";
import { Aportaciones2ListEditor } from "./AportacionesSection2ListEditor";
import { ServiciosBasicServicesListEditor, ServiciosExtraServicesListEditor } from "./ServiciosSectionListEditors";
import { VentajasItemsListEditor } from "./VentajasSectionListEditor";
import { EtapasListEditor } from "./EtapasSectionListEditor";
import { ClavesListEditor } from "./ClavesSectionListEditor";
import { PorcentajesDatosListEditor } from "./PorcentajesSectionListEditor";
import { OpcionesLeftItemsListEditor, OpcionesRightItemsListEditor } from "./OpcionesSeleccionesSectionListEditors";
import { EstudioDatosListEditor } from "./EstudioSectionListEditor";
import { PasosListEditor } from "./PasosSectionListEditor";
import { MultipleEtapasOptionsListEditor } from "./MultipleEtapasSectionListEditor";
import { ListHistoriaListEditor } from "./ListHistoriaSectionListEditor";
import { ListColumnsListEditor } from "./ListColumnsSectionListEditor";
import { CarouselPerceptionsListIdsEditor } from "./CarouselPerceptionsSectionListEditor";

export const LIST_EDITOR_REGISTRY: Record<string, ComponentType<CollectionListEditorProps>> = {
  "FaqSection.faqs": FaqSectionFaqsListEditor,
  "ClientPerceptionSection.items": ClientPerceptionItemsListEditor,
  "ClientPerceptionSection.list": ClientPerceptionListListEditor,
  "ClientPerceptionSection.tabla": ClientPerceptionTablaListEditor,
  "CaracteristicasIncorporadas.data": CaracteristicasIncorporadasDataListEditor,
  "ObstaculosYSolucionesSection.table": ObstaculosTableListEditor,
  "ResumenSection.list": ResumenListListEditor,
  "RazonesSection.list": RazonesListListEditor,
  "AportacionesSection.aportaciones": AportacionesListEditor,
  "AportacionesSection2.aportaciones": Aportaciones2ListEditor,
  "ServiciosSection.basicServices": ServiciosBasicServicesListEditor,
  "ServiciosSection.extraServices": ServiciosExtraServicesListEditor,
  "VentajasSection.items": VentajasItemsListEditor,
  "EtapasSection.etapas": EtapasListEditor,
  "ClavesSection.claves": ClavesListEditor,
  "PorcentajesSection.datos": PorcentajesDatosListEditor,
  "OpcionesSeleccionesSection.leftItems": OpcionesLeftItemsListEditor,
  "OpcionesSeleccionesSection.rightItems": OpcionesRightItemsListEditor,
  "EstudioSection.datos": EstudioDatosListEditor,
  "PasosSection.pasos": PasosListEditor,
  "MultipleEtapasSection.options": MultipleEtapasOptionsListEditor,
  "ListHistoriaSection.list": ListHistoriaListEditor,
  "ListColumnsSection.list": ListColumnsListEditor,
  "CarouselPerceptionsSection.listIds": CarouselPerceptionsListIdsEditor,
};
