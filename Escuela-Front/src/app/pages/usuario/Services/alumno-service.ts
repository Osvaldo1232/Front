import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumnos, CalifTri, CalificacionesAlumno, DetalleMateria, InscripcionReciente, MateriasCalifica, AlumnoTutor} from '../../../models/alumnos.model';


// ✅ Nueva interfaz para la respuesta del servicio de inscripciones recientes



@Injectable({
  providedIn: 'root'
})

export class AlumnoService {
  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';

  constructor(private http: HttpClient) {}

  obtenerAlumnoPorId(id: string): Observable<Alumnos> {
    return this.http.get<Alumnos>(`${this.apiUrl}/alumnos/usuario/${id}`);
  }

  // ✅ Nuevo método para obtener inscripción reciente de un alumno
  obtenerInscripcionReciente(alumnoId: string): Observable<InscripcionReciente> {
    return this.http.get<InscripcionReciente>(`${this.apiUrl}/inscripcion/reciente/${alumnoId}`);
}

obtenerMaterias(idGrado: string, idAlumno: string, idCicloEscolar: string): Observable<MateriasCalifica[]> {
  const url = `${this.apiUrl}/asignacion/materias-por-grado?idGrado=${idGrado}&idAlumno=${idAlumno}&idCicloEscolar=${idCicloEscolar}`;
  return this.http.get<MateriasCalifica[]>(url);
}

obtenerCalificaciones(alumnoId: string): Observable<CalificacionesAlumno> {
  return this.http.get<CalificacionesAlumno>(`${this.apiUrl}/calificaciones-finales/por-alumno/${alumnoId}`);
}

  obtenerCalTri(alumnoId: string, cicloId: string): Observable<CalifTri[]> {
    return this.http.get<CalifTri[]>(`${this.apiUrl}/calificaciones/alumno/${alumnoId} /ciclo/${cicloId} `);
}
  descargarPDF(idAlumno: string) {
    const url = `${this.apiUrl}/calificaciones/alumno/${idAlumno}/pdfs`;
    return this.http.get(url, { responseType: 'blob' }); // 👈 importante
  }
obtenerDetalleMat(idAlumno: string, idMateria: string,idCiclo: string): Observable<DetalleMateria[]> {
  const url = `${this.apiUrl}/calificaciones/calificaciones-por-alumno?idAlumno=${idAlumno}&idMateria=${idMateria}&idCiclo=${idCiclo}`;
  return this.http.get<DetalleMateria[]>(url);
}
obtenerTutor(idAlumno: string): Observable<AlumnoTutor> {
  return this.http.get<AlumnoTutor>(`${this.apiUrl}/inscripcion/${idAlumno}`);
}
}
