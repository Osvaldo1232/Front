import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ciclos, ComboC } from '../../../../models/ciclos.model';
import { AlumnoGGC } from '../../../../models/alumnos.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorCiclos {

  private apiUrlCicloListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares';
  private apiUrlCicloCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares/NuevoCiclo';
  private apiUrlCicloEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares/Actualizar';
  private apiUrlCicloId = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/ciclosescolares/Obtener';
 private baseUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/inscripcion/filtrarAlumnos';

  constructor(private http: HttpClient) {}
  
  
  CrearCiclo(ciclos: Ciclos): Observable<any> {
    return this.http.post(this.apiUrlCicloCrear, ciclos, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerCiclo(): Observable<Ciclos[]> {
    return this.http.get<Ciclos[]>(this.apiUrlCicloListar);
  }

    ObtenerCicloA(): Observable<ComboC[]> {
    return this.http.get<ComboC[]>(`${this.apiUrlCicloListar}/Activos`);
  }


  obtenerCicloPorId(id: any): Observable<Ciclos> {
    return this.http.get<Ciclos>(`${this.apiUrlCicloId}${id}`);
  }

  ActualizarCiclo(id: string, ciclos: Ciclos): Observable<any> {
    return this.http.put(`${this.apiUrlCicloEditar}/${id}`, ciclos, {
      responseType: 'text' as 'json'
    });
  }

 filtrarAlumnos(gradoId: string, grupoId: string, cicloId: string): Observable<AlumnoGGC[]> {
    const params = new HttpParams()
      .set('gradoId', gradoId)
      .set('grupoId', grupoId)
      .set('cicloId', cicloId);

    return this.http.get<AlumnoGGC[]>(this.baseUrl, { params });
  } 
}



 