import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { CommonModule } from '@angular/common';
import { InscripcionDTO } from '../../../../models/Materia';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { Loading } from "../../../../shared/loading/loading";


@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [FormsModule, CommonModule, Loading],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.scss'
})
export class Alumnos implements OnInit {
  grados: any[] = [];
  grupos: any[] = [];
  ciclos: any[] = [];

  gradoId: string = '';
  grupoId: string = '';
  cicloEscolar: string = '';
  inscripciones: InscripcionDTO[] = [];

  constructor(private servicioProfesor: ServiciosProfesor, private loadingService: LoadingService, private AlertService: AlertService) {}

  ngOnInit(): void {
    this.cargarCombos();
  }
  cargarCombos(): void {
    this.servicioProfesor.obtenerGradosUno().subscribe({
      next: (data) => this.grados = data,
      error: (err) => console.error('Error al cargar grados', err)
    });

    this.servicioProfesor.obtenerGrupos().subscribe({
      next: (data) => this.grupos = data,
      error: (err) => console.error('Error al cargar grupos', err)
    });

    this.servicioProfesor.obtenerCiclos().subscribe({
      next: (data) => this.ciclos = data,
      error: (err) => console.error('Error al cargar ciclos', err)
    });
  }

  buscar(): void {
    if (!this.gradoId || !this.grupoId || !this.cicloEscolar) {
      alert('Por favor, llena todos los campos antes de buscar');
      return;
    }
    this.loadingService.show();

    this.servicioProfesor.filtrarInscripciones(this.gradoId, this.grupoId, this.cicloEscolar).subscribe({
        next: (inscripciones) => {
        this.inscripciones = inscripciones || [];
        this.loadingService.hide();

        if(inscripciones.length === 0){
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
    this.gradoId = '';
    this.grupoId = '';
    this.cicloEscolar = '';
    this.inscripciones = [];
  }
}