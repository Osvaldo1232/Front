import { Component } from '@angular/core';
import { AlumnoService } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../shared/loading-service';
import { Loading } from '../../../../shared/loading/loading';
import { InscripcionReciente, MateriasCalifica } from '../../../../models/alumnos.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, Loading],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.scss'
})
export class Calificaciones {
  materias: MateriasCalifica[] = [];
  inscripcion?: InscripcionReciente;
  usuario: any;
  alumse: any;
  datos: InscripcionReciente[] = [];

  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.loginService.Usuario(); 
    if (this.usuario) {
      this.AlumnosServ(this.usuario);
    }
  }

  AlumnosServ(alumnoId: string) {
    this.loadingService.show();
    this.alumnoService.obtenerInscripcionReciente(alumnoId).subscribe({
      next: (alumnosrecientes) => {
        this.alumse = alumnosrecientes;
        if (this.alumse) {
          this.ObtenerMater(this.alumse.idGrado, this.usuario, this.alumse.idCiclo);
        } else {
          this.loadingService.hide(); 
        }
      },
      error: (err) => {
        this.loadingService.hide();
      }
    });
  }

  ObtenerMater(idGrado: string, idAlumno: string, idCicloEscolar: string) {
    this.loadingService.show();
    this.alumnoService.obtenerMaterias(idGrado, idAlumno, idCicloEscolar).subscribe({
      next: (materias) => {
        this.materias = materias || [];
        if (this.materias.length === 0) {
        }
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      }
    });
  }

  abrirCalificaciones(materia: any): void {
    if (!this.alumse) {
      return;
    }
    this.router.navigate(
      
      ['/usuario/calificacion-gene', materia.idMateria],
      {
        state: {
          materia: {
            idMateria: materia.idMateria,
            nombreMateria: materia.nombreMateria,
            idGrado: this.alumse.idGrado,
            idGrupo: this.alumse.idGrupo,
            idCiclo: this.alumse.idCiclo,
            nombreGrado: this.alumse.nombreGrado,
            nombreGrupo: this.alumse.nombreGrupo,
            ciclo: this.alumse.ciclo
          }
        }
      }
    );
  }
}