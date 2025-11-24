import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tutores } from '../../../../../../../models/tutores.model';
import { ServiciosDirectorTutores } from '../../../../../Services/servicios-director-tutores/servicios-director-tutores';
import { AlertService } from '../../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-nuevo-tutor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-tutor.html',
  styleUrl: './nuevo-tutor.scss'
})
export class NuevoTutor {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Tutores | null>();

  constructor(
    private Servicios: ServiciosDirectorTutores,
    private alertService: AlertService
  ) { }

  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correo: string = '';
  telefono: string = '';
  estatus: string = 'ACTIVO';

  guardar() {
    const tutor: Tutores = { 
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      correo: this.correo,
      telefono: this.telefono,
      estatus: this.estatus
    };

    this.Servicios.CrearTutor(tutor).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Tutor registrado exitosamente',
          'success',
          'Éxito'
        );
        
        const nuevoTutor = { 
          nombre: this.nombre,
          apellidoPaterno: this.apellidoPaterno,
          apellidoMaterno: this.apellidoMaterno,
          correo: this.correo,
          telefono: this.telefono,
          estatus: this.estatus
        };
        
        this.limpiarCampos();
        this.cerrar.emit(nuevoTutor); 
      },
      error: (err) => {
        console.error('Error al crear Tutor:', err);
        this.alertService.show(
          'Error al crear el tutor',
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
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.correo = '';
    this.telefono = '';
    this.estatus = 'ACTIVO';
  }

  // ✅ Método para permitir solo números
  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Solo permite números (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}