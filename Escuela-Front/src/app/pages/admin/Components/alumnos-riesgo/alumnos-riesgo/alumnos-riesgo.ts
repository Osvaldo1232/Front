import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlumnoReprobado } from '../../../../../models/alumno-reprobado.model';
import { InscripcionSelect } from '../../../../../models/inscripcion-select.model';
import { ServiciosDirectorCalificaciones } from '../../../Services/servicios-director-calificaciones/servicios-director-calificaciones';
import { ServiciosDirectorInscripcion } from '../../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { LoadingService } from '../../../../../shared/loading-service';
import { Loading } from '../../../../../shared/loading/loading';

@Component({
  selector: 'app-alumnos-riesgo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Loading],
  templateUrl: './alumnos-riesgo.html',
  styleUrls: ['./alumnos-riesgo.scss']
})
export class AlumnosRiesgoComponent implements OnInit {

  alumnosReprobados: AlumnoReprobado[] = [];
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
          this.cargarAlumnosReprobados();
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
      this.cargarAlumnosReprobados();
    } else {
      this.alumnosReprobados = [];
    }
  }

  cargarAlumnosReprobados() {
    if (!this.asignacionSeleccionada) return;
    
    this.loadingService.show();
    
    this.serviciosCalificaciones.ObtenerAlumnosReprobadosPorAsignacion(this.asignacionSeleccionada).subscribe({
      next: (alumnos) => {
        this.alumnosReprobados = alumnos;
        console.log('📊 Alumnos reprobados:', alumnos);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('❌ Error al cargar alumnos:', err);
        this.alumnosReprobados = [];
        this.loadingService.hide();
      }
    });
  }
}