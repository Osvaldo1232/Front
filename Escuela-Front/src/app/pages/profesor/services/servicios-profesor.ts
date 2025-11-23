import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../../../models/Profesor';
import { MateriasCamposFormativos } from '../../../models/AsignaciónMateria';
import { AlumnoCiclo, InscripcionDTO } from '../../../models/Materia';
import { RegistroHistorial } from '../../../models/HistorialAcademico';
import { HistorialAlumno } from '../../../models/HistorialAcademicoAlumno';



@Injectable({
  providedIn: 'root'
})
export class ServiciosProfesor {
  private apiUrlBase = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';

  constructor(private http: HttpClient) { }

  obtenerPerfilUsuario(idUsuario: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrlBase}/usuarios/BuscarUsuario/${idUsuario}`);
  }

  editarProfesor(idProfesor: string, profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrlBase}/Profesores/profesor/${idProfesor}`, profesor);
  }

  obtenerAsignacionDocente(idProfesor: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlBase}/asignacion-docente/resumen-profesor/reciente?idProfesor=${idProfesor}`
    );
  }

  obtenerMateriasPorGrado(idGrado: string): Observable<MateriasCamposFormativos[]> {
    const url = `${this.apiUrlBase}/asignacion/listar-por-grado?idGrado=${idGrado}`;
    return this.http.get<MateriasCamposFormativos[]>(url);
  }

  filtrarInscripciones(gradoId: string, grupoId: string, cicloId: string): Observable<InscripcionDTO[]> {
    const params = new HttpParams()
      .set('gradoId', gradoId)
      .set('grupoId', grupoId)
      .set('cicloId', cicloId);
    return this.http.get<InscripcionDTO[]>(`${this.apiUrlBase}/inscripcion/filtrarAlumnos?`, { params });
  }

  filtrarInscripciones1(cicloId: string): Observable<AlumnoCiclo[]> {
    return this.http.get<AlumnoCiclo[]>(`${this.apiUrlBase}/inscripcion/alumnos/${cicloId}`);
  }

  filtrarInscripciones2(cicloId: string, docenteId: string): Observable<RegistroHistorial[]> {
    const params = new HttpParams()
      .set('cicloId', cicloId)
      .set('docenteId', docenteId);
    return this.http.get<RegistroHistorial[]>(`${this.apiUrlBase}/calificaciones-finales/promedio/ciclo/${cicloId}`,{ params });
  }

  obtenerGradosUno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlBase}/grados`);
  }

  obtenerGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlBase}/grupos`);
  }

  obtenerCiclos1(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlBase}/ciclosescolares`);
  }

  obtenerCiclos(idDocente: string) {
    return this.http.get<any[]>(
      `${this.apiUrlBase}/asignacion-docente/${idDocente}/ciclos`);
  }

  obtenerTrimestres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlBase}/Trimestres`);
  }
  asignarCalificacionesMultiples(calificaciones: any[]): Observable<any> {
    const payload = calificaciones.map(cal => ({
      id: cal.id || undefined,
      idAlumno: cal.idAlumno,
      idMateria: cal.idMateria,
      idTrimestre: cal.idTrimestre,
      idCicloEscolar: cal.idCicloEscolar,
      idGrado: cal.idGrado,
      promedio: parseFloat(cal.promedio)
    }));

    return this.http.post(`${this.apiUrlBase}/calificaciones/asignar-multiples`, payload);
  }
  obtenerCalificacionesPorGrado(
    idCiclo: string,
    idGrado: string,
    idMateria: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('idCiclo', idCiclo)
      .set('idGrado', idGrado)
      .set('idMateria', idMateria);

    return this.http.get<any[]>(
      `${this.apiUrlBase}/calificaciones/por-grado`,
      { params }
    );
  }
  obtenerAlumnosConIdPorCiclo(cicloId: string, docenteId: string): Observable<any[]> {
  const params = new HttpParams()
    .set('cicloId', cicloId)
    .set('docenteId', docenteId);
  return this.http.get<any[]>(`${this.apiUrlBase}/alumnos/por-ciclo-docente`, { params });
}

  obtenerHistorialAlumnoPorCiclo(idAlumno: string, idCiclo: string): Observable<HistorialAlumno> {
    const params = new HttpParams()
      .set('idAlumno', idAlumno)
      .set('idCiclo', idCiclo);
    return this.http.get<HistorialAlumno>(
      `${this.apiUrlBase}/calificaciones-finales/por-ciclo`,
      { params }
    );
  }
}