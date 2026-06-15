import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PreguntasServices } from '../../services/preguntas.services';
import { IPregunta } from '../../interfaces/ipregunta';

@Component({
  selector: 'app-eliminar-pregunta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eliminar-pregunta.html',
  styleUrl: './eliminar-pregunta.css'
})
export class EliminarPregunta implements OnInit {
  private readonly preguntasServicio = inject(PreguntasServices);
  private readonly router = inject(Router);

  pregunta!: IPregunta;

  ngOnInit(): void {
    const estadoNav = history.state;

    if (estadoNav && estadoNav.data) {
      this.pregunta = estadoNav.data;
    } else {
      console.warn("Pregunta no encontrada")
      this.router.navigate(['/']);
    }
  }

  confirmarEliminacion(): void {
    if (!this.pregunta || !this.pregunta.id) return;

    this.preguntasServicio.eliminar(this.pregunta.id).subscribe({
      next: () => {
        console.log(`Pregunta eliminada`);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}