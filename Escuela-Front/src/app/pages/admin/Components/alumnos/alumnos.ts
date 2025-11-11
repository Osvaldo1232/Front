import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlumnoGGC, Alumnos } from '../../../../models/alumnos.model';
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
    Loading
  ],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.scss']
})
export class AlumnosComponent implements OnInit {

  registros: Alumnos[] = [];
  registrosGGC: AlumnoGGC[] = [];
  inscripciones: Inscripcion[] = [];
  asignaciones: AsignacionDocente[] = [];
  
  // Listas para filtros
  grados: Grados[] = [];
  grupos: Grupos[] = [];
  ciclos: Ciclos[] = [];

  // Filtros
  filtroGrado: string = '';
  filtroGrupo: string = '';
  filtroCiclo: string = '';

  // Modales
  nuevom: boolean = false;
  editarm: boolean = false;
  asignarTutorm: boolean = false;
  alumnoIdParaTutor: string | null = null;
  nombreAlumnoParaTutor: string = '';

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
    private alerta:AlertaConfirmacionService
  ) { }

  ngOnInit() {
    this.GGC();
    this.cargarAsignaciones();
    this.cargarCicloMasReciente();
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
    this.serviciosGrados.ObtenerAsignaciones().subscribe({
      next: (res) => {
        this.asignaciones = res;
        console.log('📌 Asignaciones cargadas:', this.asignaciones);
      },
      error: (err) => console.error('Error al cargar asignaciones:', err)
    });
  }

  GGC() {
    // Cargar grados
    this.serviciosGrados.obtenerGrados().subscribe({
      next: (res) => {
        this.grados = res;
        console.log('📚 Grados cargados:', this.grados);
        
        // ✅ Seleccionar automáticamente el primer grado
        if (this.grados.length > 0) {
          this.filtroGrado = this.grados[0].id!;
          console.log('✅ Primer grado seleccionado:', this.grados[0].nombre);
        }
      },
      error: (err) => console.error('Error al cargar grados:', err)
    });

    // Cargar grupos
    this.serviciosGrupos.ObtenerGrupos().subscribe({
      next: (res) => {
        this.grupos = res;
        console.log('👥 Grupos cargados:', this.grupos);
        
        // ✅ Seleccionar automáticamente el primer grupo
        if (this.grupos.length > 0) {
          this.filtroGrupo = this.grupos[0].id!;
          console.log('✅ Primer grupo seleccionado:', this.grupos[0].nombre);
        }
        
        // ✅ Después de cargar grado, grupo y ciclo, aplicar filtros automáticamente
        this.verificarYAplicarFiltros();
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

  // ✅ Cargar automáticamente el ciclo más reciente
  cargarCicloMasReciente() {
    this.serviciosCiclos.ObtenerCiclo().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          // Ordenar ciclos por año de inicio (descendente) para obtener el más reciente
          const ciclosOrdenados = res.sort((a, b) => {
            return b.anioInicio - a.anioInicio;
          });
          
          // Seleccionar el más reciente
          const cicloMasReciente = ciclosOrdenados[0];
          this.filtroCiclo = cicloMasReciente.id!;
          
          console.log('📅 Ciclo más reciente seleccionado:', cicloMasReciente);
          console.log(`✅ ${cicloMasReciente.anioInicio}-${cicloMasReciente.anioFin} cargado automáticamente`);
          
          // ✅ Después de cargar el ciclo, verificar si ya podemos aplicar filtros
          this.verificarYAplicarFiltros();
        }
      },
      error: (err) => console.error('Error al cargar ciclo más reciente:', err)
    });
  }

  // ✅ NUEVO: Verificar si los 3 filtros están cargados y aplicarlos automáticamente
  verificarYAplicarFiltros() {
    // Esperar un momento para asegurar que todos los valores estén asignados
    setTimeout(() => {
      if (this.filtroGrado && this.filtroGrupo && this.filtroCiclo) {
        console.log('🎯 Filtros iniciales cargados, aplicando automáticamente...');
        this.aplicarFiltros();
      }
    }, 500);
  }

  // ✅ Detectar cuando los 3 filtros están seleccionados
  onFiltroChange() {
    console.log('🔄 Cambio en filtros:', {
      grado: this.filtroGrado,
      grupo: this.filtroGrupo,
      ciclo: this.filtroCiclo
    });

    // Si los 3 filtros tienen valor, aplicar automáticamente
    if (this.filtroGrado && this.filtroGrupo && this.filtroCiclo) {
      console.log('✅ Todos los filtros seleccionados, aplicando...');
      this.aplicarFiltros();
    } else {
      // Si falta algún filtro, limpiar la tabla
      this.registrosGGC = [];
    }
  }

  obtenerInscripcionAlumno(alumnoId?: string): Inscripcion | undefined {
    if (!alumnoId) return undefined;
    return this.inscripciones.find(i => i.alumnoId === alumnoId);
  }

  obtenerAsignacionDeInscripcion(inscripcion: Inscripcion): AsignacionDocente | undefined {
    return this.asignaciones.find(a => a.id === inscripcion.asignacionId);
  }

  obtenerNombreGrado(alumnoId?: string): string {
    if (!alumnoId) return '-';
    
    const inscripcion = this.obtenerInscripcionAlumno(alumnoId);
    if (!inscripcion) return '-';
    
    const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
    if (!asignacion) return '-';
    
    const grado = this.grados.find(g => g.id === asignacion.idGrado);
    return grado ? grado.nombre : '-';
  }

  obtenerNombreGrupo(alumnoId?: string): string {
    if (!alumnoId) return '-';
    
    const inscripcion = this.obtenerInscripcionAlumno(alumnoId);
    if (!inscripcion) return '-';
    
    const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
    if (!asignacion) return '-';
    
    const grupo = this.grupos.find(g => g.id === asignacion.idGrupo);
    return grupo ? grupo.nombre : '-';
  }

  extraerAnio(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('-')[0];
  }

  get alumnosFiltrados() {
    return this.registros.filter(alumno => {
      const inscripcion = this.obtenerInscripcionAlumno(alumno.id!);
      
      if (!inscripcion && (this.filtroGrado || this.filtroGrupo || this.filtroCiclo)) {
        return false;
      }

      if (!inscripcion) return true;

      const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
      if (!asignacion) return false;

      if (this.filtroGrado && asignacion.idGrado !== this.filtroGrado) {
        return false;
      }

      if (this.filtroGrupo && asignacion.idGrupo !== this.filtroGrupo) {
        return false;
      }

      if (this.filtroCiclo && asignacion.idCiclo !== this.filtroCiclo) {
        return false;
      }

      return true;
    });
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

  aplicarFiltros() {
    this.paginaActual = 1;
    console.log('🔍 Filtros aplicados:', {
      grado: this.filtroGrado,
      grupo: this.filtroGrupo,
      ciclo: this.filtroCiclo
    });
   
    if (
      (this.filtroGrado && this.filtroGrado.trim() !== '') &&
      (this.filtroGrupo && this.filtroGrupo.trim() !== '') &&
      (this.filtroCiclo && this.filtroCiclo.trim() !== '')
    ) {
      this.loadingService.show();
      this.serviciosCiclos
        .filtrarAlumnos(this.filtroGrado, this.filtroGrupo, this.filtroCiclo)
        .subscribe({
          next: (data) => {
            this.registrosGGC = data;
            console.log('🔍 Alumnos encontrados:', data);
            this.loadingService.hide();
          },
          error: (err) => {
            console.error('❌ Error al filtrar alumnos:', err);
            this.loadingService.hide();
          }
        });
    }
  }

  limpiarFiltros() {
    this.registrosGGC = [];
    this.paginaActual = 1;
    
    // ✅ Restaurar primer grado
    if (this.grados.length > 0) {
      this.filtroGrado = this.grados[0].id!;
      console.log('✅ Primer grado restaurado:', this.grados[0].nombre);
    } else {
      this.filtroGrado = '';
    }
    
    // ✅ Restaurar primer grupo
    if (this.grupos.length > 0) {
      this.filtroGrupo = this.grupos[0].id!;
      console.log('✅ Primer grupo restaurado:', this.grupos[0].nombre);
    } else {
      this.filtroGrupo = '';
    }
    
    // ✅ Restaurar el ciclo más reciente
    this.cargarCicloMasReciente();
    
    console.log('🧹 Filtros restaurados a valores iniciales');
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Alumnos | null) {
    this.nuevom = false;
    
    if (event) {
      console.log('✅ Nuevo alumno creado');
      
      if (this.filtroGrado && this.filtroGrupo && this.filtroCiclo) {
        console.log('🔄 Reaplicando filtros...');
        this.aplicarFiltros();
      }
    }
  }

  EditarS(alumnoId: string) {
    console.log('📝 Abriendo modal de editar para alumno:', alumnoId);
    this.idAl = alumnoId;
    this.editarm = true;
  }

  irPerfil(alumno: Alumnos): void {
    if (alumno.id) {
      this.idAlumnoSeleccionado = alumno.id;
      this.verEstudiante = true;
    }
  }

  cerrarModalPerfil(event: boolean): void {
    this.verEstudiante = event;
    this.idAlumnoSeleccionado = null;
  }

  cerrarModalEditar(event: boolean) {
    this.editarm = false;
    
    if (event) {
      console.log('✅ Alumno editado exitosamente');
      
      if (this.filtroGrado && this.filtroGrupo && this.filtroCiclo) {
        console.log('🔄 Reaplicando filtros para actualizar la tabla...');
        this.aplicarFiltros();
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
    }
  }

// ✅ Cambiar estatus del alumno con confirmación
async cambiarEstatus(alumno: AlumnoGGC) {
  const nuevoEstatus = alumno.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

  // 🟡 Mostrar alerta de confirmación antes de proceder
  const confirmado = await this.alerta.mostrar(
    `¿Estás seguro de ${nuevoEstatus === 'ACTIVO' ? 'activar' : 'desactivar'} al alumno ${alumno.nombre}?`
  );

  if (!confirmado) {
    return; // 🚫 El usuario canceló
  }

  console.log(`🔄 Cambiando estatus de ${alumno.nombre} de ${alumno.estatus} a ${nuevoEstatus}`);
  this.loadingService.show();

  this.Servicios.CambiarEstatusAlumno(alumno.alumnoId, nuevoEstatus).subscribe({
    next: (res) => {
      console.log('✅ Estatus cambiado exitosamente:', res);

      alumno.estatus = nuevoEstatus; // Actualiza la tabla localmente

      this.alertService.show(
        `Alumno ${nuevoEstatus === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
        'success',
        'Éxito'
      );

      this.loadingService.hide();
    },
    error: (err) => {
      console.error('❌ Error al cambiar estatus:', err);

      this.alertService.show(
        'Error al cambiar el estatus del alumno',
        'danger',
        'Error'
      );

      this.loadingService.hide();
    }
  });
}


}