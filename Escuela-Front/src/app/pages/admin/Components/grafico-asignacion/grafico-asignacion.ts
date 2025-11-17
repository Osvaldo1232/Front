import { Component, OnInit } from '@angular/core';
import { ServiciosDirectorInscripcion } from '../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { InscripcionSelect } from '../../../../models/inscripcion-select.model';
import { AlertService } from '../../../../shared/alert-service';
import { ResumenAlumnos } from '../../../../models/alumnos.model';
import { ServiciosDirectorAlumnos } from '../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../../../shared/loading-service';
import { Loading } from '../../../../shared/loading/loading';




@Component({
  selector: 'app-grafico-asignacion',
  imports: [CommonModule, FormsModule, RouterModule,Loading],
  templateUrl: './grafico-asignacion.html',
  styleUrl: './grafico-asignacion.scss',
})
export class GraficoAsignacion implements OnInit{
opcionesInscripcion: any[] = [];
  idAsignacionSeleccionada: string = '';

  resumen!: ResumenAlumnos;
  porcentajeAprobados = 0;
  porcentajeReprobados = 0;

  constructor(
    private serviciosInscripcion: ServiciosDirectorInscripcion,
    private ServiciosDirectorAlumnos: ServiciosDirectorAlumnos,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
  this.cargarOpcionesInscripcion();
}

cargarOpcionesInscripcion() {
  this.loadingService.show(); // ✔ Mostrar solo una vez aquí

  this.serviciosInscripcion.ObtenerOpcionesInscripcion().subscribe({
    next: (res) => {
      this.opcionesInscripcion = res;

      if (this.opcionesInscripcion.length > 0) {
        this.idAsignacionSeleccionada = this.opcionesInscripcion[0].id;
        this.cargarGrafico(); // ✔ Cargar gráfica
      } else {
        this.loadingService.hide(); // ✔ Ocultar si no hay opciones
      }
    },
    error: () => {
      this.loadingService.hide(); // ✔ Ocultar si falla
    }
  });
}

cargarGrafico() {
  // ✔ NO llames show() de nuevo si ya estaba cargando
  // this.loadingService.show(); ← ❌ QUITADO

  this.ServiciosDirectorAlumnos.obtenerGraficoAlumnos(this.idAsignacionSeleccionada)
    .subscribe({
      next: (data) => {
        this.resumen = data;
        this.porcentajeAprobados = (data.alumnosAprobados / data.totalAlumnos) * 100;
        this.porcentajeReprobados = 100 - this.porcentajeAprobados;
      },
      error: () => {
        this.loadingService.hide(); // ✔ Siempre ocultar si falla
      },
      complete: () => {
        this.loadingService.hide(); // ✔ Ocultar cuando ya cargó TODO
      }
    });
}
}