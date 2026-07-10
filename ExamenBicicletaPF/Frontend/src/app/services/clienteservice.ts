import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICliente } from '../interfaces/iclientes';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/clientes';

  // OBTENER CLIENTES ACTIVOS
  obtenerTodos(): Observable<ICliente[]> {
    return this.http.get<ICliente[]>(this.apiUrl);
  }

  // NUEVO CLIENTE
  crear(cliente: ICliente): Observable<ICliente> {
    return this.http.post<ICliente>(this.apiUrl, cliente);
  }

  // ACTUALIZAR CLIENTE
  actualizar(id: number, cliente: ICliente): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, cliente);
  }

  // DESACTIVAR CLIENTE
  desactivar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
