import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { Materia } from '../../../../models/materia.model';
import { Maestros } from '../../../../models/maestros.model';
import { ServiciosDirector } from '../../Services/servicios-director';
import { NuevoDocente } from './nuevo-docente/nuevo-docente/nuevo-docente';
import { EditarDocente } from './editar-docente/editar-docente/editar-docente';
import { AsignarGrupoDocente } from '../docentes/asignacion-docente/asigacion-docente/asigacion-docente'; 
import { AlertService } from '../../../../shared/alert-service';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertaConfirmacionService } from '../../../../shared/alerta-confirmacion-service';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    NuevoDocente,
    EditarDocente,
    AsignarGrupoDocente, 
    Loading
  ],
  templateUrl: './docentes.html',
  styleUrls: ['./docentes.scss']
})
export class DocentesComponent implements OnInit {
  private store = inject(Store);
  materias = signal<Materia[]>([]);

  terminoBusqueda: string = '';
  nuevom: boolean = false;
  editarm: boolean = false;
  asignarGrupom: boolean = false;
  docenteSeleccionado: Maestros | null = null;
  docenteParaAsignar: Maestros | null = null;
  registros: Maestros[] = [];

  registrosPorPagina = 9;
  paginaActual = 1;

  constructor(
    private Servicios: ServiciosDirector,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private alerta: AlertaConfirmacionService
  ) { }

  get usuariosFiltrados() {
    if (!this.terminoBusqueda.trim()) return this.registros;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.registros.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.apellidoPaterno.toLowerCase().includes(termino) ||
      u.apellidoMaterno.toLowerCase().includes(termino) ||
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

  editar(docente: Maestros) {
    this.docenteSeleccionado = docente;
    this.editarm = true;
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarmodal(event: Maestros | null) {
    this.nuevom = false;
    
    if (event) {
      this.cargarDocentes();
    }
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.docenteSeleccionado = null;
    
    if (guardado) {
      this.cargarDocentes();
    }
  }

  abrirModalAsignacion(docente: Maestros) {
    this.docenteParaAsignar = docente;
    this.asignarGrupom = true;
  }

  cerrarModalAsignacion(guardado: boolean) {
    this.asignarGrupom = false;
    this.docenteParaAsignar = null;
    
    if (guardado) {
      console.log('✅ Asignación guardada exitosamente');
    }
  }

  // ✅ MÉTODO CORREGIDO: Cambiar estatus con confirmación
  async cambiarEstatus(docente: Maestros, event: Event) {
    // ⚠️ CRÍTICO: Prevenir el cambio del checkbox hasta confirmar
    event.preventDefault();
    
    const nuevoEstatus = docente.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    // Mostrar alerta de confirmación antes de proceder
    const confirmado = await this.alerta.mostrar(
      `¿Estás seguro de ${nuevoEstatus === 'ACTIVO' ? 'activar' : 'desactivar'} al docente ${docente.nombre}?`
    );

    if (!confirmado) {
      return; // El usuario canceló
    }

    console.log(`🔄 Cambiando estatus de ${docente.nombre} de ${docente.estatus} a ${nuevoEstatus}`);
    this.loadingService.show();

    if (docente.id) {
      this.Servicios.ActualizarEstatusDocente(docente.id, nuevoEstatus).subscribe({
        next: (mensaje) => {
          console.log('✅ Estatus cambiado exitosamente:', mensaje);

          // ✅ SOLO aquí se cambia el estatus en el modelo
          docente.estatus = nuevoEstatus;

          // Actualizar en el array
          const index = this.registros.findIndex(d => d.id === docente.id);
          if (index !== -1) {
            this.registros[index].estatus = nuevoEstatus;
          }

          this.alertService.show(
            `Docente ${nuevoEstatus === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
            'success',
            'Éxito'
          );

          this.loadingService.hide();
        },
        error: (err) => {
          console.error('❌ Error al cambiar estatus:', err);
          this.alertService.show(
            'Error al cambiar el estatus del docente',
            'danger',
            'Error'
          );
          this.loadingService.hide();
        }
      });
    } else {
      console.error('❌ El docente no tiene ID');
      this.loadingService.hide();
    }
  }

  cargarDocentes() {
    this.loadingService.show();
    this.Servicios.ObtenerDocentes().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('👨‍🏫 Docentes cargados:', this.registros);
        this.loadingService.hide(); 
      },
      error: (err) => {
        console.error('Error al cargar Docentes:', err);
        this.loadingService.hide();
      }
    });
  }
}