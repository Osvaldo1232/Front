import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServiciosCampoFormativo } from '../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { CampoFormativoModel } from '../../../../models/campo-formativo.model';
import { CampoFormativoNuevo } from './campo-formativo-nuevo/campo-formativo-nuevo/campo-formativo-nuevo';
import { CampoFormativoEditar } from './campo-formativo-editar/campo-formativo-editar/campo-formativo-editar';
import { AlertaConfirmacionService } from '../../../../shared/alerta-confirmacion-service';
import { AlertService } from '../../../../shared/alert-service';
import { LoadingService } from '../../../../shared/loading-service';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-campo-formativo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CampoFormativoNuevo,
    CampoFormativoEditar,
    Loading
  ],
  templateUrl: './campo-formativo.html',
  styleUrls: ['./campo-formativo.scss']
})
export class CampoFormativo implements OnInit { 
  
  searchTerm: string = '';
  registros: CampoFormativoModel[] = []; 
  nuevom: boolean = false;
  
  // Modal editar
  editarm: boolean = false;
  CamposSeleccionado: CampoFormativoModel | null = null;

  // Paginación
  registrosPorPagina = 6;
  paginaActual = 1;

  constructor(
    private Servicios: ServiciosCampoFormativo, 
    private loadingService: LoadingService,
    private alerta: AlertaConfirmacionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.cargarCampos();
  }

  get camposFiltrados() {
    if (!this.searchTerm.trim()) return this.registros;
    const termino = this.searchTerm.toLowerCase();
    return this.registros.filter(a =>
      a.nombre.toLowerCase().includes(termino) ||
      a.estatus.toLowerCase().includes(termino));
  }

  get alumnosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.camposFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.camposFiltrados.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  getNombreCampo(index: number): string {
    const nombres = [
      'Primer Campo Formativo',
      'Segundo Campo Formativo',
      'Tercer Campo Formativo',
      'Cuarto Campo Formativo',
      'Quinto Campo Formativo',
      'Sexto Campo Formativo',
      'Séptimo Campo Formativo',
      'Octavo Campo Formativo',
      'Noveno Campo Formativo',
      'Décimo Campo Formativo'
    ];
    
    const indiceGlobal = (this.paginaActual - 1) * this.registrosPorPagina + index;
    return nombres[indiceGlobal] || `Campo Formativo ${indiceGlobal + 1}`;
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

  cerrarModal(event: CampoFormativoModel | null) {
    this.nuevom = false;
    if (event) {
      this.cargarCampos();
    }
  }

  editar(campoformativo: CampoFormativoModel) {
    this.CamposSeleccionado = campoformativo;
    this.editarm = true;
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.CamposSeleccionado = null;
    if (guardado) {
      this.cargarCampos();
    }
  }

  // ✅ MÉTODO CORREGIDO: Cambiar estatus con confirmación
  async cambiarEstatus(campo: CampoFormativoModel, event: Event) {
    // ⚠️ CRÍTICO: Prevenir el cambio del checkbox hasta confirmar
    event.preventDefault();
    
    const nuevoEstatus = campo.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    // Mostrar alerta de confirmación antes de proceder
    const confirmado = await this.alerta.mostrar(
      `¿Estás seguro de ${nuevoEstatus === 'ACTIVO' ? 'activar' : 'desactivar'} el campo formativo "${campo.nombre}"?`
    );

    if (!confirmado) {
      return; // El usuario canceló
    }

    console.log(`🔄 Cambiando estatus de ${campo.nombre} de ${campo.estatus} a ${nuevoEstatus}`);
    this.loadingService.show();

    // Crear objeto actualizado
    const campoActualizado: CampoFormativoModel = {
      ...campo,
      estatus: nuevoEstatus
    };

    if (campo.id) {
        this.Servicios.ActualizarCampoFormativo(String(campo.id), campoActualizado).subscribe({
        next: (mensaje) => {
          console.log('✅ Estatus cambiado exitosamente:', mensaje);

          // ✅ SOLO aquí se cambia el estatus en el modelo
          campo.estatus = nuevoEstatus;

          // Actualizar en el array
          const index = this.registros.findIndex(c => c.id === campo.id);
          if (index !== -1) {
            this.registros[index].estatus = nuevoEstatus;
          }

          this.alertService.show(
            `Campo formativo ${nuevoEstatus === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
            'success',
            'Éxito'
          );

          this.loadingService.hide();
        },
        error: (err) => {
          console.error('❌ Error al cambiar estatus:', err);
          this.alertService.show(
            'Error al cambiar el estatus del campo formativo',
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

  cargarCampos() {
    this.loadingService.show(); 
    this.Servicios.ObtenerCampoFormativo().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('📚 Campos Formativos cargados:', this.registros);
        this.loadingService.hide(); 
      },
      error: (err) => {
        console.error('Error al cargar Campos Formativos:', err);
        this.loadingService.hide();
      }
    });
  }
}