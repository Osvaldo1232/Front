import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ciclos } from '../../../../../../../models/ciclos.model';
import { ServiciosDirectorCiclos } from '../../../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { AlertService } from '../../../../../../../shared/alert-service';
import { SelectAnios } from '../../../../../../../shared/select-anios/select-anios';

@Component({
  selector: 'app-nuevo-ciclo',
  standalone: true,
  imports: [FormsModule, CommonModule, SelectAnios],
  templateUrl: './nuevo-ciclo.html',
  styleUrl: './nuevo-ciclo.scss'
})
export class NuevoCiclo implements OnInit {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Ciclos | null>();

  fechaInicio: number | null = null;
  fechaFin: number | null = null;
  estatus: string = 'ACTIVO';

  errorValidacion: string = '';

  constructor(
    private Servicios: ServiciosDirectorCiclos,
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  validarAnios() {
    this.errorValidacion = '';
    if (this.fechaInicio !== null) {
      this.fechaFin = this.fechaInicio + 1; // Año fin automáticamente
    } else {
      this.fechaFin = null;
    }
  }

  guardar() {
    if (this.fechaInicio === null || this.fechaFin === null) {
      this.errorValidacion = 'Debe seleccionar ambos años';
      return;
    }

    if (this.fechaFin !== this.fechaInicio + 1) {
      this.errorValidacion = 'El año fin debe ser el siguiente al año de inicio';
      return;
    }

    const ciclo: Ciclos = { 
      anioInicio: this.fechaInicio,
      anioFin: this.fechaFin,
      estatus: this.estatus
    };

    this.Servicios.CrearCiclo(ciclo).subscribe({
      next: (mensaje) => {
        this.alertService.show(
          'Ciclo escolar registrado exitosamente',
          'success',
          'Éxito'
        );
        this.limpiarCampos();
        this.cerrar.emit(ciclo);
      },
      error: (err) => {
        this.alertService.show(
          'Error al crear el ciclo escolar',
          'danger',
          'Error'
        );
      }
    });
  }
calcularAnoFin() {
  if (this.fechaInicio) {
    this.fechaFin = +this.fechaInicio + 1;
  } else {
    this.fechaFin = null;
  }
}


  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(null);
  }

  limpiarCampos() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.estatus = 'ACTIVO';
    this.errorValidacion = '';
  }
}
