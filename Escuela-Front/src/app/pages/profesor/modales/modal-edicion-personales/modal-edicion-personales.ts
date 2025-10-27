import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { Profesor, ProfesorUno } from '../../../../models/Profesor';

@Component({
  selector: 'app-modal-edicion-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edicion-personales.html',
  styleUrl: './modal-edicion-personales.scss'
})
export class ModalEdicionPersonales implements OnChanges {
  @Input() registro: Profesor | null = null;
  @Output() cerrar = new EventEmitter<Profesor | null>();

  constructor(private Servicios: ServiciosProfesor) { }

  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  especialidad: string = '';
  estatus: string = '';
  telefono: string = '';
  rfc: string = '';
  clavePresupuestal: string = '';
  grado: string = '';
  grupo: string = '';
  guardando: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registro'] && this.registro) {
      this.nombre = this.registro.nombre || '';
      this.apellidos = this.registro.apellidos || '';
      this.email = this.registro.email || '';
      this.fechaNacimiento = this.registro.fechaNacimiento || '';
      this.sexo = this.registro.sexo || '';
      this.especialidad = this.registro.especialidad || '';
      this.estatus = this.registro.estatus || '';
      this.telefono = this.registro.telefono || '';
      this.rfc = this.registro.rfc || '';
      this.clavePresupuestal = this.registro.clavePresupuestal || '';
      this.grado = this.registro.grado || '';
      this.grupo = this.registro.grupo || '';
    }
  }

  editar(): void {
    if (!this.registro?.id) {
      console.error('No hay ID de registro para actualizar');
      alert('Error: No se puede actualizar el registro');
      return;
    }
    if (!this.nombre.trim() || !this.apellidos.trim() || !this.email.trim()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    if (this.rfc.trim().length < 12 || this.rfc.trim().length > 13) {
      alert('El RFC debe tener 12 o 13 caracteres');
      return;
    }
    this.guardando = true;

    const profesorActualizado: Profesor = {
      id: this.registro.id,
      nombre: this.nombre.trim(),
      apellidos: this.apellidos.trim(),
      email: this.email.trim(),
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo,
      especialidad: this.especialidad.trim(),
      estatus: this.estatus,
      telefono: this.telefono.trim(),
      rfc: this.rfc.trim().toUpperCase(),
      clavePresupuestal: this.clavePresupuestal.trim(),
      grado: this.grado.trim(),
      grupo: this.grupo.trim()
    };

    this.Servicios.editarProfesor(this.registro.id, profesorActualizado).subscribe({
      next: () => {
        console.log('Profesor actualizado correctamente');
        this.guardando = false;
        this.cerrar.emit(profesorActualizado);
      },
      error: (err) => {
        if (err.status === 200 || err.status === 0) {
          console.log('Profesor actualizado correctamente (con error de parsing)');
          this.guardando = false;
          this.cerrar.emit(profesorActualizado);
        } else {
          console.error('Error al actualizar:', err);
          this.guardando = false;
        }
      }
    });
  }

  cerrarModal(): void {
    this.cerrar.emit(null);
  }
}