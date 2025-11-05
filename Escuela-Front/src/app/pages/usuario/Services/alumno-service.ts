import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumnos, InscripcionReciente, MateriasCalifica} from '../../../models/alumnos.model';


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

 obtenerMaterias(almId: string, cicloid:string): Observable<MateriasCalifica []> {
    return this.http.get<MateriasCalifica[]>(`${this.apiUrl}/calificaciones-finales/alumno/${almId}/ciclo/${cicloid}`);
 
}
}
