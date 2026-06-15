import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PreguntasServices } from '../../services/preguntas.services';
import { IPregunta } from '../../interfaces/ipregunta';

@Component({
  selector: 'app-editar-pregunta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-pregunta.html',
  styleUrl: './editar-pregunta.css'
})
export class EditarPregunta implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly preguntasServicio = inject(PreguntasServices);

  formularioEditar!: FormGroup;
  preguntaId!: number;

  ngOnInit(): void {
    this.formularioEditar = this.fb.group({
      enunciado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      orden: [0, [Validators.required, Validators.min(1)]],
      peso: [0, [Validators.required, Validators.min(1)]]
    });

    const estadoNav = history.state;
    
    if (estadoNav && estadoNav.data) {
      const pregunta: IPregunta = estadoNav.data;
      this.preguntaId = pregunta.id!; 

      this.formularioEditar.patchValue({
        enunciado: pregunta.enunciado,
        descripcion: pregunta.descripcion,
        orden: pregunta.orden,
        peso: pregunta.peso
      });
      console.log("Datos Pregunta:", pregunta);
    } else {
      console.warn("Error, sin datos");
      this.router.navigate(['/']);
    }
  }

  guardarCambios(): void {
    if (this.formularioEditar.invalid) {
      this.formularioEditar.markAllAsTouched();
      return;
    }

    const preguntaActualizada: IPregunta = {
      id: this.preguntaId,
      ...this.formularioEditar.value
    };

    this.preguntasServicio.actualizar(this.preguntaId, preguntaActualizada).subscribe({
      next: () => {
        console.log("Actualizado");
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }
}