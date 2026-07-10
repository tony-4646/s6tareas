import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AlquilerService } from '../../services/alquilerservice';
import { ClienteService } from '../../services/clienteservice';
import { BicicletaService } from '../../services/bicicletaservice';
import { EstacionService } from '../../services/estacionservice';
import { IAlquiler } from '../../interfaces/ialquileres';
import { ICliente } from '../../interfaces/iclientes';
import { IBicicleta } from '../../interfaces/ibicicletas';
import { IEstacion } from '../../interfaces/iestaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alquileres',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './alquileres.html',
  styleUrls: ['./alquileres.css'],
})
export class AlquileresComponent implements OnInit {
  private alquilerService = inject(AlquilerService);
  private clienteService = inject(ClienteService);
  private bicicletaService = inject(BicicletaService);
  private estacionService = inject(EstacionService);
  private cdr = inject(ChangeDetectorRef);

  // Arreglos de datos principales e auxiliares
  private historialCompleto: IAlquiler[] = [];
  public historialFiltrado: IAlquiler[] = [];
  public alquileresPaginados: IAlquiler[] = [];

  private clientesActivos: ICliente[] = [];
  private bicicletasActivas: IBicicleta[] = [];
  private estacionesActivas: IEstacion[] = [];

  // Buscador y paginación
  public buscador = new FormControl('');
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5;
  public totalPaginas: number = 1;

  ngOnInit(): void {
    this.cargarHistorial();
    this.cargarDatosAuxiliares();
    this.configurarBuscadorReactivo();
  }

  // CARGA HISTORIAL
  cargarHistorial(): void {
    this.alquilerService.obtenerTodos().subscribe({
      next: (datos) => {
        this.historialCompleto = datos;
        this.filtrarYCalcular();
      },
      error: (err) => Swal.fire('Error', 'No se pudo cargar el historial: ' + err.message, 'error'),
    });
  }

  // CARGA DATOS
  cargarDatosAuxiliares(): void {
    this.clienteService.obtenerTodos().subscribe((c) => (this.clientesActivos = c));
    this.bicicletaService.obtenerTodas().subscribe((b) => (this.bicicletasActivas = b));
    this.estacionService.obtenerTodas().subscribe((e) => (this.estacionesActivas = e));
  }

  private configurarBuscadorReactivo(): void {
    this.buscador.valueChanges.subscribe((valor) => {
      this.paginaActual = 1;
      this.filtrarYCalcular(valor || '');
    });
  }

  private filtrarYCalcular(termino: string = this.buscador.value || ''): void {
    const busqueda = termino.toLowerCase().trim();

    this.historialFiltrado = this.historialCompleto.filter(
      (a) =>
        (a.cliente_nombre && a.cliente_nombre.toLowerCase().includes(busqueda)) ||
        (a.bicicleta_codigo && a.bicicleta_codigo.toLowerCase().includes(busqueda)),
    );

    this.totalPaginas = Math.ceil(this.historialFiltrado.length / this.itemsPorPagina) || 1;
    this.actualizarPagina();
  }

  private actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.alquileresPaginados = this.historialFiltrado.slice(inicio, fin);
    this.cdr.detectChanges();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPagina();
    }
  }

  // NUEVO ALQUILER
  abrirModalAlquilar(): void {
    const bicisDisponibles = this.bicicletasActivas.filter((b) => b.b_estado === 'en_estacion');

    if (this.clientesActivos.length === 0 || bicisDisponibles.length === 0) {
      Swal.fire(
        'Atención',
        'Se necesitan clientes activos y al menos una bicicleta en estación disponible para iniciar.',
        'warning',
      );
      return;
    }

    let clientesHtml = '';
    this.clientesActivos.forEach(
      (c) =>
        (clientesHtml += `<option value="${c.cliente_id}">${c.c_nombres} (${c.c_documento})</option>`),
    );

    let bicisHtml = '';
    bicisDisponibles.forEach(
      (b) =>
        (bicisHtml += `<option value="${b.bicicleta_id}">${b.b_codigo} - [${b.estacion_nombre}]</option>`),
    );

    Swal.fire({
      title: 'Despachar Alquiler de Bicicleta',
      html: `
        <label style="display:block; text-align:left; margin-top:10px; font-weight:600;">Seleccione el Cliente:</label>
        <select id="swal-alq-cliente" class="swal2-input" style="margin-top:5px;">${clientesHtml}</select>
        
        <label style="display:block; text-align:left; margin-top:15px; font-weight:600;">Seleccione la Bicicleta:</label>
        <select id="swal-alq-bici" class="swal2-input" style="margin-top:5px;">${bicisHtml}</select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Iniciar Viaje',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const clienteId = parseInt(
          (document.getElementById('swal-alq-cliente') as HTMLSelectElement).value,
          10,
        );
        const bicicletaId = parseInt(
          (document.getElementById('swal-alq-bici') as HTMLSelectElement).value,
          10,
        );

        const rentasActivas = this.historialCompleto.filter(
          (alquiler) => alquiler.cliente_id === clienteId && !alquiler.a_fin,
        ).length;

        if (rentasActivas >= 3) {
          Swal.showValidationMessage(
            `Límite excedido: Este cliente ya posee ${rentasActivas} alquileres en curso en este periodo.`,
          );
          return false; 
        }

        return { cliente_id: clienteId, bicicleta_id: bicicletaId };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.alquilerService
          .comenzar(result.value.cliente_id, result.value.bicicleta_id)
          .subscribe({
            next: () => {
              Swal.fire(
                '¡Viaje Iniciado!',
                'El alquiler quedó registrado y la bicicleta cambió a estado ocupada.',
                'success',
              );
              this.cargarHistorial();
              this.bicicletaService.obtenerTodas().subscribe((b) => (this.bicicletasActivas = b)); // Refrescar catálogo local de bicis
            },
            error: (err) => Swal.fire('Error', err.message, 'error'),
          });
      }
    });
  }

  // DEVOLVER BICICLETA
  abrirModalDevolucion(alquilerId: number | undefined): void {
    if (!alquilerId) return;

    let estacionesHtml = '';
    this.estacionesActivas.forEach(
      (e) => (estacionesHtml += `<option value="${e.estacion_id}">${e.e_nombre}</option>`),
    );

    Swal.fire({
      title: 'Registrar Devolución',
      text: 'Indique en qué estación se está entregando la bicicleta en este momento:',
      html: `
        <select id="swal-dev-estacion" class="swal2-input" style="width:80%;">${estacionesHtml}</select>
      `,
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      confirmButtonText: 'Confirmar Recepción',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return parseInt(
          (document.getElementById('swal-dev-estacion') as HTMLSelectElement).value,
          10,
        );
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.alquilerService.terminar(alquilerId, result.value).subscribe({
          next: () => {
            Swal.fire(
              'Completado',
              'La bicicleta ha regresado a la estación y el alquiler ha concluido.',
              'success',
            );
            this.cargarHistorial();
            this.bicicletaService.obtenerTodas().subscribe((b) => (this.bicicletasActivas = b)); // Sincronizar catálogo
          },
          error: (err) => Swal.fire('Error', err.message, 'error'),
        });
      }
    });
  }

  formatearFecha(fechaStr: string | Date | undefined | null): string {
    if (!fechaStr) return '--- (En Curso) ---';
    const f = new Date(fechaStr);
    return f.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
