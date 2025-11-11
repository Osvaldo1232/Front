import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { NuevoGrado } from '../../modales/nuevo-grado/nuevo-grado';
import { ServiciosDirector } from '../../Services/servicios-director';
import { Grados } from '../../../../models/grado.models';
import { EditarGrado } from './editar-grado/editar-grado/editar-grado';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { AlertaConfirmacionService } from '../../../../shared/alerta-confirmacion-service';

@Component({
  selector: 'app-grado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    MultiSelectModule,
    NuevoGrado,
    EditarGrado,
    Loading
  ],
  templateUrl: './grado.html',
  styleUrls: ['./grado.scss']
})
export class Grado implements OnInit {

  nuevom: boolean = false;
  registros: Grados[] = [];

  editarm: boolean = false;
  gradoSeleccionado: Grados | null = null;

  registrosPorPagina = 6;
  paginaActual = 1;

  constructor(
    private Servicios: ServiciosDirector,
    private loadingService: LoadingService,
    private alertService: AlertService,
      private alerta:AlertaConfirmacionService
  ) { }

  ngOnInit() {
    this.cargarGrados();
  }

  get registrosPaginados(): Grados[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.registros.slice(inicio, fin);
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

  existeNombreGrado(nombre: string, idExcluir?: number): boolean {
    return this.registros.some(grado =>
      grado.nombre.toLowerCase().trim() === nombre.toLowerCase().trim() &&
      grado.id !== idExcluir
    );
  }

  nuevo() {
    this.nuevom = true;
  }

  editar(grado: Grados) {
    this.gradoSeleccionado = grado;
    this.editarm = true;
  }

  cerrarmodal(event: Grados | null) {

    if (event && this.existeNombreGrado(event.nombre)) {
      this.alertService.show(
        'Ya existe un grado con ese nombre. Por favor, elige otro.',
        'warning',
        'Duplicado'
      );
      return;
    }

    this.nuevom = false;

    if (event?.id) {
      this.cargarGrados();
    }
  }

  cerrarModalEditar(guardado: boolean) {

    if (
      guardado &&
      this.gradoSeleccionado &&
      this.existeNombreGrado(this.gradoSeleccionado.nombre, this.gradoSeleccionado.id)
    ) {
      this.alertService.show(
        'Ya existe un grado con ese nombre. Por favor, elige otro.',
        'warning',
        'Duplicado'
      );
      return;
    }

    this.editarm = false;
    this.gradoSeleccionado = null;

    if (guardado) {
      this.cargarGrados();
    }
  }

  async cambiarEstatus(grado: Grados) {
        const confirmado = await this.alerta.mostrar('¿Estás seguro de cambiar el estatus?');

  if (!confirmado) {
    return; // El usuario canceló
  }
    grado.estatus = grado.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  }

  cargarGrados() {
    this.loadingService.show();

    this.Servicios.obtenerGrados().subscribe({
      next: (res) => {
        this.registros = res;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Ya existe un grupo con ese nombre. Por favor, elige otro nombre.', err);
        this.alertService.show(
          'Ya existe un grupo con ese nombre. Por favor, elige otro nombre.',
          'danger',
          'Error'
        );
      }
    });
  }
}