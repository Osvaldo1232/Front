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
        } else {
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('Error al cargar ciclos', err);
        this.loadingService.hide();
        this.AlertService.show(
          'Ocurrió un error al cargar los ciclos escolares',
          'danger',
          'Error'
        );
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
      this.AlertService.show(
        'Por favor, selecciona un ciclo escolar antes de buscar',
        'warning',
        'Advertencia'
      );
      return;
    }

    if (mostrarLoading) {
      this.loadingService.show();
    }

    this.servicioDirectorAsignacion.filtrarInscripciones1(this.cicloEscolar).subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones || [];
        this.loadingService.hide();

        if (inscripciones.length === 0) {
          this.AlertService.show(
            'Actualmente no se encontraron alumnos para los criterios seleccionados.',
            'warning',
            'Información'
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