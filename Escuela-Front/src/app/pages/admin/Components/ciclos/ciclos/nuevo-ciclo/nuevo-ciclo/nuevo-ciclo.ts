import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ciclos } from '../../../../../../../models/ciclos.model';
import { ServiciosDirectorCiclos } from '../../../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { AlertService } from '../../../../../../../shared/alert-service';

@Component({
  selector: 'app-nuevo-ciclo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-ciclo.html',
  styleUrl: './nuevo-ciclo.scss'
})
export class NuevoCiclo implements OnInit {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Ciclos | null>();

  constructor(
    private Servicios: ServiciosDirectorCiclos,
    private alertService: AlertService
  ) { }

  // ✅ Cambiar a any para que el select funcione correctamente
  fechaInicio: any = '';
  fechaFin: any = '';
  estatus: string = 'ACTIVO';
  
  aniosDisponibles: number[] = [];
  aniosFin: number[] = [];
  errorValidacion: string = '';

  ngOnInit() {
    this.generarAniosDisponibles();
  }

  generarAniosDisponibles() {
    const anioActual = new Date().getFullYear();
    const anioProximo = anioActual + 1;
    
    for (let i = 2015; i <= anioProximo; i++) {
      this.aniosDisponibles.push(i);
    }
  }

  validarAnios() {
    this.errorValidacion = '';
    this.fechaFin = '';
    
    if (this.fechaInicio) {
      const anioInicio = Number(this.fechaInicio);  // ✅ Convertir a número
      const anioActual = new Date().getFullYear();
      const anioProximo = anioActual + 1;
      
      if (anioInicio > anioProximo) {
        this.errorValidacion = `El año de inicio no puede ser mayor a ${anioProximo}`;
        this.aniosFin = [];
        return;
      }
      
      this.aniosFin = [anioInicio + 1];
      this.fechaFin = anioInicio + 1;  // ✅ Será número
    }
  }

  guardar() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.errorValidacion = 'Debe seleccionar ambos años';
      return;
    }

    // ✅ CONVERTIR EXPLÍCITAMENTE A NÚMEROS
    const anioInicio = Number(this.fechaInicio);
    const anioFin = Number(this.fechaFin);

    if (anioFin !== anioInicio + 1) {
      this.errorValidacion = 'El año fin debe ser el siguiente al año de inicio';
      return;
    }

    const ciclo: Ciclos = { 
      fechaInicio: anioInicio,   // ✅ Enviar como número
      fechaFin: anioFin,         // ✅ Enviar como número
      estatus: this.estatus
    };

    console.log('📤 Enviando ciclo:', ciclo);
    console.log('📤 Tipo fechaInicio:', typeof ciclo.fechaInicio);
    console.log('📤 Tipo fechaFin:', typeof ciclo.fechaFin);

    this.Servicios.CrearCiclo(ciclo).subscribe({
      next: (mensaje) => {
        console.log('✅ Respuesta del servidor:', mensaje);
        this.alertService.show(
          'Ciclo escolar registrado exitosamente',
          'success',
          'Éxito'
        );
        
        this.limpiarCampos();
        this.cerrar.emit(ciclo); 
      },
      error: (err) => {
        console.error('❌ Error al crear Ciclo:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Error del servidor:', err.error);
        this.alertService.show(
          'Error al crear el ciclo escolar',
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
    this.fechaInicio = '';
    this.fechaFin = '';
    this.estatus = 'ACTIVO';
    this.aniosFin = [];
    this.errorValidacion = '';
  }
}