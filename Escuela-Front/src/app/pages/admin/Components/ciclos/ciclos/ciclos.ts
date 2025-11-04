import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ciclos } from '../../../../../models/ciclos.model';
import { ServiciosDirectorCiclos } from '../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { NuevoCiclo } from '../ciclos/nuevo-ciclo/nuevo-ciclo/nuevo-ciclo';
import { EditarCiclo } from '../ciclos/editar-ciclo/editar-ciclo/editar-ciclo';
import { AlertService } from '../../../../../shared/alert-service';
import { Loading } from '../../../../../shared/loading/loading';
import { LoadingService } from '../../../../../shared/loading-service';


@Component({
  selector: 'app-ciclos-escolares',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoCiclo,
    EditarCiclo,
    Loading
  ],
  templateUrl: './ciclos.html',
  styleUrls: ['./ciclos.scss']
})
export class CiclosEscolaresComponent implements OnInit {
  
  registros: Ciclos[] = [];
  nuevom: boolean = false;
  
  editarm: boolean = false;
  cicloSeleccionado: Ciclos | null = null;

  registrosPorPagina = 6;
  paginaActual = 1;

  constructor(
    private Servicios: ServiciosDirectorCiclos,private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.cargarCiclos();
  }

  // ✅ MÉTODO PARA EXTRAER Y FORMATEAR EL AÑO
  extraerAnio(fecha: any): string {
    if (!fecha) return '';
    
    // Si es string con formato YYYY-MM-DD
    if (typeof fecha === 'string') {
      return fecha.split('-')[0];
    }
    
    // Si es número, convertir a string
    if (typeof fecha === 'number') {
      return fecha.toString();
    }
    
    return fecha.toString();
  }

  get ciclosPaginados() {
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

  cerrarModal(event: Ciclos | null) {
    this.nuevom = false;
    if (event) {
      this.cargarCiclos();
    }
  }

  editar(ciclo: Ciclos) {
    console.log('📝 Editando ciclo:', ciclo);
    this.cicloSeleccionado = ciclo;
    this.editarm = true;
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.cicloSeleccionado = null;
    if (guardado) {
      this.cargarCiclos();
    }
  }

  cambiarEstatus(ciclo: Ciclos) {
    const nuevoEstatus = ciclo.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const estatusAnterior = ciclo.estatus;
    ciclo.estatus = nuevoEstatus;

    if (ciclo.id) {
      const cicloActualizado: Ciclos = {
        ...ciclo,
        estatus: nuevoEstatus
      };

      this.Servicios.ActualizarCiclo(ciclo.id, cicloActualizado).subscribe({
        next: (mensaje) => {
          console.log(mensaje);
          
          const index = this.registros.findIndex(c => c.id === ciclo.id);
          if (index !== -1) {
            this.registros[index].estatus = nuevoEstatus;
          }
          
          this.alertService.show(
            `Estatus cambiado a ${nuevoEstatus}`,
            'success',
            'Éxito'
          );
        },
        error: (err) => {
          console.error('Error al cambiar estatus:', err);
          ciclo.estatus = estatusAnterior;
          this.alertService.show(
            'Error al cambiar el estatus',
            'danger',
            'Error'
          );
        }
      });
    }
  }

  cargarCiclos() {
        this.loadingService.show(); 
    this.Servicios.ObtenerCiclo().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('📥 Ciclos cargados:', this.registros);
            this.loadingService.hide(); 
      },
      error: (err) => console.error('Error al cargar Ciclos:', err)
    });
  }
}