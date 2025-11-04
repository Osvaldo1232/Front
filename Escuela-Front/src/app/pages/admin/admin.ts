import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { Directivo } from '../../models/DirectivoPersonal';
import { ServiciosDirectorAlumnos } from './Services/servicios-director-alumnos/servicios-director-alumnos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  
  sidebarVisible: boolean = true;
  usuario!: Directivo;
  UsuarioLogueado: any;
  rolUsuario: any;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private directorService: ServiciosDirectorAlumnos
  ) {}

  ngOnInit(): void {
    // 1️⃣ Obtener rol del usuario desde localStorage
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles: string[] = JSON.parse(rolesString);
      this.rolUsuario = roles[0];
    }

    // 2️⃣ Obtener información del usuario logueado
    this.UsuarioLogueado = this.loginService.Usuario();

    // 3️⃣ Cargar perfil del usuario si existe sesión activa
    if (this.UsuarioLogueado) {
      this.obtenerPerfil();
    }
  }

  // 🔹 Método para obtener el perfil del directivo
  obtenerPerfil(): void {
    this.directorService.obtenerPerfilUsuario(this.UsuarioLogueado).subscribe({
      next: (data: Directivo) => {
        this.usuario = data;
        console.log('Perfil cargado correctamente:', this.usuario);
      },
      error: (err) => {
        console.error('Error al obtener el perfil:', err);
      }
    });
  }

  // 🔹 Alternar visibilidad del sidebar
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // 🔹 Cerrar sesión
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
