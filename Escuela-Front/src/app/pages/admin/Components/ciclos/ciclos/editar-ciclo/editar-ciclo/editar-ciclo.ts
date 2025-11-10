import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ciclos } from '../../../../../../../models/ciclos.model';
import { ServiciosDirectorCiclos } from '../../../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { AlertService } from '../../../../../../../shared/alert-service';
@Component({
  selector: 'app-editar-ciclo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-ciclo.html',
  styleUrl: './editar-ciclo.scss'
})
export class EditarCiclo implements OnChanges, OnInit {
  @Input() editar: boolean = false;
  @Input() ciclo: Ciclos | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirectorCiclos,
    private alertService: AlertService
  ) { }

  id: any = '';
  anioInicio: string = '';
  anioFin: string = '';
  estatus: string = 'ACTIVO';
  
  aniosDisponibles: number[] = [];
  aniosFin: number[] = [];
  errorValidacion: string = '';

  ngOnInit() {
    this.generarAniosDisponibles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ciclo'] && this.ciclo) {
      this.cargarDatos();
    }
  }

  generarAniosDisponibles() {
    const anioActual = new Date().getFullYear();
    const anioProximo = anioActual + 1;
    
    for (let i = 2015; i <= anioProximo; i++) {
      this.aniosDisponibles.push(i);
    }
  }

  cargarDatos() {
    if (this.ciclo) {
      console.log('📝 Ciclo recibido para editar:', this.ciclo);
      
      this.id = this.ciclo.id || '';
      
      // ✅ EXTRAER SOLO EL AÑO DE LA FECHA
      this.anioInicio = this.extraerAnio(this.ciclo.anioInicio);
      this.anioFin = this.extraerAnio(this.ciclo.anioFin);
      this.estatus = this.ciclo.estatus || 'ACTIVO';
      
      console.log('📝 Año inicio:', this.anioInicio);
      console.log('📝 Año fin:', this.anioFin);
      
      if (this.anioInicio) {
        this.validarAnios();
      }
    }
  }

  // ✅ EXTRAER SOLO EL AÑO
  extraerAnio(fecha: string): string {
    if (!fecha) return '';
    // Si viene formato YYYY-MM-DD, tomar solo YYYY
    return fecha.split('-')[0];
  }

  validarAnios() {
    this.errorValidacion = '';
    
    if (this.anioInicio) {
      const anioInicio = Number(this.anioInicio);
      const anioActual = new Date().getFullYear();
      const anioProximo = anioActual + 1;
      
      if (anioInicio > anioProximo) {
        this.errorValidacion = `El año de inicio no puede ser mayor a ${anioProximo}`;
        this.aniosFin = [];
        return;
      }
      
      this.aniosFin = [anioInicio + 1];
      
      const anioFinActual = Number(this.anioFin);
      if (!this.anioFin || anioFinActual !== anioInicio + 1) {
        this.anioFin = (anioInicio + 1).toString();
      }
    }
  }

  guardar() {
    if (!this.anioInicio || !this.anioFin) {
      this.errorValidacion = 'Debe seleccionar ambos años';
      return;
    }

    const anioInicio = Number(this.anioInicio);
    const anioFin = Number(this.anioFin);

    if (anioFin !== anioInicio + 1) {
      this.errorValidacion = 'El año fin debe ser el siguiente al año de inicio';
      return;
    }

    // ✅ CONVERTIR A FORMATO YYYY-MM-DD
    const cicloActualizado: Ciclos = { 
      id: this.id,
      anioInicio: `${anioInicio}-01-01`,
      anioFin: `${anioFin}-01-01`,
      estatus: this.estatus
    };

    console.log('📤 Enviando actualización:', cicloActualizado);

    this.Servicios.ActualizarCiclo(this.id, cicloActualizado).subscribe({
      next: (mensaje) => {
        console.log('✅ Respuesta del servidor:', mensaje);
        this.alertService.show(
          'Ciclo escolar actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('❌ Error al actualizar Ciclo:', err);
        this.alertService.show(
          'Error al actualizar el ciclo escolar',
          'danger',
          'Error'
        );
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit(false);
  }
}