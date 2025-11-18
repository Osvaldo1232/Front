import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { Component, HostListener } from '@angular/core';
import { AlumnoService } from './Services/alumno-service';
import { Alumnos } from '../../models/alumnos.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})
export class Usuario {

  sidebarVisible: boolean = true;
  rolUsuario: any;
  usuario!: Alumnos;
  UsuarioLogueado: any;

  constructor(
    private router: Router,
    private LoginS: LoginService,
    private alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    /* Detectar rol */
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const roles: string[] = JSON.parse(rolesString);
      this.rolUsuario = roles[0];
    }

    /* Obtener usuario */
    this.UsuarioLogueado = this.LoginS.Usuario();

    if (this.UsuarioLogueado) {
      this.obtenerPerfil();
    }

    /* Detectar cambio de ruta y cerrar sidebar en móvil/tablet */
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.sidebarVisible = false;
        }
      });

    /* Detectar tamaño inicial de pantalla */
    this.adjustSidebarByScreen();
  }

  /* ---------- Ajustar sidebar si es móvil ---------- */
  @HostListener('window:resize')
  adjustSidebarByScreen() {
    if (window.innerWidth <= 768) {
      this.sidebarVisible = false; // en móvil inicia cerrado
    } else {
      this.sidebarVisible = true; // en PC se muestra
    }
  }

  obtenerPerfil(): void {
    this.alumnoService.obtenerAlumnoPorId(this.UsuarioLogueado).subscribe({
      next: (data: Alumnos) => {
        this.usuario = data;
      },
      error: () => {}
    });
  }

  /* ---------- Abrir/cerrar menú ---------- */
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  /* ---------- Logout ---------- */
  logout() {
    this.LoginS.logout();
    this.router.navigate(['/login']);
  }
}
