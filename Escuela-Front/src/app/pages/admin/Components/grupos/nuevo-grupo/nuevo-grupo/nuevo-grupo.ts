import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Grupos } from '../../../../../../models/grupos.models';
import { ServiciosDirectorGrupos } from '../../../../Services/servicios-director-grupos/servicio-director-grupos';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-nuevo-grupo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-grupo.html',
  styleUrl: './nuevo-grupo.scss'
})
export class NuevoGrupo {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Grupos | null>();

  constructor(
    private Servicios: ServiciosDirectorGrupos,
    private alertService: AlertService
  ) { }

  nombre: string = '';
  estatus: string = 'ACTIVO';

  guardar() {
    const grupo: Grupos = { 
      nombre: this.nombre, 
      estatus: this.estatus
    };

    this.Servicios.CrearGrupo(grupo).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Grupo registrado exitosamente',
          'success',
          'Éxito'
        );
        
        const nuevoGrupo = { 
          nombre: this.nombre,
          estatus: this.estatus
        };
        
        this.limpiarCampos();
        this.cerrar.emit(nuevoGrupo); 
      },
      error: (err) => {
        this.alertService.show(
          'Ya existe un grupo con ese nombre. Por favor, elige otro nombre.',
          'warning',
          'Error'
        );
        this.cerrarModal();
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