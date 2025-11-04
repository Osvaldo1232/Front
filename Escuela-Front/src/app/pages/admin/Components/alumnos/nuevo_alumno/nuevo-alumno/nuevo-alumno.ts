import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumnos } from '../../../../../../models/alumnos.model';
import { Inscripcion } from '../../../../../../models/inscripcion.model';
import { Grados } from '../../../../../../models/grado.models';
import { Grupos } from '../../../../../../models/grupos.models';
import { Ciclos } from '../../../../../../models/ciclos.model';
import { ServiciosDirectorAlumnos } from '../../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { ServiciosDirectorInscripcion } from '../../../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { ServiciosDirector } from '../../../../Services/servicios-director';
import { ServiciosDirectorGrupos } from '../../../../Services/servicios-director-grupos/servicio-director-grupos';
import { ServiciosDirectorCiclos } from '../../../../Services/servicios-director-ciclos/servicios-director-ciclos';
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
    private serviciosGrados: ServiciosDirector,
    private serviciosGrupos: ServiciosDirectorGrupos,
    private serviciosCiclos: ServiciosDirectorCiclos,
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

  // Datos de inscripción
  gradoId: string = '';
  grupoId: string = '';
  cicloId: string = '';
  docenteId: string = 'f8b0d04e-cf89-4674-aec5-0d11aff70d8f'; // Este lo asignarás desde Swagger por ahora

  // Listas para los selects
  grados: Grados[] = [];
  grupos: Grupos[] = [];
  ciclos: Ciclos[] = [];

  guardando: boolean = false;
  errorMensaje: string = '';

  ngOnInit() {
    this.cargarDatos();
  }

  // ✅ CARGAR GRADOS, GRUPOS Y CICLOS
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

  // ✅ EXTRAER SOLO EL AÑO DE LA FECHA
  extraerAnio(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('-')[0];
  }

  // ✅ VALIDAR CONTRASEÑAS
  validarFormulario(): boolean {
    if (this.password !== this.confirmPassword) {
      this.errorMensaje = 'Las contraseñas no coinciden';
      return false;
    }

    if (!this.gradoId || !this.grupoId || !this.cicloId) {
      this.errorMensaje = 'Debe seleccionar Grado, Grupo y Ciclo Escolar';
      return false;
    }

    this.errorMensaje = '';
    return true;
  }

  // ✅ GUARDAR ALUMNO E INSCRIPCIÓN (ASYNC/AWAIT)
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

      // Convertir Observable a Promise con firstValueFrom
      const respuestaAlumno: any = await firstValueFrom(
        this.serviciosAlumnos.CrearAlumno(alumno)
      );

      console.log('✅ Respuesta crear alumno:', respuestaAlumno);

      // Parsear la respuesta (viene como string JSON)
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
        docenteId: 'f8b0d04e-cf89-4674-aec5-0d11aff70d8f', // ID temporal, lo cambiarás después
        gradoId: this.gradoId,
        grupoId: this.grupoId,
        cicloId: this.cicloId,
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
    this.gradoId = '';
    this.grupoId = '';
    this.cicloId = '';
    this.errorMensaje = '';
  }
}