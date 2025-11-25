import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlumnoReprobado } from '../../../../models/alumno-reprobado.model';
import { AlumnoCalificaciones } from '../../../../models/calificaciones-asignacion.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorCalificaciones {

  private apiUrlReprobados = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/calificaciones-finales/reprobados';
  private apiUrlAsignaciones = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/calificaciones-finales';

  constructor(private http: HttpClient) {}

  // Obtener alumnos reprobados por asignación
  ObtenerAlumnosReprobadosPorAsignacion(idAsignacion: string): Observable<AlumnoReprobado[]> {
    return this.http.get<AlumnoReprobado[]>(`${this.apiUrlReprobados}/${idAsignacion}`);
  }

  // ✅ NUEVO: Obtener calificaciones de todos los alumnos de una asignación
  ObtenerCalificacionesPorAsignacion(idAsignacion: string): Observable<AlumnoCalificaciones[]> {
    return this.http.get<AlumnoCalificaciones[]>(`${this.apiUrlAsignaciones}/${idAsignacion}/alumnos-materias`);
  }
}