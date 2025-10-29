import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert-service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

   alumnos = [
    { correo:'', contraseña: '',  }
];
  
  email = '';
  password = '';
  errorMessage = '';

  constructor(private loginService: LoginService, private router: Router, private alertService: AlertService) {}

  login() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(credentials).subscribe({
      next: () => {
        const roles = this.loginService.getUserRoles(); 
        const uuid = this.loginService.Usuario(); 
        if (roles.includes('DIRECTOR')) {
          this.router.navigate(['/admin']);
        } else if (roles.includes('ESTUDIANTE')) {
          this.router.navigate(['/usuario']);
        } else if (roles.includes('PROFESOR')) {
          this.router.navigate(['/profesor']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
    this.alertService.show(
  'Usuario o contraseña incorrectos. Verifica tus datos.',
  'danger',
  'Error de autenticación'
);
      }
    });
  }
}
