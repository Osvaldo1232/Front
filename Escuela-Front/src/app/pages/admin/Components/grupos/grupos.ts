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
import { AlertaConfirmacionService } from '../../../../shared/alerta-confirmacion-service';
import { AlertService } from '../../../../shared/alert-service';

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

  constructor(
    private Servicios: ServiciosDirectorGrupos,
    private loadingService: LoadingService,
    private alerta: AlertaConfirmacionService,
    private alertService: AlertService
  ) { }

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

  existeNombreGrupo(nombre: string, idExcluir?: string): boolean {
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

  // ✅ MÉTODO CORREGIDO: Cambiar estatus con confirmación
  async cambiarEstatus(grupo: Grupos, event: Event) {
    // ⚠️ CRÍTICO: Prevenir el cambio del checkbox hasta confirmar
    event.preventDefault();
    
    const nuevoEstatus = grupo.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    // Mostrar alerta de confirmación antes de proceder
    const confirmado = await this.alerta.mostrar(
      `¿Estás seguro de ${nuevoEstatus === 'ACTIVO' ? 'activar' : 'desactivar'} el grupo ${grupo.nombre}?`
    );

    if (!confirmado) {
      return; // El usuario canceló
    }

    console.log(`🔄 Cambiando estatus de ${grupo.nombre} de ${grupo.estatus} a ${nuevoEstatus}`);
    this.loadingService.show();

    // Crear objeto actualizado
    const grupoActualizado: Grupos = {
      ...grupo,
      estatus: nuevoEstatus
    };

    if (grupo.id) {
      this.Servicios.ActualizarGrupo(grupo.id, grupoActualizado).subscribe({
        next: (mensaje) => {
          console.log('✅ Estatus cambiado exitosamente:', mensaje);

          // ✅ SOLO aquí se cambia el estatus en el modelo
          grupo.estatus = nuevoEstatus;

          // Actualizar en el array
          const index = this.registros.findIndex(g => g.id === grupo.id);
          if (index !== -1) {
            this.registros[index].estatus = nuevoEstatus;
          }

          this.alertService.show(
            `Grupo ${nuevoEstatus === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
            'success',
            'Éxito'
          );

          this.loadingService.hide();
        },
        error: (err) => {
          console.error('❌ Error al cambiar estatus:', err);
          this.alertService.show(
            'Error al cambiar el estatus del grupo',
            'danger',
            'Error'
          );
          this.loadingService.hide();
        }
      });
    } else {
      this.loadingService.hide();
    }
  }

  cargarGrupos() {
    this.loadingService.show();
    this.Servicios.ObtenerGrupos().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('📚 Grupos cargados:', this.registros);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('❌ Error al cargar grupos:', err);
        this.loadingService.hide();
      }
    });
  }
}