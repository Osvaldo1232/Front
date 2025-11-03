import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { ServiciosDirector } from './Services/servicios-director'; // Ajusta la ruta según tu estructura
import { Director } from './../../models/director.model'; // Ajusta según tu modelo

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  
  sidebarVisible: boolean = true;
  usuario!: Director; // Cambia Director por tu modelo (puede ser Usuario, Admin, etc.)
  UsuarioLogueado: any;
  rolUsuario: any;

  constructor(
    private loginService: LoginService, 
    private router: Router,
    private directorService: ServiciosDirector // Servicio para obtener datos del director
  ) {}

  ngOnInit(): void {
    // 1. Obtener el rol desde localStorage
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles: string[] = JSON.parse(rolesString);
      this.rolUsuario = roles[0]; 
    }

    // 2. Obtener el usuario logueado
    this.UsuarioLogueado = this.loginService.Usuario();
    
    // 3. Si hay usuario logueado, obtener su perfil completo
    if (this.UsuarioLogueado) {
      this.obtenerPerfil();
    }
  }

  obtenerPerfil(): void {
    // Ajusta este método según el servicio que tengas para obtener el perfil del director
    this.directorService.obtenerPerfilUsuario(this.UsuarioLogueado).subscribe({
      next: (data: Director) => {
        this.usuario = data;
        console.log('Usuario cargado:', this.usuario);
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}