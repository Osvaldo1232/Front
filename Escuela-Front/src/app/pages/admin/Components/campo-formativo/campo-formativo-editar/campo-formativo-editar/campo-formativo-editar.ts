import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampoFormativoModel } from '../../../../../../models/campo-formativo.model';
import { ServiciosCampoFormativo } from '../../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { AlertService } from '../../../../../../shared/alert-service'; 


@Component({
  selector: 'app-campo-formativo-editar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './campo-formativo-editar.html',
  styleUrl: './campo-formativo-editar.scss'
})
export class CampoFormativoEditar implements OnChanges {
  @Input() editar: boolean = false;
  @Input() campo: CampoFormativoModel | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosCampoFormativo,
    private alertService: AlertService // ⬅️ INYECTAR
  ) { }

  id: string = '';
  nombre: string = '';
  estatus: string = 'ACTIVO';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campo'] && this.campo) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.campo) {
      this.id = this.campo.id?.toString() || '';
      this.nombre = this.campo.nombre || '';
      this.estatus = this.campo.estatus || 'ACTIVO';
    }
  }

  guardar() {
    const campoActualizado: CampoFormativoModel = { 
      id: this.id,
      nombre: this.nombre, 
      estatus: this.estatus
    };

    this.Servicios.ActualizarCampoFormativo(this.id, campoActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        // ⬇️ REEMPLAZAR alert() con tu servicio
        this.alertService.show(
          'Campo Formativo actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar Campo Formativo:', err);
        // ⬇️ REEMPLAZAR alert() con tu servicio
        this.alertService.show(
          'Error al actualizar el campo formativo',
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