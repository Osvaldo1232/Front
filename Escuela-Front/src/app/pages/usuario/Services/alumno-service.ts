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

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/alumnos';

  constructor(private http: HttpClient) {}

  obtenerAlumnoPorId(id: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/usuario/${id}`);
  }
}
