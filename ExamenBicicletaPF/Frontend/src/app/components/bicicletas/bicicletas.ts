import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BicicletaService } from '../../services/bicicletaservice';
import { EstacionService } from '../../services/estacionservice';
import { IBicicleta } from '../../interfaces/ibicicletas';
import { IEstacion } from '../../interfaces/iestaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bicicletas.html',
  styleUrls: ['./bicicletas.css'],
})
export class BicicletasComponent implements OnInit {
  private bicicletaService = inject(BicicletaService);
  private estacionService = inject(EstacionService);
  private cdr = inject(ChangeDetectorRef);
  private listaBicicletasCompleta: IBicicleta[] = [];
  public listaBicicletasFiltrada: IBicicleta[] = [];
  public bicicletasPaginadas: IBicicleta[] = [];
  private listaEstacionesActivas: IEstacion[] = [];
  public buscador = new FormControl('');
  public paginaActual: number = 1;
  public itemsPorPagina: number = 5;
  public totalPaginas: number = 1;

  ngOnInit(): void {
    this.cargarBicicletas();
    this.cargarEstacionesAuxiliares();
    this.configurarBuscadorReactivo();
  }

  // CARGA BICICLETAS
  cargarBicicletas(): void {
    this.bicicletaService.obtenerTodas().subscribe({
      next: (bicis) => {
        this.listaBicicletasCompleta = bicis;
        this.filtrarYCalcular();
      },
      error: (err) => Swal.fire('Error', 'No se pudieron cargar las bicicletas: ' + err.message, 'error')
    });
  }

  // CARGA ESTACIONES
  private cargarEstacionesAuxiliares(): void {
    this.estacionService.obtenerTodas().subscribe({
      next: (estaciones) => this.listaEstacionesActivas = estaciones,
      error: (err) => console.error('Error cargando estaciones auxiliares', err)
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

    this.listaBicicletasFiltrada = this.listaBicicletasCompleta.filter((b) =>
      b.b_codigo.toLowerCase().includes(busqueda) ||
      b.b_tipo.toLowerCase().includes(busqueda) ||
      (b.estacion_nombre && b.estacion_nombre.toLowerCase().includes(busqueda)) ||
      (b.b_estado && b.b_estado.toLowerCase().includes(busqueda))
    );

    this.totalPaginas = Math.ceil(this.listaBicicletasFiltrada.length / this.itemsPorPagina) || 1;
    this.actualizarPagina();
  }

  private actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.bicicletasPaginadas = this.listaBicicletasFiltrada.slice(inicio, fin);
    this.cdr.detectChanges();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPagina();
    }
  }

  // CREAR NUEVA BICICLETA
  abrirModalCrear(): void {
    if (this.listaEstacionesActivas.length === 0) {
      Swal.fire('Atención', 'Debes registrar al menos una estación activa antes de añadir bicicletas.', 'warning');
      return;
    }
    let estacionesHtml = '';
    this.listaEstacionesActivas.forEach(e => {
      estacionesHtml += `<option value="${e.estacion_id}">${e.e_nombre} (Capacidad: ${e.e_capacidad})</option>`;
    });

    Swal.fire({
      title: 'Registrar Nueva Bicicleta',
      html: `
        <input id="swal-bici-codigo" class="swal2-input" placeholder="Código (Ej: B-102)" style="text-transform: uppercase;">
        <select id="swal-bici-tipo" class="swal2-input">
          <option value="un_asiento">Un Asiento</option>
          <option value="dos_asientos">Dos Asientos (Tándem)</option>
          <option value="off_road">Off-Road (Montaña)</option>
          <option value="electrica">Eléctrica</option>
        </select>
        <select id="swal-bici-estacion" class="swal2-input">
          ${estacionesHtml}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const codigo = (document.getElementById('swal-bici-codigo') as HTMLInputElement).value.toUpperCase().trim();
        const tipo = (document.getElementById('swal-bici-tipo') as HTMLSelectElement).value;
        const estacionId = parseInt((document.getElementById('swal-bici-estacion') as HTMLSelectElement).value, 10);

        if (!codigo) {
          Swal.showValidationMessage('El código de la bicicleta es requerido');
          return false;
        }

        const existeCodigo = this.listaBicicletasCompleta.some(b => b.b_codigo.toUpperCase() === codigo);
        if (existeCodigo) {
          Swal.showValidationMessage('Este código de bicicleta ya se encuentra registrado');
          return false;
        }

        const estacionSeleccionada = this.listaEstacionesActivas.find(e => e.estacion_id === estacionId);
        if (estacionSeleccionada) {
          const bicisActualesEnEstacion = this.listaBicicletasCompleta.filter(
            b => b.estacion_id === estacionId && b.b_estado === 'en_estacion'
          ).length;
          if (bicisActualesEnEstacion >= estacionSeleccionada.e_capacidad) {
            Swal.showValidationMessage(
              `¡Estación Llena! ${estacionSeleccionada.e_nombre} llegó a su límite (${bicisActualesEnEstacion}/${estacionSeleccionada.e_capacidad} slots ocupados)`
            );
            return false;
          }
        }

        return { b_codigo: codigo, b_tipo: tipo, estacion_id: estacionId, b_estado: 'en_estacion' };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.bicicletaService.crear(result.value as IBicicleta).subscribe({
          next: () => {
            Swal.fire('¡Añadida!', 'Bicicleta agregada a la flotilla con éxito.', 'success');
            this.cargarBicicletas();
          },
          error: (err) => Swal.fire('Error', err.message, 'error')
        });
      }
    });
  }

  // DESHABILITAR
  eliminarBicicleta(id: number | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Dar de baja bicicleta?',
      text: 'La bicicleta saldrá de circulación y liberará su slot de la estación, pero su historial de rentas se mantendrá intacto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, retirar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bicicletaService.desactivar(id).subscribe({
          next: () => {
            Swal.fire('Retirada', 'Bicicleta dada de baja correctamente.', 'success');
            this.cargarBicicletas();
          },
          error: (err) => Swal.fire('Error', err.message, 'error')
        });
      }
    });
  }
}