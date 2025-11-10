import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TutorCombo } from '../../../../../models/tutor-combo.model';
import { AlumnoTutor } from '../../../../../models/alumno-tutor.model';
import { Ciclos } from '../../../../../models/ciclos.model';
import { ServiciosDirectorTutores } from '../../../Services/servicios-director-tutores/servicios-director-tutores';
import { ServiciosDirectorCiclos } from '../../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { AlertService } from '../../../../../shared/alert-service';

@Component({
  selector: 'app-asignar-tutor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asignar-tutor.html',
  styleUrl: './asignar-tutor.scss'
})
export class AsignarTutor implements OnInit, OnChanges {
  @Input() mostrar: boolean = false;
  @Input() alumnoId: string | null = null;        
  @Input() nombreAlumno: string = '';             
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private serviciosTutores: ServiciosDirectorTutores,
    private serviciosAlumnoTutor: ServiciosDirectorTutores,
    private serviciosCiclos: ServiciosDirectorCiclos,
    private alertService: AlertService
  ) { }

  tutorId: string = '';
  cicloId: string = '';
  parentesco: string = '';

  tutores: TutorCombo[] = [];
  ciclos: Ciclos[] = [];

  guardando: boolean = false;
  errorMensaje: string = '';

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alumnoId'] && this.alumnoId) {
      console.log('👨‍🎓 Alumno ID seleccionado:', this.alumnoId);
    }
  }

  cargarDatos() {
    // Cargar tutores
    this.serviciosTutores.ObtenerTutoresCombo().subscribe({
      next: (res) => {
        this.tutores = res;
        console.log('👥 Tutores cargados:', this.tutores);
      },
      error: (err) => console.error('Error al cargar tutores:', err)
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

  validarFormulario(): boolean {
    if (!this.tutorId || !this.cicloId || !this.parentesco.trim()) {
      this.errorMensaje = 'Debe completar todos los campos';
      return false;
    }

    this.errorMensaje = '';
    return true;
  }

  guardar() {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.alumnoId) {  // ✅ Validar el ID
      this.errorMensaje = 'Error: No se encontró el ID del alumno';
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';

    const asignacion: AlumnoTutor = {
      alumnoId: this.alumnoId,  // ✅ Usar el ID directo
      tutorId: this.tutorId,
      cicloId: this.cicloId,
      parentesco: this.parentesco
    };

    console.log('📤 Enviando asignación:', asignacion);

    this.serviciosAlumnoTutor.AsignarTutorAlumno(asignacion).subscribe({
      next: (res) => {
        console.log('✅ Tutor asignado:', res);
        
        this.alertService.show(
          'Tutor asignado exitosamente',
          'success',
          'Éxito'
        );

        this.limpiarCampos();
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('❌ Error al asignar tutor:', err);
        
        this.errorMensaje = err.error?.message || 'Error al asignar el tutor';
        
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
    this.tutorId = '';
    this.cicloId = '';
    this.parentesco = '';
    this.errorMensaje = '';
  }
}
