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
import { EditarDocente } from './editar-docente/editar-docente/editar-docente';
import { AlertService } from '../../../../shared/alert-service';

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
    EditarDocente
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
  docenteSeleccionado: Maestros | null = null;
  registros: Maestros[] = [];

  registrosPorPagina = 9;
  paginaActual = 1;

  constructor(
    private Servicios: ServiciosDirector,
    private alertService: AlertService
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

  cambiarEstatus(docente: Maestros) {
  const nuevoEstatus = docente.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  const estatusAnterior = docente.estatus;
  docente.estatus = nuevoEstatus;

  if (docente.id) {
    console.log(`📤 Cambiando estatus de ${docente.nombre} a ${nuevoEstatus}`);

    // ✅ USAR EL NUEVO MÉTODO DEDICADO
    this.Servicios.ActualizarEstatusDocente(docente.id, nuevoEstatus).subscribe({
      next: (mensaje) => {
        console.log('✅ Respuesta del servidor:', mensaje);
        
        // Actualizar localmente el registro
        const index = this.registros.findIndex(d => d.id === docente.id);
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
        console.error('❌ Error completo:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Error del servidor:', err.error);
        
        // Revertir el cambio si falla
        docente.estatus = estatusAnterior;
        
        this.alertService.show(
          'Error al cambiar el estatus',
          'danger',
          'Error'
        );
      }
    });
  } else {
    console.error('❌ El docente no tiene ID');
    docente.estatus = estatusAnterior;
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