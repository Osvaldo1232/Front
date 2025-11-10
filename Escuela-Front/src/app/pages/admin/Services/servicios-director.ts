import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaResponse } from '../../../models/materia.model';
import { Grados } from '../../../models/grado.models';
import { Maestros } from '../../../models/maestros.model';
import { Director } from '../../../models/director.model';
import { AsignacionDocente } from '../../../models/asignacion-docente.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirector {

  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grados'; 
  private apiUrlEditarGrado = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/grados/Actualizar'; 
  private apiUrlProfesores = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Profesores';
  private apiUrlCrearProfesor = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios/profesor';
  private apiUrlActualizarProfesor = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Profesores/profesor'; 
  private apiUrlUsuarios = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios';
  private apiUrlCrearAsignacion = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/asignacion-docente/guardar';
  private apiUrlAsignaciones = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/asignacion-docente';

  constructor(private http: HttpClient) {}
  
  crearGrado(grado: Grados): Observable<Grados> {
    return this.http.post<Grados>(`${this.apiUrl}/NuevoGrado`, grado);
  }
  
  getMaterias(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id'
  ): Observable<MateriaResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<MateriaResponse>(this.apiUrl, { params });
  }

  obtenerGrados(): Observable<Grados[]> {
    return this.http.get<Grados[]>(this.apiUrl);
  }

  ActualizarGrado(id: string, grado: Grados): Observable<any> {
    return this.http.put(`${this.apiUrlEditarGrado}/${id}`, grado, {
      responseType: 'text' as 'json'
    });
  }
  
  CrearDocente(docente: Maestros): Observable<any> {
    return this.http.post(this.apiUrlCrearProfesor, docente, {
      responseType: 'json'
    });
  }

  ObtenerDocentes(): Observable<Maestros[]> {
    return this.http.get<Maestros[]>(this.apiUrlProfesores);
  }

  CrearAsignacion(asignacion: AsignacionDocente): Observable<any> {
    return this.http.post(this.apiUrlCrearAsignacion, asignacion, {
      responseType: 'text' as 'json'
    });
  }

  // ✅ NUEVO: Obtener todas las asignaciones
  ObtenerAsignaciones(): Observable<AsignacionDocente[]> {
    return this.http.get<AsignacionDocente[]>(this.apiUrlAsignaciones);
  }

  // Obtener asignaciones por ciclo
  ObtenerAsignacionesPorCiclo(cicloId: string): Observable<AsignacionDocente[]> {
    return this.http.get<AsignacionDocente[]>(`${this.apiUrlAsignaciones}/por-ciclo/${cicloId}`);
  }

  ActualizarDocente(id: string, docente: Maestros): Observable<any> {
    return this.http.put(`${this.apiUrlActualizarProfesor}/${id}`, docente, {
      responseType: 'text' as 'json'
    });
  }

  // Obtener perfil del director logueado
  obtenerPerfilUsuario(email: string): Observable<Director> {
    return this.http.get<Director>(`https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/usuarios/BuscarUsuario/${email}`);
  }

  // Actualizar solo el estatus
  ActualizarEstatusDocente(id: string, estatus: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrlUsuarios}/${id}/estatus?estatus=${estatus}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }
}