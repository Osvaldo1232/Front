import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Tutores } from '../../../../../models/tutores.model';
import { ServiciosDirectorTutores } from '../../../Services/servicios-director-tutores/servicios-director-tutores';
import { NuevoTutor } from '../tutores/nuevo-tutor/nuevo-tutor/nuevo-tutor';
import { EditarTutor } from '../tutores/editar-tutor/editar-tutor/editar-tutor';

@Component({
  selector: 'app-tutores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoTutor,
    EditarTutor
  ],
  templateUrl: './tutores.html',
  styleUrls: ['./tutores.scss']
})
export class TutoresComponent implements OnInit {
  
  terminoBusqueda: string = '';
  registros: Tutores[] = [];
  nuevom: boolean = false;
  
  // Modal editar
  editarm: boolean = false;
  tutorSeleccionado: Tutores | null = null;

  // Paginación
  registrosPorPagina = 10;
  paginaActual = 1;

  constructor(private Servicios: ServiciosDirectorTutores) { }

  ngOnInit() {
    this.cargarTutores();
  }

  get tutoresFiltrados() {
    if (!this.terminoBusqueda.trim()) return this.registros;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.registros.filter(t =>
      t.nombre.toLowerCase().includes(termino) ||
      t.apellidos.toLowerCase().includes(termino) ||
      t.correo.toLowerCase().includes(termino) ||
      t.telefono.toLowerCase().includes(termino)
    );
  }

  get tutoresPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.tutoresFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.tutoresFiltrados.length / this.registrosPorPagina);
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

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.paginaActual = 1;
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Tutores | null) {
    this.nuevom = false;
    if (event) {
      this.cargarTutores();
    }
  }

  editar(tutor: Tutores) {
    this.tutorSeleccionado = tutor;
    this.editarm = true;
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.tutorSeleccionado = null;
    if (guardado) {
      this.cargarTutores();
    }
  }

  cargarTutores() {
    this.Servicios.ObtenerTutores().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('Tutores cargados:', this.registros);
      },
      error: (err) => console.error('Error al cargar Tutores:', err)
    });
  }
}