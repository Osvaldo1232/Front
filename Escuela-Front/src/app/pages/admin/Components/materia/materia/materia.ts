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

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevaMateria,
    EditarMateria
  ],
  templateUrl: './materia.html',
  styleUrls: ['./materia.scss']
})
export class MateriasComponent implements OnInit {
  
  registros: Materia[] = [];
  camposFormativos: CampoFormativoModel[] = [];
  
  nuevom: boolean = false;
  editarm: boolean = false;
  materiaSeleccionada: Materia | null = null;

  // Paginación
  registrosPorPagina = 6;
  paginaActual = 1;

  constructor(
    private serviciosMaterias: ServiciosDirectorMaterias,
    private serviciosCamposFormativos: ServiciosCampoFormativo,
    private alertService: AlertService, private alerta:AlertaConfirmacionService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar materias
    this.serviciosMaterias.ObtenerMaterias().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('📚 Materias cargadas:', this.registros);
      },
      error: (err) => console.error('Error al cargar Materias:', err)
    });

    // Cargar campos formativos
    this.serviciosCamposFormativos.ObtenerCampoFormativo().subscribe({
      next: (res) => {
        this.camposFormativos = res;
        console.log('📋 Campos Formativos cargados:', this.camposFormativos);
      },
      error: (err) => console.error('Error al cargar Campos Formativos:', err)
    });
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
      this.cargarDatos();
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
      this.cargarDatos();
    }
  }

  async cambiarEstatus(materia: Materia) {
       const confirmado = await this.alerta.mostrar('¿Estás seguro de cambiar el estatus?');

  if (!confirmado) {
    return; // El usuario canceló
  }
    const nuevoEstatus = materia.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const estatusAnterior = materia.estatus;
    materia.estatus = nuevoEstatus;

    if (materia.id) {
      const materiaActualizada: Materia = {
        ...materia,
        estatus: nuevoEstatus
      };

      this.serviciosMaterias.ActualizarMateria(materia.id, materiaActualizada).subscribe({
        next: (mensaje) => {
          console.log(mensaje);
          
          const index = this.registros.findIndex(m => m.id === materia.id);
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
          materia.estatus = estatusAnterior;
          this.alertService.show(
            'Error al cambiar el estatus',
            'danger',
            'Error'
          );
        }
      });
    }
  }
}