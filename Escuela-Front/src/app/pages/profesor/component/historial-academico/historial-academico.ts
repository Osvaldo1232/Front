import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroHistorial } from '../../../../models/HistorialAcademico';
import { FiltrosHistorial } from '../../../../models/HistorialAcademico';

@Component({
  selector: 'app-historial-academico',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-academico.html',
  styleUrl: './historial-academico.scss'
})
export class HistorialAcademico implements OnInit {
  registros: RegistroHistorial[] = [];
  registrosFiltrados: RegistroHistorial[] = [];
  ciclosDisponibles: string[] = [];
  cargando: boolean = false;

  filtros: FiltrosHistorial = {
    cicloEscolar: '',
    alumno: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;

    this.registros = [
      {
        id: '1',
        alumno: 'Esteban Jaimes',
        cicloEscolar: '2024-2025',
        grado: '1',
        grupo: 'A',
        calificacion: 10
      },
      {
        id: '2',
        alumno: 'Perla Tinoco',
        cicloEscolar: '2024-2025',
        grado: '1',
        grupo: 'A',
        calificacion: 10
      },
      {
        id: '3',
        alumno: 'Melquiades Gomez',
        cicloEscolar: '2024-2025',
        grado: '1',
        grupo: 'A',
        calificacion: 9
      },
      {
        id: '4',
        alumno: 'Himaldo Juarez',
        cicloEscolar: '2024-2025',
        grado: '1',
        grupo: 'A',
        calificacion: 10
      },
      {
        id: '5',
        alumno: 'Nicodemo Soto',
        cicloEscolar: '2024-2025',
        grado: '1',
        grupo: 'A',
        calificacion: 9
      },
      {
        id: '6',
        alumno: 'Fidencio Minotios',
        cicloEscolar: '2024-2025',
        grado: '1',
        grupo: 'A',
        calificacion: 10
      }
    ];

    this.ciclosDisponibles = [...new Set(this.registros.map(r => r.cicloEscolar))];

    this.registrosFiltrados = [...this.registros];
    this.cargando = false;
  }

  aplicarFiltros(): void {
    this.registrosFiltrados = this.registros.filter(registro => {
      const cumpleCiclo = !this.filtros.cicloEscolar ||
        registro.cicloEscolar === this.filtros.cicloEscolar;

      const cumpleAlumno = !this.filtros.alumno ||
        registro.alumno.toLowerCase().includes(this.filtros.alumno.toLowerCase());

      return cumpleCiclo && cumpleAlumno;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      cicloEscolar: '',
      alumno: ''
    };
    this.registrosFiltrados = [...this.registros];
  }
}
