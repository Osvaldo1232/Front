import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InscripcionDTO, Materia } from '../../../../models/Materia';
import { AsignacionDocente, MateriasCamposFormativos } from '../../../../models/AsignaciónMateria';
import { MateriaAsignada } from '../../../../models/AsignaciónMateria';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { LoginService } from '../../../../services/login-service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materias.html',
  styleUrl: './materias.scss'
})
export class Materias implements OnInit {
  materias: MateriasCamposFormativos[] = [];
  cargando: boolean = false;
  asignacionDocente: AsignacionDocente | null = null;
  errorMensaje: string = '';
inscripciones:InscripcionDTO []=[];
  usuariologuado:any;
  constructor(
    private router: Router,
    private servicios: ServiciosProfesor,
    private LoginS:LoginService
  ) {}

  ngOnInit(): void {
    this.usuariologuado=this.LoginS.Usuario();
    if(this.usuariologuado){
    this.cargarAsignacionYMaterias();
    }
  }

  cargarAsignacionYMaterias(): void {
    this.cargando = true;
    this.servicios.obtenerAsignacionDocente( this.usuariologuado).subscribe({
      next: (asignacion) => {
        if(asignacion.idGrado){
          this.cargarMateriasPorGrado(asignacion.idGrado);
          this.AlumnosIns(asignacion.idGrado, asignacion.idGrupo, asignacion.idCiclo)
        }
      },
      error: (err) => {

        if (err.status === 404) {
          this.errorMensaje = 'No tiene asignación de grado actualmente';
          this.materias = [];
        } else if (err.status === 0) {
          this.errorMensaje = 'Error de conexión con el servidor';
        } else {
          this.errorMensaje = 'Error al cargar la asignación';
        }

        this.cargando = false;
      }
    });
  }


AlumnosIns(grado:any, grupo:any, ciclo:any){
  this.servicios.filtrarInscripciones(grado, grupo, ciclo).subscribe({
  next: (inscripciones) => {
    console.log('✅ Inscripciones obtenidas:', inscripciones);
    this.inscripciones = inscripciones;
  },
  error: (err) => {
    console.error('❌ Error al obtener inscripciones:', err);
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
          this.errorMensaje = '';
        }

        this.cargando = false;
      },
      error: (err) => {

        if (err.status === 404) {
          this.errorMensaje = 'No hay materias asignadas para este grado';
          this.materias = [];
        } else if (err.status === 0) {
          this.errorMensaje = 'Error de conexión con el servidor';
        } else if (err.status === 500) {
          this.errorMensaje = 'Error interno del servidor';
        } else {
          this.errorMensaje = 'Error al cargar las materias';
        }

        this.cargando = false;
      }
    });
  }

  abrirCalificaciones(materia: MateriasCamposFormativos): void {

    if (!this.asignacionDocente) {
      return;
    }

    this.router.navigate(['/calificaciones', materia.idMateria], {
      state: {
        materia,
        grado: this.asignacionDocente.grado,
        grupo: this.asignacionDocente.grupo,
        ciclo: this.asignacionDocente.ciclo,
        idAsignacion: this.asignacionDocente.id
      }
    });
  }

  recargarMaterias(): void {
    this.errorMensaje = '';
    this.cargarAsignacionYMaterias();
  }
}