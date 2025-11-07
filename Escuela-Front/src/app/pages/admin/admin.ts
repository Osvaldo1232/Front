import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
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

    const width = window.innerWidth;
  this.sidebarVisible = width > 900;

    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles: string[] = JSON.parse(rolesString);
      this.rolUsuario = roles[0];
    }
    this.UsuarioLogueado = this.loginService.Usuario();
    if (this.UsuarioLogueado) {
      this.obtenerPerfil();
    }
  }

  obtenerPerfil(): void {
    this.directorService.obtenerPerfilUsuario(this.UsuarioLogueado).subscribe({
      next: (data: Directivo) => {
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
  }
  else {
    this.sidebarVisible = false;
  }
}


  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
