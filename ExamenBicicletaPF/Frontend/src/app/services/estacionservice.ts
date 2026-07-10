import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEstacion } from '../interfaces/iestaciones';

@Injectable({
  providedIn: 'root',
})
export class EstacionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/estaciones';

  // OBTENER ESTACIONES ACTIVAS
  obtenerTodas(): Observable<IEstacion[]> {
    return this.http.get<IEstacion[]>(this.apiUrl);
  }

  // NUEVA ESTACIÓN
  crear(estacion: IEstacion): Observable<IEstacion> {
    return this.http.post<IEstacion>(this.apiUrl, estacion);
  }

  //ACTUALIZAR ESTACIÓN
  actualizar(id: number, estacion: IEstacion): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, estacion);
  }

  // DESHABILITAR ESTACIÓN Y REASINGAR BICICLETAS
  desactivar(idOrigen: number, idDestino: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${idOrigen}`, {
      body: {
        estacion_destino_id: idDestino,
      },
    });
  }
}
