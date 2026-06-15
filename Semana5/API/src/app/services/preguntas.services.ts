import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IPregunta } from '../interfaces/ipregunta';
import { Inject, Injectable } from '@angular/core';

@Injectable ({
    providedIn: 'root'
})
export class PreguntasServices {
    private readonly http = inject(HttpClient);

    ruta:string = "https://localhost:44304/api/preguntasapi";

    todos():Observable<IPregunta[]>{
        return this.http.get<IPregunta[]>(this.ruta)
    }

    insertar(pregunta: IPregunta): Observable<IPregunta>{
        return this.http.post<IPregunta>(this.ruta, pregunta);
    }
    
    actualizar(id: number, pregunta: IPregunta): Observable<any>{
        return this.http.put(`${this.ruta}/${id}`, pregunta);
    }

    eliminar(id: number): Observable<any>{
        return this.http.delete(`${this.ruta}/${id}`);
    }

}
