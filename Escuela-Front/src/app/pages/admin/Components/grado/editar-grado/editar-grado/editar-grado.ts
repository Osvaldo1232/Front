import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Grados } from '../../../../../../models/grado.models';
import { ServiciosDirector } from '../../../../Services/servicios-director';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-editar-grado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-grado.html',
  styleUrl: './editar-grado.scss'
})
export class EditarGrado implements OnChanges {
  @Input() editar: boolean = false;
  @Input() grado: Grados | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirector,
    private alertService: AlertService
  ) { }

  id: any = '';
  nombre: string = '';
  estatus: string = 'ACTIVO';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['grado'] && this.grado) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.grado) {
      this.id = this.grado.id || '';
      this.nombre = this.grado.nombre || '';
      this.estatus = this.grado.estatus || 'ACTIVO';
    }
  }

  guardar() {
    const gradoActualizado: Grados = { 
      id: this.id,
      nombre: this.nombre, 
      estatus: this.estatus
    };

    this.Servicios.ActualizarGrado(this.id, gradoActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Grado actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar Grado:', err);
        this.alertService.show(
          'Error al actualizar el grado',
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