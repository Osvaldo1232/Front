import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia } from '../../../../models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorMaterias {

  private apiUrlMateriasListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/mostrarmaterias';
  private apiUrlMateriasCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/nueva';
  private apiUrlMateriasEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/Actualizar';

  constructor(private http: HttpClient) {}
  
  
  CrearMateria(materia: Materia): Observable<any> {
    return this.http.post(this.apiUrlMateriasCrear, materia);

   
  }

  ObtenerMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrlMateriasListar);
  }

  ActualizarMateria(id: string, materia: Materia): Observable<any> {
    return this.http.put(`${this.apiUrlMateriasEditar}/${id}`, materia, {
      responseType: 'text' as 'json'
    });
  }
}