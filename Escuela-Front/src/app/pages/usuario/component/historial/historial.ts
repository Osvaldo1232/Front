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
  styleUrl: './historial.scss',
 
})
export class Historial implements OnInit {
calificaciones!: CalificacionesAlumno;

usuario:any;
errorMessage = '';

   constructor( private alumnoService: AlumnoService,
      private loginService: LoginService,
      private loadingService: LoadingService
    ) {}

  ngOnInit(): void {
     this.loadingService.show();
   this.usuario= this.loginService.Usuario();
   if (this.usuario) {
      this.cargarCalificac(this.usuario);
    } else {
      this.errorMessage = 'No se encontró el ID del alumno.';
    }
  }

cargarCalificac(usu:any){
  this.loadingService.show();
  this.alumnoService.obtenerCalificaciones(usu).subscribe({
  next: (data: CalificacionesAlumno) => {
      this.calificaciones = data;
      this.loadingService.hide();
    },
    error: () => {
      this.errorMessage = 'No se pudieron cargar las calificaciones.';
      this.loadingService.hide();
    }
  });
}


descargarPDF() {
    

    this.alumnoService.descargarPDF(this.usuario).subscribe({
      
      next: (pdfBlob) => {
         this.loadingService.show();
        // Crear un link temporal para descargar el PDF
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'HistorialAcademico.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error al descargar PDF', err);
      }
    });
  }
 
}






