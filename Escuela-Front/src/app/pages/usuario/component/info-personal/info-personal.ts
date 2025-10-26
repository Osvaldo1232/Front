import { Component, OnInit } from '@angular/core';
import { AlumnoService, Alumno } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-personal',
  templateUrl: './info-personal.html',
  styleUrls: ['./info-personal.scss'],
   standalone: true,
  imports: [CommonModule]
})
export class InfoPersonalComponent implements OnInit {
  alumno?: Alumno;
  errorMessage = '';

  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const id = this.loginService.Usuario(); // ✅ Obtenemos el UUID guardado al hacer login

    if (id) {
      this.alumnoService.obtenerAlumnoPorId(id).subscribe({
        next: (data) => {
          this.alumno = data;
          console.log('Datos del alumno:', data);
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar los datos del alumno.';
        }
      });
    } else {
      this.errorMessage = 'No se encontró el ID del alumno.';
    }
  }
}
