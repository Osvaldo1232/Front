import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login-service';
import { ServiciosProfesor } from './services/servicios-profesor';
import { Profesor } from '../../models/Profesor';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profesor.html',
  styleUrl: './profesor.scss'
})
export class ProfesorComponent implements OnInit {
  sidebarVisible: boolean = true;
  usuario!: Profesor;
  UsuarioLogueado: any;
  rolUsuario: any;

  constructor(
    private router: Router, 
    private LoginS: LoginService, 
    private profesorService: ServiciosProfesor
  ) { }

  ngOnInit(): void {
    const width = window.innerWidth;
    this.sidebarVisible = width > 900;

    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles: string[] = JSON.parse(rolesString);
      this.rolUsuario = roles[0];
    }

    this.UsuarioLogueado = this.LoginS.Usuario();
    if (this.UsuarioLogueado) {
      this.obtenerPerfil();
    }
  }

  obtenerPerfil(): void {
    this.profesorService.obtenerPerfilUsuario(this.UsuarioLogueado).subscribe({
      next: (data: Profesor) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil:', err);
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    if (window.innerWidth <= 900) {
      this.sidebarVisible = false;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    const width = window.innerWidth;
    if (width > 900) {
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
    }
  }

  logout() {
    this.LoginS.logout();
    this.router.navigate(['/login']);
  }
}