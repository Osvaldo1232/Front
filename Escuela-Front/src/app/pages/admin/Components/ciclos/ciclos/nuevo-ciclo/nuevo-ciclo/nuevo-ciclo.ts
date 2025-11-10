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

  fechaInicio: string = '';
  fechaFin: string = '';
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
    
    // Desde 2015 hasta el año próximo
    for (let i = 2015; i <= anioProximo; i++) {
      this.aniosDisponibles.push(i);
    }
  }

  validarAnios() {
    this.errorValidacion = '';
    this.fechaFin = '';
    
    if (this.fechaInicio) {
      const anioInicio = Number(this.fechaInicio);
      const anioActual = new Date().getFullYear();
      const anioProximo = anioActual + 1;
      
      if (anioInicio > anioProximo) {
        this.errorValidacion = `El año de inicio no puede ser mayor a ${anioProximo}`;
        this.aniosFin = [];
        return;
      }
      
      this.aniosFin = [anioInicio + 1];
      this.fechaFin = (anioInicio + 1).toString();
    }
  }

  guardar() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.errorValidacion = 'Debe seleccionar ambos años';
      return;
    }

    const anioInicio = Number(this.fechaInicio);
    const anioFin = Number(this.fechaFin);

    if (anioFin !== anioInicio + 1) {
      this.errorValidacion = 'El año fin debe ser el siguiente al año de inicio';
      return;
    }

    // ✅ CONVERTIR A FORMATO YYYY-MM-DD (01 de enero de cada año)
    const ciclo: Ciclos = { 
      anioInicio: `${anioInicio}-01-01`,
      anioFin: `${anioFin}-01-01`,
      estatus: this.estatus
    };

    console.log('📤 Enviando ciclo:', ciclo);

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