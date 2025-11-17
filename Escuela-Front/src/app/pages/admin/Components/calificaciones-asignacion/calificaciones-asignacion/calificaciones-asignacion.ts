import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlumnoCalificaciones } from '../../../../../models/calificaciones-asignacion.model';
import { InscripcionSelect } from '../../../../../models/inscripcion-select.model';
import { ServiciosDirectorCalificaciones } from '../../../Services/servicios-director-calificaciones/servicios-director-calificaciones';
import { ServiciosDirectorInscripcion } from '../../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { LoadingService } from '../../../../../shared/loading-service';
import { Loading } from '../../../../../shared/loading/loading';

@Component({
  selector: 'app-calificaciones-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Loading],
  templateUrl: './calificaciones-asignacion.html',
  styleUrls: ['./calificaciones-asignacion.scss']
})
export class CalificacionesAsignacionComponent implements OnInit {

  alumnos: AlumnoCalificaciones[] = [];
  asignaciones: InscripcionSelect[] = [];
  asignacionSeleccionada: string = '';

  constructor(
    private serviciosCalificaciones: ServiciosDirectorCalificaciones,
    private serviciosInscripcion: ServiciosDirectorInscripcion,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.cargarAsignaciones();
  }

  cargarAsignaciones() {
    this.loadingService.show();
    
    this.serviciosInscripcion.ObtenerOpcionesInscripcion().subscribe({
      next: (res) => {
        this.asignaciones = res;
        console.log('📚 Asignaciones cargadas:', res);
        
        // ✅ Seleccionar automáticamente la primera
        if (res.length > 0) {
          this.asignacionSeleccionada = res[0].id;
          this.cargarCalificaciones();
        } else {
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar asignaciones:', err);
        this.loadingService.hide();
      }
    });
  }

  onAsignacionChange() {
    if (this.asignacionSeleccionada) {
      this.cargarCalificaciones();
    } else {
      this.alumnos = [];
    }
  }

  cargarCalificaciones() {
    if (!this.asignacionSeleccionada) return;
    
    this.loadingService.show();
    
    this.serviciosCalificaciones.ObtenerCalificacionesPorAsignacion(this.asignacionSeleccionada).subscribe({
      next: (alumnos) => {
        this.alumnos = alumnos;
        console.log('📊 Calificaciones cargadas:', alumnos);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('❌ Error al cargar calificaciones:', err);
        this.alumnos = [];
        this.loadingService.hide();
      }
    });
  }

  // Obtener color según calificación
  getColorCalificacion(calificacion: number): string {
    if (calificacion < 6) return 'reprobado';
    if (calificacion < 8) return 'regular';
    if (calificacion < 9) return 'bueno';
    return 'excelente';
  }

  // Calcular promedio del alumno
  calcularPromedio(materias: any[]): number {
    if (!materias || materias.length === 0) return 0;
    const suma = materias.reduce((acc, m) => acc + m.calificacion, 0);
    return suma / materias.length;
  }
}