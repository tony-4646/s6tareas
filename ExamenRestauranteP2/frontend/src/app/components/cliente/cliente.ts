import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/clienteservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})
export class ClienteComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  listaClientes: any[] = [];
  clienteForm = {
    c_nombre: '',
    c_apellido: '',
    c_email: '',
    c_telefono: '',
  };

  mostrarFormulario = false;
  editando = false;
  idClienteSeleccionado: number | null = null;
  textoBusqueda: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 5;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar clientes:', err),
    });
  }

  get clientesFiltrados(): any[] {
    if (!this.textoBusqueda) return this.listaClientes;
    const busqueda = this.textoBusqueda.toLowerCase().trim();
    return this.listaClientes.filter(
      (c) =>
        c.c_nombre.toLowerCase().includes(busqueda) ||
        (c.c_apellido && c.c_apellido.toLowerCase().includes(busqueda)) ||
        (c.c_email && c.c_email.toLowerCase().includes(busqueda)) ||
        c.cliente_id.toString().includes(busqueda),
    );
  }

  get clientesPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.clientesFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.registrosPorPagina) || 1;
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
    this.idClienteSeleccionado = null;
    this.clienteForm = { c_nombre: '', c_apellido: '', c_email: '', c_telefono: '' };
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  abrirFormularioEditar(cliente: any): void {
    this.editando = true;
    this.idClienteSeleccionado = cliente.cliente_id;

    this.clienteForm = {
      c_nombre: cliente.c_nombre,
      c_apellido: cliente.c_apellido,
      c_email: cliente.c_email,
      c_telefono: cliente.c_telefono,
    };

    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  guardar(event: Event): void {
    event.preventDefault();

    if (this.editando && this.idClienteSeleccionado) {
      this.clienteService.updateCliente(this.idClienteSeleccionado, this.clienteForm).subscribe({
        next: () => {
          this.mostrarFormulario = false;
          this.cargarClientes();
          this.cdr.detectChanges();
          Swal.fire('Actualizado', 'Los datos del cliente se han modificado.', 'success');
        },
        error: (err) => Swal.fire('Error', err.error?.error || 'No se pudo actualizar.', 'error'),
      });
    } else {
      this.clienteService.createCliente(this.clienteForm).subscribe({
        next: () => {
          this.mostrarFormulario = false;
          this.cargarClientes();
          this.cdr.detectChanges();
          Swal.fire('Registrado', 'El cliente ha sido guardado con éxito.', 'success');
        },
        error: (err) =>
          Swal.fire('Error al registrar', err.error?.error || '¿Correo duplicado?', 'error'),
      });
    }
  }

  eliminar(id: number): void {
    Swal.fire({
      title: 'Desactivar',
      text: 'El cliente pasará a estar inactivo en el sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe({
          next: () => {
            this.cargarClientes();
            Swal.fire(
              'Desactivado',
              'El cliente ha sido removido de las listas activas.',
              'success',
            );
          },
          error: (err) => Swal.fire('Error', err.error?.error || 'No se pudo desactivar.', 'error'),
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.cdr.detectChanges();
  }
}
