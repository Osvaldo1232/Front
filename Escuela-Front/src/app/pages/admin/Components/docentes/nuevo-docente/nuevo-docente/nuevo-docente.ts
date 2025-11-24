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
  confirmPassword: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  especialidad: string = '';
  estatus: string = 'ACTIVO';
  telefono: string = '';
  rfc: string = '';
  clavePresupuestal: string = '';

  // ✅ Fecha máxima (hoy)
  get fechaMaxima(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  guardar() {
    // ✅ Validar campos vacíos
    if (!this.validarCamposRequeridos()) {
      this.alertService.show(
        'Por favor, completa todos los campos requeridos',
        'warning',
        'Advertencia'
      );
      return;
    }

    // ✅ Validar formato de nombre y apellidos
    if (!this.validarTextoAlfabetico(this.nombre)) {
      this.alertService.show(
        'El nombre solo puede contener letras',
        'warning',
        'Advertencia'
      );
      return;
    }

    if (!this.validarTextoAlfabetico(this.apellidoPaterno)) {
      this.alertService.show(
        'El apellido paterno solo puede contener letras',
        'warning',
        'Advertencia'
      );
      return;
    }

    if (!this.validarTextoAlfabetico(this.apellidoMaterno)) {
      this.alertService.show(
        'El apellido materno solo puede contener letras',
        'warning',
        'Advertencia'
      );
      return;
    }

    if (!this.validarTextoAlfabetico(this.especialidad)) {
      this.alertService.show(
        'La especialidad solo puede contener letras',
        'warning',
        'Advertencia'
      );
      return;
    }

    // ✅ Validar RFC
    if (!this.validarRFC(this.rfc)) {
      this.alertService.show(
        'El RFC debe tener exactamente 13 caracteres',
        'warning',
        'Advertencia'
      );
      return;
    }

    // ✅ Validar email
    if (!this.validarEmail(this.email)) {
      this.alertService.show(
        'Por favor, ingresa un correo electrónico válido',
        'warning',
        'Advertencia'
      );
      return;
    }

    // ✅ Validar teléfono
    if (this.telefono.length !== 10) {
      this.alertService.show(
        'El teléfono debe tener exactamente 10 dígitos',
        'warning',
        'Advertencia'
      );
      return;
    }

    // ✅ Validar contraseñas
    if (this.password !== this.confirmPassword) {
      this.alertService.show(
        'Las contraseñas no coinciden',
        'warning',
        'Advertencia'
      );
      return;
    }

    // ✅ Validar fecha de nacimiento
    if (!this.validarFechaNacimiento(this.fechaNacimiento)) {
      this.alertService.show(
        'La fecha de nacimiento no puede ser mayor a la fecha actual',
        'warning',
        'Advertencia'
      );
      return;
    }

    const maestros: Maestros = { 
      nombre: this.nombre.trim(), 
      estatus: this.estatus,
      email: this.email.trim().toLowerCase(), 
      apellidoPaterno: this.apellidoPaterno.trim(),
      apellidoMaterno: this.apellidoMaterno.trim(),
      password: this.password, 
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      especialidad: this.especialidad.trim(), 
      telefono: this.telefono, 
      rfc: this.rfc.toUpperCase(),
      clavePresupuestal: this.clavePresupuestal.trim() 
    };

    this.Servicios.CrearDocente(maestros).subscribe({
      next: (mensaje) => {
        if(mensaje.codigo == 1000){
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

  // ===================================
  // MÉTODOS DE VALIDACIÓN
  // ===================================

  // ✅ Validar que todos los campos requeridos estén llenos
  validarCamposRequeridos(): boolean {
    return !!(
      this.nombre.trim() &&
      this.apellidoPaterno.trim() &&
      this.apellidoMaterno.trim() &&
      this.email.trim() &&
      this.password &&
      this.confirmPassword &&
      this.fechaNacimiento &&
      this.sexo &&
      this.especialidad.trim() &&
      this.telefono &&
      this.rfc.trim() &&
      this.clavePresupuestal.trim()
    );
  }

  // ✅ Validar que solo contenga letras y espacios (no al inicio)
  validarTextoAlfabetico(texto: string): boolean {
    if (!texto || texto.trim() === '') return false;
    
    // No permitir espacios al inicio
    if (texto.startsWith(' ')) return false;
    
    // Solo letras, espacios, acentos y ñ
    const regex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
    return regex.test(texto.trim());
  }

  // ✅ Validar RFC (13 caracteres)
  validarRFC(rfc: string): boolean {
    return rfc.trim().length === 13;
  }

  // ✅ Validar email
  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
  }

  // ✅ Validar que la fecha no sea mayor a hoy
  validarFechaNacimiento(fecha: string): boolean {
    if (!fecha) return false;
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaNac <= hoy;
  }

  // ✅ Solo permitir números en teléfono
  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // ✅ Solo permitir letras y espacios
  soloLetras(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Permitir teclas especiales (backspace, tab, etc.)
    if (charCode <= 31) return true;
    
    // Permitir espacio (32)
    if (charCode === 32) return true;
    
    // Permitir letras (a-z, A-Z) y caracteres acentuados
    const char = String.fromCharCode(charCode);
    const regex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]$/;
    
    if (!regex.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // ✅ Convertir RFC a mayúsculas automáticamente
  onRfcInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rfc = input.value.toUpperCase();
  }

  // ✅ Eliminar espacios al inicio
  eliminarEspaciosInicio(event: Event, campo: string): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value.startsWith(' ')) {
      input.value = value.trimStart();
      
      // Actualizar el modelo
      switch(campo) {
        case 'nombre':
          this.nombre = input.value;
          break;
        case 'apellidoPaterno':
          this.apellidoPaterno = input.value;
          break;
        case 'apellidoMaterno':
          this.apellidoMaterno = input.value;
          break;
        case 'especialidad':
          this.especialidad = input.value;
          break;
      }
    }
  }
}