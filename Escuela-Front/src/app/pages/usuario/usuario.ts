import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-usuario',
 imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})
export class Usuario {

  constructor(private loginService: LoginService, private router: Router) {}
sidebarVisible: boolean = true; 

   logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

}
