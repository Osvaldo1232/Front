import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaResponse } from '../../../../models/materia.model';
import { Maestros } from '../../../../models/maestros.model';
import { Alumnos } from '../../../../models/alumnos.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorAlumnos {

  private apiUrlAlumnosListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/alumnos/todosestudiantes';
  private apiUrlAlumnosCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios/estudiante';
  private apiUrlAlumnosEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/alumnos/alumno';


  constructor(private http: HttpClient) {}
  
  
  CrearAlumno(alumnos: Alumnos): Observable<any> {
    return this.http.post(this.apiUrlAlumnosCrear, alumnos, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerAlumnos(): Observable<Alumnos[]> {
    return this.http.get<Alumnos[]>(this.apiUrlAlumnosListar);
  }

  ActualizarAlumno(id: string, alumno: Alumnos): Observable<any> {
    return this.http.put(`${this.apiUrlAlumnosEditar}/${id}`, alumno, {
      responseType: 'text' as 'json'
    });
  }
}