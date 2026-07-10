import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBicicleta } from '../interfaces/ibicicletas';

@Injectable({
  providedIn: 'root',
})
export class BicicletaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/bicicletas';

  // OBTENER BICICLETAS ACTIVAS
  obtenerTodas(): Observable<IBicicleta[]> {
    return this.http.get<IBicicleta[]>(this.apiUrl);
  }

  // REGISTRAR NUEVA BICICLETA
  crear(bicicleta: IBicicleta): Observable<IBicicleta> {
    return this.http.post<IBicicleta>(this.apiUrl, bicicleta);
  }

  // DAR DE BAJA BICICLETA
  desactivar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
