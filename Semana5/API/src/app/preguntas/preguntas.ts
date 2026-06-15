import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PreguntasServices } from '../services/preguntas.services';
import { IPregunta } from '../interfaces/ipregunta';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntas',
  imports: [CommonModule, RouterModule],
  templateUrl: './preguntas.html',
  styleUrl: './preguntas.css',
})
export class Preguntas implements OnInit {
  lista:IPregunta[] = []
  private readonly preguntasServicio = inject(PreguntasServices)
  private readonly cambios = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.preguntasServicio.todos().subscribe(
      {
        next: (preguntas)=>{
          this.lista = preguntas
          console.log('Datos:', this.lista)
          this.cambios.detectChanges();
        },
        error: (er)=>{
          console.log("No se pudo cargar las preguntas", er)
        }
      }
    )
  }
}
