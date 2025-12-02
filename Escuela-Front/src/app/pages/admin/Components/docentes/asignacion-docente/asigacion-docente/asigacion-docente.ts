import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Maestros } from '../../../../../../models/maestros.model';
import { AsignacionDocente } from '../../../../../../models/asignacion-docente.model';
import { Grados } from '../../../../../../models/grado.models';
import { Grupos } from '../../../../../../models/grupos.models';
import { Ciclos, ComboC } from '../../../../../../models/ciclos.model';
import { ServiciosDirector } from '../../../../Services/servicios-director';
import { ServiciosDirectorGrupos } from '../../../../Services/servicios-director-grupos/servicio-director-grupos';
import { ServiciosDirectorCiclos } from '../../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { AlertService } from '../../../../../../shared/alert-service';
import { firstValueFrom } from 'rxjs'; 


@Component({
  selector: 'app-asignar-grupo-docente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asigacion-docente.html',
  styleUrl: './asigacion-docente.scss'
})
export class AsignarGrupoDocente implements OnInit, OnChanges {
  @Input() mostrar: boolean = false;
  @Input() docente: Maestros | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private serviciosGrados: ServiciosDirector,
    private serviciosGrupos: ServiciosDirectorGrupos,
    private serviciosCiclos: ServiciosDirectorCiclos,
    private serviciosAsignacion: ServiciosDirector,
    private alertService: AlertService
  ) { }

  // Datos del formulario
  idGrado: string = '';
  idGrupo: string = '';
  idCiclo: string = '';

  // Listas para los selects
  grados: Grados[] = [];
  grupos: ComboC[] = [];
  ciclos: ComboC[] = [];

  guardando: boolean = false;
  errorMensaje: string = '';

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['docente'] && this.docente) {
      console.log('👨‍🏫 Docente seleccionado:', this.docente);
    }
  }

  get nombreCompleto(): string {
    if (!this.docente) return '';
    return `${this.docente.nombre} ${this.docente.apellidoPaterno} ${this.docente.apellidoMaterno}`;
  }

  cargarDatos() {
    // Cargar grados
    this.serviciosGrados.obtenerGrados().subscribe({
      next: (res) => {
        this.grados = res;
        console.log('📚 Grados cargados:', this.grados);
      },
      error: (err) => console.error('Error al cargar grados:', err)
    });

    // Cargar grupos
    this.serviciosGrupos.ObtenerGruposA().subscribe({
      next: (res) => {
        this.grupos = res;
        console.log('👥 Grupos cargados:', this.grupos);
      },
      error: (err) => console.error('Error al cargar grupos:', err)
    });

    // Cargar ciclos
    this.serviciosCiclos.ObtenerCicloA().subscribe({
      next: (res) => {
        this.ciclos = res;
        console.log('📅 Ciclos cargados:', this.ciclos);
      },
      error: (err) => console.error('Error al cargar ciclos:', err)
    });
  }

  extraerAnio(anio: number): string {
  if (!anio) return '';
  return anio.toString();
}


  validarFormulario(): boolean {
    if (!this.idGrado || !this.idGrupo || !this.idCiclo) {
      this.errorMensaje = 'Debe seleccionar Grado, Grupo y Ciclo';
      return false;
    }

    this.errorMensaje = '';
    return true;
  }

 async guardar() {
  if (!this.validarFormulario()) {
    return;
  }

  if (!this.docente?.id) {
    this.errorMensaje = 'Error: No se encontró el ID del docente';
    return;
  }

  this.guardando = true;
  this.errorMensaje = '';

  const asignacion: AsignacionDocente = {
    idDocente: this.docente.id,
    idGrado: this.idGrado,
    idGrupo: this.idGrupo,
    idCiclo: this.idCiclo,
    estatus: 'ACTIVO'
  };

  console.log('📤 Enviando asignación:', asignacion);

  try {
    let respuesta: any = await firstValueFrom(
      this.serviciosAsignacion.CrearAsignacion(asignacion)
    );

    console.log('✅ Respuesta del servidor (raw):', respuesta);
    console.log('🔍 Tipo de respuesta:', typeof respuesta);

    // ✅ CRÍTICO: Parsear si viene como string
    if (typeof respuesta === 'string') {
      try {
        respuesta = JSON.parse(respuesta);
        console.log('✅ Respuesta parseada:', respuesta);
      } catch (e) {
        console.error('❌ Error al parsear respuesta:', e);
      }
    }

    // ✅ Validar si hay error (código 2001, 2000, etc.)
    if (respuesta.codigo) {
      // Si tiene código, es un error del backend
      this.alertService.show(
        respuesta.mensaje,
        'danger',
        'Error'
      );
      this.guardando = false;
      return;
    }

    // ✅ Si no hay código de error, mostrar éxito
    this.alertService.show(
      'Asignación creada exitosamente',
      'success',
      'Éxito'
    );

    this.limpiarCampos();
    this.cerrar.emit(true);

  } catch (error: any) {
    console.error('❌ Error completo:', error);
    
    let mensajeError = 'Error al crear la asignación';
    
    if (error.error && error.error.mensaje) {
      mensajeError = error.error.mensaje;
    } else if (error.error && error.error.message) {
      mensajeError = error.error.message;
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
    
  } finally {
    this.guardando = false;
  }
}

  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(false);
  }

  limpiarCampos() {
    this.idGrado = '';
    this.idGrupo = '';
    this.idCiclo = '';
    this.errorMensaje = '';
  }
}