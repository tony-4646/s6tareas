import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'https://localhost:7231/api/UsuariosApi/Login';

  constructor (private http: HttpClient){
  }

      login (usuario: any): Observable<any>{
        return this.http.post<any>(this.apiUrl, usuario)
      }
}
