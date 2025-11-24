import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Materia } from '../../../../../models/materia.model';
import { CampoFormativoModel } from '../../../../../models/campo-formativo.model';
import { ServiciosDirectorMaterias } from '../../../Services/servicios-director-materias/servicios-director-materias';
import { ServiciosCampoFormativo } from '../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { NuevaMateria } from '../materia/nueva-materia/nueva-materia/nueva-materia';
import { EditarMateria } from '../editar-materia/editar-materia/editar-materia';
import { AlertService } from '../../../../../shared/alert-service';
import { AlertaConfirmacionService } from '../../../../../shared/alerta-confirmacion-service';
import { Loading } from '../../../../../shared/loading/loading';
import { LoadingService } from '../../../../../shared/loading-service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevaMateria,
    EditarMateria,
    Loading
  ],
  templateUrl: './materia.html',
  styleUrls: ['./materia.scss']
})
export class MateriasComponent implements OnInit {
  
  registros: Materia[] = [];
  camposFormativos: CampoFormativoModel[] = [];
  
  campoFormativoSeleccionado: string = '';
  
  nuevom: boolean = false;
  editarm: boolean = false;
  materiaSeleccionada: Materia | null = null;

  // Paginación
  registrosPorPagina = 6;
  paginaActual = 1;

  constructor(
    private serviciosMaterias: ServiciosDirectorMaterias,
    private serviciosCamposFormativos: ServiciosCampoFormativo,
    private alertService: AlertService, 
    private alerta: AlertaConfirmacionService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.cargarCamposFormativos();
  }

 cargarCamposFormativos() {
  this.serviciosCamposFormativos.ObtenerCampoFormativo().subscribe({
    next: (res) => {
      this.camposFormativos = res;
      console.log('📋 Campos Formativos cargados:', this.camposFormativos);
      
      // ✅ Seleccionar automáticamente el primer campo formativo
      if (this.camposFormativos.length > 0) {
        this.campoFormativoSeleccionado = String(this.camposFormativos[0].id || '');
        console.log('✅ Primer campo formativo seleccionado:', this.camposFormativos[0].nombre);
        this.aplicarFiltro();
      }
    },
    error: (err) => console.error('Error al cargar Campos Formativos:', err)
  });
}
  cargarDatos() {
    this.loadingService.show();
    this.serviciosMaterias.ObtenerMaterias().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('📚 Materias cargadas:', this.registros);
        this.loadingService.hide(); 
      },
      error: (err) => {
        console.error('Error al cargar Materias:', err);
        this.loadingService.hide();
      }
    });
  }

  aplicarFiltro() {
    if (!this.campoFormativoSeleccionado || this.campoFormativoSeleccionado === '') {
      this.cargarDatos();
      return;
    }

    console.log('🔍 Filtrando por campo formativo:', this.campoFormativoSeleccionado);
    this.loadingService.show();
    
    this.serviciosMaterias.ObtenerMateriasPorCampo(this.campoFormativoSeleccionado).subscribe({
      next: (res) => {
        this.registros = res;
        this.paginaActual = 1;
        console.log('✅ Materias filtradas:', res);
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('❌ Error al filtrar materias:', err);
        this.alertService.show('Error al filtrar las materias', 'danger', 'Error');
        this.loadingService.hide();
      }
    });
  }

  limpiarFiltro() {
    this.campoFormativoSeleccionado = '';
    this.paginaActual = 1;
    this.cargarDatos();
    console.log('🧹 Filtro limpiado');
  }

  obtenerNombreCampoFormativo(campoFormativoId: string): string {
    const campo = this.camposFormativos.find(c => c.id === campoFormativoId);
    return campo ? campo.nombre : '-';
  }

  get materiasPaginadas() {
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

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Materia | null) {
    this.nuevom = false;
    if (event) {
      if (this.campoFormativoSeleccionado) {
        this.aplicarFiltro();
      } else {
        this.cargarDatos();
      }
    }
  }

  editar(materia: Materia) {
    this.materiaSeleccionada = materia;
    this.editarm = true;
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.materiaSeleccionada = null;
    if (guardado) {
      if (this.campoFormativoSeleccionado) {
        this.aplicarFiltro();
      } else {
        this.cargarDatos();
      }
    }
  }

  // ✅ MÉTODO CORREGIDO: Cambiar estatus con confirmación
  async cambiarEstatus(materia: Materia, event: Event) {
    // ⚠️ CRÍTICO: Prevenir el cambio del checkbox hasta confirmar
    event.preventDefault();
    
    const nuevoEstatus = materia.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    // Mostrar alerta de confirmación antes de proceder
    const confirmado = await this.alerta.mostrar(
      `¿Estás seguro de ${nuevoEstatus === 'ACTIVO' ? 'activar' : 'desactivar'} la materia ${materia.nombre}?`
    );

    if (!confirmado) {
      return; // El usuario canceló
    }

    console.log(`🔄 Cambiando estatus de ${materia.nombre} de ${materia.estatus} a ${nuevoEstatus}`);
    this.loadingService.show();

    // Crear objeto actualizado
    const materiaActualizada: Materia = {
      ...materia,
      estatus: nuevoEstatus
    };

    if (materia.id) {
      this.serviciosMaterias.ActualizarMateria(materia.id, materiaActualizada).subscribe({
        next: (mensaje) => {
          console.log('✅ Estatus cambiado exitosamente:', mensaje);

          // ✅ SOLO aquí se cambia el estatus en el modelo
          materia.estatus = nuevoEstatus;

          // Actualizar en el array
          const index = this.registros.findIndex(m => m.id === materia.id);
          if (index !== -1) {
            this.registros[index].estatus = nuevoEstatus;
          }

          this.alertService.show(
            `Materia ${nuevoEstatus === 'ACTIVO' ? 'activada' : 'desactivada'} exitosamente`,
            'success',
            'Éxito'
          );

          this.loadingService.hide();
        },
        error: (err) => {
          console.error('❌ Error al cambiar estatus:', err);
          this.alertService.show(
            'Error al cambiar el estatus de la materia',
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
}