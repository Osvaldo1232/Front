import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Profesor } from '../../../../models/Profesor';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { ModalEdicionPersonales } from '../../modales/modal-edicion-personales/modal-edicion-personales';
import { LoginService } from '../../../../services/login-service';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';


@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalEdicionPersonales, Loading  ],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss'
})
export class DatosPersonales implements OnInit {
  usuario!: Profesor;
  perfil: Profesor = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '',
    sexo: '',
    especialidad: '',
    estatus: '',
    telefono: '',
    rfc: '',
    clavePresupuestal: '',
    grado: 'N/A',
    grupo: 'N/A'
  };

  registroParaEditar: Profesor | null = null;
  usuariologueado: string = '';

  constructor(private profesorService: ServiciosProfesor, private loginser:LoginService , private loadingService: LoadingService) { }

  get nombreCompleto(): string {
    return `${this.perfil.nombre} ${this.perfil.apellidos}`.trim();
  }

  ngOnInit(): void {
    this.usuariologueado=this.loginser.Usuario();
    if (this.usuariologueado){
      this.obtenerPerfil();
    }else{
      console.error('No se encontró UUID del usuario logueado.');
    }
  }
  obtenerPerfil(): void {
    this.loadingService.show(); 

    this.profesorService.obtenerPerfilUsuario(this.usuariologueado).subscribe({
      next: (data: Profesor) => {
    this.loadingService.hide(); 

        this.usuario = data;
      },
      error: (err) => {
    this.loadingService.hide(); 

      }
    });
  }
  editar(registro: any) {
    this.registroParaEditar = registro;
  }
  cerrarModal(usuarioEditado: Profesor | null): void {
    this.registroParaEditar = null;

    if (usuarioEditado) {
      this.usuario = usuarioEditado;
    }
  }

}