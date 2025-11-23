import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { Profesor, ProfesorUno } from '../../../../models/Profesor';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';

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

  constructor(
    private Servicios: ServiciosProfesor,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

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
    
    const hoy = new Date();
    this.fechaMaxima = hoy.toISOString().split('T')[0];
  }

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

  soloLetras(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);
    
    if (!/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/.test(char) && 
        charCode !== 8 && charCode !== 46 && charCode !== 9 && 
        charCode !== 37 && charCode !== 39) {
      event.preventDefault();
    }
  }

  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    
    if ((charCode < 48 || charCode > 57) && 
        charCode !== 8 && charCode !== 46 && charCode !== 9 && 
        charCode !== 37 && charCode !== 39) {
      event.preventDefault();
    }
  }

  validarTelefono(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length > 10) {
      valor = valor.substring(0, 10);
    }
    
    this.telefono = valor;
  }

  validarRFC(event: any): void {
    let valor = event.target.value.toUpperCase();
    valor = valor.replace(/[^A-Z0-9]/g, '');
    
    if (valor.length > 13) {
      valor = valor.substring(0, 13);
    }
    
    this.rfc = valor;
  }

  validarFormatoRFC(rfc: string): boolean {
    const regexFisica = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
    const regexMoral = /^[A-Z]{3}[0-9]{6}[A-Z0-9]{3}$/;
    
    return regexFisica.test(rfc) || regexMoral.test(rfc);
  }

  editar(): void {
    if (!this.registro?.id) {
      this.alertService.show('Error: No se puede actualizar el registro', 'danger', 'Error');
      return;
    }

    if (!this.nombre.trim() || !this.apellidoPaterno.trim() || !this.apellidoMaterno.trim()) {
      this.alertService.show('Por favor complete todos los campos requeridos (Nombre, Apellidos)', 'warning', 'Campos requeridos');
      return;
    }

    if (/\d/.test(this.nombre) || /\d/.test(this.apellidoPaterno) || /\d/.test(this.apellidoMaterno)) {
      this.alertService.show('Los campos de nombre y apellidos no pueden contener números', 'warning', 'Validación');
      return;
    }

    if (!this.telefono.trim() || this.telefono.length !== 10) {
      this.alertService.show('El teléfono debe contener exactamente 10 dígitos', 'warning', 'Validación');
      return;
    }

    if (!this.fechaNacimiento) {
      this.alertService.show('Por favor ingrese la fecha de nacimiento', 'warning', 'Campo requerido');
      return;
    }

    const fechaNac = new Date(this.fechaNacimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaNac >= hoy) {
      this.alertService.show('La fecha de nacimiento no puede ser igual o mayor a la fecha actual', 'warning', 'Validación');
      return;
    }

    if (!this.rfc.trim()) {
      this.alertService.show('Por favor ingrese el RFC', 'warning', 'Campo requerido');
      return;
    }

    if (this.rfc.trim().length < 12 || this.rfc.trim().length > 13) {
      this.alertService.show('El RFC debe tener 12 o 13 caracteres', 'warning', 'Validación');
      return;
    }

    if (!this.validarFormatoRFC(this.rfc.trim())) {
      this.alertService.show('El formato del RFC no es válido', 'warning', 'Validación');
      return;
    }

    if (!this.clavePresupuestal.trim() || !this.especialidad.trim()) {
      this.alertService.show('Por favor complete todos los campos requeridos', 'warning', 'Campos requeridos');
      return;
    }

    this.guardando = true;
    this.loadingService.show();

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
        this.loadingService.hide();
        this.cerrar.emit(profesorActualizado);
      },
      error: (err) => {
        if (err.status === 200 || err.status === 0) {
          console.log('Profesor actualizado correctamente (con error de parsing)');
          this.guardando = false;
          this.loadingService.hide();
          this.cerrar.emit(profesorActualizado);
        } else {
          console.error('Error al actualizar:', err);
          this.alertService.show('Error al actualizar los datos. Por favor intente nuevamente.', 'danger', 'Error');
          this.guardando = false;
          this.loadingService.hide();
        }
      }
    });
  }

  cerrarModal(): void {
    this.cerrar.emit(null);
  }
}