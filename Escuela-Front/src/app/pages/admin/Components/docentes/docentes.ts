import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { Materia } from '../../../../models/materia.model';
import { cargarMaterias } from '../../../../store/actions/materia.actions';
import { selectAllMaterias } from '../../../../store/selectors/materia.selectors';
import { Maestros } from '../../../../models/maestros.model';
import { ServiciosDirector } from '../../Services/servicios-director';
import { NuevoDocente } from './nuevo-docente/nuevo-docente/nuevo-docente';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    NuevoDocente
  ],
  templateUrl: './docentes.html',
  styleUrls: ['./docentes.scss']
})
export class DocentesComponent implements OnInit {
  private store = inject(Store);
  materias = signal<Materia[]>([]);

  terminoBusqueda: string = '';
  nuevom: boolean = false;
  registros: Maestros[] = [];

  registrosPorPagina = 9;
  paginaActual = 1;

  constructor(private Servicios: ServiciosDirector) { }

  get usuariosFiltrados() {
    if (!this.terminoBusqueda.trim()) return this.registros;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.registros.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.apellidos.toLowerCase().includes(termino) ||
      u.email.toLowerCase().includes(termino) ||
      u.especialidad.toLowerCase().includes(termino)
    );
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  irAPagina(num: number) {
    this.paginaActual = num;
  }

  buscar() {
    this.paginaActual = 1;
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.paginaActual = 1;
  }

  ngOnInit() {
    this.cargarDocentes();
  }

  editar(registro: any) {
    // Implementar lógica de edición
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarmodal(event: Maestros | null) {
    this.nuevom = false;
    
    if (event) {
      // Si se creó un nuevo docente, recargar la lista
      this.cargarDocentes();
    }
  }

  cargarDocentes() {
    this.Servicios.ObtenerDocentes().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('Docentes cargados:', this.registros);
      },
      error: (err) => console.error('Error al cargar Docentes:', err)
    });
  }
}