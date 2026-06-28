import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Eventoservice } from '../eventoservice';
import { Ieventos } from '../ieventos';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editarevento.html',
  styleUrls: ['./editarevento.css'],
})
export class EditarEvento implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventoServicio = inject(Eventoservice);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  eventoId!: number;

  formEvento: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventoId = +idParam;
      this.cargarDatosEvento();
    } else {
      this.router.navigate(['/eventos']);
    }
  }

  cargarDatosEvento(): void {
    this.eventoServicio.uno(this.eventoId).subscribe({
      next: (evento) => {
        this.formEvento.patchValue({
          nombre: evento.nombre,
          descripcion: evento.descripcion,
        });
      },
      error: (err) => {
        console.error('Error al cargar el evento:', err);
        alert('No se pudo encontrar el evento');
        this.router.navigate(['/eventos']);
      },
    });
  }

  actualizarEvento(): void {
    if (this.formEvento.invalid) {
      this.formEvento.markAllAsTouched();
      return;
    }

    const eventoActualizado: Ieventos = {
      id: this.eventoId,
      nombre: this.formEvento.value.nombre,
      descripcion: this.formEvento.value.descripcion,
    };

    this.eventoServicio.actualizar(this.eventoId, eventoActualizado).subscribe({
      next: () => {
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        console.error('Error al actualizar el evento:', err);
        alert('Ocurrió un error al intentar guardar los cambios.');
      },
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.formEvento.get(campo);
    return !!(control && control.errors && control.touched);
  }
}
