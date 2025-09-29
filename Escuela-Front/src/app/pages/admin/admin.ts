import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-admin',
 imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
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
