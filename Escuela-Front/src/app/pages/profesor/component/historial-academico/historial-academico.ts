import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroHistorial } from '../../../../models/HistorialAcademico';
import { LoadingService } from '../../../../shared/loading-service';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { AlertService } from '../../../../shared/alert-service';
import { Loading } from "../../../../shared/loading/loading";
import { LoginService } from '../../../../services/login-service';

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
  idUsuario: string = '';

  constructor(
    private servicioDirectorAsignacion: ServiciosProfesor,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    this.idUsuario = this.loginService.Usuario(); 

    if (!this.idUsuario) {
      console.error('No se encontró usuario logueado');
      this.loadingService.hide();
      return;
    }

    this.cargarCombos();
  }

  cargarCombos(): void {
    this.servicioDirectorAsignacion.obtenerCiclos(this.idUsuario).subscribe({
      next: (data) => {
        this.ciclos = data;

        const cicloActual = this.obtenerCicloActual(this.ciclos);

        if (cicloActual) {
          this.cicloEscolar = cicloActual.id;
          this.buscar(false);
        }

        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error al cargar ciclos', err);
        this.loadingService.hide();
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
      alert('Por favor, selecciona un ciclo escolar antes de buscar');
      return;
    }

    if (mostrarLoading) {
      this.loadingService.show();
    }

    this.servicioDirectorAsignacion.filtrarInscripciones2(this.cicloEscolar).subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones || [];
        this.loadingService.hide();

        if (!this.inscripciones.length) {
          this.AlertService.show(
            'Actualmente no se encontraron alumnos para los criterios seleccionados.',
            'warning',
            'Error'
          );
        }
      },
      error: (err) => {
        console.error('Error al obtener inscripciones', err);
        this.loadingService.hide();
        this.AlertService.show(
          'Ocurrió un error al buscar los alumnos',
          'danger',
          'Error'
        );
      }
    });
  }

  limpiar(): void {
    this.cicloEscolar = '';
    this.inscripciones = [];
  }
}