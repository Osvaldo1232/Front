import { Injectable } from '@angular/core';
import { Listagradomateria } from '../../../../models/listagradomateria.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorListaGradosMateria {
  
  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';

  constructor(private http: HttpClient) { }

   obtenerGrado(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grados`);
  }

  ListarGrado(gradoId: string): Observable<Listagradomateria[]> {
    return this.http.get<Listagradomateria[]>(`${this.apiUrl}/asignacion/listar-por-grado?idGrado=${gradoId}`);
  }

}
