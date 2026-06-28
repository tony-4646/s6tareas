import { Routes } from '@angular/router';
import { Eventos } from './eventos/eventos';
import { NuevoEvento } from './nuevoevento/nuevoevento';
import { EditarEvento } from './editarevento/editarevento';

export const routes: Routes = [
        {
        path:'',
        component:Eventos,
        pathMatch:'full'
    },
     {
        path:'eventos',
        component:Eventos,
        pathMatch:'full'
    },
    {
        path: 'nuevoevento',
        component:NuevoEvento,
        pathMatch:'full'
    },
    {
        path: 'editarevento/:id',
        component:EditarEvento,
        pathMatch: 'full'
    }
];
