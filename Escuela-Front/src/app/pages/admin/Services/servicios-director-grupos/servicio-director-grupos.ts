import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupos } from '../../../../models/grupos.models';
import { AsignacionGradoGrupo } from '../../../../models/Materia';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorGrupos {

  private apiUrlGruposListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grupos';
  private apiUrlGruposCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grupos/NuevoGrupo';
  private apiUrlGruposEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grupos/Actualizar';
  private apiUrlAsignacionGrado = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';


  constructor(private http: HttpClient) { }

  filtrarInscripciones(cicloId: string): Observable<AsignacionGradoGrupo[]> {
    return this.http.get<AsignacionGradoGrupo[]>(`${this.apiUrlAsignacionGrado}/asignacion-docente/por-ciclo/${cicloId}`);
  }
  obtenerCiclos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlAsignacionGrado}/ciclosescolares`);
  }

  CrearGrupo(grupos: Grupos): Observable<any> {
    return this.http.post(this.apiUrlGruposCrear, grupos, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerGrupos(): Observable<Grupos[]> {
    return this.http.get<Grupos[]>(this.apiUrlGruposListar);
  }

  ActualizarGrupo(id: string, grupos: Grupos): Observable<any> {
    return this.http.put(`${this.apiUrlGruposEditar}/${id}`, grupos, {
      responseType: 'text' as 'json'
    });

  }
}