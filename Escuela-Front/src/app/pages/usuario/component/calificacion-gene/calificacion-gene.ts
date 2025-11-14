import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../shared/alert-service';
import { LoginService } from '../../../../services/login-service';
import { AlumnoService } from '../../Services/alumno-service';
import { LoadingService } from '../../../../shared/loading-service';
import { DetalleMateria } from '../../../../models/alumnos.model';

@Component({
  selector: 'app-calificacion-gene',
  imports: [CommonModule ],
  templateUrl: './calificacion-gene.html',
  styleUrl: './calificacion-gene.scss'
})
export class CalificacionGene implements OnInit  {

  usuario: any;
  detalleMateria: DetalleMateria[] = [];
  cargando = false;

  idMateria: string = '';
  nombreMateria: string = '';
  idGrado: string = '';
  idGrupo: string = '';
  idCiclo: string = '';
  nombreGrado: string = '';
  nombreGrupo: string = '';
  ciclo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private loginService: LoginService,
    private alumnoService: AlumnoService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.usuario = this.loginService.Usuario();

    this.obtenerParametrosNavegacion();

    if (this.usuario) {
      this.cargarDetalleMateria(this.usuario);
    } else {
      this.alertService.show(
        'No se encontró el ID del alumno en la sesión.',
        'danger',
        'Error'
      );
    }
  }

  obtenerParametrosNavegacion(): void {
    this.idMateria = this.route.snapshot.paramMap.get('idMateria') || '';
    const state = history.state;
    if (state.materia) {
      this.nombreMateria = state.materia.nombreMateria;
      this.idGrado = state.materia.idGrado;
      this.idGrupo = state.materia.idGrupo;
      this.idCiclo = state.materia.idCiclo;
      this.nombreGrado = state.materia.nombreGrado;
      this.nombreGrupo = state.materia.nombreGrupo;
      this.ciclo = state.materia.ciclo;

      if (!this.idMateria && state.materia.idMateria) {
        this.idMateria = state.materia.idMateria;
      }
    }

    if (!this.idMateria || !this.idGrado || !this.idGrupo || !this.idCiclo) {
      this.alertService.show(
        'Faltan datos necesarios. Regrese a la pantalla anterior.',
        'danger',
        'Error'
      );
    }
  }

  cargarDetalleMateria(idAlumno: string): void {
    if (!idAlumno || !this.idMateria || !this.idCiclo) {
      this.alertService.show(
        'Faltan datos necesarios para cargar el detalle de la materia.',
        'danger',
        'Error'
      );
      return;
    }

    this.cargando = true;
    this.loadingService.show();

    this.alumnoService.obtenerDetalleMat(idAlumno, this.idMateria, this.idCiclo)
      .subscribe({
        next: (detalle) => {
          this.detalleMateria = detalle || [];
          this.cargando = false;
          this.loadingService.hide();
        },
        error: () => {
          this.cargando = false;
          this.loadingService.hide();

          this.alertService.show(
            'Error al obtener el detalle de la materia.',
            'danger',
            'Error'
          );
        }
      });
  }
}
