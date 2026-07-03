import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menuservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);

  listaMenus: any[] = [];
  menuForm = { m_nombre: '', m_descripcion: '', m_precio: 0 };
  mostrarFormulario = false;
  editando = false;
  idMenuSeleccionado: number | null = null;
  textoBusqueda: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 5;

  ngOnInit(): void {
    this.cargarMenus();
  }

  cargarMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.listaMenus = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar menús:', err),
    });
  }

  get menusFiltrados(): any[] {
    if (!this.textoBusqueda) {
      return this.listaMenus;
    }
    const busqueda = this.textoBusqueda.toLowerCase().trim();
    return this.listaMenus.filter(
      (menu) =>
        menu.m_nombre.toLowerCase().includes(busqueda) ||
        menu.m_descripcion.toLowerCase().includes(busqueda) ||
        menu.menu_id.toString().includes(busqueda),
    );
  }

  get menusPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.menusFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.menusFiltrados.length / this.registrosPorPagina) || 1;
  }

  resetearPaginacion(): void {
    this.paginaActual = 1;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  abrirFormularioNuevo(): void {
    this.editando = false;
    this.idMenuSeleccionado = null;
    this.menuForm = { m_nombre: '', m_descripcion: '', m_precio: 0 };
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  abrirFormularioEditar(menu: any): void {
    this.editando = true;
    this.idMenuSeleccionado = menu.menu_id;
    this.menuForm = { ...menu };
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  guardar(event: Event): void {
    event.preventDefault();
    if (this.editando && this.idMenuSeleccionado) {
      this.menuService.updateMenu(this.idMenuSeleccionado, this.menuForm).subscribe({
        next: () => {
          this.mostrarFormulario = false;
          this.cargarMenus();
          this.cdr.detectChanges();
          Swal.fire('Actualizado', 'El platillo se ha modificado correctamente.', 'success');
        },
        error: (err) =>
          Swal.fire('Error al actualizar', err.error?.error || 'Hubo un problema.', 'error'),
      });
    } else {
      this.menuService.createMenu(this.menuForm).subscribe({
        next: () => {
          this.mostrarFormulario = false;
          this.cargarMenus();
          this.cdr.detectChanges();
          Swal.fire('Creado', 'El nuevo platillo ha sido agregado al menú.', 'success');
        },
        error: (err) =>
          Swal.fire('Error al crear', err.error?.error || 'Hubo un problema.', 'error'),
      });
    }
  }

  eliminar(id: number): void {
    Swal.fire({
      title: 'Desactivar',
      text: 'El platillo se desactivará de la lista activa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.deleteMenu(id).subscribe({
          next: () => {
            this.cargarMenus();
            Swal.fire('Desactivado', 'El plato ha sido retirado con éxito.', 'success');
          },
          error: (err) =>
            Swal.fire('Error', err.error?.error || 'No se pudo desactivar el platillo.', 'error'),
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.cdr.detectChanges();
  }
}
