import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule  } from '@angular/common';
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
export class ProfesorComponent implements OnInit{ 
  sidebarVisible: boolean = true; 
 usuario!: Profesor;
  UsuarioLogueado:any;
  constructor(private router: Router, private LoginS:LoginService, private profesorService: ServiciosProfesor) {} 
rolUsuario :any;
ngOnInit(): void {

  const rolesString = localStorage.getItem('roles');
  if (rolesString) {
    const roles: string[] = JSON.parse(rolesString);
    this.rolUsuario = roles[0]; 
  }

  this.UsuarioLogueado=this.LoginS.Usuario();
if (this.UsuarioLogueado){
      this.obtenerPerfil();
    }
  }

 obtenerPerfil(): void {
    this.profesorService.obtenerPerfilUsuario( this.UsuarioLogueado).subscribe({
      next: (data: Profesor) => {
        this.usuario = data;
      },
      error: (err) => {
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  logout() {
    this.LoginS.logout();
    this.router.navigate(['/login']);
  }
}