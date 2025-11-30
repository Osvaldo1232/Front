import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { LoadingService } from '../../../../shared/loading-service';
import { CalificacionesAlumno } from '../../../../models/alumnos.model';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, Loading],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss'],
})
export class Historial implements OnInit {
  
  calificaciones!: CalificacionesAlumno;
  cargando: boolean = false;
  usuario: any;
  errorMessage = '';

  // 👉 NUEVO: controla si el botón debe mostrarse
  hayCalificaciones: boolean = false;

  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.usuario = this.loginService.Usuario();
    if (this.usuario) {
      this.cargarCalificac(this.usuario);
    } else {
      this.errorMessage = 'No se encontró el ID del alumno.';
    }
  }

  cargarCalificac(usu: any) {
    this.cargando = true;
    this.loadingService.show();

    this.alumnoService.obtenerCalificaciones(usu).subscribe({
      next: (data: CalificacionesAlumno) => {
        this.calificaciones = data;

        // 👉 VALIDAR SI TRAE CALIFICACIONES
        if (data && data.calificacionesPorGrado?.length > 0) {
          this.hayCalificaciones = true;
        } else {
          this.hayCalificaciones = false;
        }
      },

      complete: () => {
        this.cargando = false;
        this.loadingService.hide();
      }
    });
  }

  descargarPDF() {
    if (!this.usuario) return;

    this.cargando = true;
    this.loadingService.show();

    this.alumnoService.descargarPDF(this.usuario).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'HistorialAcademico.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },

      complete: () => {
        this.cargando = false;
        this.loadingService.hide();
      }
    });
  }
}
