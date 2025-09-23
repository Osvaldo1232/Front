import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosDirector {
  
  private apiUrl = 'http://localhost/Materias/listarMaterias';

  constructor(private http: HttpClient) {}
  ObtenerMaterias(credentials: { email: string; password: string }): Observable<any> {
      return this.http.post<any>(this.apiUrl, credentials).pipe(
        tap(response => {
          if (response) {
           
          }
        })
      );
    }

}
