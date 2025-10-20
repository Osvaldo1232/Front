import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profesor',
  standalone: true,
  // Necesita RouterModule para el <router-outlet> y routerLink
  imports: [CommonModule, RouterModule], 
  templateUrl: './profesor.html',
  styleUrl: './profesor.scss' // Asegúrate de que los estilos existan
})
export class ProfesorComponent { // <--- ¡EXPORTANDO EL NOMBRE CORRECTO!
  sidebarVisible: boolean = true; 

  constructor(private router: Router) {} 

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  logout() {
    // Lógica de logout real y redirección
    this.router.navigate(['/login']);
  }
}