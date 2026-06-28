import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Eventoservice } from '../eventoservice';
import { Ieventos } from '../ieventos';

@Component({
  selector: 'app-nuevo-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './nuevoevento.html',
  styleUrls: ['./nuevoevento.css']
})
export class NuevoEvento {
  private readonly fb = inject(FormBuilder);
  private readonly eventoServicio = inject(Eventoservice);
  private readonly router = inject(Router);
  formEvento: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]]
  });


  guardarEvento(): void {
    if (this.formEvento.invalid) {
      this.formEvento.markAllAsTouched(); 
      return;
    }
    const nuevoEvento: Ieventos = {
      nombre: this.formEvento.value.nombre,
      descripcion: this.formEvento.value.descripcion
    };
    this.eventoServicio.nuevo(nuevoEvento).subscribe({
      next: () => {
        this.router.navigate(['/eventos']); 
      },
      error: (err) => {
        console.error('Error al crear el evento:', err);
        alert('Hubo un error al intentar guardar el evento...');
      }
    });
  }
  esCampoInvalido(campo: string): boolean {
    const control = this.formEvento.get(campo);
    return !!(control && control.errors && control.touched);
  }
}