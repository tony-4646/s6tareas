import { Injectable } from '@angular/core';
import { variables_ambiente } from './enviroment';
import { HttpClient } from '@angular/common/http';
import { Ieventos } from './ieventos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Eventoservice {
  apiurl=variables_ambiente.apiBaseURL
  constructor(private readonly http:HttpClient) {}
  todos():Observable<Ieventos[]>{
    return this.http.get<Ieventos[]>(`${this.apiurl}/eventos`)
  }
  uno(id:number):Observable<Ieventos>{
    return this.http.get<Ieventos>(`${this.apiurl}/eventos/${id}`)
  }
  nuevo(evento:Ieventos):Observable<Ieventos>{
    return this.http.post<Ieventos>(`${this.apiurl}/eventos`,evento)
  }
  actualizar(id:number, evento:Ieventos):Observable<Ieventos>{
    return this.http.patch<Ieventos>(`${this.apiurl}/eventos/${id}`, evento)
  }
  eliminar(id:number):Observable<string>{
    return this.http.delete<string>(`${this.apiurl}/eventos/${id}`)
  }

}
