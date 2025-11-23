import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading-service';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { AlertService } from '../../../../shared/alert-service';
import { Loading } from "../../../../shared/loading/loading";
import { LoginService } from '../../../../services/login-service';
import { HistorialAlumno } from '../../../../models/HistorialAcademicoAlumno';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-historial-alumno-acdemico',
  imports: [CommonModule, FormsModule, Loading],
  templateUrl: './historial-alumno-acdemico.html',
  styleUrl: './historial-alumno-acdemico.scss'
})
export class HistorialAlumnoAcdemico implements OnInit {
  ciclos: any[] = [];
  alumnos: any[] = [];
  cicloEscolar: string = '';
  alumnoSeleccionado: string = '';
  historialAlumno: HistorialAlumno | null = null;
  idUsuario: string = '';

  constructor(private servicioDirectorAsignacion: ServiciosProfesor, private loginService: LoginService,private loadingService: LoadingService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.loginService.Usuario(); 

    if (!this.idUsuario) {
      console.error('No se encontró usuario logueado');
      this.AlertService.show('No se encontró usuario logueado', 'danger', 'Error');
      return;
    }

    this.cargarCombos();
  }

  cargarCombos(): void {
    this.loadingService.show();

    this.servicioDirectorAsignacion.obtenerCiclos(this.idUsuario).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (data) => {
        console.log('Ciclos obtenidos:', data);
        this.ciclos = data;
        const cicloActual = this.obtenerCicloActual(this.ciclos);

        if (cicloActual) {
          this.cicloEscolar = cicloActual.id;
          this.cargarAlumnos();
        } else {
          this.AlertService.show('No se encontraron ciclos escolares', 'warning', 'Información');
        }
      },
      error: (err) => {
        console.error('Error al cargar ciclos', err);
        this.AlertService.show('Error al cargar los ciclos escolares', 'danger', 'Error');
      }
    });
  }

  obtenerCicloActual(ciclos: any[]): any {
    const anioActual = new Date().getFullYear();
    const actual = ciclos.find(c => anioActual >= c.anioInicio && anioActual <= c.anioFin);
    if (!actual) {
      return ciclos.sort((a, b) => b.anioFin - a.anioFin)[0];
    }
    return actual;
  }

  onCicloChange(): void {
    this.alumnoSeleccionado = '';
    this.historialAlumno = null;
    if (this.cicloEscolar) {
      this.cargarAlumnos();
    } else {
      this.alumnos = [];
    }
  }

  onAlumnoChange(): void {
    if (this.alumnoSeleccionado && this.cicloEscolar) {
      this.buscarHistorial();
    } else {
      this.historialAlumno = null;
    }
  }

  cargarAlumnos(): void {
    if (!this.cicloEscolar) {
      return;
    }

    this.loadingService.show();
    this.servicioDirectorAsignacion.obtenerAlumnosConIdPorCiclo(this.cicloEscolar, this.idUsuario).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (alumnos) => {
        console.log('Alumnos obtenidos completos:', alumnos);
        
        if (alumnos && alumnos.length > 0) {
          console.log('Estructura del primer alumno:', JSON.stringify(alumnos[0], null, 2));
          console.log('Claves del objeto:', Object.keys(alumnos[0]));
        }
        
        this.alumnos = alumnos || [];

        if (this.alumnos.length === 0) {
          this.AlertService.show('No se encontraron alumnos para el ciclo seleccionado', 'warning', 'Información');
        }
      },
      error: (err) => {
        console.error('Error al cargar alumnos', err);
        this.AlertService.show('Error al cargar los alumnos', 'danger', 'Error');
      }
    });
  }

  buscarHistorial(): void {
    console.log('Buscando con:', {
      idAlumno: this.alumnoSeleccionado,
      idCiclo: this.cicloEscolar
    });

    this.loadingService.show();
    
    this.servicioDirectorAsignacion.obtenerHistorialAlumnoPorCiclo(this.alumnoSeleccionado, this.cicloEscolar).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (historial) => {
        console.log('Historial recibido:', historial);
        this.historialAlumno = historial;

        if (!historial.camposFormativos || historial.camposFormativos.length === 0) {
          this.AlertService.show('El alumno no tiene campos formativos registrados en este ciclo', 'warning', 'Sin calificaciones');
        }
      },
      error: (err) => {
        console.error('Error al obtener historial:', err);
        
        if (err.status === 403) {
          this.AlertService.show('No tiene permisos para acceder a esta información', 'danger', 'Error de permisos');
        } else if (err.status === 404) {
          this.AlertService.show('No se encontró historial académico para el alumno seleccionado', 'warning', 'Sin datos');
        } else {
          this.AlertService.show('Ocurrió un error al buscar el historial académico', 'danger', 'Error');
        }
      }
    });
  }

  obtenerNombreAlumno(alumno: any): string {
    if (alumno.nombreCompleto) {
      return alumno.nombreCompleto;
    }
    if (alumno.nombreAlumno) {
      return alumno.nombreAlumno;
    }
    const nombre = alumno.nombre || '';
    const apellidoP = alumno.apellidoPaterno || '';
    const apellidoM = alumno.apellidoMaterno || '';
    return `${nombre} ${apellidoP} ${apellidoM}`.trim() || 'Sin nombre';
  }

  obtenerIdAlumno(alumno: any): string {
    console.log('Buscando ID en alumno:', alumno);
    
    if (alumno.idAlumno) {
      console.log('ID encontrado en idAlumno:', alumno.idAlumno);
      return alumno.idAlumno;
    }
    
    if (alumno.id) {
      console.log('ID encontrado en id:', alumno.id);
      return alumno.id;
    }
    
    if (alumno.alumnoId) {
      console.log('ID encontrado en alumnoId:', alumno.alumnoId);
      return alumno.alumnoId;
    }
    
    if (alumno.alumno && alumno.alumno.id) {
      console.log('ID encontrado en alumno.id:', alumno.alumno.id);
      return alumno.alumno.id;
    }
    
    console.error('No se encontró ID del alumno. Estructura:', alumno);
    return '';
  }
}