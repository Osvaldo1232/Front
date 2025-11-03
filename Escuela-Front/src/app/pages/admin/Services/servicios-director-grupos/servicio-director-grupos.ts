import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupos } from '../../../../models/grupos.models';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorGrupos {

  private apiUrlGruposListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grupos';
  private apiUrlGruposCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grupos/NuevoGrupo';
  private apiUrlGruposEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grupos/Actualizar';


  constructor(private http: HttpClient) {}
  
  
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