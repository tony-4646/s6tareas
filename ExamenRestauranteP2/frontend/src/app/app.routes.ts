import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu';
import { ClienteComponent } from './components/cliente/cliente';
import { OrdenComponent } from './components/orden/orden';

export const routes: Routes = [
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' },
  { path: 'menus', component: MenuComponent },
  { path: 'clientes', component: ClienteComponent },
  { path: 'ordenes', component: OrdenComponent },
  { path: '**', redirectTo: 'ordenes' },
];
