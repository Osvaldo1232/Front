import { Component, OnInit } from '@angular/core';
import { AsignacionGradoGrupo } from '../../../../models/Materia';
import { ServiciosDirectorGrupos } from '../../Services/servicios-director-grupos/servicio-director-grupos';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-asignacion-grado',
  standalone: true,
  imports: [FormsModule, CommonModule, Loading],
  templateUrl: './asignacion-grado.html',
  styleUrl: './asignacion-grado.scss'
})
export class AsignacionGrado implements OnInit {
  ciclos: any[] = [];
  cicloEscolar: string = '';
  inscripciones: AsignacionGradoGrupo[] = [];

  constructor(
    private servicioDirectorAsignacion: ServiciosDirectorGrupos,
    private loadingService: LoadingService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    // 🔹 Mostrar loading al entrar a la pantalla
    this.loadingService.show();
    this.cargarCombos();
  }

  cargarCombos(): void {
    this.servicioDirectorAsignacion.obtenerCiclos().subscribe({
      next: (data) => {
        this.ciclos = data;

        // 🔹 Determinar el ciclo actual o más reciente
        const cicloActual = this.obtenerCicloActual(this.ciclos);

        if (cicloActual) {
          this.cicloEscolar = cicloActual.id; // precargar el combo
          this.buscar(false); // cargar inscripciones sin mostrar loading extra
        } else {
          // Si no hay ciclos, ocultar el loading
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('Error al cargar ciclos', err);
        this.loadingService.hide();
      }
    });
  }

  // 🔹 Buscar el ciclo que incluya el año actual
  obtenerCicloActual(ciclos: any[]): any {
    const anioActual = new Date().getFullYear();

    const actual = ciclos.find(c =>
      anioActual >= c.anioInicio && anioActual <= c.anioFin
    );

    // Si no hay ciclo activo, tomar el más reciente por año de fin
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

    this.servicioDirectorAsignacion.filtrarInscripciones(this.cicloEscolar).subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones || [];
        this.loadingService.hide();

        if (inscripciones.length === 0) {
          this.AlertService.show(
            'Actualmente no se encontraron alumnos para los criterios seleccionados.',
            'danger',
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
