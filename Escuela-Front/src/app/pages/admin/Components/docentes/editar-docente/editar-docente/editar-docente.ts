import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Maestros } from '../../../../../../models/maestros.model';
import { ServiciosDirector } from '../../../../Services/servicios-director';

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

  constructor(private Servicios: ServiciosDirector) { }

  id: string = '';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['docente'] && this.docente) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.docente) {
      this.id = this.docente.id || '';
      this.nombre = this.docente.nombre || '';
      this.apellidos = this.docente.apellidos || '';
      this.email = this.docente.email || '';
      this.password = ''; // No mostramos la contraseña actual
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
    const maestroActualizado: Maestros = { 
      id: this.id,
      nombre: this.nombre, 
      apellidos: this.apellidos,
      email: this.email, 
    password: this.password,
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
        alert('Docente actualizado exitosamente');
        this.cerrar.emit(true); // true indica que se guardó
      },
      error: (err) => {
        console.error('Error al actualizar Docente:', err);
        alert('Error al actualizar el docente');
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit(false); // false indica que se canceló
  }
}