import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { CalificacionRegistro } from '../../../../models/calificacion';

@Component({
  selector: 'app-modal-edicion-calificacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edicion-calificacion.html',
  styleUrl: './modal-edicion-calificacion.scss'
})
export class ModalEdicionCalificacion implements OnChanges {
  @Input() registro: any;
  @Output() cerrar = new EventEmitter<CalificacionRegistro | null>();

  constructor(private Servicios: ServiciosProfesor) { }

  matricula: string = '';
  nombreEstudiante: string = '';
  materia: string = '';
  grado: string = '';
  grupo: string = '';
  trimestre: string = '';
  ciclo: string = '';
  calificacion: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registro'] && this.registro) {
      this.matricula = this.registro.matricula || '';
      this.nombreEstudiante = this.registro.nombreEstudiante || '';
      this.materia = this.registro.materia || '';
      this.grado = this.registro.grado || '';
      this.grupo = this.registro.grupo || '';
      this.trimestre = this.registro.trimestre || '';
      this.ciclo = this.registro.ciclo || '';
      this.calificacion = this.registro.calificacion || 0;
    }
  }

  editar() {
    const calificacion: CalificacionRegistro = {
      matricula: this.matricula,
      nombreEstudiante: this.nombreEstudiante,
      materia: this.materia,
      grado: this.grado,
      grupo: this.grupo,
      trimestre: this.trimestre,
      ciclo: this.ciclo,
      calificacion: this.calificacion
    };

    this.Servicios.editarCalificacion(calificacion).subscribe({
      next: (res) => {
        const EditarCalificacion = {
          id: res.id,
          matricula: this.matricula,
          nombreEstudiante: this.nombreEstudiante,
          materia: this.materia,
          grado: this.grado,
          grupo: this.grupo,
          trimestre: this.trimestre,
          ciclo: this.ciclo,
          calificacion: this.calificacion
        };
        this.cerrar.emit(EditarCalificacion);
      },
      error: (err) => console.error('Error al crear Calificacion:', err)
    });
  }

  cerrarModal() {
    this.cerrar.emit(null);
  }
}