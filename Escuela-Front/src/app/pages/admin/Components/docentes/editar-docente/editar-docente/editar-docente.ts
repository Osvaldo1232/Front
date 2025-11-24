import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Maestros } from '../../../../../../models/maestros.model';
import { ServiciosDirector } from '../../../../Services/servicios-director';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-editar-docente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-docente.html',
  styleUrl: './editar-docente.scss'
})
export class EditarDocente implements OnChanges {
  @Input() editar: boolean = false;
  @Input() docente: Maestros | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirector,
    private alertService: AlertService
  ) { }

  id: string = '';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['docente'] && this.docente) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.docente) {
      this.id = this.docente.id || '';
      this.nombre = this.docente.nombre || '';
      this.apellidoPaterno = this.docente.apellidoPaterno || '';
      this.apellidoMaterno = this.docente.apellidoMaterno || '';
      this.email = this.docente.email || '';
      this.password = ''; // no se muestra la contraseña actual
      this.confirmPassword = ''; // limpiar confirmación
      this.fechaNacimiento = this.docente.fechaNacimiento || '';
      this.sexo = this.docente.sexo || '';
      this.especialidad = this.docente.especialidad || '';
      this.estatus = this.docente.estatus || 'ACTIVO';
      this.telefono = this.docente.telefono || '';
      this.rfc = this.docente.rfc || '';
      this.clavePresupuestal = this.docente.clavePresupuestal || '';
    }
  }

  guardar() {
    // ✅ Validar contraseñas solo si el usuario escribió una nueva
    if (this.password) {
      if (this.password !== this.confirmPassword) {
        this.alertService.show(
          'Las contraseñas no coinciden. Por favor, verifica.',
          'warning',
          'Advertencia'
        );
        return;
      }
    }

    const maestroActualizado: Maestros = { 
      id: this.id,
      nombre: this.nombre, 
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email: this.email, 
      password: this.password, // se enviará vacío si no la cambió
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      especialidad: this.especialidad, 
      estatus: this.estatus,
      telefono: this.telefono, 
      rfc: this.rfc,
      clavePresupuestal: this.clavePresupuestal 
    };

    this.Servicios.ActualizarDocente(this.id, maestroActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Docente actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar el Docente:', err);
        this.alertService.show(
          'Error al actualizar el Docente',
          'danger',
          'Error'
        );
      }
    });
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

  cerrarModal() {
    this.cerrar.emit(false);
  }
}
