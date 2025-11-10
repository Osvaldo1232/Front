import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Maestros } from '../../../../../../models/maestros.model';
import { AsignacionDocente } from '../../../../../../models/asignacion-docente.model';
import { Grados } from '../../../../../../models/grado.models';
import { Grupos } from '../../../../../../models/grupos.models';
import { Ciclos } from '../../../../../../models/ciclos.model';
import { ServiciosDirector } from '../../../../Services/servicios-director';
import { ServiciosDirectorGrupos } from '../../../../Services/servicios-director-grupos/servicio-director-grupos';
import { ServiciosDirectorCiclos } from '../../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { AlertService } from '../../../../../../shared/alert-service';

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
  grupos: Grupos[] = [];
  ciclos: Ciclos[] = [];

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
    this.serviciosGrupos.ObtenerGrupos().subscribe({
      next: (res) => {
        this.grupos = res;
        console.log('👥 Grupos cargados:', this.grupos);
      },
      error: (err) => console.error('Error al cargar grupos:', err)
    });

    // Cargar ciclos
    this.serviciosCiclos.ObtenerCiclo().subscribe({
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

  guardar() {
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

    this.serviciosAsignacion.CrearAsignacion(asignacion).subscribe({
      next: (res) => {
        console.log('✅ Asignación creada:', res);
        
        this.alertService.show(
          'Asignación creada exitosamente',
          'success',
          'Éxito'
        );

        this.limpiarCampos();
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('❌ Error al crear asignación:', err);
        
        this.errorMensaje = err.error?.message || 'Error al crear la asignación';
        
        this.alertService.show(
          this.errorMensaje,
          'danger',
          'Error'
        );
      },
      complete: () => {
        this.guardando = false;
      }
    });
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