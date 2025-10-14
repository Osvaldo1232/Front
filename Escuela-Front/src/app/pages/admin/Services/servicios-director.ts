import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaResponse } from '../../../models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirector {

  private apiUrl = 'http://localhost:8080/materias/mostrarMaterias'; 

  constructor(private http: HttpClient) {}

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
}
