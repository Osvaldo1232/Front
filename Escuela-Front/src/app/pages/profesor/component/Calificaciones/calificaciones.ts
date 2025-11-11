import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CalificacionRegistro } from '../../../../models/calificacion';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { AlumnoCalificacion, Trimestre } from '../../../../models/calificarMateria';
import { InscripcionDTO } from '../../../../models/Materia';
import { forkJoin } from 'rxjs';
import { Loading } from "../../../../shared/loading/loading";


@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Loading],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.scss'
})
export class CalificacionesComponent implements OnInit {
  idMateria: string = '';
  nombreMateria: string = '';
  idGrado: string = '';
  idGrupo: string = '';
  idCiclo: string = '';
  nombreGrado: string = '';
  nombreGrupo: string = '';
  nombreCiclo: string = '';

  idTrimestre1: string = '';
  idTrimestre2: string = '';
  idTrimestre3: string = '';
  trimestres: Trimestre[] = [];

  alumnos: InscripcionDTO[] = [];
  alumnosCalificaciones: AlumnoCalificacion[] = [];
  alumnosFiltrados: AlumnoCalificacion[] = [];
  alumnosPaginados: AlumnoCalificacion[] = [];

  filtros = {
    nombreEstudiante: ''
  };
  paginaActual = 1;
  totalPaginas = 1;
  registrosPorPagina = 10;

  modoEdicion = false;
  cargando = false;
  Math = Math;

  constructor( private route: ActivatedRoute, private router: Router, private servicios: ServiciosProfesor, private loadingService: LoadingService, private alertService: AlertService ) {}

  ngOnInit(): void {
    this.obtenerParametrosNavegacion();
    this.cargarDatosIniciales();
  }

  obtenerParametrosNavegacion(): void {
    this.idMateria = this.route.snapshot.paramMap.get('idMateria') || '';
    
    const state = history.state;

    if (state.materia) {
      this.nombreMateria = state.materia.nombreMateria;
      this.idGrado = state.materia.idGrado;
      this.idGrupo = state.materia.idGrupo;
      this.idCiclo = state.materia.idCiclo;
      
      if (!this.idMateria && state.materia.idMateria) {
        this.idMateria = state.materia.idMateria;
      }
    }

    this.nombreGrado = state.grado || '';
    this.nombreGrupo = state.grupo || '';
    this.nombreCiclo = state.ciclo || '';

    if (!this.idMateria || !this.idGrado || !this.idGrupo || !this.idCiclo) {
      this.alertService.show(
        'Faltan datos necesarios. Regrese a la pantalla anterior.',
        'danger',
        'Error'
      );
    }
  }

  cargarDatosIniciales(): void {
    this.loadingService.show();
    this.cargando = true;

    forkJoin({
      trimestres: this.servicios.obtenerTrimestres(),
      inscripciones: this.servicios.filtrarInscripciones(
        this.idGrado,
        this.idGrupo,
        this.idCiclo
      )
    }).subscribe({
      next: (resultado) => {
        this.trimestres = resultado.trimestres.filter(t => t.estatus === 'ACTIVO');
        this.ordenarYAsignarTrimestres();

        this.alumnos = resultado.inscripciones;
        this.inicializarCalificaciones();
        
        setTimeout(() => {
          this.cargarCalificacionesExistentes();
        }, 100);

        this.loadingService.hide();
        this.cargando = false;
      },
      error: (err) => {
        this.loadingService.hide();
        this.cargando = false;
        this.alertService.show(
          'Error al cargar los datos. Verifique la conexión.',
          'danger',
          'Error'
        );
      }
    });
  }

  ordenarYAsignarTrimestres(): void {
    this.trimestres.forEach(t => {
      const nombre = t.nombre.toLowerCase();
      
      if (nombre.includes('1') || nombre.includes('primero')) {
        this.idTrimestre1 = t.id;
      } else if (nombre.includes('2') || nombre.includes('segundo')) {
        this.idTrimestre2 = t.id;
      } else if (nombre.includes('3') || nombre.includes('tercero')) {
        this.idTrimestre3 = t.id;
      }
    });
  }

  inicializarCalificaciones(): void {
    this.alumnosCalificaciones = this.alumnos.map(alumno => {
      const id = (alumno as any).alumnoId || alumno.idAlumno;
      
      return {
        idAlumno: id,
        nombreAlumno: `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`,
        calificacionT1: null,
        calificacionT2: null,
        calificacionT3: null,
        promedioFinal: null
      };
    });

    this.alumnosFiltrados = [...this.alumnosCalificaciones];
    this.calcularPaginacion();
  }

  aplicarFiltros(): void {
    const busqueda = this.filtros.nombreEstudiante.toLowerCase().trim();
    
    if (busqueda === '') {
      this.alumnosFiltrados = [...this.alumnosCalificaciones];
    } else {
      this.alumnosFiltrados = this.alumnosCalificaciones.filter(a =>
        a.nombreAlumno.toLowerCase().includes(busqueda)
      );
    }

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(
      this.alumnosFiltrados.length / this.registrosPorPagina
    );

    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.alumnosPaginados = this.alumnosFiltrados.slice(inicio, fin);
  }

  irAPagina(num: number): void {
    if (num < 1 || num > this.totalPaginas) return;
    this.paginaActual = num;
    this.calcularPaginacion();
  }

  validarCalificacion(valor: number | null): boolean {
    if (valor === null || valor === undefined) return true;
    return valor >= 0 && valor <= 10;
  }

  calcularPromedioFinal(alumno: AlumnoCalificacion): number | null {
    const calificaciones = [
      alumno.calificacionT1,
      alumno.calificacionT2,
      alumno.calificacionT3
    ].filter(c => c !== null && c !== undefined) as number[];

    if (calificaciones.length === 0) return null;
    
    const suma = calificaciones.reduce((acc, cal) => acc + cal, 0);
    return parseFloat((suma / calificaciones.length).toFixed(1));
  }

  onCalificacionChange(alumno: AlumnoCalificacion): void {
    alumno.promedioFinal = this.calcularPromedioFinal(alumno);
  }

  validarTrimestre1Completo(): boolean {
    return this.alumnosCalificaciones.every(
      a => a.calificacionT1 !== null && 
           a.calificacionT1 !== undefined &&
           this.validarCalificacion(a.calificacionT1)
    );
  }

  validarTrimestre2Completo(): boolean {
    return this.alumnosCalificaciones.every(
      a => a.calificacionT2 !== null && 
           a.calificacionT2 !== undefined &&
           this.validarCalificacion(a.calificacionT2)
    );
  }

  puedeEditarTrimestre2(): boolean {
    return this.validarTrimestre1Completo();
  }

  puedeEditarTrimestre3(): boolean {
    return this.validarTrimestre1Completo() && this.validarTrimestre2Completo();
  }

  Editar(): void {
    this.modoEdicion = true;
    this.alertService.show(
      'Modo de edición activado. Puede modificar las calificaciones.',
      'success',
      'Edición'
    );
  }

  guardar(): void {
    if (!this.idMateria || !this.idGrado || !this.idGrupo || !this.idCiclo) {
      this.alertService.show(
        'Error: Faltan datos necesarios. Regrese y vuelva a entrar.',
        'danger',
        'Error de Datos'
      );
      return;
    }

    if (!this.idTrimestre1 || !this.idTrimestre2 || !this.idTrimestre3) {
      this.alertService.show(
        'Error: No se pudieron cargar los trimestres correctamente.',
        'danger',
        'Error'
      );
      return;
    }

    const tieneCalificaciones = this.alumnosCalificaciones.some(
      a => a.calificacionT1 !== null || a.calificacionT2 !== null || a.calificacionT3 !== null
    );

    if (!tieneCalificaciones) {
      this.alertService.show(
        'Debe ingresar al menos una calificación antes de guardar.',
        'warning',
        'Validación'
      );
      return;
    }

    const calificacionesInvalidas = this.alumnosCalificaciones.filter(
      a => !this.validarCalificacion(a.calificacionT1) ||
           !this.validarCalificacion(a.calificacionT2) ||
           !this.validarCalificacion(a.calificacionT3)
    );

    if (calificacionesInvalidas.length > 0) {
      this.alertService.show(
        'Todas las calificaciones deben estar entre 0 y 10.',
        'warning',
        'Validación'
      );
      return;
    }

    const hayCalificacionesT2 = this.alumnosCalificaciones.some(a => a.calificacionT2 !== null);
    if (hayCalificacionesT2 && !this.validarTrimestre1Completo()) {
      this.alertService.show(
        'Debe completar todas las calificaciones del Trimestre 1 antes de calificar el Trimestre 2.',
        'warning',
        'Validación'
      );
      return;
    }

    const hayCalificacionesT3 = this.alumnosCalificaciones.some(a => a.calificacionT3 !== null);
    if (hayCalificacionesT3 && !this.validarTrimestre2Completo()) {
      this.alertService.show(
        'Debe completar todas las calificaciones del Trimestre 2 antes de calificar el Trimestre 3.',
        'warning',
        'Validación'
      );
      return;
    }
    
    const calificacionesAGuardar: any[] = [];

    this.alumnosCalificaciones.forEach(alumno => {
      if (alumno.calificacionT1 !== null && alumno.calificacionT1 !== undefined) {
        calificacionesAGuardar.push({
          idAlumno: alumno.idAlumno,
          idMateria: this.idMateria,
          idTrimestre: this.idTrimestre1,
          idCicloEscolar: this.idCiclo,
          idGrado: this.idGrado,
          promedio: Number(alumno.calificacionT1)
        });
      }

      if (alumno.calificacionT2 !== null && alumno.calificacionT2 !== undefined) {
        calificacionesAGuardar.push({
          idAlumno: alumno.idAlumno,
          idMateria: this.idMateria,
          idTrimestre: this.idTrimestre2,
          idCicloEscolar: this.idCiclo,
          idGrado: this.idGrado,
          promedio: Number(alumno.calificacionT2)
        });
      }

      if (alumno.calificacionT3 !== null && alumno.calificacionT3 !== undefined) {
        calificacionesAGuardar.push({
          idAlumno: alumno.idAlumno,
          idMateria: this.idMateria,
          idTrimestre: this.idTrimestre3,
          idCicloEscolar: this.idCiclo,
          idGrado: this.idGrado,
          promedio: Number(alumno.calificacionT3)
        });
      }
    });

    const calificacionesConErrores = calificacionesAGuardar.filter(
      c => !c.idAlumno || !c.idMateria || !c.idTrimestre || !c.idCicloEscolar || !c.idGrado
    );

    if (calificacionesConErrores.length > 0) {
      this.alertService.show(
        'Error: Faltan datos necesarios para guardar.',
        'danger',
        'Error de Datos'
      );
      return;
    }

    this.loadingService.show();
    
    let contador = 0;
    let errores = 0;
    const total = calificacionesAGuardar.length;

    calificacionesAGuardar.forEach((calificacion) => {
      this.servicios.asignarCalificacion(calificacion).subscribe({
        next: () => {
          contador++;
          if (contador + errores === total) {
            this.loadingService.hide();
            
            if (errores === 0) {
              this.modoEdicion = false;
              this.alertService.show(
                `Se guardaron ${total} calificaciones exitosamente.`,
                'success',
                'Éxito'
              );
            } else {
              this.alertService.show(
                `Se guardaron ${contador} de ${total} calificaciones. ${errores} fallaron.`,
                'warning',
                'Parcialmente exitoso'
              );
            }
          }
        },
        error: () => {
          errores++;
          if (contador + errores === total) {
            this.loadingService.hide();
            
            if (contador === 0) {
              this.alertService.show(
                'Error al guardar las calificaciones.',
                'danger',
                'Error'
              );
            } else {
              this.alertService.show(
                `Se guardaron ${contador} de ${total} calificaciones. ${errores} fallaron.`,
                'warning',
                'Parcialmente exitoso'
              );
            }
          }
        }
      });
    });
  }

  volver(): void {
    this.router.navigate(['/profesor/materias']);
  }

  cargarCalificacionesExistentes(): void {
    if (!this.idMateria || !this.idCiclo || !this.idGrado) {
      return;
    }

    if (!this.idTrimestre1 || !this.idTrimestre2 || !this.idTrimestre3) {
      return;
    }

    this.servicios.obtenerCalificacionesPorGrado(
      this.idCiclo,
      this.idGrado,
      this.idMateria
    ).subscribe({
      next: (calificaciones: any[]) => {
        if (calificaciones && calificaciones.length > 0) {
          calificaciones.forEach(cal => {
            const alumno = this.alumnosCalificaciones.find(
              a => a.idAlumno === cal.idAlumno
            );

            if (alumno) {
              if (cal.trimestre1 !== null && cal.trimestre1 !== undefined) {
                alumno.calificacionT1 = cal.trimestre1;
              }
              
              if (cal.trimestre2 !== null && cal.trimestre2 !== undefined) {
                alumno.calificacionT2 = cal.trimestre2;
              }
              
              if (cal.trimestre3 !== null && cal.trimestre3 !== undefined) {
                alumno.calificacionT3 = cal.trimestre3;
              }
              
              alumno.promedioFinal = this.calcularPromedioFinal(alumno);
            }
          });
          
          this.alumnosFiltrados = [...this.alumnosCalificaciones];
          this.calcularPaginacion();
        }
      },
      error: () => {
      }
    });
  }
}