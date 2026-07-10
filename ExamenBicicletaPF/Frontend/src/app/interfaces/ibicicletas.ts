export interface IBicicleta {
  bicicleta_id?: number;
  b_codigo: string;
  b_tipo: 'un_asiento' | 'dos_asientos' | 'off_road' | 'electrica';
  b_estado?: 'en_estacion' | 'prestada' | 'en_mantenimiento';
  estacion_id: number | null;
  b_disponible?: boolean;
  estacion_nombre?: string; 
}