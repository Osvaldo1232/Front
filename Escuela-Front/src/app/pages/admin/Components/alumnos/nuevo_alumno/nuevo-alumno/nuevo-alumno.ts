import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { Inscripcion } from '../../../../../../models/inscripcion.model';
import { InscripcionSelect } from '../../../../../../models/inscripcion-select.model';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { ServiciosDirectorInscripcion } from '../../../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { AlertService } from '../../../../../../shared/alert-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-nuevo-alumno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-alumno.html',
  styleUrl: './nuevo-alumno.scss'
})
export class NuevoAlumno implements OnInit {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Alumnos | null>();

  constructor(
    private serviciosAlumnos: ServiciosDirectorAlumnos,
    private serviciosInscripcion: ServiciosDirectorInscripcion,
    private alertService: AlertService
  ) { }

  // Datos del alumno
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

  // ✅ SIMPLIFICADO: Solo el ID de la asignación seleccionada
  asignacionId: string = '';

  // Lista de opciones (grado/grupo/ciclo concatenados)
  opcionesInscripcion: InscripcionSelect[] = [];

  guardando: boolean = false;
  errorMensaje: string = '';

  ngOnInit() {
    this.cargarOpcionesInscripcion();
  }

  // ✅ Cargar opciones concatenadas
  cargarOpcionesInscripcion() {
    this.serviciosInscripcion.ObtenerOpcionesInscripcion().subscribe({
      next: (res) => {
        this.opcionesInscripcion = res;
        console.log('📋 Opciones de inscripción:', this.opcionesInscripcion);
      },
      error: (err) => console.error('Error al cargar opciones de inscripción:', err)
    });
  }

  // ✅ Validar formulario
  validarFormulario(): boolean {
    if (this.password !== this.confirmPassword) {
      this.errorMensaje = 'Las contraseñas no coinciden';
      return false;
    }

    if (!this.asignacionId) {
      this.errorMensaje = 'Debe seleccionar Grado, Grupo y Ciclo';
      return false;
    }

    this.errorMensaje = '';
    return true;
  }

  // ✅ Guardar alumno e inscripción
  async guardar() {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';

    try {
      // 1️⃣ CREAR ALUMNO
      console.log('📤 Paso 1: Creando alumno...');
      const alumno: Alumnos = {
        nombre: this.nombre,
        apellidoPaterno: this.apellidoPaterno,
        apellidoMaterno: this.apellidoMaterno,
        email: this.email,
        password: this.password,
        fechaNacimiento: this.fechaNacimiento,
        sexo: this.sexo,
        matricula: this.matricula,
        curp: this.curp,
        estatus: this.estatus
      };

      const respuestaAlumno: any = await firstValueFrom(
        this.serviciosAlumnos.CrearAlumno(alumno)
      );

      console.log('✅ Respuesta crear alumno:', respuestaAlumno);

      // Validar si hay error
      if (respuestaAlumno.codigo == 1000) {
        this.alertService.show(
          respuestaAlumno.mensaje,
          'danger',
          'Error'
        );
        this.guardando = false;
        return;
      }

      let alumnoCreado;
      if (typeof respuestaAlumno === 'string') {
        alumnoCreado = JSON.parse(respuestaAlumno);
      } else {
        alumnoCreado = respuestaAlumno;
      }

      const alumnoId = alumnoCreado.id;
      console.log('✅ Alumno creado con ID:', alumnoId);

      // 2️⃣ CREAR INSCRIPCIÓN
      console.log('📤 Paso 2: Creando inscripción...');
      const inscripcion: Inscripcion = {
        alumnoId: alumnoId,
        asignacionId: this.asignacionId,
        estatus: 'ACTIVO'
      };

      const respuestaInscripcion = await firstValueFrom(
        this.serviciosInscripcion.CrearInscripcion(inscripcion)
      );

      console.log('✅ Respuesta crear inscripción:', respuestaInscripcion);

      // 3️⃣ ÉXITO
      this.alertService.show(
        'Alumno inscrito exitosamente',
        'success',
        'Éxito'
      );

      this.limpiarCampos();
      this.cerrar.emit(alumno);

    } catch (error: any) {
      console.error('❌ Error en el proceso:', error);
      
      if (error.error) {
        this.errorMensaje = error.error;
      } else {
        this.errorMensaje = 'Error al registrar el alumno. Intenta nuevamente.';
      }

      this.alertService.show(
        this.errorMensaje,
        'danger',
        'Error'
      );
    } finally {
      this.guardando = false;
    }
  }

  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(null);
  }

  limpiarCampos() {
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
    this.asignacionId = '';
    this.errorMensaje = '';
  }
}