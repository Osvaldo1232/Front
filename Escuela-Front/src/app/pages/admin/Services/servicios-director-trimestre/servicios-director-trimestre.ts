import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trimestres } from '../../../../models/trimestres.model';
@Injectable({
  providedIn: 'root'
})
export class ServiciosDirectorTrimestre {
 
  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Trimestres';

  constructor(private http: HttpClient) {}

ObtenerTrimestre(): Observable<Trimestres[]> {
    return this.http.get<Trimestres[]>(this.apiUrl);
  }
}
