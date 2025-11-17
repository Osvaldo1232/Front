import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia } from '../../../../models/materia.model';
import { AsignacionMateriaGrado } from '../../../../models/asignacion-materia-grado.model';


@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorMaterias {

  private apiUrlMateriasListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/mostrarmaterias';
  private apiUrlMateriasCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/nueva';
  private apiUrlMateriasEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/Actualizar';
  private apiUrlAsignar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/asignacion/guardar';
  private apiUrlMateriasPorCampo = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/materias/por-campo'; // ✅ NUEVO

  constructor(private http: HttpClient) {}
  
  CrearMateria(materia: Materia): Observable<any> {
    return this.http.post(this.apiUrlMateriasCrear, materia);
  }

  ObtenerMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrlMateriasListar);
  }

  ObtenerMateriasPorCampo(idCampoFormativo: string): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrlMateriasPorCampo}/${idCampoFormativo}`);
  }

  ActualizarMateria(id: string, materia: Materia): Observable<any> {
    return this.http.put(`${this.apiUrlMateriasEditar}/${id}`, materia, {
      responseType: 'text' as 'json'
    });
  }

  AsignarMateriaGrado(asignacion: AsignacionMateriaGrado): Observable<any> {
    return this.http.post(this.apiUrlAsignar, asignacion, {
      responseType: 'json'
    });
  }

  ObtenerAsignaciones(idGrado: string): Observable<AsignacionMateriaGrado[]> {
    return this.http.get<AsignacionMateriaGrado[]>(`https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/asignacion/grado/${idGrado}`);
  }
}