import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-unauthorized',
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>🚫 Acceso denegado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <button (click)="goToLogin()">Volver al Login</button>
    </div>
  `
})
export class UnauthorizedComponent {
  goToLogin() {
    window.location.href = '/login';
  }
}
