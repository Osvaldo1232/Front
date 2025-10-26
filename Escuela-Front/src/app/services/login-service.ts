import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/Autenticacion/login';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.storeUUID(response.uuid);
          this.storeRoles([response.rol]); 
        }
      })
    );
  }

  getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private storeUUID(uuid: string): void {
    localStorage.setItem('uuid', uuid);
  }

  private storeRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  Usuario(): string {
    return localStorage.getItem('uuid') || '';
  }

  getUserRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('uuid');
    localStorage.removeItem('roles');
  }



  getTokenExpirationDate(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return null;

    const date = new Date(0);
    date.setUTCSeconds(payload.exp);
    return date;
  } catch {
    return null;
  }
}

isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;

  const expirationDate = this.getTokenExpirationDate(token);
  return !expirationDate || expirationDate < new Date();
}

isAuthenticated(): boolean {
  return !!this.getToken() && !this.isTokenExpired();
}


}