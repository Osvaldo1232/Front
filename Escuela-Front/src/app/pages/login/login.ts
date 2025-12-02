import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert-service';
import { LoadingService } from '../../shared/loading-service';
import { Loading } from '../../shared/loading/loading';
import { AlertaConfirmacionService } from '../../shared/alerta-confirmacion-service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, Loading],
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

  constructor(private loginService: LoginService, private router: Router, 
    private alertService: AlertService, private loadingService: LoadingService,
  private alerta:AlertaConfirmacionService) {}

   login() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.loadingService.show(); 
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
        this.loadingService.hide(); 
        console.log("hio")
      },
      error: (err) => {

        this.loadingService.hide(); 
        let mensaje = "Ocurrió un error inesperado.";

   if (err.status === 401) {
        mensaje = err.error?.error || "Usuario o contraseña incorrectos.";
      }

      else if (err.status === 403) {
        mensaje = err.error?.error || "Acceso denegado.";
      }

      this.alertService.show(
        mensaje,
        'danger',
        'Error de autenticación'
      );
      }
    });
  }
}
