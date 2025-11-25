import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlumnoGGC, Alumnos } from '../../../../models/alumnos.model';
import { InscripcionSelect } from '../../../../models/inscripcion-select.model';
import { Inscripcion } from '../../../../models/inscripcion.model';
import { AsignacionDocente } from '../../../../models/asignacion-docente.model';
import { Grados } from '../../../../models/grado.models';
import { Grupos } from '../../../../models/grupos.models';
import { Ciclos } from '../../../../models/ciclos.model';
import { ServiciosDirectorAlumnos } from '../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { ServiciosDirectorInscripcion } from '../../Services/servicios-director-inscripcion/servicios-director-inscripcion';
import { ServiciosDirector } from '../../Services/servicios-director';
import { ServiciosDirectorGrupos } from '../../Services/servicios-director-grupos/servicio-director-grupos';
import { ServiciosDirectorCiclos } from '../../Services/servicios-director-ciclos/servicios-director-ciclos';
import { NuevoAlumno } from './nuevo_alumno/nuevo-alumno/nuevo-alumno';
import { EditarAlumno } from './editar-alumno/editar-alumno/editar-alumno'; 
import { AsignarTutor } from './asignar-tutor/asignar-tutor';
import { Router } from '@angular/router';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { AlertaConfirmacionService } from '../../../../shared/alerta-confirmacion-service';
import { PerfilEstudiante } from './perfil-estudiante/perfil-estudiante/perfil-estudiante';
import { ActualizarAsignacion } from '../alumnos/actualizar-asignacion/actualizar-asignacion/actualizar-asignacion';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoAlumno,
    EditarAlumno,
    AsignarTutor,
    Loading,
    PerfilEstudiante,
    ActualizarAsignacion
  ],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.scss']
})
export class AlumnosComponent implements OnInit {

  registros: Alumnos[] = [];
  registrosGGC: AlumnoGGC[] = [];
  inscripciones: Inscripcion[] = [];
  asignaciones: InscripcionSelect[] = [];
  
  // Listas para filtros
  grados: Grados[] = [];
  grupos: Grupos[] = [];
  ciclos: Ciclos[] = [];

  // ✅ NUEVO FILTRO (reemplaza los 3 anteriores)
  asignacionSeleccionada: string = '';

  // Modales
  nuevom: boolean = false;
  editarm: boolean = false;
  asignarTutorm: boolean = false;
  alumnoIdParaTutor: string | null = null;
  nombreAlumnoParaTutor: string = '';

  // Modal Actualizar Asignación
  actualizarAsignacionm: boolean = false;
  alumnoIdParaAsignacion: string | null = null;
  nombreAlumnoParaAsignacion: string = '';
  asignacionActualId: string = '';
  inscripcionIdParaAsignacion: string = '';

  verEstudiante: boolean = false;
  idAlumnoSeleccionado: string | null = null;
  idAl: string = '';

  // Paginación
  registrosPorPagina = 10;
  paginaActual = 1;

  constructor(
    private Servicios: ServiciosDirectorAlumnos,
    private serviciosInscripcion: ServiciosDirectorInscripcion,
    private serviciosGrados: ServiciosDirector,
    private serviciosGrupos: ServiciosDirectorGrupos,
    private serviciosCiclos: ServiciosDirectorCiclos,
    private router: Router,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private alerta: AlertaConfirmacionService
  ) { }

  ngOnInit() {
    this.cargarAsignaciones();
  }

  cargarDatos() {
    this.loadingService.show();
    
    this.Servicios.ObtenerAlumnos().subscribe({
      next: (res) => {
        this.registros = res;
        console.log('👨‍🎓 Alumnos cargados:', this.registros);
        this.loadingService.hide(); 
      },
      error: (err) => {
        console.error('Error al cargar alumnos:', err);
        this.loadingService.hide();
      }
    });

    this.serviciosInscripcion.ObtenerInscripciones().subscribe({
      next: (res) => {
        this.inscripciones = res;
        console.log('📋 Inscripciones cargadas:', this.inscripciones);
      },
      error: (err) => console.error('Error al cargar inscripciones:', err)
    });
  }

  cargarAsignaciones() {
    console.log('🔄 Iniciando carga de asignaciones...');
    console.log('📍 URL:', 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion/select');
    
    this.serviciosGrados.ObtenerAsignaciones().subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        this.asignaciones = res;
        console.log('📌 Total de asignaciones:', this.asignaciones.length);
        
        if (this.asignaciones.length > 0) {
          this.asignacionSeleccionada = this.asignaciones[0].id || '';
          console.log('✅ Primera asignación seleccionada:', {
            id: this.asignaciones[0].id,
            value: this.asignaciones[0].value
          });
          
          this.onAsignacionChange();
        } else {
          console.log('⚠️ No hay asignaciones disponibles');
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('❌ ERROR completo:', err);
        console.error('Status:', err.status);
        console.error('URL:', err.url);
        this.loadingService.hide();
      }
    });
  }

  onAsignacionChange() {
  console.log('🔄 Asignación seleccionada:', this.asignacionSeleccionada);
  
  if (!this.asignacionSeleccionada || this.asignacionSeleccionada.trim() === '') {
    this.registrosGGC = [];
    this.loadingService.hide();
    console.log('⚠️ No hay asignación seleccionada');
    return;
  }

  this.paginaActual = 1;
  this.loadingService.show();
  console.log('⏳ Cargando alumnos...');

  // ✅ PASO 1: Obtener alumnos de la asignación (sin estatus)
  this.Servicios.obtenerAlumnosPorAsignacion(this.asignacionSeleccionada)
    .pipe(
      finalize(() => {
        this.loadingService.hide();
        console.log('✅ Loading finalizado');
      })
    )
    .subscribe({
      next: (alumnosAsignacion) => {
        if (!alumnosAsignacion || !Array.isArray(alumnosAsignacion) || alumnosAsignacion.length === 0) {
          this.registrosGGC = [];
          console.log('ℹ️ No hay alumnos en esta asignación');
          return;
        }

        console.log('📦 Alumnos de asignación obtenidos:', alumnosAsignacion.length);

        // ✅ PASO 2: Obtener TODOS los alumnos completos (con estatus)
        this.Servicios.ObtenerAlumnos().subscribe({
          next: (todosLosAlumnos) => {
            console.log('📦 Todos los alumnos obtenidos:', todosLosAlumnos.length);

            // ✅ PASO 3: Cruzar información - agregar estatus a cada alumno
            this.registrosGGC = alumnosAsignacion.map(alumnoAsig => {
              // Buscar el alumno completo por ID
              const alumnoCompleto = todosLosAlumnos.find(a => a.id === alumnoAsig.alumnoId);
              
              return {
                ...alumnoAsig,
                estatus: alumnoCompleto?.estatus || 'ACTIVO' // ✅ Agregar estatus
              };
            });

            console.log('✅ Alumnos con estatus:', this.registrosGGC.length, 'registros');
          },
          error: (err) => {
            console.error('❌ Error al obtener todos los alumnos:', err);
            // ✅ Si falla, usar ACTIVO por defecto
            this.registrosGGC = alumnosAsignacion.map(a => ({
              ...a,
              estatus: 'ACTIVO'
            }));
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar alumnos de asignación:', err);
        this.registrosGGC = [];
       /*  this.alertService.show(
          'Error al cargar alumnos',
          'danger',
          'Error'
        ); */
      }
    });
}

  obtenerInscripcionAlumno(alumnoId?: string): Inscripcion | undefined {
    if (!alumnoId) return undefined;
    return this.inscripciones.find(i => i.alumnoId === alumnoId);
  }

  obtenerAsignacionDeInscripcion(inscripcion: Inscripcion): AsignacionDocente | undefined {
    return this.asignaciones.find(a => a.id === inscripcion.asignacionId) as any;
  }

  obtenerNombreGrado(alumnoId?: string): string {
    if (!alumnoId) return '-';
    
    const inscripcion = this.obtenerInscripcionAlumno(alumnoId);
    if (!inscripcion) return '-';
    
    const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
    if (!asignacion) return '-';
    
    const grado = this.grados.find(g => g.id === (asignacion as any).idGrado);
    return grado ? grado.nombre : '-';
  }

  obtenerNombreGrupo(alumnoId?: string): string {
    if (!alumnoId) return '-';
    
    const inscripcion = this.obtenerInscripcionAlumno(alumnoId);
    if (!inscripcion) return '-';
    
    const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
    if (!asignacion) return '-';
    
    const grupo = this.grupos.find(g => g.id === (asignacion as any).idGrupo);
    return grupo ? grupo.nombre : '-';
  }

  extraerAnio(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('-')[0];
  }

  get alumnosFiltrados() {
    return this.registrosGGC;
  }

  get alumnosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.alumnosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.alumnosFiltrados.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  limpiarFiltros() {
    this.registrosGGC = [];
    this.paginaActual = 1;
    
    // ✅ Restaurar primera asignación
    if (this.asignaciones.length > 0) {
      this.asignacionSeleccionada = this.asignaciones[0].id || '';
      console.log('✅ Primera asignación restaurada');
      this.onAsignacionChange();
    } else {
      this.asignacionSeleccionada = '';
    }
    
    console.log('🧹 Filtros limpiados');
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Alumnos | null) {
    this.nuevom = false;
    
    if (event) {
      console.log('✅ Nuevo alumno creado');
      
      if (this.asignacionSeleccionada) {
        console.log('🔄 Recargando alumnos...');
        this.onAsignacionChange();
      }
    }
  }

  EditarS(alumnoId: string) {
    console.log('📝 Abriendo modal de editar para alumno:', alumnoId);
    this.idAl = alumnoId;
    this.editarm = true;
  }

  irPerfil(alumnoId: string): void {
    console.log('👁️ Abriendo perfil del alumno:', alumnoId);
    this.idAlumnoSeleccionado = alumnoId;
    this.verEstudiante = true;
  }

  cerrarModalPerfil(event: boolean): void {
    this.verEstudiante = event;
    this.idAlumnoSeleccionado = null;
  }

  cerrarModalEditar(event: boolean) {
    this.editarm = false;
    
    if (event) {
      console.log('✅ Alumno editado exitosamente');
      
      if (this.asignacionSeleccionada) {
        console.log('🔄 Recargando alumnos...');
        this.onAsignacionChange();
      }
    }
  }

  cargarAlumnos() {
    this.cargarDatos();
  }

  asignarTutor(alumnoId: string, nombreCompleto: string) {
    console.log('👨‍👩‍👧‍👦 Abriendo modal para asignar tutor a:', nombreCompleto);
    this.alumnoIdParaTutor = alumnoId;
    this.nombreAlumnoParaTutor = nombreCompleto;
    this.asignarTutorm = true;
  }

  cerrarModalAsignarTutor(guardado: boolean) {
  this.asignarTutorm = false;
  this.alumnoIdParaTutor = null;
  this.nombreAlumnoParaTutor = '';
  
  if (guardado) {
    console.log('✅ Tutor asignado exitosamente');
    
    // ✅ Recargar la lista de alumnos para actualizar los botones
    if (this.asignacionSeleccionada) {
      console.log('🔄 Recargando alumnos para actualizar botones...');
      this.onAsignacionChange();
    }
  }
}

  // ✅ Cambiar estatus del alumno con confirmación
  async cambiarEstatus(alumno: AlumnoGGC, event: Event) {
    // ⚠️ CRÍTICO: Prevenir el cambio del checkbox hasta confirmar
    event.preventDefault();
    
    const nuevoEstatus = alumno.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    // Mostrar alerta de confirmación antes de proceder
    const confirmado = await this.alerta.mostrar(
      `¿Estás seguro de ${nuevoEstatus === 'ACTIVO' ? 'activar' : 'desactivar'} al alumno ${alumno.nombre}?`
    );

    if (!confirmado) {
      return; // El usuario canceló
    }

    console.log(`🔄 Cambiando estatus de ${alumno.nombre} de ${alumno.estatus} a ${nuevoEstatus}`);
    this.loadingService.show();

    this.Servicios.CambiarEstatusAlumno(alumno.alumnoId, nuevoEstatus).subscribe({
      next: (res) => {
        console.log('✅ Estatus cambiado exitosamente:', res);

        // ✅ SOLO aquí se cambia el estatus en el modelo
        alumno.estatus = nuevoEstatus!; 

        this.alertService.show(
          `Alumno ${nuevoEstatus === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
          'success',
          'Éxito'
        );

        this.loadingService.hide();
      },
      error: (err) => {
        this.alertService.show(
          'Error al cambiar el estatus del alumno',
          'danger',
          'Error'
        );

        this.loadingService.hide();
      }
    });
  }

  actualizarAsignacion(alumnoId: string, nombreCompleto: string) {
    console.log('🔄 Abriendo modal para actualizar asignación de:', nombreCompleto);
    
    // ✅ Solo pasar lo básico, sin buscar la inscripción
    this.alumnoIdParaAsignacion = alumnoId;
    this.nombreAlumnoParaAsignacion = nombreCompleto;
    this.asignacionActualId = '';
    this.inscripcionIdParaAsignacion = '';
    this.actualizarAsignacionm = true;
  }

  cerrarModalActualizarAsignacion(guardado: boolean) {
    this.actualizarAsignacionm = false;
    this.alumnoIdParaAsignacion = null;
    this.nombreAlumnoParaAsignacion = '';
    this.asignacionActualId = '';
    this.inscripcionIdParaAsignacion = '';
    
    if (guardado) {
      console.log('✅ Asignación actualizada exitosamente');
      
      if (this.asignacionSeleccionada) {
        console.log('🔄 Recargando alumnos...');
        this.onAsignacionChange();
      }
    }
  }
}