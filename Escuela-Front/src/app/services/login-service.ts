import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  uuid="";
  private apiUrl = 'http://localhost/Autenticacion/login';

  constructor(private http: HttpClient) {}


  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post<any>(this.apiUrl, credentials).pipe(
    tap(response => {
      if (response.token) {
        console.log(response)
        this.uuid=response.uuid;
        this.storeToken(response.token);
        localStorage.setItem('roles', JSON.stringify([response.rol]));  // guarda el rol en un arreglo
      }
    })
  );
}

 Usuario(){
  return this.uuid;
 }

  storeToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

getUserRoles(): string[] {
  const roles = localStorage.getItem('roles');
  return roles ? JSON.parse(roles) : [];
}
}