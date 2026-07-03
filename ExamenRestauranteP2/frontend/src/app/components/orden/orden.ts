import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../services/ordenservice';
import { ClienteService } from '../../services/clienteservice';
import { MenuService } from '../../services/menuservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.html',
  styleUrls: ['./orden.css'],
})
export class OrdenComponent implements OnInit {
  private ordenService = inject(OrdenService);
  private clienteService = inject(ClienteService);
  private menuService = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);

  listaOrdenes: any[] = [];
  listaClientes: any[] = [];
  listaMenus: any[] = [];
  mostrarFormulario = false;
  clienteSeleccionado: number | null = null;
  articulosCarrito: any[] = [];
  totalOrden: number = 0;
  textoBusqueda: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 5;

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.cargarOrdenes();

    this.clienteService.getClientes().subscribe((data) => {
      this.listaClientes = data;
    });

    this.menuService.getMenus().subscribe((data) => {
      this.listaMenus = data;
    });
  }

  cargarOrdenes(): void {
    this.ordenService.getOrdenes().subscribe({
      next: (data) => {
        this.listaOrdenes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar órdenes:', err),
    });
  }

  get ordenesFiltradas(): any[] {
    const ordenesConCliente = this.listaOrdenes.map((orden) => {
      const cliente = this.listaClientes.find((c) => c.cliente_id === orden.cliente_id);
      return {
        ...orden,
        c_nombre: cliente ? cliente.c_nombre : 'Desconocido',
        c_apellido: cliente ? cliente.c_apellido : '',
      };
    });

    if (!this.textoBusqueda) return ordenesConCliente;

    const busqueda = this.textoBusqueda.toLowerCase().trim();

    return ordenesConCliente.filter(
      (o) =>
        o.orden_id.toString().includes(busqueda) ||
        o.o_estado.toLowerCase().includes(busqueda) ||
        o.c_nombre.toLowerCase().includes(busqueda) ||
        o.c_apellido.toLowerCase().includes(busqueda),
    );
  }

  get ordenesPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.ordenesFiltradas.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ordenesFiltradas.length / this.registrosPorPagina) || 1;
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

  abrirNuevaOrden(): void {
    this.clienteSeleccionado = null;
    this.articulosCarrito = [];
    this.totalOrden = 0;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  agregarAlCarrito(menu: any): void {
    const itemExistente = this.articulosCarrito.find((item) => item.menu_id === menu.menu_id);

    if (itemExistente) {
      itemExistente.d_cantidad++;
    } else {
      this.articulosCarrito.push({
        menu_id: menu.menu_id,
        nombre: menu.m_nombre,
        m_precio: menu.m_precio,
        d_cantidad: 1,
      });
    }
    this.calcularTotal();
  }

  removerDelCarrito(index: number): void {
    this.articulosCarrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.totalOrden = this.articulosCarrito.reduce(
      (acc, item) => acc + item.m_precio * item.d_cantidad,
      0,
    );
  }

  guardarOrden(): void {
    if (!this.clienteSeleccionado || this.articulosCarrito.length === 0) {
      Swal.fire('Atención', 'Debes seleccionar un cliente y agregar al menos un plato.', 'warning');
      return;
    }

    const nuevaOrden = {
      cliente_id: Number(this.clienteSeleccionado),
      articulos: this.articulosCarrito.map((item) => ({
        menu_id: item.menu_id,
        d_cantidad: item.d_cantidad,
        d_precio_unitario: item.m_precio,
      })),
    };

    this.ordenService.createOrden(nuevaOrden).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.listaOrdenes = [];
        this.cargarOrdenes();
        Swal.fire('¡Éxito!', 'La orden se ha registrado correctamente.', 'success');
      },
      error: (err) =>
        Swal.fire('Error', err.error?.error || 'No se pudo registrar la orden.', 'error'),
    });
  }

  cambiarEstado(ordenId: number, nuevoEstado: string): void {
    this.ordenService.updateEstado(ordenId, nuevoEstado).subscribe({
      next: () => {
        this.listaOrdenes = [];
        this.cargarOrdenes();
        Swal.fire('Actualizado', `La orden ahora está: ${nuevoEstado}`, 'success');
      },
      error: (err) =>
        Swal.fire('Error', err.error?.error || 'No se pudo cambiar el estado.', 'error'),
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
