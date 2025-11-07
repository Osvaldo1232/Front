import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tutores } from '../../../../../../../models/tutores.model';
import { ServiciosDirectorTutores } from '../../../../../Services/servicios-director-tutores/servicios-director-tutores';
import { AlertService } from '../../../../../../../shared/alert-service';

@Component({
  selector: 'app-editar-tutor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-tutor.html',
  styleUrl: './editar-tutor.scss'
})
export class EditarTutor implements OnChanges {
  @Input() editar: boolean = false;
  @Input() tutor: Tutores | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirectorTutores,
    private alertService: AlertService
  ) { }

  id: any = '';
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correo: string = '';
  telefono: string = '';
  estatus: string = 'ACTIVO';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tutor'] && this.tutor) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.tutor) {
      this.id = this.tutor.id || '';
      this.nombre = this.tutor.nombre || '';
      this.apellidoPaterno = this.tutor.apellidoPaterno || '';
      this.apellidoMaterno = this.tutor.apellidoMaterno || '';
      this.correo = this.tutor.correo || '';
      this.telefono = this.tutor.telefono || '';
      this.estatus = this.tutor.estatus || 'ACTIVO';
    }
  }

  guardar() {
    const tutorActualizado: Tutores = { 
      id: this.id,
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      correo: this.correo,
      telefono: this.telefono,
      estatus: this.estatus
    };

    this.Servicios.ActualizarTutor(this.id, tutorActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Tutor actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar Tutor:', err);
        this.alertService.show(
          'Error al actualizar el tutor',
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