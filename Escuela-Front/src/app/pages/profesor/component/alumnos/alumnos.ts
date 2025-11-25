import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { CommonModule } from '@angular/common';
import { AlumnoCiclo } from '../../../../models/Materia';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { Loading } from "../../../../shared/loading/loading";
import { LoginService } from '../../../../services/login-service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [FormsModule, CommonModule, Loading],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.scss'
})
export class Alumnos implements OnInit {
  ciclos: any[] = [];
  cicloEscolar: string = '';
  inscripciones: AlumnoCiclo[] = [];
  inscripcionesFiltradas: AlumnoCiclo[] = [];
  inscripcionesPaginadas: AlumnoCiclo[] = [];
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
        this.AlertService.show('Ocurrió un error al cargar los ciclos escolares', 'danger', 'Error');
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

    this.servicioDirectorAsignacion.filtrarInscripciones1(this.cicloEscolar,  this.idUsuario).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones || [];
        this.inscripcionesFiltradas = [...this.inscripciones];
        this.paginaActual = 1;
        this.calcularPaginacion();

        if (inscripciones.length === 0) {
          this.AlertService.show('Actualmente no se encontraron alumnos para los criterios seleccionados.', 'warning', 'Información');
        }
      },
      error: (err) => {
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
}