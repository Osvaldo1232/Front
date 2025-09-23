import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private loginService: LoginService, private router: Router) {}

  login() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(credentials).subscribe({
      next: () => {
        const roles = this.loginService.getUserRoles(); 
        const uuid = this.loginService.Usuario(); 

        console.log('Login exitoso, uuid:', uuid);
        console.log('Roles:', roles);

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
        this.errorMessage = 'Credenciales inválidas o error del servidor';
      }
    });
  }
}
