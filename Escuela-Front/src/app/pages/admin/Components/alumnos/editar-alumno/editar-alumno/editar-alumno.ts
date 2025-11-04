import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-editar-alumno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-alumno.html',
  styleUrl: './editar-alumno.scss'
})
export class EditarAlumno implements OnChanges {
  @Input() editar: boolean = false;
  @Input() alumno: Alumnos | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirectorAlumnos,
    private alertService: AlertService 
  ) {}

  id: string = '';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alumno'] && this.alumno) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.alumno) {

      
      console.log('Cargando datos del alumno para editar:', this.alumno);
      this.id = this.alumno.id || '';
      this.nombre = this.alumno.nombre || '';
      this.apellidoPaterno = this.alumno.apellidoPaterno || '';
      this.apellidoMaterno = this.alumno.apellidoMaterno || '';
      this.email = this.alumno.email || '';
      this.password = ''; // No mostramos la contraseña actual
      this.confirmPassword = ''; // ✅ limpiar también
      this.fechaNacimiento = this.alumno.fechaNacimiento || '';
      this.sexo = this.alumno.sexo || '';
      this.estatus = this.alumno.estatus || 'ACTIVO';
      this.matricula = this.alumno.matricula || '';
      this.curp = this.alumno.curp || '';
    }
  }

  guardar() {
    // ✅ Validar contraseñas solo si se intenta cambiar
    if (this.password || this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        this.alertService.show(
          'Las contraseñas no coinciden. Por favor, verifica.',
          'warning',
          'Advertencia'
        );
        return;
      }
    }

    // ✅ Si la contraseña está vacía, no la cambiamos
    const AlumnoActualizado: Alumnos = { 
      id: this.id,
      nombre: this.nombre, 
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email: this.email, 
      password: this.password, // sigue siendo string (vacío si no se cambia)
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      estatus: this.estatus,
      matricula: this.matricula,
      curp: this.curp
    };

    // ✅ Enviar siempre un string, pero el backend decide si lo actualiza o no
    this.Servicios.ActualizarAlumno(this.id, AlumnoActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Alumno actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar Alumno:', err);
        this.alertService.show(
          'Error al actualizar el Alumno',
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
