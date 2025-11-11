import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InscripcionDTO } from '../../../../models/Materia';
import { AsignacionDocente, MateriasCamposFormativos } from '../../../../models/AsignaciónMateria';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { LoginService } from '../../../../services/login-service';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../../shared/alert-service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Loading],
  templateUrl: './materias.html',
  styleUrl: './materias.scss'
})
export class Materias implements OnInit {
  materias: MateriasCamposFormativos[] = [];
  cargando: boolean = false;
  asignacionDocente: AsignacionDocente | null = null;
  errorMensaje: string = '';
  inscripciones: InscripcionDTO[] = [];
  usuariologuado: any;

  constructor(private router: Router, private servicios: ServiciosProfesor, private LoginS: LoginService,
    private loadingService: LoadingService, private AlertService: AlertService) { }

  ngOnInit(): void {
    this.usuariologuado = this.LoginS.Usuario();
    if (this.usuariologuado) {
      this.cargarAsignacionYMaterias();
    }
  }

  cargarAsignacionYMaterias(): void {
    this.loadingService.show();
    this.cargando = true;
    this.servicios.obtenerAsignacionDocente(this.usuariologuado).subscribe({
      next: (asignacion) => {
        this.asignacionDocente = asignacion;
        if (asignacion.idGrado) {
          this.cargarMateriasPorGrado(asignacion.idGrado);
          this.AlumnosIns(asignacion.idGrado, asignacion.idGrupo, asignacion.idCiclo)
        }
      },
      error: (err) => {
        this.loadingService.hide();
        this.AlertService.show(
          'Actualmente, el profesor no tiene asignación registrada.',
          'danger',
          'Error'
        );
      }
    });
  }


  AlumnosIns(grado: any, grupo: any, ciclo: any) {
    this.servicios.filtrarInscripciones(grado, grupo, ciclo).subscribe({
      next: (inscripciones) => {
        console.log('Inscripciones obtenidas:', inscripciones);
        this.inscripciones = inscripciones;
      },
      error: (err) => {
        console.error('Error al obtener inscripciones:', err);
      }
    });

  }

  cargarMateriasPorGrado(idGrado: string): void {
    if (!idGrado) {
      this.errorMensaje = 'No hay grado asignado';
      this.cargando = false;
      return;
    }

    this.servicios.obtenerMateriasPorGrado(idGrado).subscribe({
      next: (materias) => {

        if (!materias || materias.length === 0) {
          this.errorMensaje = 'No hay materias asignadas para este grado';
          this.materias = [];
        } else {
          this.materias = materias;
        }
        this.loadingService.hide();
        this.cargando = false;
      },
    });
  }

  abrirCalificaciones(materia: any): void {
    if (!this.asignacionDocente) {
      return;
    }

    this.router.navigate(
      ['/profesor/calificaciones', materia.idMateria],
      {
        state: {
          materia: {
            idMateria: materia.idMateria,
            nombreMateria: materia.nombreMateria,
            idGrado: this.asignacionDocente.idGrado,
            idGrupo: this.asignacionDocente.idGrupo,
            idCiclo: this.asignacionDocente.idCiclo
          }
        }
      }
    );
  }

  recargarMaterias(): void {
    this.cargarAsignacionYMaterias();
  }
}