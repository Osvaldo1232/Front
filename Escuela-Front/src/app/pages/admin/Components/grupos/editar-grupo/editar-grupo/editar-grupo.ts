import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Grupos } from '../../../../../../models/grupos.models';
import { ServiciosDirectorGrupos } from '../../../../Services/servicios-director-grupos/servicio-director-grupos';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-editar-grupo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-grupo.html',
  styleUrl: './editar-grupo.scss'
})
export class EditarGrupo implements OnChanges {
  @Input() editar: boolean = false;
  @Input() grupo: Grupos | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirectorGrupos,
    private alertService: AlertService
  ) { }

  id: any = '';
  nombre: string = '';
  estatus: string = 'ACTIVO';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['grupo'] && this.grupo) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.grupo) {
      this.id = this.grupo.id || '';
      this.nombre = this.grupo.nombre || '';
      this.estatus = this.grupo.estatus || 'ACTIVO';
    }
  }

  guardar() {
    const grupoActualizado: Grupos = { 
      id: this.id,
      nombre: this.nombre, 
      estatus: this.estatus
    };

    this.Servicios.ActualizarGrupo(this.id, grupoActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Grupo actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar Grupo:', err);
        this.alertService.show(
          'Error al actualizar el grupo',
          'danger',
          'Error'
        );
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit(false);
  }
}