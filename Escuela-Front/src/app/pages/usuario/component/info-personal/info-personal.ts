import { Component, OnInit } from '@angular/core';
import { AlumnoService, Alumno, InscripcionReciente } from '../../Services/alumno-service';
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
  inscripcion?: InscripcionReciente; // ✅ Guardamos la inscripción reciente
  errorMessage = '';

  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const id = this.loginService.Usuario(); // Obtenemos el UUID del alumno

    if (id) {
      // 🔹 Obtener datos del alumno
      this.alumnoService.obtenerAlumnoPorId(id).subscribe({
        next: (data) => {
          this.alumno = data;
          console.log('Datos del alumno:', data);

          // 🔹 Obtener inscripción reciente
          this.alumnoService.obtenerInscripcionReciente(id).subscribe({
            next: (inscripcionData) => {
              this.inscripcion = inscripcionData;
              console.log('Inscripción reciente:', inscripcionData);
            },
            error: () => {
              this.errorMessage = 'No se pudo cargar la inscripción reciente.';
            }
          });
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
