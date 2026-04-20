export const LogoType = {
  SQUARE: "square",
  WIDE: "wide",
  ULTRAWIDE: "ultrawide",
} as const;

export type LogoType = (typeof LogoType)[keyof typeof LogoType];

export interface Cliente {
  id_cliente: number;
  description: string;
  url: string;
  logo: string;
  permisoweb: number;
  logoType: LogoType;
}
