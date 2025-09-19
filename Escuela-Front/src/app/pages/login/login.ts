import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
   email = '';

   uuid="";
  password = '';
  errorMessage = '';









  
  constructor(private loginService: LoginService, private router: Router) {
  }

login() {
  console.log("lihgoiughoi")
  const credentials = {
    email: this.email,
    password: this.password
  };

  this.loginService.login(credentials).subscribe({
    next: (response) => {
      console.log(response);
      const roles = this.loginService.getUserRoles();

      this.uuid=this.loginService.Usuario();
      console.log(this.uuid, "uuid");


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
