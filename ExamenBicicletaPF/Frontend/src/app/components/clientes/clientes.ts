import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ClienteService } from '../../services/clienteservice';
import { ICliente } from '../../interfaces/iclientes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css'],
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);
  private listaClientesCompleta: ICliente[] = [];
  public listaClientesFiltrada: ICliente[] = [];
  public clientesPaginados: ICliente[] = [];
  public buscador = new FormControl('');
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5; 
  public totalPaginas: number = 1;

  ngOnInit(): void {
    this.cargarClientes();
    this.configurarBuscadorReactivo();
  }

  // CARGAR CLIENTES
  cargarClientes(): void {
    this.clienteService.obtenerTodos().subscribe({
      next: (clientes) => {
        this.listaClientesCompleta = clientes;
        this.filtrarYCalcular();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los clientes: ' + err.message, 'error');
      },
    });
  }

  private configurarBuscadorReactivo(): void {
    this.buscador.valueChanges.subscribe((valor) => {
      this.paginaActual = 1; // Resetea a la primera página al buscar
      this.filtrarYCalcular(valor || '');
    });
  }

  private filtrarYCalcular(termino: string = this.buscador.value || ''): void {
    const busqueda = termino.toLowerCase().trim();

    this.listaClientesFiltrada = this.listaClientesCompleta.filter(
      (c) =>
        c.c_nombres.toLowerCase().includes(busqueda) ||
        c.c_documento.includes(busqueda) ||
        (c.c_email && c.c_email.toLowerCase().includes(busqueda)),
    );

    this.totalPaginas = Math.ceil(this.listaClientesFiltrada.length / this.itemsPorPagina) || 1;
    this.actualizarPagina();
  }

  private actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.clientesPaginados = this.listaClientesFiltrada.slice(inicio, fin);

    this.cdr.detectChanges(); 
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPagina();
    }
  }

  // NUEVO CLIENTE
  abrirModalCrear(): void {
    Swal.fire({
      title: 'Registrar Nuevo Cliente',
      html: `
        <input id="swal-nombres" class="swal2-input" placeholder="Nombres completos">
        <input id="swal-documento" class="swal2-input" placeholder="Documento / Cédula">
        <input id="swal-telefono" class="swal2-input" placeholder="Teléfono">
        <input id="swal-email" class="swal2-input" type="email" placeholder="Correo electrónico">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombres = (document.getElementById('swal-nombres') as HTMLInputElement).value;
        const documento = (document.getElementById('swal-documento') as HTMLInputElement).value;
        const telefono = (document.getElementById('swal-telefono') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;

        if (!nombres || !documento) {
          Swal.showValidationMessage('Los nombres y el documento son obligatorios');
          return false;
        }

        const existeEmail = this.listaClientesCompleta.some(
          (c) => c.c_email && c.c_email.toLowerCase() === email.toLowerCase(),
        );
        if (existeEmail) {
          Swal.showValidationMessage(
            'Este correo electrónico ya se encuentra registrado por otro cliente',
          );
          return false;
        }

        const existe = this.listaClientesCompleta.some((c) => c.c_documento === documento);
        if (existe) {
          Swal.showValidationMessage('Este número de documento ya está registrado y activo');
          return false;
        }

        const regexTelefono = /^[0-9]{10,15}$/;
        if (telefono && !regexTelefono.test(telefono)) {
          Swal.showValidationMessage(
            'El teléfono debe contener solo números (entre 10 y 15 dígitos)',
          );
          return false;
        }

        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !regexEmail.test(email)) {
          Swal.showValidationMessage(
            'El formato del correo electrónico no es válido (ejemplo@dominio.com)',
          );
          return false;
        }

        return { c_nombres: nombres, c_documento: documento, c_telefono: telefono, c_email: email };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.clienteService.crear(result.value as ICliente).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Cliente registrado correctamente.', 'success');
            this.cargarClientes();
          },
          error: (err) => Swal.fire('Error', err.message, 'error'),
        });
      }
    });
  }

  // EDITAR CLIENTE
  abrirModalEditar(cliente: ICliente): void {
    Swal.fire({
      title: 'Editar Cliente',
      html: `
        <input id="swal-edit-nombres" class="swal2-input" placeholder="Nombres" value="${cliente.c_nombres}">
        <input id="swal-edit-documento" class="swal2-input" placeholder="Documento" value="${cliente.c_documento}">
        <input id="swal-edit-telefono" class="swal2-input" placeholder="Teléfono" value="${cliente.c_telefono || ''}">
        <input id="swal-edit-email" class="swal2-input" type="email" placeholder="Email" value="${cliente.c_email || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombres = (document.getElementById('swal-edit-nombres') as HTMLInputElement).value;
        const documento = (document.getElementById('swal-edit-documento') as HTMLInputElement)
          .value;
        const telefono = (document.getElementById('swal-edit-telefono') as HTMLInputElement).value;
        const email = (document.getElementById('swal-edit-email') as HTMLInputElement).value;

        if (!nombres || !documento) {
          Swal.showValidationMessage('Los nombres y el documento son obligatorios');
          return false;
        }

        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !regexEmail.test(email)) {
          Swal.showValidationMessage(
            'El formato del correo electrónico no es válido (ejemplo@dominio.com)',
          );
          return false;
        }

        const existeEmail = this.listaClientesCompleta.some(
          (c) =>
            c.c_email &&
            c.c_email.toLowerCase() === email.toLowerCase() &&
            c.cliente_id !== cliente.cliente_id,
        );
        if (existeEmail) {
          Swal.showValidationMessage('Este correo electrónico ya pertenece a otro cliente activo');
          return false;
        }

        const regexTelefono = /^[0-9]{10,15}$/;
        if (telefono && !regexTelefono.test(telefono)) {
          Swal.showValidationMessage(
            'El teléfono debe contener solo números (entre 10 y 15 dígitos)',
          );
          return false;
        }

        const existe = this.listaClientesCompleta.some(
          (c) => c.c_documento === documento && c.cliente_id !== cliente.cliente_id,
        );
        if (existe) {
          Swal.showValidationMessage('Este número de documento ya pertenece a otro cliente activo');
          return false;
        }

        return { c_nombres: nombres, c_documento: documento, c_telefono: telefono, c_email: email };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value && cliente.cliente_id) {
        this.clienteService.actualizar(cliente.cliente_id, result.value as ICliente).subscribe({
          next: () => {
            Swal.fire('¡Actualizado!', 'Los datos han sido modificados.', 'success');
            this.cargarClientes();
          },
          error: (err) => Swal.fire('Error', err.message, 'error'),
        });
      }
    });
  }

  // DESACTIVAR CLIENTE
  eliminarCliente(id: number | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El cliente será deshabilitado del sistema pero se conservará su historial.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.desactivar(id).subscribe({
          next: () => {
            Swal.fire('Deshabilitado', 'El cliente ha sido dado de baja.', 'success');
            this.cargarClientes();
          },
          error: (err) => Swal.fire('Error', err.message, 'error'),
        });
      }
    });
  }
}
