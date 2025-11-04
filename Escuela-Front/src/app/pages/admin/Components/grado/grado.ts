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
  
  // Modal editar (para futuro)
  editarm: boolean = false;
  gradoSeleccionado: Grados | null = null;

  // Paginación
  registrosPorPagina = 6; // 6 cards (3x2)
  paginaActual = 1;

  constructor(private Servicios: ServiciosDirector,private loadingService: LoadingService) { }

  ngOnInit() {
    this.cargarGrados();
  }

  // Getters para paginación
  get totalPaginas() {
    return Math.ceil(this.registros.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  // Método para obtener el nombre del grado según posición
  getNombreGrado(index: number): string {
    const nombres = [
      'Primer Grado',
      'Segundo Grado',
      'Tercer Grado',
      'Cuarto Grado',
      'Quinto Grado',
      'Sexto Grado'
    ];
    
    // Calcular el índice global considerando la paginación
    const indiceGlobal = (this.paginaActual - 1) * this.registrosPorPagina + index;
    
    return nombres[indiceGlobal] || `Grado ${indiceGlobal + 1}`;
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  editar(grado: Grados) {
    this.gradoSeleccionado = grado;
    this.editarm = true;
    console.log('Editar grado:', grado);
    // Aquí abrirías el modal de editar cuando lo crees
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarmodal(event: Grados | null) {
    this.nuevom = false;

    if (event?.id) {
      this.cargarGrados();
    }
  }

  cerrarModalEditar(guardado: boolean) {
    this.editarm = false;
    this.gradoSeleccionado = null;
    if (guardado) {
      this.cargarGrados();
    }
  }

  cambiarEstatus(grado: Grados) {
    // Cambiar el estatus localmente
    grado.estatus = grado.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    console.log('Cambiar estatus:', grado);
    
    // Aquí llamarías al servicio para actualizar en el backend
    // this.Servicios.actualizarGrado(grado.id, grado).subscribe({
    //   next: (res) => {
    //     console.log('Estatus actualizado:', res);
    //   },
    //   error: (err) => console.error('Error al actualizar estatus:', err)
    // });
  }

  cargarGrados() {
            this.loadingService.show(); 
    this.Servicios.obtenerGrados().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('Grados cargados:', this.registros);
                    this.loadingService.hide(); 
      },
      error: (err) => console.error('Error al cargar grados:', err)
    });
  }
}