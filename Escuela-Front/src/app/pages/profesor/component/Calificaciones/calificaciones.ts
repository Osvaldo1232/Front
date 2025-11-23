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

  calificacionesIdsMap: Map<string, {
    idCalT1?: string,
    idCalT2?: string,
    idCalT3?: string
  }> = new Map();

  filtros = {
    nombreEstudiante: ''
  };
  paginaActual = 1;
  totalPaginas = 1;
  registrosPorPagina = 10;

  modoEdicion = false;
  cargando = false;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicios: ServiciosProfesor,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

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
    this.calificacionesIdsMap.clear();

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

  validarYLimitarInput(event: any, alumno: AlumnoCalificacion, trimestre: number): void {
    let valor = event.target.value;
    valor = valor.replace(/[^0-9.]/g, '');
    
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }

    // Limitar a 1 decimal
    if (partes.length === 2 && partes[1].length > 1) {
      valor = partes[0] + '.' + partes[1].substring(0, 1);
    }

    let numero = parseFloat(valor);
    if (numero > 10) {
      numero = 10;
      valor = '10';
    }
    if (numero < 0) {
      numero = 0;
      valor = '0';
    }

    if (trimestre === 1) {
      alumno.calificacionT1 = isNaN(numero) ? null : numero;
    } else if (trimestre === 2) {
      alumno.calificacionT2 = isNaN(numero) ? null : numero;
    } else if (trimestre === 3) {
      alumno.calificacionT3 = isNaN(numero) ? null : numero;
    }

    event.target.value = isNaN(numero) ? '' : valor;
    this.onCalificacionChange(alumno);
  }

  convertirCalificacionALetras(calificacion: number | null): string {
    if (calificacion === null || calificacion === undefined) return '';
    
    const parteEntera = Math.floor(calificacion);
    const parteDecimal = Math.round((calificacion - parteEntera) * 10);

    const numerosALetras: { [key: number]: string } = {
      0: 'Cero',
      1: 'Uno',
      2: 'Dos',
      3: 'Tres',
      4: 'Cuatro',
      5: 'Cinco',
      6: 'Seis',
      7: 'Siete',
      8: 'Ocho',
      9: 'Nueve',
      10: 'Diez'
    };

    let resultado = numerosALetras[parteEntera] || calificacion.toString();
    
    if (parteDecimal > 0) {
      resultado += ` punto ${numerosALetras[parteDecimal] || ''}`;
    }
    
    return resultado;
  }

  convertirPromedioALetras(promedio: number | null): string {
    if (promedio === null || promedio === undefined) return '';
    
    const promedioRedondeado = Math.round(promedio * 10) / 10;
    
    const parteEntera = Math.floor(promedioRedondeado);
    const parteDecimal = Math.round((promedioRedondeado - parteEntera) * 10);
    
    const numerosALetras: { [key: number]: string } = {
      0: 'cero',
      1: 'uno',
      2: 'dos',
      3: 'tres',
      4: 'cuatro',
      5: 'cinco',
      6: 'seis',
      7: 'siete',
      8: 'ocho',
      9: 'nueve',
      10: 'diez'
    };
    
    let resultado = numerosALetras[parteEntera] || '';
    
    if (parteDecimal > 0) {
      resultado += ` punto ${numerosALetras[parteDecimal] || ''}`;
    }
    
    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
  }

  calcularPromedioFinal(alumno: AlumnoCalificacion): number | null {
    const calificaciones = [
      alumno.calificacionT1,
      alumno.calificacionT2,
      alumno.calificacionT3
    ].filter(c => c !== null && c !== undefined) as number[];

    if (calificaciones.length === 0) return null;

    const suma = calificaciones.reduce((acc, cal) => acc + cal, 0);
    const promedio = suma / calificaciones.length;
    
    // Redondear a 1 decimal
    return Math.round(promedio * 10) / 10;
  }

  puedeEditarTrimestre1(alumno: AlumnoCalificacion): boolean {
    return this.modoEdicion;
  }

  puedeEditarTrimestre2(alumno: AlumnoCalificacion): boolean {
    return this.modoEdicion && alumno.calificacionT1 !== null && alumno.calificacionT1 !== undefined;
  }

  puedeEditarTrimestre3(alumno: AlumnoCalificacion): boolean {
    return this.modoEdicion &&
      alumno.calificacionT1 !== null && alumno.calificacionT1 !== undefined &&
      alumno.calificacionT2 !== null && alumno.calificacionT2 !== undefined;
  }

  onCalificacionChange(alumno: AlumnoCalificacion): void {
    alumno.promedioFinal = this.calcularPromedioFinal(alumno);
  }

  Editar(): void {
    this.modoEdicion = true;
  }

  guardar(): void {
    if (!this.idMateria || !this.idGrado || !this.idGrupo || !this.idCiclo) {
      this.alertService.show(
        'Error: Faltan datos necesarios.',
        'danger',
        'Error'
      );
      return;
    }

    if (!this.idTrimestre1 || !this.idTrimestre2 || !this.idTrimestre3) {
      this.alertService.show(
        'Error: No se pudieron cargar los trimestres.',
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
        'Debe ingresar al menos una calificación.',
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
        'Todas las calificaciones deben ser números entre 0 y 10.',
        'warning',
        'Validación'
      );
      return;
    }

    const alumnosOrdenIncorrecto = this.alumnosCalificaciones.filter(alumno => {
      if ((alumno.calificacionT2 !== null && alumno.calificacionT2 !== undefined) &&
        (alumno.calificacionT1 === null || alumno.calificacionT1 === undefined)) {
        return true;
      }

      if ((alumno.calificacionT3 !== null && alumno.calificacionT3 !== undefined) &&
        ((alumno.calificacionT1 === null || alumno.calificacionT1 === undefined) ||
          (alumno.calificacionT2 === null || alumno.calificacionT2 === undefined))) {
        return true;
      }
      return false;
    });

    if (alumnosOrdenIncorrecto.length > 0) {
      this.alertService.show(
        'Debe calificar los trimestres en orden: primero el Trimestre 1, luego el 2 y finalmente el 3.',
        'warning',
        'Orden incorrecto'
      );
      return;
    }

    this.loadingService.show();

    const calificacionesAGuardar: any[] = [];
    const calificacionesUnicas = new Set<string>();

    this.alumnosCalificaciones.forEach(alumno => {
      const idsExistentes = this.calificacionesIdsMap.get(alumno.idAlumno);

      if (alumno.calificacionT1 !== null && alumno.calificacionT1 !== undefined) {
        const key = `${alumno.idAlumno}-${this.idTrimestre1}`;

        if (!calificacionesUnicas.has(key)) {
          calificacionesUnicas.add(key);

          const payload: any = {
            idAlumno: alumno.idAlumno,
            idMateria: this.idMateria,
            idTrimestre: this.idTrimestre1,
            idCicloEscolar: this.idCiclo,
            idGrado: this.idGrado,
            promedio: Number(alumno.calificacionT1)
          };

          if (idsExistentes?.idCalT1) {
            payload.id = idsExistentes.idCalT1;
          }

          calificacionesAGuardar.push(payload);
        }
      }

      if (alumno.calificacionT2 !== null && alumno.calificacionT2 !== undefined) {
        const key = `${alumno.idAlumno}-${this.idTrimestre2}`;

        if (!calificacionesUnicas.has(key)) {
          calificacionesUnicas.add(key);

          const payload: any = {
            idAlumno: alumno.idAlumno,
            idMateria: this.idMateria,
            idTrimestre: this.idTrimestre2,
            idCicloEscolar: this.idCiclo,
            idGrado: this.idGrado,
            promedio: Number(alumno.calificacionT2)
          };

          if (idsExistentes?.idCalT2) {
            payload.id = idsExistentes.idCalT2;
          }

          calificacionesAGuardar.push(payload);
        }
      }

      if (alumno.calificacionT3 !== null && alumno.calificacionT3 !== undefined) {
        const key = `${alumno.idAlumno}-${this.idTrimestre3}`;

        if (!calificacionesUnicas.has(key)) {
          calificacionesUnicas.add(key);

          const payload: any = {
            idAlumno: alumno.idAlumno,
            idMateria: this.idMateria,
            idTrimestre: this.idTrimestre3,
            idCicloEscolar: this.idCiclo,
            idGrado: this.idGrado,
            promedio: Number(alumno.calificacionT3)
          };

          if (idsExistentes?.idCalT3) {
            payload.id = idsExistentes.idCalT3;
          }

          calificacionesAGuardar.push(payload);
        }
      }
    });

    this.guardarCalificacionesMultiples(calificacionesAGuardar);
  }

  guardarCalificacionesMultiples(calificaciones: any[]): void {
    if (calificaciones.length === 0) {
      this.loadingService.hide();
      this.alertService.show(
        'No hay calificaciones para guardar.',
        'warning',
        'Validación'
      );
      return;
    }

    this.servicios.asignarCalificacionesMultiples(calificaciones).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.modoEdicion = false;

        this.alertService.show(
          `Calificación registrada exitosamente.`,
          'success',
          'Éxito'
        );

        setTimeout(() => {
          this.cargarCalificacionesExistentes();
        }, 500);
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error al guardar calificaciones:', err);
        this.alertService.show(
          'Error al guardar las calificaciones.',
          'danger',
          'Error'
        );
      }
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
        this.calificacionesIdsMap.clear();

        if (calificaciones && calificaciones.length > 0) {
          calificaciones.forEach(cal => {
            this.calificacionesIdsMap.set(cal.idAlumno, {
              idCalT1: cal.idCalificacionTrimestre1,
              idCalT2: cal.idCalificacionTrimestre2,
              idCalT3: cal.idCalificacionTrimestre3
            });

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
      error: (err) => {
        console.error('Error al cargar calificaciones existentes:', err);
      }
    });
  }
}