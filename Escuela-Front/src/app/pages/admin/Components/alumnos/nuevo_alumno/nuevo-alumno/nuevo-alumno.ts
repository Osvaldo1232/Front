import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-nuevo-alumno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-alumno.html',
  styleUrl: './nuevo-alumno.scss'
})
export class NuevoAlumno {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Alumnos | null>();

  constructor(
    private Servicios: ServiciosDirectorAlumnos,
    private alertService: AlertService
  ) {}

  // Campos del formulario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // ✅ Nuevo campo
  fechaNacimiento: string = '';
  sexo: string = '';
  matricula: string = '';
  curp: string = '';
  estatus: string = 'ACTIVO';

  guardar() {
    // ✅ Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      this.alertService.show(
        'Las contraseñas no coinciden. Por favor, verifica.',
        'warning',
        'Advertencia'
      );
      return;
    }

    const alumno: Alumnos = { 
      nombre: this.nombre, 
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email: this.email, 
      password: this.password, 
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      matricula: this.matricula,
      curp: this.curp,
      estatus: this.estatus
    };

    this.Servicios.CrearAlumno(alumno).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Alumno registrado exitosamente',
          'success',
          'Éxito'
        );

        const nuevoAlumno = { ...alumno };
        this.limpiarCampos();
        this.cerrar.emit(nuevoAlumno); 
      },
      error: (err) => {
        console.error('Error al crear Alumno:', err);
        this.alertService.show(
          'Error al crear el Alumno',
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
    this.matricula = '';
    this.curp = '';
    this.estatus = 'ACTIVO';
  }
}
