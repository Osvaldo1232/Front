import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Alumnos } from '../../../../models/alumnos.model';
import { ServiciosDirectorAlumnos } from '../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { NuevoAlumno } from './nuevo_alumno/nuevo-alumno/nuevo-alumno';
import { EditarAlumno } from './editar-alumno/editar-alumno/editar-alumno'; // ⬅️ IMPORTA EL COMPONENTE EDITAR

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoAlumno,
    EditarAlumno, // ⬅️ AGREGA EDITAR A LOS IMPORTS
  ],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.scss']
})
export class AlumnosComponent implements OnInit { 
  
  searchTerm: string = '';
  registros: Alumnos[] = []; 
  nuevom: boolean = false;
  
  // Modal editar
  editarm: boolean = false;
  alumnoSeleccionado: Alumnos | null = null;

  // Paginación
  registrosPorPagina = 10;
  paginaActual = 1;

  constructor(private Servicios: ServiciosDirectorAlumnos) { }

  ngOnInit() {
    this.cargarAlumnos();
  }

  get alumnosFiltrados() {
    if (!this.searchTerm.trim()) return this.registros;
    const termino = this.searchTerm.toLowerCase();
    return this.registros.filter(a =>
      a.nombre.toLowerCase().includes(termino) ||
      a.apellidos.toLowerCase().includes(termino) ||
      a.matricula.toLowerCase().includes(termino) ||
      a.email.toLowerCase().includes(termino)
    );
  }

  get alumnosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.alumnosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.alumnosFiltrados.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  buscar() {
    this.paginaActual = 1;
  }

  limpiar() {
    this.searchTerm = '';
    this.paginaActual = 1;
  }

  onSearchChange() {
    this.paginaActual = 1;
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Alumnos | null) {
    this.nuevom = false;
    if (event) {
      this.cargarAlumnos();
    }
  }

  // ==========================
  // MODAL EDITAR
  // ==========================
  editar(alumno: Alumnos) {
    this.alumnoSeleccionado = alumno;
    this.editarm = true; // abre modal
  }

  cerrarModalEditar(event: boolean) {
    this.editarm = false; // cierra modal
    if (event) {
      this.cargarAlumnos(); // recarga la tabla si se guardó
    }
  }

  cargarAlumnos() {
    this.Servicios.ObtenerAlumnos().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('Alumnos cargados:', this.registros);
      },
      error: (err) => console.error('Error al cargar Alumnos:', err)
    });
  }
}
