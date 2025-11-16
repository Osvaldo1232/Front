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
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
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
  fechaMaxima: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registro'] && this.registro) {
      this.nombre = this.registro.nombre || '';
      this.apellidoPaterno = this.registro.apellidoPaterno || '';
      this.apellidoMaterno = this.registro.apellidoMaterno || '';
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
    
    // Establecer fecha máxima (hoy)
    const hoy = new Date();
    this.fechaMaxima = hoy.toISOString().split('T')[0];
  }

  // Validación: eliminar espacios al inicio
  eliminarEspaciosInicio(event: any, campo: string): void {
    const valor = event.target.value;
    if (valor.startsWith(' ')) {
      event.target.value = valor.trimStart();
      switch(campo) {
        case 'nombre': this.nombre = event.target.value; break;
        case 'apellidoPaterno': this.apellidoPaterno = event.target.value; break;
        case 'apellidoMaterno': this.apellidoMaterno = event.target.value; break;
        case 'telefono': this.telefono = event.target.value; break;
        case 'rfc': this.rfc = event.target.value; break;
        case 'clavePresupuestal': this.clavePresupuestal = event.target.value; break;
        case 'especialidad': this.especialidad = event.target.value; break;
      }
    }
  }

  // Validación: solo letras y espacios (para nombres y apellidos)
  soloLetras(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);
    
    // Permitir: letras (a-z, A-Z), espacios, ñ, Ñ, acentos, backspace, delete, tab, flechas
    if (!/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/.test(char) && 
        charCode !== 8 && charCode !== 46 && charCode !== 9 && 
        charCode !== 37 && charCode !== 39) {
      event.preventDefault();
    }
  }

  // Validación: solo números para teléfono
  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Permitir: números (0-9), backspace, delete, tab, flechas
    if ((charCode < 48 || charCode > 57) && 
        charCode !== 8 && charCode !== 46 && charCode !== 9 && 
        charCode !== 37 && charCode !== 39) {
      event.preventDefault();
    }
  }

  // Validación: formato de teléfono (10 dígitos)
  validarTelefono(event: any): void {
    let valor = event.target.value.replace(/\D/g, ''); // Remover todo excepto dígitos
    
    if (valor.length > 10) {
      valor = valor.substring(0, 10);
    }
    
    this.telefono = valor;
  }

  // Validación: RFC mayúsculas y formato
  validarRFC(event: any): void {
    let valor = event.target.value.toUpperCase();
    
    // Eliminar caracteres no válidos (solo letras, números y guiones permitidos temporalmente)
    valor = valor.replace(/[^A-Z0-9]/g, '');
    
    if (valor.length > 13) {
      valor = valor.substring(0, 13);
    }
    
    this.rfc = valor;
  }

  // Validación completa del RFC
  validarFormatoRFC(rfc: string): boolean {
    // RFC Persona Física: 13 caracteres (AAAA######XXX)
    // RFC Persona Moral: 12 caracteres (AAA######XXX)
    const regexFisica = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
    const regexMoral = /^[A-Z]{3}[0-9]{6}[A-Z0-9]{3}$/;
    
    return regexFisica.test(rfc) || regexMoral.test(rfc);
  }

  editar(): void {
    if (!this.registro?.id) {
      alert('Error: No se puede actualizar el registro');
      return;
    }

    // Validar campos requeridos
    if (!this.nombre.trim() || !this.apellidoPaterno.trim() || !this.apellidoMaterno.trim()) {
      alert('Por favor complete todos los campos requeridos (Nombre, Apellidos)');
      return;
    }

    // Validar que no contengan números
    if (/\d/.test(this.nombre) || /\d/.test(this.apellidoPaterno) || /\d/.test(this.apellidoMaterno)) {
      alert('Los campos de nombre y apellidos no pueden contener números');
      return;
    }

    // Validar teléfono
    if (!this.telefono.trim() || this.telefono.length !== 10) {
      alert('El teléfono debe contener exactamente 10 dígitos');
      return;
    }

    // Validar fecha de nacimiento
    if (!this.fechaNacimiento) {
      alert('Por favor ingrese la fecha de nacimiento');
      return;
    }

    const fechaNac = new Date(this.fechaNacimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaNac >= hoy) {
      alert('La fecha de nacimiento no puede ser igual o mayor a la fecha actual');
      return;
    }

    // Validar RFC
    if (!this.rfc.trim()) {
      alert('Por favor ingrese el RFC');
      return;
    }

    if (this.rfc.trim().length < 12 || this.rfc.trim().length > 13) {
      alert('El RFC debe tener 12 o 13 caracteres');
      return;
    }

    if (!this.validarFormatoRFC(this.rfc.trim())) {
      alert('El formato del RFC no es válido. Debe ser:\n- 13 caracteres para persona física (4 letras + 6 números + 3 caracteres)\n- 12 caracteres para persona moral (3 letras + 6 números + 3 caracteres)');
      return;
    }

    // Validar otros campos requeridos
    if (!this.clavePresupuestal.trim() || !this.especialidad.trim()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.guardando = true;

    const profesorActualizado: Profesor = {
      id: this.registro.id,
      nombre: this.nombre.trim(),
      apellidoPaterno: this.apellidoPaterno.trim(),
      apellidoMaterno: this.apellidoMaterno.trim(),
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
        alert('Datos actualizados correctamente');
        this.cerrar.emit(profesorActualizado);
      },
      error: (err) => {
        if (err.status === 200 || err.status === 0) {
          console.log('Profesor actualizado correctamente (con error de parsing)');
          this.guardando = false;
          alert('Datos actualizados correctamente');
          this.cerrar.emit(profesorActualizado);
        } else {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar los datos. Por favor intente nuevamente.');
          this.guardando = false;
        }
      }
    });
  }

  cerrarModal(): void {
    this.cerrar.emit(null);
  }
}