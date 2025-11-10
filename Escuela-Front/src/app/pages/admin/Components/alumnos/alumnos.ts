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
import { Router } from '@angular/router';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NuevoAlumno,
    EditarAlumno,
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
  alumnoSeleccionado: Alumnos | null = null;
  
  verEstudiante: boolean = false;
  idAlumnoSeleccionado: string | null = null;
  idAl: any;

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
  ) { }

  ngOnInit() {
    this.GGC();
    this.cargarAsignaciones();
  }

  cargarDatos() {
    this.loadingService.show();
    
    // Cargar alumnos
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

    // Cargar inscripciones
    this.serviciosInscripcion.ObtenerInscripciones().subscribe({
      next: (res) => {
        this.inscripciones = res;
        console.log('📋 Inscripciones cargadas:', this.inscripciones);
      },
      error: (err) => console.error('Error al cargar inscripciones:', err)
    });
  }

  // ✅ CARGAR ASIGNACIONES
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
    this.serviciosGrados.obtenerGrados().subscribe({
      next: (res) => {
        this.grados = res;
        console.log('📚 Grados cargados:', this.grados);
      },
      error: (err) => console.error('Error al cargar grados:', err)
    });

    this.serviciosGrupos.ObtenerGrupos().subscribe({
      next: (res) => {
        this.grupos = res;
        console.log('👥 Grupos cargados:', this.grupos);
      },
      error: (err) => console.error('Error al cargar grupos:', err)
    });

    this.serviciosCiclos.ObtenerCiclo().subscribe({
      next: (res) => {
        this.ciclos = res;
        console.log('📅 Ciclos cargados:', this.ciclos);
      },
      error: (err) => console.error('Error al cargar ciclos:', err)
    });
  }

  // ✅ OBTENER INSCRIPCIÓN DE UN ALUMNO
  obtenerInscripcionAlumno(alumnoId?: string): Inscripcion | undefined {
    if (!alumnoId) return undefined;
    return this.inscripciones.find(i => i.alumnoId === alumnoId);
  }

  // ✅ OBTENER ASIGNACIÓN DE UNA INSCRIPCIÓN
  obtenerAsignacionDeInscripcion(inscripcion: Inscripcion): AsignacionDocente | undefined {
    return this.asignaciones.find(a => a.id === inscripcion.asignacionId);
  }

  // ✅ OBTENER NOMBRE DEL GRADO
  obtenerNombreGrado(alumnoId?: string): string {
    if (!alumnoId) return '-';
    
    const inscripcion = this.obtenerInscripcionAlumno(alumnoId);
    if (!inscripcion) return '-';
    
    const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
    if (!asignacion) return '-';
    
    const grado = this.grados.find(g => g.id === asignacion.idGrado);
    return grado ? grado.nombre : '-';
  }

  // ✅ OBTENER NOMBRE DEL GRUPO
  obtenerNombreGrupo(alumnoId?: string): string {
    if (!alumnoId) return '-';
    
    const inscripcion = this.obtenerInscripcionAlumno(alumnoId);
    if (!inscripcion) return '-';
    
    const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
    if (!asignacion) return '-';
    
    const grupo = this.grupos.find(g => g.id === asignacion.idGrupo);
    return grupo ? grupo.nombre : '-';
  }

  // ✅ EXTRAER AÑO DE FECHA
  extraerAnio(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('-')[0];
  }

  // ✅ APLICAR FILTROS
  get alumnosFiltrados() {
    return this.registros.filter(alumno => {
      const inscripcion = this.obtenerInscripcionAlumno(alumno.id!);
      
      // Si no tiene inscripción, no mostrarlo cuando hay filtros activos
      if (!inscripcion && (this.filtroGrado || this.filtroGrupo || this.filtroCiclo)) {
        return false;
      }

      if (!inscripcion) return true;

      // Obtener la asignación
      const asignacion = this.obtenerAsignacionDeInscripcion(inscripcion);
      if (!asignacion) return false;

      // Filtro por grado
      if (this.filtroGrado && asignacion.idGrado !== this.filtroGrado) {
        return false;
      }

      // Filtro por grupo
      if (this.filtroGrupo && asignacion.idGrupo !== this.filtroGrupo) {
        return false;
      }

      // Filtro por ciclo
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
      this.serviciosCiclos
        .filtrarAlumnos(this.filtroGrado, this.filtroGrupo, this.filtroCiclo)
        .subscribe({
          next: (data) => {
            this.registrosGGC = data;
            console.log('🔍 Alumnos encontrados:', data);
          },
          error: (err) => {
            console.error('❌ Error al filtrar alumnos:', err);
          }
        });
    }
  }

  limpiarFiltros() {
    this.filtroGrado = '';
    this.filtroGrupo = '';
    this.filtroCiclo = '';
    this.paginaActual = 1;
    console.log('🧹 Filtros limpiados');
  }

  nuevo() {
    this.nuevom = true;
  }

  cerrarModal(event: Alumnos | null) {
    this.nuevom = false;
    if (event) {
      this.cargarDatos();
    }
  }

  EditarS(alumnoId: string) {
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
      this.cargarDatos();
    }
  }

  cargarAlumnos() {
    this.cargarDatos();
  }
}