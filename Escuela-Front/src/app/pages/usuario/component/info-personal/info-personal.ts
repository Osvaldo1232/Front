import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../Services/alumno-service';
import { Alumnos, AlumnoTutor, InscripcionReciente } from '../../../../models/alumnos.model';
import { LoginService } from '../../../../services/login-service';
import { CommonModule } from '@angular/common';
import { timeout } from 'rxjs';
import { LoadingService } from '../../../../shared/loading-service';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-info-personal',
  templateUrl: './info-personal.html',
  styleUrls: ['./info-personal.scss'],
  standalone: true,
  imports: [CommonModule, Loading]
})
export class InfoPersonalComponent implements OnInit {
  alumno?: Alumnos;
  inscripcion?: InscripcionReciente; // ✅ Guardamos la inscripción reciente
  errorMessage = '';
  usuario:any;
  tutor!:AlumnoTutor;
  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.usuario= this.loginService.Usuario(); // Obtenemos el UUID del alumno
    if (this.usuario) {
      this.cargarUsuario(this.usuario);
      this.cargarTutor(this.usuario);
      this.obtenerDatosTutor(this.usuario);
    } else {
      this.errorMessage = 'No se encontró el ID del alumno.';
    }
}


cargarTutor(id:any){
this.loadingService.show();
        this.alumnoService.obtenerInscripcionReciente(id).subscribe({
            next: (inscripcionData) => {
              this.inscripcion = inscripcionData;
              this.loadingService.hide(); 
            },
            error: () => {
              this.errorMessage = 'No se pudo cargar la inscripción reciente.';
              this.loadingService.hide(); 
            }
          });
}

cargarUsuario(usu:any){
  this.loadingService.show();
  this.alumnoService.obtenerAlumnoPorId(usu).subscribe({
    next: (data) => {
      this.alumno = data;
      this.loadingService.hide(); 
    },
    error: () => {
      this.errorMessage = 'No se pudieron cargar los datos del alumno.';
      this.loadingService.hide(); 
    }
  });
}
  obtenerDatosTutor(idAlumno: string) {
    this.alumnoService.obtenerTutor(idAlumno).subscribe({
      next: (data) => {
        this.tutor = data;

      },
      error: (err) => console.error('Error al obtener alumno:', err)
    });
  }
}
