import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { Maestros } from '../../../../../../models/maestros.model';
import { ServiciosDirector } from '../../../../Services/servicios-director';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-nuevo-docente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-docente.html',
  styleUrl: './nuevo-docente.scss'
})
export class NuevoDocente {
  @Input() nuevo: any;
  @Output() cerrar = new EventEmitter<Maestros | null>();

  constructor(
    private Servicios: ServiciosDirector,
    private alertService: AlertService,
  ) { }

  // Campos del formulario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // ✅ nuevo campo
  fechaNacimiento: string = '';
  sexo: string = '';
  especialidad: string = '';
  estatus: string = 'ACTIVO';
  telefono: string = '';
  rfc: string = '';
  clavePresupuestal: string = '';

  guardar() {
    // ✅ Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      this.alertService.show(
        'Las contraseñas no coinciden. Por favor, verifica.',
        'warning',
        'Advertencia'
      );
      return; // Detiene el proceso si no coinciden
    }

    const maestros: Maestros = { 
      nombre: this.nombre, 
      estatus: this.estatus,
      email: this.email, 
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      password: this.password, 
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      especialidad: this.especialidad, 
      telefono: this.telefono, 
      rfc: this.rfc,
      clavePresupuestal: this.clavePresupuestal 
    };

    this.Servicios.CrearDocente(maestros).subscribe({
      next: (mensaje) => {

        if(mensaje.codigo==1000){
          this.alertService.show(
          mensaje.mensaje,
          'danger',
          'Error'
        ); 
        return;
        }        
        this.alertService.show(
          'Docente registrado exitosamente',
          'success',
          'Éxito'
        );
        
        const NuevoDocente = { ...maestros };

        this.limpiarCampos(); 
        this.cerrar.emit(NuevoDocente); 
      },
      error: (err) => {
        console.error('Error al crear Docente:', err);
        this.alertService.show(
          'Error al crear el Docente',
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
    this.email = '';
    this.password = '';
    this.confirmPassword = ''; 
    this.fechaNacimiento = '';
    this.sexo = '';
    this.especialidad = '';
    this.estatus = 'ACTIVO';
    this.telefono = '';
    this.rfc = '';
    this.clavePresupuestal = '';
  }



  
}
