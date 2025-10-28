import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Materia } from '../../../../models/Materia';
import { AsignacionDocente } from '../../../../models/AsignaciónMateria';
import { MateriaAsignada } from '../../../../models/AsignaciónMateria';
import { ServiciosProfesor } from '../../services/servicios-profesor';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materias.html',
  styleUrl: './materias.scss'
})
export class Materias implements OnInit {
  materias: MateriaAsignada[] = [];
  cargando: boolean = false;
  asignacionDocente: AsignacionDocente | null = null;
  errorMensaje: string = '';

  constructor(
    private router: Router,
    private servicios: ServiciosProfesor
  ) {}

  ngOnInit(): void {
    this.cargarAsignacionYMaterias();
  }

  cargarAsignacionYMaterias(): void {
    this.cargando = true;
    const idProfesor = this.obtenerIdProfesorLogueado();

    if (!idProfesor) {
      console.error('❌ No hay profesor logueado');
      this.errorMensaje = 'No se pudo identificar al profesor';
      this.cargando = false;
      this.cargarDatosEjemplo();
      return;
    }

    console.log('📡 Buscando asignación para profesor:', idProfesor);
    this.servicios.obtenerAsignacionDocente(idProfesor).subscribe({
      next: (asignacion) => {
        console.log('✅ Asignación del docente obtenida:', asignacion);
        this.asignacionDocente = asignacion;
        this.cargarMateriasPorGrado(asignacion.grado);
      },
      error: (err) => {
        console.error('❌ Error al obtener asignación del docente:', err);

        if (err.status === 404) {
          this.errorMensaje = 'No tiene asignación de grado actualmente';
          this.materias = [];
        } else if (err.status === 0) {
          this.errorMensaje = 'Error de conexión con el servidor';
        } else {
          this.errorMensaje = 'Error al cargar la asignación';
          this.cargarDatosEjemplo();
        }

        this.cargando = false;
      }
    });
  }

  cargarMateriasPorGrado(idGrado: string): void {
    if (!idGrado) {
      console.error('❌ No hay ID de grado');
      this.errorMensaje = 'No hay grado asignado';
      this.cargando = false;
      return;
    }

    console.log('📘 Cargando materias para grado:', idGrado);
    this.servicios.obtenerMateriasPorGrado(idGrado).subscribe({
      next: (materias) => {
        console.log('✅ Materias obtenidas:', materias);

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
        console.error('❌ Error al cargar materias:', err);

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

  obtenerIdProfesorLogueado(): string | null {
    const idProfesor =
      localStorage.getItem('idUsuario') ||
      localStorage.getItem('idProfesor') ||
      localStorage.getItem('userId');

    if (!idProfesor) {
      console.error('❌ No se encontró ID de profesor en localStorage');
    } else {
      console.log('✅ ID del profesor encontrado:', idProfesor);
    }

    return idProfesor;
  }

  cargarDatosEjemplo(): void {
    console.warn('⚠️ Cargando datos de ejemplo (modo prueba)');
    this.asignacionDocente = {
      id: 'ejemplo-1',
      idProfesor: 'profesor-ejemplo',
      grado: '1',
      grupo: 'A',
      ciclo: '2024-2025'
    };

    this.materias = [
      {
        id: '6',
        nombre: 'EDUCACION FISICA',
        campoFormativo: 'DE LO HUMANO Y COMUNITARIO',
        grado: '1',
        grupo: 'A'
      }
    ];

    this.cargando = false;
    this.errorMensaje = 'Mostrando datos de ejemplo';
  }

  abrirCalificaciones(materia: MateriaAsignada): void {
    console.log('🧾 Abrir calificaciones para materia:', materia);

    if (!this.asignacionDocente) {
      alert('No se puede acceder a calificaciones sin asignación de grado');
      return;
    }

    this.router.navigate(['/calificaciones', materia.id], {
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
    console.log('🔄 Recargando materias...');
    this.errorMensaje = '';
    this.cargarAsignacionYMaterias();
  }
}