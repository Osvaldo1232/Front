import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id: string;
  nombre: string;
  email: string;
  password: string;
  apellidos: string;
  rol: string;
  fechaNacimiento: string;
  sexo: string;
  matricula: string;
  curp: string;
  estatus: string;
}

// ✅ Nueva interfaz para la respuesta del servicio de inscripciones recientes
export interface InscripcionReciente {
  id: string;
  idGrado: string;
  nombreGrado: string;
  idGrupo: string;
  nombreGrupo: string;
  idCiclo: string;
  ciclo: string;
  nombreProfesorCompleto: string;
  telefonoProfesor: string;
}

export interface MateriasCalifica {
  idMateria: string;
  nombreMateria: string;
  calificacionActual: any;
  idGrado: string;
  nombreGrado: string;
}

@Injectable({
  providedIn: 'root'
})

export class AlumnoService {
  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';

  constructor(private http: HttpClient) {}

  obtenerAlumnoPorId(id: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/alumnos/usuario/${id}`);
  }

  // ✅ Nuevo método para obtener inscripción reciente de un alumno
  obtenerInscripcionReciente(alumnoId: string): Observable<InscripcionReciente> {
    return this.http.get<InscripcionReciente>(`${this.apiUrl}/inscripcion/reciente/${alumnoId}`);
  
}

 obtenerMaterias(almId: string, cicloid:string): Observable<MateriasCalifica []> {
    return this.http.get<MateriasCalifica[]>(`${this.apiUrl}/calificaciones-finales/alumno/${almId}/ciclo/${cicloid}`);
 
}
}
