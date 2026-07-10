import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'alquileres',
    pathMatch: 'full',
  },

  // ALQUILERES
  {
    path: 'alquileres',
    loadComponent: () =>
      import('./components/alquileres/alquileres').then((m) => m.AlquileresComponent),
  },

  // CLIENTES
  {
    path: 'clientes',
    loadComponent: () => import('./components/clientes/clientes').then((m) => m.ClientesComponent),
  },

  // ESTACIONES
  {
    path: 'estaciones',
    loadComponent: () =>
      import('./components/estaciones/estaciones').then((m) => m.EstacionesComponent),
  },

  // BICICLETAS
  {
    path: 'bicicletas',
    loadComponent: () =>
      import('./components/bicicletas/bicicletas').then((m) => m.BicicletasComponent),
  },

  {
    path: '**',
    redirectTo: 'alquileres',
  },
];
