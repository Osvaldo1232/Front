import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { Component } from '@angular/core';
import { AlumnoService } from './Services/alumno-service';
import { Alumnos } from '../../models/alumnos.model';


@Component({
  selector: 'app-usuario',
 imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})
export class Usuario {

  constructor(private router: Router, private LoginS:LoginService, private alumnoService: AlumnoService) {}
sidebarVisible: boolean = true; 
rolUsuario :any;
usuario!: Alumnos;
UsuarioLogueado:any;

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
      this.alumnoService.obtenerAlumnoPorId( this.UsuarioLogueado).subscribe({
        next: (data: Alumnos) => {
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
