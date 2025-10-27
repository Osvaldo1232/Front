import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
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

  constructor(private Servicios: ServiciosDirectorAlumnos) { }

  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  matricula: string = '';
  curp: string = '';
  estatus: string = 'ACTIVO';

  guardar() {
    const alumno: Alumnos = { 
      nombre: this.nombre, 
      apellidos: this.apellidos,
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
        alert('Alumno registrado exitosamente');
        
        const nuevoAlumno = { 
          nombre: this.nombre,
          apellidos: this.apellidos,
          email: this.email,
          password: this.password,
          fechaNacimiento: this.fechaNacimiento,
          sexo: this.sexo,
          matricula: this.matricula,
          curp: this.curp,
          estatus: this.estatus
        };
        
        this.limpiarCampos();
        this.cerrar.emit(nuevoAlumno); 
      },
      error: (err) => {
        console.error('Error al crear Alumno:', err);
        alert('Error al crear el alumno');
      }
    });
  }

  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(null);
  }

  limpiarCampos() {
    this.nombre = '';
    this.apellidos = '';
    this.email = '';
    this.password = '';
    this.fechaNacimiento = '';
    this.sexo = '';
    this.matricula = '';
    this.curp = '';
    this.estatus = 'ACTIVO';
  }
}