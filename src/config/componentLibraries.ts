import type { ComponentLibraryItem, ComponentPropDefinition } from "../types/editor";

const HERO_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "stringList", defaultValue: [] },
  { key: "pragma", label: "Pragma", type: "stringList", defaultValue: [] },
  { key: "cta", label: "CTA", type: "text", defaultValue: "" },
  { key: "imgType", label: "Image type", type: "text", defaultValue: "img" },
  { key: "imgUrl", label: "Image URL", type: "text", defaultValue: "" },
  { key: "backgroundImg", label: "Background image", type: "text", defaultValue: "" },
  { key: "backgroundRepeat", label: "Background repeat", type: "text", defaultValue: "no-repeat" },
  { key: "backgroundSize", label: "Background size", type: "text", defaultValue: "cover" },
  { key: "backgroundPositionX", label: "Background position X", type: "text", defaultValue: "center" },
];

const TEXT_SECTION_SCHEMA: ComponentPropDefinition[] = [
  { key: "background", label: "Background", type: "text", required: true, defaultValue: "" },
  { key: "level1", label: "Level 1", type: "stringList", defaultValue: [] },
  { key: "level2", label: "Level 2", type: "stringList", defaultValue: [] },
  { key: "level3", label: "Level 3", type: "stringList", defaultValue: [] },
  { key: "level4", label: "Level 4", type: "stringList", defaultValue: [] },
  { key: "level5", label: "Level 5", type: "stringList", defaultValue: [] },
  { key: "level6", label: "Level 6", type: "stringList", defaultValue: [] },
  { key: "level7", label: "Level 7", type: "stringList", defaultValue: [] },
  { key: "level8", label: "Level 8", type: "stringList", defaultValue: [] },
  { key: "level9", label: "Level 9", type: "stringList", defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", defaultValue: "" },
  { key: "remarkableText", label: "Remarkable text", type: "text", defaultValue: "" },
  { key: "remarkableText2", label: "Remarkable text 2", type: "text", defaultValue: "" },
  { key: "remarkableText3", label: "Remarkable text 3", type: "text", defaultValue: "" },
];

const VIDEO_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "items", label: "Items", type: "stringList", required: true, defaultValue: [] },
  { key: "url_video", label: "Video URL", type: "text", defaultValue: "" },
  { key: "buttonText", label: "Button text", type: "text", defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", defaultValue: "" },
];

const FAQ_SCHEMA: ComponentPropDefinition[] = [
  { key: "faqs", label: "FAQs", type: "json", required: true, defaultValue: [] },
];

const QUESTIONS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "intro", label: "Intro", type: "json", defaultValue: "" },
  { key: "preQuestionsText", label: "Pre questions text", type: "text", defaultValue: "" },
  { key: "questions", label: "Questions", type: "stringList", defaultValue: [] },
  { key: "bigMarkText", label: "Big mark text", type: "text", defaultValue: "" },
  { key: "buttonText", label: "Button text", type: "text", defaultValue: "" },
  { key: "background", label: "Background", type: "text", defaultValue: "white" },
];

const CLIENT_CAROUSEL_SCHEMA: ComponentPropDefinition[] = [
  { key: "scope", label: "Scope", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
];

const SIMPLE_TITLE_SUBTITLE_IMAGES_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", required: true, defaultValue: "" },
  { key: "images", label: "Images", type: "stringList", required: true, defaultValue: [] },
];

const PRESENTACION_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", defaultValue: "" },
  { key: "imgBottom", label: "Bottom image", type: "text", required: true, defaultValue: "" },
];

const IMG_TEXT_SCHEMA: ComponentPropDefinition[] = [
  { key: "imgCabecera", label: "Header image", type: "text", required: true, defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", defaultValue: "" },
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", defaultValue: "" },
];

const HERO2_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "stringList", required: true, defaultValue: [] },
  { key: "pragma", label: "Pragma", type: "text", required: true, defaultValue: "" },
  { key: "imgBottom", label: "Bottom image", type: "text", required: true, defaultValue: "" },
];

const CLIENTS_MURAL_SCHEMA: ComponentPropDefinition[] = [
  { key: "scope", label: "Scope", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "stringList", required: true, defaultValue: [] },
];

const PRESENTACION2_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", defaultValue: "" },
  { key: "images", label: "Images", type: "stringList", required: true, defaultValue: [] },
  { key: "bottomText", label: "Bottom text", type: "text", defaultValue: "" },
];

const CAROUSEL_PERCEPTIONS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", defaultValue: "" },
  { key: "listIds", label: "List IDs", type: "json", required: true, defaultValue: [] },
];

const SIDE_IMG_TEXT_SCHEMA: ComponentPropDefinition[] = [
  { key: "image", label: "Image", type: "text", required: true, defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", defaultValue: "" },
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "plagma", label: "Plagma", type: "text", defaultValue: "" },
];

const SIDE_LEFT_IMG_TEXT_SCHEMA: ComponentPropDefinition[] = [
  { key: "image", label: "Image", type: "text", required: true, defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", defaultValue: "" },
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "json", required: true, defaultValue: "" },
  { key: "paragraphs", label: "Paragraphs", type: "json", defaultValue: "" },
  { key: "plagma", label: "Plagma", type: "text", defaultValue: "" },
];

const SIDE_TEXT_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", required: true, defaultValue: "" },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const SIMPLE_TESTIMONIO_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "id_testimonio", label: "Testimonio ID", type: "number", required: true, defaultValue: 1 },
];

const CLIENT_PERCEPTION_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "items", label: "Items", type: "json", defaultValue: [] },
  { key: "list", label: "List", type: "json", defaultValue: [] },
  { key: "secondtitle", label: "Second title", type: "text", defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", defaultValue: "" },
  { key: "id_testimonio", label: "Testimonio ID", type: "number", defaultValue: 1 },
  { key: "downtext", label: "Down text", type: "text", defaultValue: "" },
  { key: "supertitle", label: "Super title", type: "text", defaultValue: "" },
  { key: "image", label: "Image", type: "text", defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", defaultValue: "" },
  { key: "secondsupertitle", label: "Second super title", type: "text", defaultValue: "" },
  { key: "tabla", label: "Tabla", type: "json", required: true, defaultValue: [] },
];

const CARACTERISTICAS_SCHEMA: ComponentPropDefinition[] = [
  { key: "data", label: "Data", type: "json", required: true, defaultValue: [] },
];

const OBSTACULOS_SCHEMA: ComponentPropDefinition[] = [
  { key: "imgBackground", label: "Background image", type: "text", defaultValue: "" },
  { key: "image", label: "Image", type: "text", defaultValue: "" },
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "tabletitle", label: "Table title", type: "text", defaultValue: "" },
  { key: "table", label: "Table", type: "json", required: true, defaultValue: [] },
  { key: "pragma", label: "Pragma", type: "stringList", required: true, defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", defaultValue: "" },
  { key: "background", label: "Background", type: "text", defaultValue: "" },
  { key: "backgroundtable", label: "Background table", type: "text", defaultValue: "" },
];

const RESUMEN_SCHEMA: ComponentPropDefinition[] = [
  { key: "imgCabecera", label: "Header image", type: "text", required: true, defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", required: true, defaultValue: "" },
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "titlelist", label: "Title list", type: "text", required: true, defaultValue: "" },
  { key: "list", label: "List", type: "json", required: true, defaultValue: [] },
  { key: "cta", label: "CTA", type: "json", required: true, defaultValue: {} },
];

const RAZONES_SCHEMA: ComponentPropDefinition[] = [
  { key: "imgCabecera", label: "Header image", type: "text", required: true, defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", required: true, defaultValue: "" },
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "titleList", label: "Title list", type: "text", required: true, defaultValue: "" },
  { key: "list", label: "List", type: "json", required: true, defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const APORTACIONES_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "aportaciones", label: "Aportaciones", type: "json", required: true, defaultValue: [] },
];

const APORTACIONES2_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "aportaciones", label: "Aportaciones", type: "json", required: true, defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const REGALO_SCHEMA: ComponentPropDefinition[] = [
  { key: "image", label: "Image", type: "text", required: true, defaultValue: "" },
  { key: "imageBackground", label: "Background image", type: "text", required: true, defaultValue: "" },
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "titleSection", label: "Section title", type: "text", required: true, defaultValue: "" },
  { key: "claimSection", label: "Section claim", type: "text", required: true, defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", required: true, defaultValue: "" },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const SERVICIOS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "basicTitle", label: "Basic title", type: "text", required: true, defaultValue: "" },
  { key: "extraTitle", label: "Extra title", type: "text", required: true, defaultValue: "" },
  { key: "basicServices", label: "Basic services", type: "json", required: true, defaultValue: [] },
  { key: "extraServices", label: "Extra services", type: "json", required: true, defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const VENTAJAS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "highlightText", label: "Highlight text", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "items", label: "Items", type: "json", required: true, defaultValue: [] },
  { key: "background", label: "Background", type: "text", defaultValue: "white" },
];

const ETAPAS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "etapas", label: "Etapas", type: "json", required: true, defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const CLAVES_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claves", label: "Claves", type: "json", required: true, defaultValue: [] },
  { key: "showDividers", label: "Show dividers", type: "boolean", defaultValue: false },
];

const PORCENTAJES_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", required: true, defaultValue: "" },
  { key: "datos", label: "Datos", type: "json", required: true, defaultValue: [] },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", required: true, defaultValue: "" },
];

const OPCIONES_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "highlightedText", label: "Highlighted text", type: "text", defaultValue: "" },
  { key: "intro", label: "Intro", type: "text", defaultValue: "" },
  { key: "leftTitle", label: "Left title", type: "text", required: true, defaultValue: "" },
  { key: "leftItems", label: "Left items", type: "json", required: true, defaultValue: [] },
  { key: "rightTitle", label: "Right title", type: "text", required: true, defaultValue: "" },
  { key: "rightItems", label: "Right items", type: "json", required: true, defaultValue: [] },
  { key: "paragraphs", label: "Paragraphs", type: "stringList", defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", defaultValue: "" },
  { key: "imgBackground", label: "Background image", type: "text", defaultValue: "" },
];

const ESTUDIO_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "stringList", required: true, defaultValue: [] },
  { key: "pragma", label: "Pragma", type: "text", required: true, defaultValue: "" },
  { key: "datos", label: "Datos", type: "json", required: true, defaultValue: [] },
];

const PASOS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", required: true, defaultValue: "" },
  { key: "pasos", label: "Pasos", type: "json", required: true, defaultValue: [] },
];

const DESGRANE_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "text", required: true, defaultValue: "" },
  { key: "listTitle", label: "List title", type: "text", required: true, defaultValue: "" },
  { key: "list", label: "List", type: "json", required: true, defaultValue: [] },
];

const NECESIDADES_SCHEMA: ComponentPropDefinition[] = [
  { key: "imgBackground", label: "Background image", type: "text", required: true, defaultValue: "" },
  { key: "image", label: "Image", type: "text", required: true, defaultValue: "" },
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", required: true, defaultValue: "" },
  { key: "titlelist", label: "Title list", type: "text", required: true, defaultValue: "" },
  { key: "list", label: "List", type: "stringList", defaultValue: [] },
  { key: "claim", label: "Claim", type: "text", defaultValue: "" },
];

const MULTIPLE_ETAPAS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "subtitle", label: "Subtitle", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "selectorTitle", label: "Selector title", type: "text", defaultValue: "" },
  { key: "options", label: "Options", type: "json", required: true, defaultValue: [] },
];

const LIST_HISTORIA_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "claim", label: "Claim", type: "stringList", defaultValue: [] },
  { key: "titlelist", label: "Title list", type: "text", defaultValue: "" },
  { key: "list", label: "List", type: "json", defaultValue: [] },
  { key: "image", label: "Image", type: "text", defaultValue: "" },
  { key: "pragma", label: "Pragma", type: "stringList", defaultValue: [] },
  { key: "listStyle", label: "List style", type: "text", defaultValue: "numbered" },
  { key: "compact", label: "Compact", type: "boolean", defaultValue: false },
];

const LIST_COLUMNS_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "" },
  { key: "list", label: "List", type: "json", required: true, defaultValue: [] },
  { key: "image", label: "Image", type: "text", required: true, defaultValue: "" },
];

const HISTORIA_TEXT_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "stringList", required: true, defaultValue: [] },
  { key: "buttonText", label: "Button text", type: "text", defaultValue: "" },
  { key: "image", label: "Image", type: "text", defaultValue: "" },
];

const HISTORIA_CLIENTE_SCHEMA: ComponentPropDefinition[] = [
  { key: "claim", label: "Claim", type: "stringList", required: true, defaultValue: [] },
  { key: "id_testimonio", label: "Testimonio ID", type: "number", required: true, defaultValue: 1 },
];

const DESCARGA_INFORME_SCHEMA: ComponentPropDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true, defaultValue: "" },
  { key: "claim", label: "Claim", type: "text", required: true, defaultValue: "" },
  { key: "buttonText", label: "Button text", type: "text", required: true, defaultValue: "" },
];

const COMPONENT_SCHEMAS: Record<string, ComponentPropDefinition[]> = {
  HeroSection: HERO_SCHEMA,
  HeroSection2: HERO2_SCHEMA,
  ClientCarouselWrapper: CLIENT_CAROUSEL_SCHEMA,
  TextSection: TEXT_SECTION_SCHEMA,
  VideoSection: VIDEO_SCHEMA,
  FaqSection: FAQ_SCHEMA,
  QuestionsSection: QUESTIONS_SCHEMA,
  ClientPerceptionSection: CLIENT_PERCEPTION_SCHEMA,
  CaracteristicasIncorporadas: CARACTERISTICAS_SCHEMA,
  ObstaculosYSolucionesSection: OBSTACULOS_SCHEMA,
  MovilPortalSection: SIMPLE_TITLE_SUBTITLE_IMAGES_SCHEMA,
  CertificacionesSection: SIMPLE_TITLE_SUBTITLE_IMAGES_SCHEMA,
  ResumenSection: RESUMEN_SCHEMA,
  PresentacionSection: PRESENTACION_SCHEMA,
  ImgTextSection: IMG_TEXT_SCHEMA,
  ClientsMuralSection: CLIENTS_MURAL_SCHEMA,
  PresentacionSection2: PRESENTACION2_SCHEMA,
  CarouselPerceptionsSection: CAROUSEL_PERCEPTIONS_SCHEMA,
  RazonesSection: RAZONES_SCHEMA,
  SideImgTextSection: SIDE_IMG_TEXT_SCHEMA,
  SideLeftImgTextSection: SIDE_LEFT_IMG_TEXT_SCHEMA,
  AportacionesSection: APORTACIONES_SCHEMA,
  RegaloSection: REGALO_SCHEMA,
  ServiciosSection: SERVICIOS_SCHEMA,
  VentajasSection: VENTAJAS_SCHEMA,
  EtapasSection: ETAPAS_SCHEMA,
  ClavesSection: CLAVES_SCHEMA,
  PorcentajesSection: PORCENTAJES_SCHEMA,
  SideTextSection: SIDE_TEXT_SCHEMA,
  OpcionesSeleccionesSection: OPCIONES_SCHEMA,
  EstudioSection: ESTUDIO_SCHEMA,
  PasosSection: PASOS_SCHEMA,
  DesgraneSection: DESGRANE_SCHEMA,
  SimpleClientPerceptionSection: SIMPLE_TESTIMONIO_SCHEMA,
  NecesidadesSection: NECESIDADES_SCHEMA,
  AportacionesSection2: APORTACIONES2_SCHEMA,
  MultipleEtapasSection: MULTIPLE_ETAPAS_SCHEMA,
  ListHistoriaSection: LIST_HISTORIA_SCHEMA,
  ListColumnsSection: LIST_COLUMNS_SCHEMA,
  HistoriaTextSection: HISTORIA_TEXT_SCHEMA,
  HistoriaClienteSection: HISTORIA_CLIENTE_SCHEMA,
  DescargaInformeSection: DESCARGA_INFORME_SCHEMA,
};

function buildPreviewImage(label: string): string {
  const safeLabel = label.length > 26 ? `${label.slice(0, 23)}...` : label;
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#e2e8f0'/>
          <stop offset='100%' stop-color='#cbd5e1'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <rect x='32' y='32' width='736' height='386' rx='20' fill='#ffffff' fill-opacity='0.72'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#334155' font-size='34' font-family='Arial, sans-serif'>${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Biblioteca base reutilizable para contenidos que renderiza LandingBuilder en store.
const LANDING_COMPONENT_LIBRARY_BASE: ComponentLibraryItem[] = [
  { type: "HeroSection", label: "Hero", image: "/previews/heroSection.png" },
  { type: "HeroSection2", label: "Hero 2", image: "/previews/heroSection2.png" },
  { type: "ClientCarouselWrapper", label: "Carrusel de clientes", image: "/previews/clientCarouselWrapper.png" },
  { type: "TextSection", label: "Bloque de texto" , image: "/previews/textSection.png"},
  { type: "VideoSection", label: "Video" , image: "/previews/videoSection.png" },
  { type: "ClientPerceptionSection", label: "Percepcion cliente", image: "/previews/clientPerceptionSection.png" },
  { type: "CarouselPerceptionsSection", label: "Carrusel percepciones", image: "/previews/carouselPerceptionsSection.png" },
  { type: "SimpleClientPerceptionSection", label: "Percepcion simple" , image: "/previews/simpleClientPerceptionSection.png" },
  { type: "CaracteristicasIncorporadas", label: "Caracteristicas incorporadas", image: "/previews/caracteristicasIncorporadas.png" },
  { type: "ObstaculosYSolucionesSection", label: "Obstaculos y soluciones",  image: "/previews/obstaculosYSolucionesSection.png" },
  { type: "MovilPortalSection", label: "Seccion movil" , image: "/previews/movilPortalSection.png" },
  { type: "CertificacionesSection", label: "Certificaciones" , image: "/previews/certificacionesSection.png" },
  { type: "ResumenSection", label: "Resumen"  , image: "/previews/resumenSection.png" },
  { type: "PresentacionSection", label: "Presentacion"  , image: "/previews/presentacionSection.png" },
  { type: "PresentacionSection2", label: "Presentacion 2" , image: "/previews/presentacionSection2.png" },
  { type: "ImgTextSection", label: "Imagen + texto"   , image: "/previews/imgTextSection.png" },
  { type: "SideImgTextSection", label: "Imagen lateral derecha" , image: "/previews/sideImgTextSection.png" },
  { type: "SideLeftImgTextSection", label: "Imagen lateral izquierda"   , image: "/previews/sideLeftImgTextSection.png" },
  { type: "SideTextSection", label: "Texto lateral"  , image: "/previews/sideTextSection.png" },
  { type: "RazonesSection", label: "Razones"    , image: "/previews/razonesSection.png" },
  { type: "AportacionesSection", label: "Aportaciones"  , image: "/previews/aportacionesSection.png" },
  { type: "AportacionesSection2", label: "Aportaciones 2", image: "/previews/aportacionesSection2.png" },
  { type: "RegaloSection", label: "Regalo"  , image: "/previews/regaloSection.png" },
  { type: "ServiciosSection", label: "Servicios" , image: "/previews/serviciosSection.png" },
  { type: "VentajasSection", label: "Ventajas" , image: "/previews/ventajasSection.png" },
  { type: "EtapasSection", label: "Etapas"  },
  { type: "MultipleEtapasSection", label: "Multiples etapas" },
  { type: "QuestionsSection", label: "Preguntas", image: "/previews/questionsSection.png" },
  { type: "ClavesSection", label: "Claves", image: "/previews/clavesSection.png" },
  { type: "PorcentajesSection", label: "Porcentajes" , image: "/previews/porcentajesSection.png" },
  { type: "OpcionesSeleccionesSection", label: "Opciones / selecciones" , image: "/previews/opcionesSeleccionesSection.png" },
  { type: "EstudioSection", label: "Estudio"  , image: "/previews/estudioSection.png" },
  { type: "PasosSection", label: "Pasos"  , image: "/previews/pasosSection.png" },
  { type: "DesgraneSection", label: "Desgrane", image: "/previews/desgraneSection.png" },
  { type: "NecesidadesSection", label: "Necesidades",  image: "/previews/necesidadesSection.png" },
  { type: "ListHistoriaSection", label: "Lista historia"  , image: "/previews/listHistoriaSection.png" },
  { type: "ListColumnsSection", label: "Lista columnas"  , image: "/previews/listColumnsSection.png" },
  { type: "HistoriaTextSection", label: "Texto historia" , image: "/previews/historiaTextSection.png" },
  { type: "HistoriaClienteSection", label: "Historia cliente" , image: "/previews/historiaClienteSection.png" },
  { type: "ClientsMuralSection", label: "Mural clientes" , image: "/previews/clientsMuralSection.png" },
  { type: "DescargaInformeSection", label: "Descarga informe" , image: "/previews/descargaInformeSection.png" },
  { type: "FaqSection", label: "FAQ" , image: "/previews/faqSection.png" },
];

export const LANDING_COMPONENT_LIBRARY: ComponentLibraryItem[] = LANDING_COMPONENT_LIBRARY_BASE.map((item) => ({
  ...item,
  description: item.description ?? "Componente disponible en LandingBuilder",
  image: item.image ?? buildPreviewImage(item.label),
  propsSchema: item.propsSchema ?? COMPONENT_SCHEMAS[item.type],
  defaultData:
    item.defaultData ??
    Object.fromEntries(
      (item.propsSchema ?? COMPONENT_SCHEMAS[item.type] ?? []).map((prop) => [
        prop.key,
        prop.defaultValue ?? (prop.type === "boolean" ? false : prop.type === "number" ? 0 : prop.type === "json" ? {} : ""),
      ])
    ),
}));
