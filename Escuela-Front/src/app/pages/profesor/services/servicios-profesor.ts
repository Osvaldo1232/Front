import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalificacionRegistro, CalificacionResponse } from '../../../models/calificacion';
import { Profesor } from '../../../models/Profesor';
import { MateriasCamposFormativos } from '../../../models/AsignaciónMateria';
import { AlumnoCiclo, InscripcionDTO } from '../../../models/Materia';
import { RegistroHistorial } from '../../../models/HistorialAcademico';



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

  filtrarInscripciones2(cicloId: string): Observable<RegistroHistorial[]> {
    return this.http.get<[RegistroHistorial]>(`${this.apiUrlBase}/calificaciones-finales/promedio/ciclo/${cicloId}`);
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
  asignarCalificacion(calificacion: any): Observable<any> {
    const payload = {
      idAlumno: calificacion.idAlumno,
      idMateria: calificacion.idMateria,
      idTrimestre: calificacion.idTrimestre,
      idCicloEscolar: calificacion.idCicloEscolar,
      idGrado: calificacion.idGrado,
      promedio: parseFloat(calificacion.promedio)
    };

    return this.http.post(`${this.apiUrlBase}/calificaciones/asignar`, payload);
  }
}