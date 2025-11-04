import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumnos } from '../../../../models/alumnos.model';
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
   obtenerPerfilUsuario(idUsuario: string): Observable<Directivo> {
       return this.http.get<Directivo>(`${this.apiUrlDirectivoId}/usuarios/BuscarUsuario/${idUsuario}`);
     }
}