export interface Testimonio {
  id_testimonio: number;
  id_cliente: number;
  description: string;
  persona: string;
  cargo: string;
}

export interface TestimonioConCliente extends Testimonio {
  cliente_description: string;
  logo: string;
  logoType: string;
}
