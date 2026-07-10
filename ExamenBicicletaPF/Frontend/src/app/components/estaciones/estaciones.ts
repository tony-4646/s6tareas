import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { EstacionService } from '../../services/estacionservice';
import { BicicletaService } from '../../services/bicicletaservice';
import { IEstacion } from '../../interfaces/iestaciones';
import { IBicicleta } from '../../interfaces/ibicicletas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './estaciones.html',
  styleUrls: ['./estaciones.css'],
})
export class EstacionesComponent implements OnInit {
  private estacionService = inject(EstacionService);
  private bicicletaService = inject(BicicletaService);
  private cdr = inject(ChangeDetectorRef);
  private listaEstacionesCompleta: IEstacion[] = [];
  public listaEstacionesFiltrada: IEstacion[] = [];
  public estacionesPaginadas: IEstacion[] = [];
  private listaBicicletasCompleta: IBicicleta[] = [];
  public buscador = new FormControl('');
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5;
  public totalPaginas: number = 1;

  ngOnInit(): void {
    this.cargarEstaciones();
    this.cargarBicicletas();
    this.configurarBuscadorReactivo();
  }

  // OBTENER ESTACIONES
  cargarEstaciones(): void {
    this.estacionService.obtenerTodas().subscribe({
      next: (estaciones) => {
        this.listaEstacionesCompleta = estaciones;
        this.filtrarYCalcular();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar las estaciones: ' + err.message, 'error');
      },
    });
  }

  // CARGAR BICICLETAS
  cargarBicicletas(): void {
    this.bicicletaService.obtenerTodas().subscribe({
      next: (bicis) => {
        this.listaBicicletasCompleta = bicis;
      },
      error: (err) => console.error('Error silencioso al sincronizar inventario:', err),
    });
  }

  private configurarBuscadorReactivo(): void {
    this.buscador.valueChanges.subscribe((valor) => {
      this.paginaActual = 1;
      this.filtrarYCalcular(valor || '');
    });
  }

  private filtrarYCalcular(termino: string = this.buscador.value || ''): void {
    const busqueda = termino.toLowerCase().trim();

    this.listaEstacionesFiltrada = this.listaEstacionesCompleta.filter(
      (e) =>
        e.e_nombre.toLowerCase().includes(busqueda) ||
        e.e_ciudad.toLowerCase().includes(busqueda) ||
        e.e_direccion.toLowerCase().includes(busqueda),
    );

    this.totalPaginas = Math.ceil(this.listaEstacionesFiltrada.length / this.itemsPorPagina) || 1;
    this.actualizarPagina();
  }

  private actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.estacionesPaginadas = this.listaEstacionesFiltrada.slice(inicio, fin);
    this.cdr.detectChanges();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPagina();
    }
  }

  // NUEVA ESTACION
  abrirModalCrear(): void {
    Swal.fire({
      title: 'Registrar Nueva Estación',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre de la estación">
        <input id="swal-direccion" class="swal2-input" placeholder="Dirección">
        <input id="swal-capacidad" class="swal2-input" type="number" min="5" max="25" placeholder="Capacidad (5 - 25 slots)">
        <input id="swal-ciudad" class="swal2-input" placeholder="Ciudad">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
        const direccion = (
          document.getElementById('swal-direccion') as HTMLInputElement
        ).value.trim();
        const capacidad = parseInt(
          (document.getElementById('swal-capacidad') as HTMLInputElement).value,
          10,
        );
        const city = (document.getElementById('swal-ciudad') as HTMLInputElement).value.trim();

        if (!nombre || !direccion || !city || isNaN(capacidad)) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        if (capacidad < 5 || capacidad > 25) {
          Swal.showValidationMessage('La capacidad debe estar entre 5 y 25 espacios máximo');
          return false;
        }

        const existe = this.listaEstacionesCompleta.some(
          (e) => e.e_nombre.toLowerCase() === nombre.toLowerCase(),
        );
        if (existe) {
          Swal.showValidationMessage('Ya existe una estación registrada con ese nombre');
          return false;
        }

        return { e_nombre: nombre, e_direccion: direccion, e_capacidad: capacidad, e_ciudad: city };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.estacionService.crear(result.value as IEstacion).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Estación creada correctamente.', 'success');
            this.cargarEstaciones();
          },
          error: (err) => Swal.fire('Error', err.message, 'error'),
        });
      }
    });
  }

  // EDITAR ESTACION
  abrirModalEditar(estacion: IEstacion): void {
    if (!estacion.estacion_id) return;

    const bicisActualesEnPunto = this.listaBicicletasCompleta.filter(
      (b) => b.estacion_id === estacion.estacion_id && b.b_estado === 'en_estacion',
    ).length;

    Swal.fire({
      title: 'Modificar Datos de la Estación',
      html: `
        <label style="display:block; text-align:left; margin-left:10%; font-weight:600; margin-top:10px;">Nombre de Estación:</label>
        <input id="swal-edit-nombre" class="swal2-input" style="margin-top:5px;" value="${estacion.e_nombre}">
        
        <label style="display:block; text-align:left; margin-left:10%; font-weight:600; margin-top:10px;">Dirección:</label>
        <input id="swal-edit-direccion" class="swal2-input" style="margin-top:5px;" value="${estacion.e_direccion}">
        
        <label style="display:block; text-align:left; margin-left:10%; font-weight:600; margin-top:10px;">Capacidad Máxima:</label>
        <input id="swal-edit-capacidad" class="swal2-input" type="number" style="margin-top:5px;" value="${estacion.e_capacidad}">
        <small style="display:block; color:#777; margin-top:2px;">Bicicletas en este punto actualmente: <b>${bicisActualesEnPunto}</b></small>
        
        <label style="display:block; text-align:left; margin-left:10%; font-weight:600; margin-top:10px;">Ciudad:</label>
        <input id="swal-edit-ciudad" class="swal2-input" style="margin-top:5px;" value="${estacion.e_ciudad}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (
          document.getElementById('swal-edit-nombre') as HTMLInputElement
        ).value.trim();
        const direccion = (
          document.getElementById('swal-edit-direccion') as HTMLInputElement
        ).value.trim();
        const capacidad = parseInt(
          (document.getElementById('swal-edit-capacidad') as HTMLInputElement).value,
          10,
        );
        const ciudad = (
          document.getElementById('swal-edit-ciudad') as HTMLInputElement
        ).value.trim();

        if (!nombre || !direccion || !ciudad || isNaN(capacidad)) {
          Swal.showValidationMessage('Todos los campos son obligatorios.');
          return false;
        }

        if (capacidad < 5 || capacidad > 25) {
          Swal.showValidationMessage(
            'La capacidad permitida por el sistema debe oscilar entre 5 y 25 slots.',
          );
          return false;
        }

        const duplicado = this.listaEstacionesCompleta.some(
          (e) =>
            e.e_nombre.toLowerCase() === nombre.toLowerCase() &&
            e.estacion_id !== estacion.estacion_id,
        );
        if (duplicado) {
          Swal.showValidationMessage('Ya existe otra estación registrada con este nombre.');
          return false;
        }

        if (capacidad < bicisActualesEnPunto) {
          Swal.showValidationMessage(
            `Imposible reducir capacidad: La estación cuenta actualmente con ${bicisActualesEnPunto} bicicletas físicas resguardadas.`,
          );
          return false;
        }

        return {
          estacion_id: estacion.estacion_id,
          e_nombre: nombre,
          e_direccion: direccion,
          e_capacidad: capacidad,
          e_ciudad: ciudad,
          e_disponible: estacion.e_disponible,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.estacionService
          .actualizar(estacion.estacion_id!, result.value as IEstacion)
          .subscribe({
            next: () => {
              Swal.fire(
                '¡Actualizado!',
                'Los datos de la estación fueron modificados con éxito.',
                'success',
              );
              this.cargarEstaciones();
              this.cargarBicicletas();
            },
            error: (err) => Swal.fire('Error', 'No se pudo actualizar: ' + err.message, 'error'),
          });
      }
    });
  }

  // DESHABILITAR ESTACIÓN
  eliminarEstacion(idOrigen: number | undefined): void {
    if (!idOrigen) return;

    const opcionesSustitutas = this.listaEstacionesCompleta.filter(
      (e) => e.estacion_id !== idOrigen,
    );

    if (opcionesSustitutas.length === 0) {
      Swal.fire(
        'Operación No Permitida',
        'No puedes deshabilitar esta estación porque debe existir al menos otra estación activa en el sistema.',
        'warning',
      );
      return;
    }

    let selectOptionsHtml = '';
    opcionesSustitutas.forEach((e) => {
      selectOptionsHtml += `<option value="${e.estacion_id}">${e.e_nombre} (Capacidad: ${e.e_capacidad})</option>`;
    });

    Swal.fire({
      title: '¿Deshabilitar Estación?',
      text: 'Para proceder, debes elegir a qué estación activa se transferirán todas las bicicletas que se encuentran actualmente en este punto.',
      icon: 'warning',
      html: `
        <p style="margin-bottom: 10px; font-size: 0.95rem; color: #555;">Selecciona la estación de destino:</p>
        <select id="swal-select-destino" class="swal2-input" style="width: 80%; margin-top: 0;">
          ${selectOptionsHtml}
        </select>
      `,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirmar Cierre',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const idDestino = parseInt(
          (document.getElementById('swal-select-destino') as HTMLSelectElement).value,
          10,
        );
        if (isNaN(idDestino)) {
          Swal.showValidationMessage('Debes seleccionar una estación válida.');
          return false;
        }
        return idDestino;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const idDestino = result.value;
        this.estacionService.desactivar(idOrigen, idDestino).subscribe({
          next: (res) => {
            Swal.fire('Estación Cerrada', res.mensaje, 'success');
            this.cargarEstaciones();
            this.cargarBicicletas();
          },
          error: (err) => {
            let mensajeExplicativo = 'Error desconocido al intentar deshabilitar.';
            if (err.error && err.error.error) {
              mensajeExplicativo = err.error.error;
            } else if (err.message) {
              mensajeExplicativo = err.message;
            }
            Swal.fire({
              title: 'No se pudo deshabilitar',
              text: mensajeExplicativo,
              icon: 'error',
              confirmButtonText: 'Entendido',
            });
          },
        });
      }
    });
  }
}
