import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inscripcion } from '../../../../../../models/inscripcion.model';
import { InscripcionSelect } from '../../../../../../models/inscripcion-select.model';
import { ServiciosDirectorInscripcion } from '../../../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { LoadingService } from '../../../../../../shared/loading-service';
import { AlertService } from '../../../../../../shared/alert-service';
import { firstValueFrom } from 'rxjs'; 


@Component({
  selector: 'app-actualizar-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-asignacion.html',
  styleUrls: ['./actualizar-asignacion.scss']
})
export class ActualizarAsignacion implements OnInit {
  @Input() mostrar: boolean = false;
  @Input() alumnoId: string | null = null;
  @Input() nombreAlumno: string = '';
  @Input() asignacionActualId: string = '';
  @Input() inscripcionId: string = ''; // ✅ NUEVO: Recibir el ID directamente
  @Output() cerrar = new EventEmitter<boolean>();

  asignaciones: InscripcionSelect[] = [];
  asignacionesDisponibles: InscripcionSelect[] = [];
  asignacionSeleccionada: string = '';

  constructor(
    private serviciosInscripcion: ServiciosDirectorInscripcion,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.cargarAsignaciones();
    console.log('📋 Inscripción ID recibida:', this.inscripcionId);
  }

  cargarAsignaciones() {
    this.loadingService.show();
    this.serviciosInscripcion.ObtenerOpcionesInscripcion().subscribe({
      next: (res) => {
        this.asignaciones = res;
        
        // ✅ Filtrar para excluir la asignación actual del alumno
        this.asignacionesDisponibles = res.filter(
          asignacion => asignacion.id !== this.asignacionActualId
        );
        
        console.log('📚 Todas las asignaciones:', res);
        console.log('🔍 Asignación actual del alumno:', this.asignacionActualId);
        console.log('✅ Asignaciones disponibles (sin la actual):', this.asignacionesDisponibles);
        
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('❌ Error al cargar asignaciones:', err);
        this.alertService.show('Error al cargar las asignaciones disponibles', 'danger', 'Error');
        this.loadingService.hide();
      }
    });
  }

 async guardar() {
  if (!this.asignacionSeleccionada) {
    this.alertService.show('Por favor selecciona una asignación', 'warning', 'Advertencia');
    return;
  }

  if (!this.alumnoId) {
    this.alertService.show('No se encontró el ID del alumno', 'danger', 'Error');
    return;
  }

  // ✅ Crear el objeto de inscripción
  const inscripcion: Inscripcion = {
    alumnoId: this.alumnoId,
    asignacionId: this.asignacionSeleccionada,
    estatus: 'ACTIVO'
  };

  console.log('🔄 Enviando inscripción:', inscripcion);
  this.loadingService.show();

  try {
    // ✅ Usar firstValueFrom para manejar la respuesta
    const respuesta: any = await firstValueFrom(
      this.serviciosInscripcion.CrearInscripcion(inscripcion)
    );

    console.log('✅ Respuesta del servidor:', respuesta);

    // ✅ Validar si hay error (código 1001 o similar)
    if (respuesta.codigo && (respuesta.codigo === 1001 || respuesta.codigo === 1000)) {
      this.alertService.show(
        respuesta.mensaje,
        'danger',
        'Error'
      );
      this.loadingService.hide();
      return;
    }

    // ✅ Si no hay error, mostrar éxito
    this.alertService.show('Asignación actualizada exitosamente', 'success', 'Éxito');
    this.loadingService.hide();
    this.cerrar.emit(true);

  } catch (error: any) {
    console.error('❌ Error completo:', error);
    
    // ✅ Intentar extraer el mensaje del backend
    let mensajeError = 'Error al actualizar la asignación';
    
    if (error.error && error.error.mensaje) {
      mensajeError = error.error.mensaje;
    } else if (error.error && typeof error.error === 'string') {
      try {
        const errorObj = JSON.parse(error.error);
        if (errorObj.mensaje) {
          mensajeError = errorObj.mensaje;
        }
      } catch (e) {
        // Si no se puede parsear, usar mensaje por defecto
      }
    }
    
    this.alertService.show(mensajeError, 'danger', 'Error');
    this.loadingService.hide();
  }
}

  cancelar() {
    this.cerrar.emit(false);
  }
}