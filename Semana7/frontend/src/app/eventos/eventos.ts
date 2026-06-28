import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Ieventos } from '../ieventos';
import { Eventoservice } from '../eventoservice';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-eventos',
  imports: [CommonModule, RouterLink],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css'],
})
export class Eventos {
  listaEventos: Ieventos[] = [];
  private readonly eventoServicio = inject(Eventoservice);
  private readonly detector = inject(ChangeDetectorRef);
  private readonly rutas = inject(Router);
  ngOnInit(): void {
    this.cargaLista();
  }
  async cargaLista() {
    this.eventoServicio.todos().subscribe({
      next: (lista) => {
        this.listaEventos = lista;
        this.detector.detectChanges();
      },
      error: (errores) => {
        console.log(errores);
      },
    });
  }

  eliminarEvento(id: number | undefined): void {
    if (!id) return;

    const confirmar = confirm('¿Estás seguro de que deseas eliminar este evento?');
    
    if (confirmar) {
      this.eventoServicio.eliminar(id).subscribe({
        next: () => {
          this.listaEventos = this.listaEventos.filter(evento => evento.id !== id);
          this.detector.detectChanges();
          alert('Evento eliminado con éxito');
          this.cargaLista();
        },
        error: (errores) => {
          console.error('Error al eliminar el evento:', errores);
          alert('Error de eliminación');
        }
      });
    }
  }

  exportarPDF(): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(11, 17, 30); 
    doc.text('Reporte de Eventos', 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 14, 26);

    const columnas = ['#', 'Nombre del Evento', 'Descripción'];

    const filas = this.listaEventos.map((evento, index) => [
      index + 1,
      evento.nombre,
      evento.descripcion
    ]);

    autoTable(doc, {
      startY: 32,
      head: [columnas],
      body: filas,
      theme: 'grid',
      headStyles: {
        fillColor: [11, 17, 30], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [248, 250, 253]
      },
      margin: { top: 30, left: 14, right: 14 }
    });

    doc.save(`Reporte_Eventos_${fecha.replace(/\//g, '-')}.pdf`);
  }
}
