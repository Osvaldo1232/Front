import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaResponse } from '../../../models/materia.model';
import { Grados } from '../../../models/grado.models';
import { Maestros } from '../../../models/maestros.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirector {

  private apiUrl = 'http://localhost:8080/grados'; 
  private apiUrlProfesores = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Profesores';
  private apiUrlCrearProfesor = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios/profesor';
  private apiUrlActualizarProfesor = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Profesores/profesor'; 

  constructor(private http: HttpClient) {}
  
  crearGrado(grado: Grados): Observable<Grados> {
    return this.http.post<Grados>(`${this.apiUrl}/NuevoGrado`, grado);
  }
  
  getMaterias(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id'
  ): Observable<MateriaResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<MateriaResponse>(this.apiUrl, { params });
  }

  obtenerGrados(): Observable<Grados[]> {
    return this.http.get<Grados[]>(this.apiUrl);
  }
  
  CrearDocente(docente: Maestros): Observable<any> {
    return this.http.post(this.apiUrlCrearProfesor, docente, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerDocentes(): Observable<Maestros[]> {
    return this.http.get<Maestros[]>(this.apiUrlProfesores);
  }

  ActualizarDocente(id: string, docente: Maestros): Observable<any> {
    return this.http.put(`${this.apiUrlActualizarProfesor}/${id}`, docente, {
      responseType: 'text' as 'json'
    });
  }
}