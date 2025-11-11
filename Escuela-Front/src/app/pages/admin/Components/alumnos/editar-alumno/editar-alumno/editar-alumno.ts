import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { AlertService } from '../../../../../../shared/alert-service'; 

@Component({
  selector: 'app-editar-alumno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-alumno.html',
  styleUrl: './editar-alumno.scss'
})
export class EditarAlumno implements OnInit, OnChanges {
  @Input() editar: boolean = false;
  @Input() alumno: string | null = null;  // ✅ Recibe el ID (string)
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private Servicios: ServiciosDirectorAlumnos,
    private alertService: AlertService 
  ) {}

  id: string = '';
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  matricula: string = '';
  curp: string = '';
  estatus: string = 'ACTIVO';

  cargando: boolean = false;

  ngOnInit() {
    console.log('🔍 Modal de editar abierto');
    console.log('📋 ID recibido:', this.alumno);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔄 Cambios detectados:', changes);
    if (changes['alumno'] && this.alumno) {
      console.log('✅ Cargando datos para alumno:', this.alumno);
      this.cargarDatosAlumno();
    }
  }

  // ✅ Cargar datos del alumno por ID
  cargarDatosAlumno() {
    if (!this.alumno) {
      console.error('❌ No hay ID de alumno');
      return;
    }

    this.cargando = true;
    console.log('📤 Haciendo petición al servicio...');

    this.Servicios.obtenerAlumnoPorId(this.alumno).subscribe({
      next: (alumnoData) => {
        console.log('✅ Datos del alumno recibidos:', alumnoData);
        
        this.id = alumnoData.id || '';
        this.nombre = alumnoData.nombre || '';
        this.apellidoPaterno = alumnoData.apellidoPaterno || '';
        this.apellidoMaterno = alumnoData.apellidoMaterno || '';
        this.email = alumnoData.email || '';
        this.password = '';
        this.confirmPassword = '';
        this.fechaNacimiento = alumnoData.fechaNacimiento || '';
        this.sexo = alumnoData.sexo || '';
        this.estatus = alumnoData.estatus || 'ACTIVO';
        this.matricula = alumnoData.matricula || '';
        this.curp = alumnoData.curp || '';

        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar alumno:', err);
        this.alertService.show(
          'Error al cargar los datos del alumno',
          'danger',
          'Error'
        );
        this.cargando = false;
      }
    });
  }

  guardar() {
    // Validar contraseñas solo si se intenta cambiar
    if (this.password || this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        this.alertService.show(
          'Las contraseñas no coinciden. Por favor, verifica.',
          'warning',
          'Advertencia'
        );
        return;
      }
    }

    const alumnoActualizado: Alumnos = { 
      id: this.id,
      nombre: this.nombre, 
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email: this.email, 
      password: this.password,
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo, 
      estatus: this.estatus,
      matricula: this.matricula,
      curp: this.curp
    };

    console.log('📤 Enviando alumno actualizado:', alumnoActualizado);

    this.Servicios.ActualizarAlumno(this.id, alumnoActualizado).subscribe({
      next: (mensaje) => {
        console.log('✅ Respuesta del servidor:', mensaje);
        this.alertService.show(
          'Alumno actualizado exitosamente',
          'success',
          'Éxito'
        );
        this.limpiarCampos();
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('❌ Error al actualizar Alumno:', err);
        this.alertService.show(
          'Error al actualizar el Alumno',
          'danger',
          'Error'
        );
      }
    });
  }

  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(false);
  }

  limpiarCampos() {
    this.id = '';
    this.nombre = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.fechaNacimiento = '';
    this.sexo = '';
    this.matricula = '';
    this.curp = '';
    this.estatus = 'ACTIVO';
  }
}