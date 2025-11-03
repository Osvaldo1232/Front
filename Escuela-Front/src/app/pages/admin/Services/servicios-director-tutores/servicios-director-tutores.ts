import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutores } from '../../../../models/tutores.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorTutores {

  private apiUrlTutoresListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor';
  private apiUrlTutoresCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor/NuevoTutor';
  private apiUrlTutoresEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor/Actualizar';


  constructor(private http: HttpClient) {}
  
  
  CrearTutor(tutores: Tutores): Observable<any> {
    return this.http.post(this.apiUrlTutoresCrear, tutores, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerTutores(): Observable<Tutores[]> {
    return this.http.get<Tutores[]>(this.apiUrlTutoresListar);
  }

  ActualizarTutor(id: string, tutor: Tutores): Observable<any> {
    return this.http.put(`${this.apiUrlTutoresEditar}/${id}`, tutor, {
      responseType: 'text' as 'json'
    });
  }
}