import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampoFormativoModel } from '../../../../../../models/campo-formativo.model';
import { ServiciosCampoFormativo } from '../../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { AlertService } from '../../../../../../shared/alert-service'; 


@Component({
  selector: 'app-campo-formativo-nuevo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './campo-formativo-nuevo.html',
  styleUrl: './campo-formativo-nuevo.scss'
})
export class CampoFormativoNuevo {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<CampoFormativoModel | null>();

  constructor(
    private Servicios: ServiciosCampoFormativo,
    private alertService: AlertService // ⬅️ INYECTAR
  ) { }

  nombre: string = '';
  estatus: string = 'ACTIVO';

  guardar() {
    const campo: CampoFormativoModel = { 
      nombre: this.nombre, 
      estatus: this.estatus
    };

    this.Servicios.CrearCampoFormativo(campo).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        // ⬇️ REEMPLAZAR alert() con tu servicio
        this.alertService.show(
          'Campo Formativo registrado exitosamente',
          'success',
          'Éxito'
        );
        
        const nuevoCampo = { 
          nombre: this.nombre,
          estatus: this.estatus
        };
        
        this.limpiarCampos();
        this.cerrar.emit(nuevoCampo); 
      },
      error: (err) => {
        console.error('Error al crear Campo Formativo:', err);
        // ⬇️ REEMPLAZAR alert() con tu servicio
        this.alertService.show(
          'Error al crear el campo formativo',
          'danger',
          'Error'
        );
      }
    });
  }

  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(null);
  }

  limpiarCampos() {
    this.nombre = '';
    this.estatus = 'ACTIVO';
  }
}