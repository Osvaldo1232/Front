import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Grupos } from '../../../../models/grupos.models';
import { ServiciosDirectorGrupos } from '../../Services/servicios-director-grupos/servicio-director-grupos';
import { EditarGrupo } from '../grupos/editar-grupo/editar-grupo/editar-grupo';
import { NuevoGrupo } from '../grupos/nuevo-grupo/nuevo-grupo/nuevo-grupo';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoGrupo,
    EditarGrupo,
    Loading
  ],
  templateUrl: './grupos.html',
  styleUrls: ['./grupos.scss']
})
export class GruposComponent implements OnInit {

  registros: Grupos[] = [];
  nuevom: boolean = false;

  editarm: boolean = false;
  grupoSeleccionado: Grupos | null = null;

  registrosPorPagina = 6;
  paginaActual = 1;

  constructor(private Servicios: ServiciosDirectorGrupos, private loadingService: LoadingService,) { }

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
  existeNombreGrupo(nombre: string, idExcluir?: number): boolean {
    return this.registros.some(grupo =>
      grupo.nombre.toLowerCase().trim() === nombre.toLowerCase().trim() &&
      grupo.id !== idExcluir
    );
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Grupos | null) {
    if (event && this.existeNombreGrupo(event.nombre)) {
      return;
    }
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
  }

  cargarGrupos() {
    this.loadingService.show();
    this.Servicios.ObtenerGrupos().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('Grupos cargados:', this.registros);
        this.loadingService.hide();
      },
      error: (err) => console.error('Ya existe un grupo con ese nombre. Por favor, elige otro nombre.', err)
    });
  }
}