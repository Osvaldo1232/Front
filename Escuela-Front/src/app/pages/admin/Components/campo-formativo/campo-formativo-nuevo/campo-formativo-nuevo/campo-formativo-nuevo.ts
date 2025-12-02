import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampoFormativoModel } from '../../../../../../models/campo-formativo.model';
import { ServiciosCampoFormativo } from '../../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-campo-formativo-nuevo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './campo-formativo-nuevo.html',
  styleUrl: './campo-formativo-nuevo.scss'
})
export class CampoFormativoNuevo {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<CampoFormativoModel | null>();

  constructor(
    private Servicios: ServiciosCampoFormativo,
    private alertService: AlertService
  ) { }

  nombre: string = '';
  estatus: string = 'ACTIVO';

  guardar() {
    if (!this.nombre.trim()) {
      this.alertService.show(
        'El nombre del campo formativo es obligatorio',
        'warning',
        'Advertencia'
      );
      return;
    }

    if (!this.validarTextoAlfabetico(this.nombre)) {
      this.alertService.show(
        'El nombre solo puede contener letras',
        'warning',
        'Advertencia'
      );
      return;
    }

    const campo: CampoFormativoModel = { 
      nombre: this.nombre.trim(), 
      estatus: this.estatus
    };

    this.Servicios.CrearCampoFormativo(campo).subscribe({
      next: (mensaje) => {
        console.log(mensaje);
        this.alertService.show(
          'Campo Formativo registrado exitosamente',
          'success',
          'Éxito'
        );
        
        const nuevoCampo = { 
          nombre: this.nombre.trim(),
          estatus: this.estatus
        };
        
        this.limpiarCampos();
        this.cerrar.emit(nuevoCampo); 
      },
      error: (err) => {
        console.error('Error al crear Campo Formativo:', err);
        this.alertService.show(
          'Error al crear el campo formativo',
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
    this.estatus = 'ACTIVO';
  }

  

  validarTextoAlfabetico(texto: string): boolean {
    if (!texto || texto.trim() === '') return false;
    
    if (texto.startsWith(' ')) return false;
    
    const regex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
    return regex.test(texto.trim());
  }

  soloLetras(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    if (charCode <= 31) return true;
    
    if (charCode === 32) return true;
    
    const char = String.fromCharCode(charCode);
    const regex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]$/;
    
    if (!regex.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  eliminarEspaciosInicio(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value.startsWith(' ')) {
      input.value = value.trimStart();
      this.nombre = input.value;
    }
  }
}