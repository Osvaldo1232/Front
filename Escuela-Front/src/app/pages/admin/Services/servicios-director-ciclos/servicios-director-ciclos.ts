import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ciclos } from '../../../../models/ciclos.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorCiclos {

  private apiUrlCicloListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares';
  private apiUrlCicloCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares/NuevoCiclo';
  private apiUrlCicloEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares/Actualizar';
  private apiUrlCicloId = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares/Obtener';


  constructor(private http: HttpClient) {}
  
  
  CrearCiclo(ciclos: Ciclos): Observable<any> {
    return this.http.post(this.apiUrlCicloCrear, ciclos, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerCiclo(): Observable<Ciclos[]> {
    return this.http.get<Ciclos[]>(this.apiUrlCicloListar);
  }
  obtenerCicloPorId(id: any): Observable<Ciclos> {
    return this.http.get<Ciclos>(`${this.apiUrlCicloId}${id}`);
  }

  ActualizarCiclo(id: string, ciclos: Ciclos): Observable<any> {
    return this.http.put(`${this.apiUrlCicloEditar}/${id}`, ciclos, {
      responseType: 'text' as 'json'
    });
  }
}