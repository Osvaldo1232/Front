import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutores } from '../../../../models/tutores.model';
import { TutorCombo } from '../../../../models/tutor-combo.model';
import { AlumnoTutor } from '../../../../models/alumno-tutor.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorTutores {

  private apiUrlTutoresListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor';
  private apiUrlTutoresCrear = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor/NuevoTutor';
  private apiUrlTutoresEditar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor/Actualizar';
  private apiUrlTutoresCombo = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor/combo';
  private apiUrlAsignar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Tutor/registrar';
  private baseUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app';

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

  // ✅ NUEVO: Obtener ciclos donde el alumno NO tiene tutor asignado
  ObtenerCiclosSinTutor(idAlumno: string): Observable<TutorCombo[]> {
    return this.http.get<TutorCombo[]>(`${this.baseUrl}/ciclosescolares/sin-tutor/${idAlumno}`);
  }

  // ⚠️ DEPRECADO: Mantener por compatibilidad (puedes eliminarlo después)
  ObtenerTutoresCombo(): Observable<TutorCombo[]> {
    return this.http.get<TutorCombo[]>(this.apiUrlTutoresCombo);
  }

  AsignarTutorAlumno(asignacion: AlumnoTutor): Observable<any> {
    return this.http.post(this.apiUrlAsignar, asignacion, {
      responseType: 'json'
    });
  }
}