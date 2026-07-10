export interface IAlquiler {
  alquiler_id?: number;
  cliente_id: number;
  bicicleta_id: number;
  a_inicio?: string | Date;
  a_fin?: string | Date | null;
  cliente_nombre?: string; 
  bicicleta_codigo?: string; 
}
