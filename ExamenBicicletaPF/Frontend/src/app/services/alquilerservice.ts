import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAlquiler } from '../interfaces/ialquileres';

@Injectable({
  providedIn: 'root',
})
export class AlquilerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/alquileres';

  // OBTENER LOS ALQUILERES
  obtenerTodos(): Observable<IAlquiler[]> {
    return this.http.get<IAlquiler[]>(this.apiUrl);
  }

  // NUEVO ALQUILER
  comenzar(
    cliente_id: number,
    bicicleta_id: number,
  ): Observable<{ alquiler_id: number; mensaje: string }> {
    return this.http.post<{ alquiler_id: number; mensaje: string }>(`${this.apiUrl}/comenzar`, {
      cliente_id,
      bicicleta_id,
    });
  }

  // FINALIZAR UN ALQUILER
  terminar(
    alquiler_id: number,
    nueva_estacion_id: number,
  ): Observable<{ alquiler_id: number; mensaje: string }> {
    return this.http.put<{ alquiler_id: number; mensaje: string }>(
      `${this.apiUrl}/terminar/${alquiler_id}`,
      {
        nueva_estacion_id,
      },
    );
  }
}
