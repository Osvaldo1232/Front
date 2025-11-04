import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscripcion } from '../../../../models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorInscripcion {

  private apiUrlInscripcionCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion/guardar';
  private apiUrlInscripcionListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion';
  private apiUrlInscripcionEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion/Actualizar';

  constructor(private http: HttpClient) {}
  
  CrearInscripcion(inscripcion: Inscripcion): Observable<any> {
    return this.http.post(this.apiUrlInscripcionCrear, inscripcion, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.apiUrlInscripcionListar);
  }

  ActualizarInscripcion(id: string, inscripcion: Inscripcion): Observable<any> {
    return this.http.put(`${this.apiUrlInscripcionEditar}/${id}`, inscripcion, {
      responseType: 'text' as 'json'
    });
  }
}