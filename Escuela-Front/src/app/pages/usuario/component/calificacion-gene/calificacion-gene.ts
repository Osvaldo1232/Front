import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-service';
import { LoadingService } from '../../../../shared/loading-service';
import { AlumnoService } from '../../Services/alumno-service';
import {Calificacionesgra } from '../../../../models/alumnos.model';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-calificacion-gene',
  imports: [CommonModule, Loading ],
  templateUrl: './calificacion-gene.html',
  styleUrl: './calificacion-gene.scss'
})
export class CalificacionGene implements OnInit  {

calificaciones: Calificacionesgra[] = [];
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
  next: (data: Calificacionesgra[]) => {
      this.calificaciones = data;
      this.loadingService.hide();
    },
    error: () => {
      this.errorMessage = 'No se pudieron cargar las calificaciones.';
      this.loadingService.hide();
    }
  });
}

}
