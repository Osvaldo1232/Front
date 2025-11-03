import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Grupos } from '../../../../models/grupos.models';
import { ServiciosDirectorGrupos } from '../../Services/servicios-director-grupos/servicio-director-grupos';
import { EditarGrupo } from '../grupos/editar-grupo/editar-grupo/editar-grupo';
import { NuevoGrupo } from '../grupos/nuevo-grupo/nuevo-grupo/nuevo-grupo';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoGrupo,
    EditarGrupo
  ],
  templateUrl: './grupos.html',
  styleUrls: ['./grupos.scss']
})
export class GruposComponent implements OnInit {
  
  registros: Grupos[] = [];
  nuevom: boolean = false;
  
  // Modal editar
  editarm: boolean = false;
  grupoSeleccionado: Grupos | null = null;

  // Paginación
  registrosPorPagina = 6; // 6 cards (3x2)
  paginaActual = 1;

  constructor(private Servicios: ServiciosDirectorGrupos) { }

  ngOnInit() {
    this.cargarGrupos();
  }

  get totalPaginas() {
    return Math.ceil(this.registros.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Grupos | null) {
    this.nuevom = false;
    if (event) {
      this.cargarGrupos();
    }
  }

  editar(grupo: Grupos) {
    this.grupoSeleccionado = grupo;
    this.editarm = true;
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.grupoSeleccionado = null;
    if (guardado) {
      this.cargarGrupos();
    }
  }

  cambiarEstatus(grupo: Grupos) {
    grupo.estatus = grupo.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    console.log('Cambiar estatus:', grupo);
    // Aquí llamarías al servicio para actualizar en el backend si lo necesitas
  }

  cargarGrupos() {
    this.Servicios.ObtenerGrupos().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('Grupos cargados:', this.registros);
      },
      error: (err) => console.error('Error al cargar Grupos:', err)
    });
  }
}