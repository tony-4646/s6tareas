import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PreguntasServices } from '../../services/preguntas.services';
import { IPregunta } from '../../interfaces/ipregunta';

@Component({
  selector: 'app-insertar-pregunta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './insertar-pregunta.html',
  styleUrl: './insertar-pregunta.css'
})
export class InsertarPregunta implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly preguntasServicio = inject(PreguntasServices);
  private readonly router = inject(Router);

  formularioInsertar!: FormGroup;

  ngOnInit(): void {
    this.formularioInsertar = this.fb.group({
      enunciado: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required]],
      orden: [1, [Validators.required, Validators.min(1)]],
      peso: [1, [Validators.required, Validators.min(1)]]
    });
  }

  crearPregunta(): void {
    if (this.formularioInsertar.invalid) {
      this.formularioInsertar.markAllAsTouched();
      return;
    }

    const nuevaPregunta: IPregunta = this.formularioInsertar.value;

    this.preguntasServicio.insertar(nuevaPregunta).subscribe({
      next: (respuesta) => {
        console.log('¡Pregunta creada exitosamente en el backend!', respuesta);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}