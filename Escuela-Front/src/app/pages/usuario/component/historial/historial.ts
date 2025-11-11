import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { LoadingService } from '../../../../shared/loading-service';
import { Calificacionesgra } from '../../../../models/alumnos.model';

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
 
})
export class Historial implements OnInit {
calificaciones: Calificacionesgra[] = [];
usuario:any;
errorMessage = '';

   constructor( private alumnoService: AlumnoService,
      private loginService: LoginService,
      private loadingService: LoadingService
    ) {}

  ngOnInit(): void {
  }




}



