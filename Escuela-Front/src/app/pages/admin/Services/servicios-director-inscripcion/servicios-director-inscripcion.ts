import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscripcion } from '../../../../models/inscripcion.model';
import { InscripcionSelect } from '../../../../models/inscripcion-select.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorInscripcion {

  private apiUrlInscripcionCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion/guardar';
  private apiUrlInscripcionListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion';
  private apiUrlInscripcionSelect = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion/select';

  constructor(private http: HttpClient) {}
  
  CrearInscripcion(inscripcion: Inscripcion): Observable<any> {
    return this.http.post(this.apiUrlInscripcionCrear, inscripcion, {
      responseType: 'json'
    });
  }

  ObtenerInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.apiUrlInscripcionListar);
  }

  // ✅ NUEVO: Obtener opciones concatenadas de grado/grupo/ciclo
  ObtenerOpcionesInscripcion(): Observable<InscripcionSelect[]> {
    return this.http.get<InscripcionSelect[]>(this.apiUrlInscripcionSelect);
  }
}