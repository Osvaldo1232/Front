import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-estudiante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-estudiante.html',
  styleUrl: './perfil-estudiante.scss'
})
export class PerfilEstudiante implements OnChanges {
  @Input() verEstudiante: boolean = false;
  @Input() idAlumno: string | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  alumno: Alumnos | null = null;
  cargando: boolean = false;

  constructor(private servicios: ServiciosDirectorAlumnos) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.verEstudiante && this.idAlumno) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    this.cargando = true;
    this.alumno = null;

    this.servicios.obtenerAlumnoPorId(this.idAlumno!).subscribe({
      next: (data: Alumnos) => {
        this.alumno = data;
        this.cargando = false;
        console.log('Datos cargados:', data);
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  cerrarModal() {
    this.alumno = null;
    this.cerrar.emit(false);
  }
}