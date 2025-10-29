import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalificacionRegistro, CalificacionResponse } from '../../../models/calificacion';
import { Profesor } from '../../../models/Profesor';
import { AsignacionDocente, MateriasCamposFormativos } from '../../../models/AsignaciónMateria';
import { MateriaAsignada } from '../../../models/AsignaciónMateria';
import { MateriaResponse } from '../../../models/AsignaciónMateria';
import { InscripcionDTO } from '../../../models/Materia';


@Injectable({
  providedIn: 'root'
})
export class ServiciosProfesor {
  private apiUrlBase = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';

  constructor(private http: HttpClient) { }

    /**
     * Obtiene el perfil completo del usuario (profesor) por su ID.
     * @param idUsuario El ID (UUID) del profesor logueado.
     */
  obtenerPerfilUsuario(idUsuario: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrlBase}/usuarios/BuscarUsuario/${idUsuario}`);
  }
  /**
   * Actualiza los datos del profesor por su ID.
   * @param idProfesor El ID (UUID) del profesor a actualizar.
   * @param profesor Los datos actualizados del profesor.
   */
  editarProfesor(idProfesor: string, profesor:Profesor ): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrlBase}/Profesores/profesor/${idProfesor}`, profesor);
  }
  // ✅ Obtener asignación del docente
  obtenerAsignacionDocente(idProfesor: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlBase}/asignacion-docente/resumen-profesor/reciente?idProfesor=${idProfesor}`
    );
  }

  // ✅ Obtener materias por grado
  obtenerMateriasPorGrado(idGrado: string): Observable<MateriasCamposFormativos[]> {
    const url = `${this.apiUrlBase}/asignacion/listar-por-grado?idGrado=${idGrado}`;
    return this.http.get<MateriasCamposFormativos[]>(url);
  }
  


   filtrarInscripciones(gradoId: string, grupoId: string, cicloId: string): Observable<InscripcionDTO[]> {
    const params = new HttpParams()
      .set('gradoId', gradoId)
      .set('grupoId', grupoId)
      .set('cicloId', cicloId);

    return this.http.get<InscripcionDTO[]>(`${this.apiUrlBase}/inscripcion/filtrar`, { params });
  }

  getMaterias(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<CalificacionResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<CalificacionResponse>(`${this.apiUrlBase}/materias`, { params });
  }


  editarCalificacion(calificacion: CalificacionRegistro): Observable<CalificacionRegistro> {

    return this.http.post<CalificacionRegistro>(`${this.apiUrlBase}/NuevaCalificacion`, calificacion);
  }
  obtenerGrados(): Observable<CalificacionRegistro[]> {
    return this.http.get<CalificacionRegistro[]>(this.apiUrlBase);
  }
}