import { Routes } from '@angular/router';
import { Preguntas } from './preguntas/preguntas';
import { InsertarPregunta } from './preguntas/insertar-pregunta/insertar-pregunta';
import { EditarPregunta } from './preguntas/editar-pregunta/editar-pregunta';
import { EliminarPregunta } from './preguntas/eliminar-pregunta/eliminar-pregunta';

export const routes: Routes = [
    {
        path:'',
        component: Preguntas,
        pathMatch:"full"
    },
     {
        path:'insertar',
        component: InsertarPregunta,
        pathMatch:"full"
    },
     {
        path:'editar',
        component: EditarPregunta,
        pathMatch:"full"
    },
     {
        path:'eliminar',
        component: EliminarPregunta,
        pathMatch:"full"
    }
];
