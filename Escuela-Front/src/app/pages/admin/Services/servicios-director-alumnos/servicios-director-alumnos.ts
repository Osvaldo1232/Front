import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumnos, ResumenAlumnos } from '../../../../models/alumnos.model';
import { Directivo } from '../../../../models/DirectivoPersonal';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorAlumnos {

  private apiUrlAlumnosListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/alumnos/todosestudiantes';
  private apiUrlAlumnosCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios/estudiante';
  private apiUrlAlumnosEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/alumnos/alumno';
  private apiUrlAlumnosId= 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/alumnos/usuario/';
  private apiUrlDirectivoId= 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';
  private apiUrlCambiarEstatus = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios'; // ✅ CORREGIDO


  constructor(private http: HttpClient) {}
  
  
  CrearAlumno(alumnos: Alumnos): Observable<any> {
    return this.http.post(this.apiUrlAlumnosCrear, alumnos);

   
  }

  ObtenerAlumnos(): Observable<Alumnos[]> {
    return this.http.get<Alumnos[]>(this.apiUrlAlumnosListar);
  }
  obtenerAlumnoPorId(id: any): Observable<Alumnos> {
    return this.http.get<Alumnos>(`${this.apiUrlAlumnosId}${id}`);
  }

  ActualizarAlumno(id: string, alumno: Alumnos): Observable<any> {
    return this.http.put(`${this.apiUrlAlumnosEditar}/${id}`, alumno, {
      responseType: 'text' as 'json'
    });
  }

// ✅ NUEVO: Cambiar estatus del alumno usando query params
  CambiarEstatusAlumno(id: string, estatus: string): Observable<any> {
    const params = new HttpParams().set('estatus', estatus);
    
    return this.http.patch(
      `${this.apiUrlCambiarEstatus}/${id}/estatus`, 
      null,  // No body
      { 
        params: params,
        responseType: 'text' as 'json' 
      }
    );
  }

   obtenerPerfilUsuario(idUsuario: string): Observable<Directivo> {
       return this.http.get<Directivo>(`${this.apiUrlDirectivoId}/usuarios/BuscarUsuario/${idUsuario}`);
     }
     obtenerGraficoAlumnos(idAsignacion : string): Observable<ResumenAlumnos> {
       return this.http.get<ResumenAlumnos>(`${this.apiUrlDirectivoId}/calificaciones-finales/asignacion/${idAsignacion}`);
     }
}