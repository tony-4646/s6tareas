import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/ordenes';

  // Obtener todas las ordenes
  getOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva orden completa
  createOrden(orden: { cliente_id: number; articulos: any[] }): Observable<any> {
    return this.http.post<any>(this.apiUrl, orden);
  }

  // Cambiar el estado de la orden
  updateEstado(id: number, nuevoEstado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/estado`, { o_estado: nuevoEstado });
  }
}