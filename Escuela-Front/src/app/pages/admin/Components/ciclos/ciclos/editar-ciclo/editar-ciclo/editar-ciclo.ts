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

  id: string = '';
  anioInicio: number | null = null;
  anioFin: number | null = null;
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
    this.aniosDisponibles = [];
    for (let i = 2015; i <= anioProximo; i++) {
      this.aniosDisponibles.push(i);
    }
  }

  cargarDatos() {
    if (this.ciclo) {
      console.log('📝 Ciclo recibido para editar:', this.ciclo);
      
      this.id = this.ciclo.id || '';
      this.anioInicio = this.extraerAnio(this.ciclo.anioInicio);
      this.anioFin = this.extraerAnio(this.ciclo.anioFin);
      this.estatus = this.ciclo.estatus || 'ACTIVO';

      if (this.anioInicio) this.validarAnios();
    }
  }

  // ✅ Si los años vienen como string (ej. "2025-01-01"), extrae solo el número
  extraerAnio(valor: any): number {
    if (!valor) return 0;
    if (typeof valor === 'string') {
      const partes = valor.split('-');
      const anio = Number(partes[0]);
      return isNaN(anio) ? 0 : anio;
    }
    return valor; // si ya es número
  }

  validarAnios() {
  this.errorValidacion = '';

  // 🔍 Aseguramos que ambos valores existan
  if (this.anioInicio !== null) {
    const anioInicio = Number(this.anioInicio);
    const anioActual = new Date().getFullYear();
    const anioProximo = anioActual + 1;

    // 🚫 Evita años fuera del rango permitido
    if (anioInicio > anioProximo) {
      this.errorValidacion = `El año de inicio no puede ser mayor a ${anioProximo}`;
      this.aniosFin = [];
      return;
    }

    // ✅ Calculamos el año siguiente correctamente
    const siguiente = anioInicio + 1;
    this.aniosFin = [siguiente];

    // 🧠 Solo asignamos anioFin si está vacío o no corresponde
    if (!this.anioFin || this.anioFin !== siguiente) {
      this.anioFin = siguiente;
    }
  }

  // ✅ Limpiar error si los años son consecutivos
  if (this.anioInicio && this.anioFin && this.anioFin === this.anioInicio + 1) {
    this.errorValidacion = '';
  }
}

guardar() {
  this.errorValidacion = '';

  if (this.anioInicio === null || this.anioFin === null) {
    this.errorValidacion = 'Debe seleccionar ambos años';
    return;
  }

  // 🚫 Solo mostramos el error si realmente no son consecutivos
  if (Number(this.anioFin) !== Number(this.anioInicio) + 1) {
    this.errorValidacion = 'El año fin debe ser el siguiente al año de inicio';
    return;
  }

  // ✅ Enviar datos correctos al backend
  const cicloActualizado: Ciclos = { 
    id: this.id,
    anioInicio: this.anioInicio,
    anioFin: this.anioFin,
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
