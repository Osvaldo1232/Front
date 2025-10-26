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

  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app'; 
  private apiUrlProfesores = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app'; // Para GET (listar)
  private apiUrlCrearProfesor = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app'; // Para POST (crear)

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
  
  // Crear profesor - usa /usuarios/profesor
  CrearDocente(docente: Maestros): Observable<any> {
    return this.http.post(this.apiUrlCrearProfesor, docente, {
      responseType: 'text' as 'json'
    });
  }

  // Obtener profesores - usa /Profesores
  ObtenerDocentes(): Observable<Maestros[]> {
    return this.http.get<Maestros[]>(this.apiUrlProfesores);
  }
}