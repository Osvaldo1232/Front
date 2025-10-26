import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { Maestros } from '../../../../../../models/maestros.model';
import { ServiciosDirector } from '../../../../Services/servicios-director';

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

  constructor(private Servicios: ServiciosDirector) { }

  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  especialidad: string = '';
  estatus: string = 'ACTIVO';
  telefono: string = '';
  rfc: string = '';
  clavePresupuestal: string = '';

  guardar() {
    const maestros: Maestros = { 
      nombre: this.nombre, 
      estatus: this.estatus,
      email: this.email, 
      apellidos: this.apellidos,
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
        console.log(mensaje);
        
        const NuevoDocente = { 
          nombre: this.nombre,
          estatus: this.estatus,
          email: this.email,
          apellidos: this.apellidos,
          password: this.password,
          fechaNacimiento: this.fechaNacimiento,
          sexo: this.sexo,
          especialidad: this.especialidad,
          telefono: this.telefono,
          rfc: this.rfc,
          clavePresupuestal: this.clavePresupuestal
        };
        
        this.limpiarCampos(); // ⬅️ Limpiar después de guardar
        this.cerrar.emit(NuevoDocente); 
      },
      error: (err) => console.error('Error al crear Docente:', err)
    });
  }

  cerrarModal() {
    this.limpiarCampos(); // ⬅️ Limpiar al cerrar
    this.cerrar.emit(null);
  }

  // ⬇️ NUEVO MÉTODO para limpiar campos
  limpiarCampos() {
    this.nombre = '';
    this.apellidos = '';
    this.email = '';
    this.password = '';
    this.fechaNacimiento = '';
    this.sexo = '';
    this.especialidad = '';
    this.estatus = 'ACTIVO';
    this.telefono = '';
    this.rfc = '';
    this.clavePresupuestal = '';
  }
}