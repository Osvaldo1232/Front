import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalificacionAlumno } from '../../../../models/HistorialAcademico copy';
import { FiltrosAlumno } from '../../../../models/HistorialAcademico copy';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss'
})
export class Historial implements OnInit{
  calificaciones: CalificacionAlumno[] = [];
  ciclosDisponibles: string[] = [];
  cargando: boolean = false;
  busquedaRealizada: boolean = false;

  filtros: FiltrosAlumno = {
    cicloEscolar: '',
    alumno: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.cargarCiclosEscolares();
  }
  cargarCiclosEscolares(): void {
    this.ciclosDisponibles = ['2024-2025', '2023-2024', '2022-2023'];
  }

  puedesBuscar(): boolean {
    return this.filtros.cicloEscolar !== '' && this.filtros.alumno.trim() !== '';
  }

  buscarHistorial(): void {
    if (!this.puedesBuscar()) {
      return;
    }

    this.cargando = true;
    this.busquedaRealizada = true;
    setTimeout(() => {
      this.calificaciones = [
        {
          id: '1',
          campoFormativo: 'Lenguas',
          grado: '1',
          grupo: 'A',
          trimestre1: 10,
          trimestre2: 2,
          trimestre3: 10,
          calificacionFinal: 10
        },
        {
          id: '2',
          campoFormativo: 'Conocimiento Matematico',
          grado: '1',
          grupo: 'A',
          trimestre1: 10,
          trimestre2: 2,
          trimestre3: 10,
          calificacionFinal: 10
        },
        {
          id: '3',
          campoFormativo: 'Tecnologia',
          grado: '1',
          grupo: 'A',
          trimestre1: 9,
          trimestre2: 2,
          trimestre3: 9,
          calificacionFinal: 9
        },
        {
          id: '4',
          campoFormativo: 'Ciencias Sociales',
          grado: '1',
          grupo: 'A',
          trimestre1: 10,
          trimestre2: 2,
          trimestre3: 10,
          calificacionFinal: 10
        }
      ];
      this.cargando = false;
    }, 1000);
  }

  limpiarFiltros(): void {
    this.filtros = {
      cicloEscolar: '',
      alumno: ''
    };
    this.calificaciones = [];
    this.busquedaRealizada = false;
  }
}
