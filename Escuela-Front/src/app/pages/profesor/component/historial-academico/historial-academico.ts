import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroHistorial } from '../../../../models/HistorialAcademico';
import { LoadingService } from '../../../../shared/loading-service';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { AlertService } from '../../../../shared/alert-service';
import { Loading } from "../../../../shared/loading/loading";
import { LoginService } from '../../../../services/login-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-historial-academico',
  imports: [CommonModule, FormsModule, Loading],
  templateUrl: './historial-academico.html',
  styleUrl: './historial-academico.scss'
})
export class HistorialAcademico implements OnInit {
  ciclos: any[] = [];
  cicloEscolar: string = '';
  inscripciones: RegistroHistorial[] = [];
  inscripcionesFiltradas: RegistroHistorial[] = [];
  inscripcionesPaginadas: RegistroHistorial[] = [];
  idUsuario: string = '';
  paginaActual = 1;
  totalPaginas = 1;
  registrosPorPagina = 10;
  Math = Math;

  constructor(
    private servicioDirectorAsignacion: ServiciosProfesor,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.loginService.Usuario(); 

    if (!this.idUsuario) {
      console.error('No se encontró usuario logueado');
      this.AlertService.show('No se encontró usuario logueado', 'danger', 'Error');
      return;
    }

    this.cargarCombos();
  }

  cargarCombos(): void {
    this.loadingService.show();

    this.servicioDirectorAsignacion.obtenerCiclos(this.idUsuario).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (data) => {
        this.ciclos = data;

        const cicloActual = this.obtenerCicloActual(this.ciclos);

        if (cicloActual) {
          this.cicloEscolar = cicloActual.id;
          this.buscar(false);
        } else {
          this.AlertService.show('No se encontraron ciclos escolares', 'warning', 'Información');
        }
      },
      error: (err) => {
        console.error('Error al cargar ciclos', err);
        this.AlertService.show('Error al cargar los ciclos escolares', 'danger', 'Error');
      }
    });
  }

  obtenerCicloActual(ciclos: any[]): any {
    const anioActual = new Date().getFullYear();

    const actual = ciclos.find(c =>
      anioActual >= c.anioInicio && anioActual <= c.anioFin
    );

    if (!actual) {
      return ciclos.sort((a, b) => b.anioFin - a.anioFin)[0];
    }

    return actual;
  }

  buscar(mostrarLoading: boolean = true): void {
    if (!this.cicloEscolar) {
      this.AlertService.show('Por favor, selecciona un ciclo escolar antes de buscar', 'warning', 'Advertencia');
      return;
    }

    if (mostrarLoading) {
      this.loadingService.show();
    }

    this.servicioDirectorAsignacion.filtrarInscripciones2(this.cicloEscolar, this.idUsuario).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones || [];
        this.inscripcionesFiltradas = [...this.inscripciones];
        this.paginaActual = 1;
        this.calcularPaginacion();

        if (!this.inscripciones.length) {
          this.AlertService.show('Actualmente no se encontraron alumnos para los criterios seleccionados.', 'warning', 'Sin resultados');
        }
      },
      error: (err) => {
        console.error('Error al obtener inscripciones', err);
        this.AlertService.show('Ocurrió un error al buscar los alumnos', 'danger', 'Error');
      }
    });
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.inscripcionesFiltradas.length / this.registrosPorPagina);

    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.inscripcionesPaginadas = this.inscripcionesFiltradas.slice(inicio, fin);
  }

  irAPagina(num: number): void {
    if (num < 1 || num > this.totalPaginas) return;
    this.paginaActual = num;
    this.calcularPaginacion();
  }

  limpiar(): void {
    this.cicloEscolar = '';
    this.inscripciones = [];
    this.inscripcionesFiltradas = [];
    this.inscripcionesPaginadas = [];
    this.paginaActual = 1;
    this.totalPaginas = 1;
  }
  convertirCalificacionALetras(calificacion: number | null | undefined): string {
    if (calificacion === null || calificacion === undefined) {
      return 'N/A';
    }

    const numerosALetras: { [key: string]: string } = {
      '0': 'Cero',
      '1': 'Uno',
      '2': 'Dos',
      '3': 'Tres',
      '4': 'Cuatro',
      '5': 'Cinco',
      '6': 'Seis',
      '7': 'Siete',
      '8': 'Ocho',
      '9': 'Nueve'
    };
    const calificacionFormateada = Number(calificacion).toFixed(1);
    const partes = calificacionFormateada.split('.');
    
    let resultado = calificacionFormateada + ' / ';
    const parteEntera = partes[0];
    if (parteEntera === '10') {
      resultado += 'Diez';
    } else {
      resultado += numerosALetras[parteEntera];
    }
    resultado += ' punto';
    for (let digito of partes[1]) {
      resultado += ' ' + numerosALetras[digito];
    }
    
    return resultado;
  }
}