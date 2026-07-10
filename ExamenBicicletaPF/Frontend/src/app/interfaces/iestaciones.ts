export interface IEstacion {
  estacion_id?: number;
  e_nombre: string;
  e_direccion: string;
  e_capacidad: number;
  e_ciudad: string;
  e_disponible?: boolean;
}