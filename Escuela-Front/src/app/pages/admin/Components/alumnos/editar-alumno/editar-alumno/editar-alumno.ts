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

  ) { }

  id: string = '';
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
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
      this.id = this.alumno.id || '';
      this.nombre = this.alumno.nombre || '';
      this.apellidos = this.alumno.apellidos || '';
      this.email = this.alumno.email || '';
      this.password = ''; // No mostramos la contraseña actual
      this.fechaNacimiento = this.alumno.fechaNacimiento || '';
      this.sexo = this.alumno.sexo || '';
      this.estatus = this.alumno.estatus || 'ACTIVO';
      this.matricula = this.alumno.matricula || '';
      this.curp = this.alumno.curp || '';
    }
  }

  guardar() {
    const AlumnoActualizado: Alumnos = { 
      id: this.id,
      nombre: this.nombre, 
      apellidos: this.apellidos,
      email: this.email, 
      password: this.password,
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      estatus: this.estatus,
      matricula: this.matricula,
      curp: this.curp
    };

    this.Servicios.ActualizarAlumno(this.id, AlumnoActualizado).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        // ⬇️ REEMPLAZAR alert() con tu servicio
        this.alertService.show(
          'Alumno actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('Error al actualizar Alumno:', err);
        // ⬇️ REEMPLAZAR alert() con tu servicio
        this.alertService.show(
          'Error al actualizar el Alumno',
          'danger',
          'Error'
        );
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit(false); // false indica que se canceló
  }
}