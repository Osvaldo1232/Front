import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalEdicionCalificacionComponent } from './modal-edicion-calificacion/modal-edicion-calificacion';


@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalEdicionCalificacionComponent], 
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.scss'
})
export class CalificacionesComponent implements OnInit {

  formulario = {
    estudiante: '', materia: '', grado: '', grupo: '',
    trimestre: '', ciclo: '', calificacion: null as number | null
  };

  registros: any[] = [ // Datos de ejemplo
    { matricula: '20230136', nombreEstudiante: 'Kevin Antonio Hernandez Garcia', materia: 'Español', grado: '1', grupo: 'A', trimestre: '1er Trimestre', ciclo: '2019-2020', calificacion: 10 },
    { matricula: '20230137', nombreEstudiante: 'Luis Angel Velazquez Garcia', materia: 'Matematicas', grado: '1', grupo: 'B', trimestre: '2do Trimestre', ciclo: '2019-2020', calificacion: 9 },
    { matricula: '20230138', nombreEstudiante: 'Osvaldo Florencio Jeronimo', materia: 'Español', grado: '1', grupo: 'A', trimestre: '1er Trimestre', ciclo: '2020-2021', calificacion: 6 },
    { matricula: '20230139', nombreEstudiante: 'Diana Laura Rodriguez Salas', materia: 'Ingles', grado: '2', grupo: 'C', trimestre: '3er Trimestre', ciclo: '2020-2021', calificacion: 8.5 },
    { matricula: '20230140', nombreEstudiante: 'Carlos Manuel Gómez Pérez', materia: 'Matematicas', grado: '2', grupo: 'B', trimestre: '2do Trimestre', ciclo: '2021-2022', calificacion: 7 },
  ];

  filtros = {
    matricula: '',
    nombreEstudiante: '',
    materia: '',
    grado: '',
    grupo: '',
    trimestre: '',
    ciclo: '',
    calificacion: ''
  };

  registrosPorPagina = 5;
  paginaActual = 1;

  get registrosFiltrados(): any[] {
    const terminos = Object.keys(this.filtros);
    let datosFiltrados = this.registros;
    if (terminos.every(key => !this.filtros[key as keyof typeof this.filtros])) {
        return this.registros; 
    }

    datosFiltrados = this.registros.filter(registro => {
      let coincide = true;
      for (const key of terminos) {
        const filtroValor = this.filtros[key as keyof typeof this.filtros].toLowerCase().trim();
        const registroValor = String(registro[key]).toLowerCase().trim();
        if (filtroValor && !registroValor.includes(filtroValor)) {
          coincide = false;
          break;
        }
      }
      return coincide;
    });

    return datosFiltrados;
  }

  get totalPaginas(): number {
    return Math.ceil(this.registrosFiltrados.length / this.registrosPorPagina);
  }

  get registrosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.registrosFiltrados.slice(inicio, fin);
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
  }
  
  irAPagina(num: number): void {
    if (num > 0 && num <= this.totalPaginas) {
        this.paginaActual = num;
    }
  }

  registroParaEditar: any = null;

  editar(registro: any): void { 
    this.registroParaEditar = registro;
  }

  manejarCierreModal(registroActualizado: any): void {
    if (registroActualizado) {
        console.log('Registro guardado y actualizado en la lista:', registroActualizado);
        
        const index = this.registros.findIndex(r => r.matricula === registroActualizado.matricula);
        if (index > -1) {
            this.registros[index] = registroActualizado; 
        }
    }
    this.registroParaEditar = null;
  }

  guardar(): void {
    console.log('Guardando nuevo registro:', this.formulario);
  }

  limpiar(): void {
    console.log('Limpiando formulario.');
    this.formulario = {
        estudiante: '', materia: '', grado: '', grupo: '',
        trimestre: '', ciclo: '', calificacion: null
    };
  }

  ngOnInit(): void {
  }
}