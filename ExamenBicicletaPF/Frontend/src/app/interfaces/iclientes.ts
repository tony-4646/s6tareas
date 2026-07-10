export interface ICliente {
  cliente_id?: number; 
  c_nombres: string;
  c_documento: string;
  c_telefono: string;
  c_email: string;
  c_disponible?: boolean;
}
