import { Component, OnInit } from '@angular/core';
import { AlumnoService, Alumno, InscripcionReciente } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { CommonModule } from '@angular/common';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-info-personal',
  templateUrl: './info-personal.html',
  styleUrls: ['./info-personal.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InfoPersonalComponent implements OnInit {
  alumno?: Alumno;
  inscripcion?: InscripcionReciente; // ✅ Guardamos la inscripción reciente
  errorMessage = '';
  usuario:any;
  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.usuario= this.loginService.Usuario(); // Obtenemos el UUID del alumno
    if (this.usuario) {
      this.cargarUsuario(this.usuario);
      this.cargarTutor(this.usuario);
    } else {
      this.errorMessage = 'No se encontró el ID del alumno.';
    }
}


cargarTutor(id:any){
        this.alumnoService.obtenerInscripcionReciente(id).subscribe({
            next: (inscripcionData) => {
              this.inscripcion = inscripcionData;
            },
            error: () => {
              this.errorMessage = 'No se pudo cargar la inscripción reciente.';
            }
          });
}

cargarUsuario(usu:any){
   this.alumnoService.obtenerAlumnoPorId(usu).subscribe({
        next: (data) => {
          this.alumno = data;
        error: () => {
          this.errorMessage = 'No se pudieron cargar los datos del alumno.';
        }
      }});
}

}