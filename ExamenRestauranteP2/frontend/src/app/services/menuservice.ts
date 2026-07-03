import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class MenuService {
  private http = inject(HttpClient); 
  private apiUrl = 'http://localhost:3000/menus'; 

  //Obtener menús activos
  getMenus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo plato
  createMenu(menu: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, menu);
  }

  // Editar un plato
  updateMenu(id: number, menu: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, menu);
  }

  // Desactivar un plato
  deleteMenu(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}